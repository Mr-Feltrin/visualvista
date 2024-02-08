const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Connection
const conn = async () => {
    // Set your own connection
    try {
        const dbConn = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster`);
        console.log("conectou ao banco!");
        return dbConn;
    }
    catch (error) {
        console.log(error);
    }
}

conn();

module.exports = conn;