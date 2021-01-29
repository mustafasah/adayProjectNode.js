const bcrypt = require ("bcryptjs")
const User = require("../models/User")

const inputDogrula = (email,password) => {
    return email && password
}

const comparePassword = (password,hashpassword) => {
    return bcrypt.compareSync(password,hashpassword)
}


module.exports = {inputDogrula,comparePassword}