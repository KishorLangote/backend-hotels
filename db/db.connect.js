const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

// this is syntax to connect to the database...

const initializeDatabase = () => {
    mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("Connected database successfully.")
    })
    .catch((error) => {
        console.log("Error to connecting hotel database.", error)
    })
}

module.exports = { initializeDatabase }