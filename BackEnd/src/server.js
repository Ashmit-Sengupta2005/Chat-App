import express from "express";
import authRoutes from "./Routes/AuthRoutes.js"
import messageRoutes from "./Routes/MessageRoutes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import { connectDB } from "./Config/DB.js";
import cors from "cors";
import { server,app } from "./Config/Socket.js";
import path from "path";
dotenv.config();
const PORT=process.env.PORT;
const __dirname=path.resolve();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/msg",messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../FrontEnd/dist")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../FrontEnd/dist", "index.html"));
  });
}
connectDB().then(()=>{server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});});