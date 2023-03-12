const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3000;
const databaseUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/test";

const app = require("./app");

const start = async () => {
  await mongoose
    .connect(databaseUrl)
    .then(() => {
      console.log("Database connection successful");
    })
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });

  app.listen(port, () => {
    console.log(`Server running. Use our API on port: ${port}`);
  });
};
start();
