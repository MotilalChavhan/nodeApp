'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      // define association here
      this.hasMany(Post, { foreignKey: 'userId' })
    }

    toJSON() {
      return { ...this.get(), password: undefined, createdAt: undefined, updatedAt: undefined }
    }
  }
  User.init({
    id : {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'user must have a firstName' },
        notEmpty: { msg: 'firstName must not be empty' }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'user must have a lastName' },
        notEmpty: { msg: 'lastName must not be empty' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'user must have a email' },
        notEmpty: { msg: 'email must not be empty' },
        isEmail: { msg: 'Must be a valid email address' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'user must have a age' },
        notEmpty: { msg: 'age must not be empty' }
      }
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'user must have a city' },
        notEmpty: { msg: 'city must not be empty' }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'user must have a state' },
        notEmpty: { msg: 'state must not be empty' }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'user must have a country' },
        notEmpty: { msg: 'country must not be empty' }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};