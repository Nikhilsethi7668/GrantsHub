import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/connectDb.lib.js";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import businessRoutes from "./routes/business.routes.js";
import grantRoutes from "./routes/grants.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { contactUs } from "./controllers/contact.controller.js";
import { getUniqueSectorsAndSaveToJson } from "./controllers/extractUniqueFields.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// const __dirname  =path.resolve(); // Add this line

const corsOptions = {
  origin: ["http://localhost:5173", "https://grant-app-frontend.amiigo.in"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/grants", grantRoutes);
app.use("/api/payment", paymentRoutes);
app.post("/api/contact", contactUs);
app.get("/api/get-sector-list", getUniqueSectorsAndSaveToJson);

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDB(); // Ensure database connects before serving requests
});
