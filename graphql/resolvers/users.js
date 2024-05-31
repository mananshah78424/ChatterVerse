const { User, Message } = require("../../models");
const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env.json");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let users = await User.findAll({
          attributes: ["username", "imageURL", "createdAt"],
          where: { username: { [Op.ne]: user.username } },
        });

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });

        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          );
          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    login: async (_, args) => {
      let errors = {};
      let { username, password } = args;
      try {
        if (password === "") errors.password = "Password should not be empty";
        if (username.trim() === "")
          errors.username = "Username should not be empty";
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Username/Password cannot be empty", {
            errors,
          });
        }
        const user = await User.findOne({
          where: { username },
        });
        if (!user) {
          errors.username = "Wrong username or username not found";
          throw new UserInputError("User not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
          errors.password = "Wrong password";
          throw new UserInputError("Password Incorrect", { errors });
        }
        console.log("Reached here in the login part");
        const token = jwt.sign(
          {
            username,
          },
          JWT_SECRET,
          { expiresIn: 60 * 60 }
        );
        console.log("Token is", token);
        user.token = token;
        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log("Error with login function", err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      console.log(args);
      let { username, email, password, confirmPassword } = args;
      let errors = {};

      try {
        //Validate field
        if (email.trim() === "") errors.email = "Email should not be empty";
        if (password.trim() === "")
          errors.password = "Password should not be empty";
        if (username.trim() === "")
          errors.username = "Username should not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "ConfirmPassword should not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords should match";
        //Check if username already exists in db
        const userByUsername = await User.findOne({ where: { username } });
        const userByEmail = await User.findOne({ where: { email } });

        if (userByUsername) errors.username = "Username is taken";
        if (userByEmail) errors.email = "Email is taken";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        //Hash password
        password = await bcrypt.hash(password, 6);

        //Create user
        const user = await User.create({
          username,
          email,
          password,
        });
        return user;
      } catch (err) {
        throw new UserInputError("Bad input", { errors: err });
      }
    },
  },
};
