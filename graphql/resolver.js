const {User}= require("../models")
const bcrypt=require("bcryptjs")
const {UserInputError} = require("apollo-server")

module.exports={
Query: {
    getUsers: async() => {
        try{
      
            const users=await User.findAll()
            return users
            
        }catch(err){
            console.log("Error retrieving users: ", err);
        }
    },
  },
  Mutation:{
    register:async (_,args)=>{
        let {username,email,password,confirmPassword}=args
        let errors={}
        
        

        try{

            //Validate field
            if(email.trim()=== "") errors.email="Email should not be empty"
            if(password.trim()=== "") password.email="Password should not be empty"
            if(username.trim()=== "") errors.username="Username should not be empty"
            if(confirmPassword.trim()=== "") errors.confirmPassword="ConfirmPassword should not be empty"

            if (password!==confirmPassword) errors.confirmPassword="Passwords should match"
            //Check if username already exists in db
            const userByUsername=await User.findOne({where:{username}})
            const userByEmail=await User.findOne({where:{email}})

            if(userByUsername) errors.username="Username is taken"
            if(userByEmail) errors.email="Email is taken"

            if(Object.keys(errors).length>0){
                throw errors
            }


            //Hash password
            password=await bcrypt.hash(password,6)

            //Create user
            const user=await User.create({
                username,email,password
            })
            return user
        }catch(err){
            
            throw new UserInputError('Bad input', {errors:err})
        }
    }
  }
}