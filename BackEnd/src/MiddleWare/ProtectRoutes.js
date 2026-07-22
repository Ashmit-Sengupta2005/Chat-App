import jwt from "jsonwebtoken";
import User from "../Models/User.js";
export const protectRoutes=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Access denied, No Token exists"});}
        const decoded=await jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
          return res.status(401).json({message:"Access denied, Invalid Token"});}
        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
          return res.status(404).json({message:"Access denied, User Not Found"});}
        req.user=user;
        next();}
    catch(error){
        console.log("Error in protectRoute Middleware ",error.message);
        res.status(500).json({message:"Internal Server Error"});}
};