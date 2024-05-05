'use strict';

const { validate } = require('graphql');
const { default: isEmail } = require('validator/lib/isEmail');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  //Sequalize and DataTypes are the same thing.
  async up(queryInterface, Sequelize) {
    console.log("Creating table");
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      password:
      {
        type:Sequelize.STRING,
        allowNull:false
      },
      imageURL:{
        type:Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};