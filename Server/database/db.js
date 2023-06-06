const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect("mongodb://localhost:27017/bookingDB", {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/bookingDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
