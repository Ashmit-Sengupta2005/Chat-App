import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../Models/User.js";
dotenv.config();

const seedAIChatBot=async()=>{
    try{
        const botId=process.env.CHATBOT_ID;
        // This Id dates back to 1970 no one can copy it
        const botExists=await User.findById(botId);
        if(!botExists){
            const newBot= new User({
                _id:botId,
                username:"Gemini AI",
                email:"YouCantMail@gmail.com",
                password:"YouCannotGuessMe@123456",
                isBot:true,
                profilePicture:"https://cdn-icons-png.flaticon.com/512/8943/8943377.png",
            });
            if(newBot){
                console.log("Gemini Bot created successfully");
                await newBot.save();
            }
            else{
                console.log("Error in creating Gemini Bot");
            }
        }
        else{
            console.log("Gemini ChatBot Already exists");
        }
    }
    catch(error){
        console.log("Error seeding AI chatbot:", error.message);}
}
export const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo DB connected");
        // Prepare the chatbot after DB is created else error
        await seedAIChatBot();
    }
    catch(error){
        console.log("Mongo DB connection error");
        console.log(error);
        process.exit(1);
    }
};