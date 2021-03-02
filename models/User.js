//13.1.5 - model class - what we create our own models from using the extends keyword
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');


//13.1.5 - create User model
class User extends Model {
    //13.2.6 - set up method to run on instance data (per user) to check password 
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//13.1.5 - define table columns and configuration
User.init(
    {
        //define an id column
        id: {
            //use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalen of "NOT NULL"
            allowNull: false, 
            //instruct that this is the Primary Key
            primaryKey: true, 
            //turn on auto increment
            autoIncrement: true
        },
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column 
        email: {
            type: DataTypes.STRING,
            allowNull: false, 
            //there cannot be any duplicate email values in this table
            unique: true, 
            //if allow null is set to false, we can run our data through validation
            validate:  {
                isEmail: true 
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: {
                //this means the password must be atleast 4 characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            //13.2.5 - set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData; 
            },
            //set up beforeUpdate lifecycle hook functionality 
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData; 
            }
        },
        //pass in out imported sequelize connection (the direct connection to our database)
        sequelize, 
        //don't automatically created createdAt/updatedAt timestamp fields
        timestamps: false, 
        //dont pluralize name of database table
        freezeTableName: true, 
        underscored: true, 
        //make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User; 