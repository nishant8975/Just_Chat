import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

// app and server come from your socket setup
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// ✅ Set higher limits for large payloads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use(cookieParser());

// ✅ CORS setup for frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Make sure this matches your frontend
    credentials: true,
  })
);

// ✅ REST API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

 app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

}

// ✅ Start server with socket support
server.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
  connectDB();
});
