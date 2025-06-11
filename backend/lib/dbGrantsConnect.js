// grantDb.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
const grantConnection = mongoose.createConnection(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

grantConnection.on("connected", () => {
  console.log("✅ Connected to grants database");
});

grantConnection.on("error", (err) => {
  console.error("❌ Grants DB connection error:", err);
});

export default grantConnection;
