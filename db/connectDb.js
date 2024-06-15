const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "pictures-studio",
    });
    console.log(`Database connected on ${conection.connection.host}`);
  } catch (error) {
    console.log("Database connection failed..........", error.message);
  }
};

module.exports = connectDb;
