import bcrypt from "bcryptjs";
import User from "../Models/User.js";
import { generateToken } from "../Config/Utils.js";
import validator from "validator";
import cloudinary from "../Config/Cloudinary.js";
import dotenv from "dotenv";
import {OAuth2Client} from 'google-auth-library';
import axios from "axios";
dotenv.config();
export const RegisterUser= async (req,res)=>{
    try{
        const {username,email,password,confirmPassword}=req.body;
        if (!username || !email || !password||!confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });}
        const emailLower = email.toLowerCase();
        if (username.length < 3||username.length>30) {
            return res.status(400).json({ message: "Username length must be between 3 to 30 characters" });}
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters long"});}
        if(password!==confirmPassword){
            return res.status(400).json({message:"Passwords don't match.Try Again"});}
        if(!validator.isEmail(emailLower)){
             return res.status(400).json({message:"Please enter a valid email ID following standard notations"});}
        const checkUser=await User.findOne({email: emailLower});
        if(checkUser){
            return res.status(400).json({message:"User already exists with same email"});}
        const salt =await bcrypt.genSalt(11);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            username,email: emailLower,password:hashedPassword,lastUsernameChange:new Date(),lastPasswordChange:new Date()});
        if(!newUser){
            return res.status(400).json({message:"Invalid User Data"});}
        await newUser.save();
        generateToken(newUser._id,res);
        const userResponse={
            _id:newUser._id,
            username:newUser.username,
            email:newUser.email,
            profilePicture:newUser.profilePicture,
            createdAt:newUser.createdAt }
        res.status(201).json({message:"New User created Successfully",user:userResponse});}
     catch(error){
        console.log("Error in registration: ",error.message);
        res.status(500).json({message:"Registration Failed.Internal Server Error"});}
};

export const LoginUser=async (req,res)=>{
    try{
    const {email,password}=req.body;
    if(!email||!password){
         return res.status(400).json({ message: "All fields are required" });}
    const emailLower = email.toLowerCase();
    const user=await User.findOne({email: emailLower});
    if(!user){
        return res.status(400).json({message:"Invalid Credentials"});}
    const isPasswordCorrect=await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Credentials"});}
    generateToken(user._id,res);
    const userResponse={
        _id:user._id,
        username:user.username,
        email:user.email,
        profilePicture:user.profilePicture,
        createdAt:user.createdAt}
    res.status(200).json({
        message:"Logged In successfully",
        user:userResponse});}
    catch(error){
        console.log("Error in login: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });}
};

export const LogoutUser=(req,res)=>{
    //Standard way clear the cookie by setting its maxAge to 0 and setting cookie to empty string
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged Out Successfully"});}
    catch(error){
        console.log("Error in logout: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth=(req,res)=>{
    //Middleware attaches user attribute(req.user) 
    try{
        res.status(200).json({user:req.user});}
    catch(error){
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });}
}

export const UpdateProfilePic=async(req,res)=>{
    //Middleware attaches user attribute(req.user) 
    try{
        const {profilePicture}=req.body;
        const userId=req.user._id;
        if(!profilePicture){
            return res.status(400).json({message:"Profile Picture is required"});}
        //Upload new Profile Picture
        const uploadPic=await cloudinary.uploader.upload(profilePicture);
        const updatedUser=await User.findByIdAndUpdate(
            userId,
            {profilePicture:uploadPic.secure_url},
            {new:true}).select("-password");
        res.status(200).json({user:updatedUser});}
    catch(error){
        console.log("Error in UpdateProfilePic controller");
        console.log(error.message);
        res.status(500).json({message:"Failed to update profile picture.Internal Server Error"});
    }
};

export const updateUsername=async(req,res)=>{
    try{
        const {newUsername}=req.body;
        const userID=req.user._id;
        if (!newUsername || newUsername.trim() === "") {
            return res.status(400).json({ message: "Username cannot be empty" });}
        if (newUsername === req.user.username) {
            return res.status(400).json({ message: "New username must be different from current username" });}
        if (newUsername.length < 3||newUsername.length>30) {
            return res.status(400).json({ message: "Username length must be between 3 to 30 characters" });}
        const user=await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });}
        const minTime=Number(process.env.USERNAME_CHANGE_DAYS)*(24*60*60*1000);
        const lastTime= (user.lastUsernameChange).getTime();
        const timeElapsed=(Date.now()-lastTime);
        if(timeElapsed<minTime){
            const remainingTime=Math.ceil((minTime-timeElapsed)/(24*60*60*1000));
            return res.status(400).json({message:`Username can't be changed before ${remainingTime} more days`});}  
        const updatedUser=await User.findByIdAndUpdate(
            userID,
            {username:newUsername, lastUsernameChange:Date.now()},
            {new:true}).select("-password");
        res.status(200).json({message:"Username Updated",user:updatedUser});}
    catch(error){
        console.log("Error in UpdateUsername controller");
        console.log(error.message);
        res.status(500).json({message:"Failed to update username .Internal Server Error"});}
};

export const updateEmail = async (req, res) => {
    try {
        const { newEmail, password } = req.body;
        const userID = req.user._id;

        if (!newEmail || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const newEmailLower = newEmail.toLowerCase();
        if (!validator.isEmail(newEmailLower)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }
        if(newEmail==req.user.email){
             return res.status(400).json({ message: "Old email and new email must be different from each other" });
        }
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const emailExists = await User.findOne({ email: newEmailLower });
        if (emailExists) {
            return res.status(400).json({ message: "Email is already taken" });
        }

        user.email = newEmailLower;
        await user.save();

        res.status(200).json({
            message: "Email updated successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                createdAt:user.createdAt
            }
        });
    } catch (error) {
        console.log("Error in updateEmail controller:", error.message);
        res.status(500).json({ message: "Failed to update email. Internal Server Error" });
    }
};

export const updatePassword = async(req,res)=>{
    try{
    const {currentPassword, newPassword, confirmNewPassword}= req.body;
    const userID=req.user._id;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "All fields are required" });}
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "New passwords do not match" });}
    if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });}
    if (currentPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different from the current password" });}
    const user = await User.findById(userID);
    if (!user) {
        return res.status(404).json({ message: "User not found" });}
    const cooldownDays = process.env.PASSWORD_CHANGE_DAYS;
    const minTime = cooldownDays * (24 * 60 * 60 * 1000);
    const lastTime = user.lastPasswordChange ? new Date(user.lastPasswordChange).getTime() : 0;
    const timeElapsed = Date.now() - lastTime;
    if (timeElapsed < minTime) {
        const remainingTime = Math.ceil((minTime - timeElapsed) / (24 * 60 * 60 * 1000));
        return res.status(400).json({ message: `Password can't be changed before ${remainingTime} more days` });}
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect current password" });}
    const salt = await bcrypt.genSalt(11);
    user.password = await bcrypt.hash(newPassword, salt);
    user.lastPasswordChange = new Date();
    await user.save();
     res.status(200).json({ message: "Password updated successfully" });}
    catch(error){
         console.log("Error in updatePassword controller:", error.message);
        res.status(500).json({ message: "Failed to update password. Internal Server Error" });}
};

export const deleteAccount=async(req,res)=>{
    try{
        const { confirmText, password } = req.body;
        const userID = req.user._id;
        if (!confirmText || !password) {
            return res.status(400).json({ message: "Both verification text and password are required" });}
        if (confirmText.trim().trim().toLowerCase() !== "delete my account") {
            return res.status(400).json({ message: "Verification text is incorrect" });}
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });}
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password. Deletion cancelled." });}
        await User.findByIdAndDelete(userID);
        //Clear JWT cookie to log them out
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Account deleted successfully" });}
    catch(error){
        console.log("Error in deleteAccount controller:", error.message);
        res.status(500).json({ message: "Failed to delete account. Internal Server Error" });}
};

export const googleAuth=async(req,res)=>{
    try{
        const {token}=req.body;
        const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { email } = (googleResponse.data);
        const currUser = await User.findOne({ email: email});
        if(!currUser){
            return res.status(404).json({message:"User not found.Try registering first"});
        }
        generateToken(currUser._id,res);
        const userResponse={
             _id: currUser._id,
            username: currUser.username,
            email: currUser.email,
            profilePicture: currUser.profilePicture,
            createdAt: currUser.createdAt
        }
        return res.status(200).json({
            message: "Google Login successful",
            user: userResponse
        });
        }
    catch(error){
        console.error("Error in Google Auth:", error);
        res.status(500).json({ message: "Internal server error during Google Authentication" });
    }
};