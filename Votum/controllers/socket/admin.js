const { jwtVerify } = require("../jwt/jwtAuth");
const pool = require("../../db");
const {newAnswer, newQuestion, newUser, idValidation} = require("../../schema/adminSchema");
const { validate } = require("../../schema/login");

class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
    }
  }

const authorizeAdmin = async (socket, next, data = {}) => {
    const token = socket.handshake.auth.token;
    jwtVerify(token, process.env.JWT_SECRET)
      .then(async (decoded) => {
          console.log(decoded.id);
        const potentialAdmin = await pool.query(
            `SELECT admin FROM users u WHERE u.id='${[decoded.id]}'`
          );
        if (potentialAdmin.rowCount > 0){
            if(potentialAdmin.rows[0].admin){
                next(socket,data);
            }
            else{
                throw new ValidationError("Not an admin");
            }
        }
        else{
            throw new ValidationError("Not an admin");
        }
      })
      .catch(err => {
        console.log("Bad request!", err);
        return false;
      });
      
  };

const adminAddAnswer = async (socket, message) => {
    newAnswer
        .validate(message)
        .catch((err) => {
            console.log(err);
        })
        .then((valid) =>{
            if(valid){
                pool.query(
                    `INSERT INTO answers (id, context, questions_id) VALUES (default, '${message.answer}', ${message.questionId})`);
            }
            else{
                console.log("invalid")
            }
        });
}
const adminRemoveAnswer = async (socket, message) => {
    idValidation
        .validate(message)
        .catch((err) => {
            console.log(err);
        })
        .then((valid) =>{
            if(valid){
                pool.query(
                    `DELETE FROM answers WHERE id=${message.id}`);
            }
            else{
                console.log("invalid")
            }
        });
}
const adminAddQuestion = async (socket, message) => {
    newQuestion
        .validate(message)
        .catch((err) => {
            console.log(err);
        })
        .then((valid) =>{
            if(valid){
                pool.query(
                    `INSERT INTO questions (context, possible_answers, open_time, close_time) VALUES ('${message.question}', ${message.possibleAnswers}, '${message.openTime}', '${message.closeTime}')`);
            }
            else{
                console.log("invalid")
            }
        });
}
const adminRemoveQuestion = async (socket, message) => {
    idValidation
        .validate(message)
        .catch((err) => {
            console.log(err);
        })
        .then((valid) =>{
            if(valid){
                pool.query(
                    `DELETE FROM answers WHERE questions_id=${message.id}`, () =>{
                        pool.query(
                            `DELETE FROM questions WHERE id=${message.id}`);
                    });
            }
            else{
                console.log("invalid")
            }
        });
}

function makeToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const adminAddUser = async (socket, message) => {
    newUser
        .validate(message)
        .catch((err) => {
            console.log(err);
        })
        .then((valid) =>{
            if(valid){
                pool.query(
                `INSERT INTO users (name, surname, email, token) VALUES ('${message.name}', '${message.surname}', '${message.email}', '${makeToken(8)}');`);

            }
            else{
                console.log("invalid")
            }
        });
}
const adminModifyUser = async (socket, message) => {

}
const adminRemoveUser = async (socket, message) => {
    idValidation
        .validate(message)
        .catch((err) => {
            console.log(err);
        })
        .then((valid) =>{
            if(valid){
                pool.query(
                `DELETE FROM users WHERE id=${message.id}`);
            }
            else{
                console.log("invalid")
            }
        });
}
const adminModifyQuestnion = async (socket, message) => {

}
const adminImportUsers = async (socket, message) => {

}

module.exports = {
    authorizeAdmin,
    adminAddAnswer,
    adminRemoveAnswer,
    adminAddQuestion,
    adminRemoveQuestion,
    adminAddUser,
    adminModifyUser,
    adminRemoveUser,
    adminModifyQuestnion,
    adminImportUsers
}