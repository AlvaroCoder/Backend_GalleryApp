const pool = require('../SQL/DatabaseConn');

const VALIDATE_EMAILS = process.env.VALIDATE_EMAILS;
const VALIDATE_USERNAMES = process.env.VALIDATE_USERNAMES;
const CREATE_USER = process.env.CREATE_USER;
const GET_USER_BY_NAME = process.env.GET_USER_BY_NAME;

const GET_CATEGORIES = process.env.GET_CATEGORIES;
const UserModel = {
    ValidateEmails : async (email = String)=>{
        try {
            return await pool.query(VALIDATE_EMAILS, email).then((res)=>res[0][0])
        } catch (error) {
            throw error
        }
    },
    ValidateUsername : async (username = String)=>{
        try {
            return await pool.query(VALIDATE_USERNAMES, username).then((res)=>res[0][0])
        } catch (error) {
            throw error
        }
    },
    CreateUser : async (data = Object)=>{
        const {idUser, username, email, password, password_hash, created_at} = data;
        try {
            return await pool.execute(CREATE_USER,[idUser, username, email, password, password_hash, created_at]).then((val)=>val[0].affectedRows)
        } catch (error) {
            throw error
        }
    },
    GetUserByUsername : async (username = String)=>{
        try {
            return await pool.query(GET_USER_BY_NAME,[username]).then((res)=>res[0][0]);
        } catch (error) {
            throw error
        }
    }
}
const CategoryModel = {
    GetCategories : async ()=>{
        try {
            return await pool.query(GET_CATEGORIES).then((row)=>row[0]).catch((err)=>{throw err});
        } catch (err) {
            throw err   
        }
    }
}
module.exports = {UserModel, CategoryModel};