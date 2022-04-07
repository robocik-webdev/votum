const initializeUser = require("./socket/initializeUser");
const authorizeUser = require("./socket/authorizeUser");
const getPolls = require("./socket/getPolls");
const readPolls = require("./socket/readPolls");
const sendAnswer = require("./socket/sendAnswer");
const {
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
} = require("./socket/admin")





module.exports = {
    authorizeAdmin,
    initializeUser,
    authorizeUser,
    getPolls,
    readPolls,
    sendAnswer,
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