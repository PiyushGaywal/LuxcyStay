const mongoose = require("mongoose");

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongoUrl, {
      serverSelectionTimeoutMS: 5000
    });
  } catch (err) {
    console.log("Initial DB connection failed:", err);
  }
};

module.exports = connectDB;
