// config/db.js
const mongoose = require(`mongoose`);
require('dotenv/config')
const connectDB = async () => {
try {
const conn = await mongoose.connect(process.env.MONGO_URI);
console.log(`MongoDB connected: ${conn.connection.host}`);
} catch (error) {
console.error(`DB connection error: ${error.message}`);
process.exit(1); // crash fast--don’t run without DB
}
};
module.exports = connectDB;