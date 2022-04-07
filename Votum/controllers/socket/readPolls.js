const idValidation = require("../../schema/idValidation")

const readPolls = async (socket, message) => {
    idValidation
        .validate(message)
        .catch(()=>{console.log("Nope")})
}

