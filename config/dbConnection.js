const mongoose = require('mongoose');
const connectDb = async () => {
    try {
        const DB_URL = process.env.CONNECTION_STRING;
        const connect = await mongoose.connect(DB_URL);
        console.log("Database connection established", connect.connection.host, connect.connection.name);
    }
    catch (err) {
        console.error("Database connection failed !!!! .Check your DB Connection", err);
        process.exit(1)
    }

};

module.exports = { connectDb };