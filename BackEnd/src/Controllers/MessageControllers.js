import Message from "../Models/Message.js";
import User from "../Models/User.js";
import dotenv from "dotenv";
import cloudinary from "../Config/Cloudinary.js";
import {GoogleGenerativeAI} from "@google/generative-ai";
import { getReceiverSocketID, io } from "../Config/Socket.js";
dotenv.config();
export const knownContacts=async (req,res)=>{
    try{
        const currentUser=req.user._id;
        // 1. Fetching all messages where current user is either sender or receiver
        const messages=await Message.find({
            $or:[
                {senderID:currentUser},
                {receiverID:currentUser}]
        }).sort({createdAt:-1});// last message order
        //2. Fetch AI chatbot
       const botId=process.env.CHATBOT_ID;
      // const AIBot=await User.findById(botId).select("-password");
        //3. Extracting unique sender Ids except currUser and gemini
        const contactIds= new Set();
        const lastMessageTimeStamp=new Map();
        const unreadMessages=new Map();
        messages.forEach((msg)=>{
            const sender=msg.senderID.toString();
            const receiver=msg.receiverID.toString();
            const current=currentUser.toString();
            const contactId=(sender===current)?receiver:sender;
            if(!lastMessageTimeStamp.has(contactId)){
                lastMessageTimeStamp.set(contactId,msg.createdAt);}
            if(sender!==current){
                if(!msg.isRead){
                    if(unreadMessages.has(sender)){
                        const curr=unreadMessages.get(sender);
                        unreadMessages.set(sender,curr+1);
                    }
                    else{
                        unreadMessages.set(sender,1);}}}
            contactIds.add(contactId);});
        contactIds.add(currentUser.toString());
        if(botId){
            contactIds.add(botId.toString());}
        else{
            return res.status(400).json({message:"Failed to add AI Bot in contacts"});
        }
        //4. Fetch details of unique Id's in the set except passwords
        const orderedIds=Array.from(contactIds);
       const details=await User.find({
        _id:{$in:Array.from(orderedIds)}
       }).select("-password");
        details.sort((a, b) => {
            return orderedIds.indexOf(a._id.toString()) - orderedIds.indexOf(b._id.toString());
        });
        const detailsWithTime=details.map((user)=>{
            const userObj=user.toObject();
            return {...userObj,
                lastMessageTime:lastMessageTimeStamp.has(user._id.toString()) ?
                lastMessageTimeStamp.get(user._id.toString()):null,
                unreadMessages:unreadMessages.has(user._id.toString())?
                unreadMessages.get(user._id.toString()):0}
        })
        return res.status(200).json({DisplayContacts:detailsWithTime});
    }
    catch(error){
        console.log("Error in knownContacts controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });}
};

export const getMessages=async(req,res)=>{
    try{
    const {id}=req.params;
    const userID=req.user._id;
    // Collect Messages between user and receiver
    const messages=await Message.find({
        $or:[
            {senderID:userID,receiverID:id},
            {senderID:id,receiverID:userID}]}).sort({createdAt:1});
    res.status(200).json({message:"Message Fetching was Successful",msg:messages});
    }
    catch(error){
        console.log("Error in getMessages Controller");
        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
};

const geminiImageHelper=(dataURL)=>{
    /*Gemini cant understand standard image strings sent by frontend
      Instead it needs two things mime type(jpeg/png) and raw Base64 Data*/
      const matches=dataURL.match(/^data:(.+);base64,(.+)$/);
      if(!matches) return null;
      return {
        mimeType:matches[1],
        data:matches[2]}
};

export const sendMessages=async(req,res)=>{
    const botId = process.env.CHATBOT_ID;
    try{
        const sender=req.user._id;
        const receiver=req.params.id;
        const {text,image}=req.body;
        // Message from user to receiver
        //Upload image in Cloudinary and save the message
        if(!text&&!image){
            return res.status(400).json({message:"Invalid message should contain some text or image"});}
        const imageUpload=image?await cloudinary.uploader.upload(image):null;
        const newMessage=new Message({
            senderID:sender,
            receiverID:receiver,
            text:text,
            ...(imageUpload&&{image:imageUpload.secure_url})});
        await newMessage.save();
        const receiverSocketID=getReceiverSocketID(receiver);
        if(receiverSocketID){
            io.to(receiverSocketID).emit("newMessage",newMessage);
        }
        if(receiver===botId){
            try{
                const previousMessages=await Message.find({
                    $or:[
                        {senderID:sender,receiverID:botId},
                        {senderID:botId,receiverID:sender}
                    ]
                }).sort({createdAt:-1}).limit(15);
                previousMessages.reverse();
                // In formatted History we don't add image as it is time consuming
                const formattedHistory=previousMessages.map(
                    (msg)=>{
                        const textContent = msg.text || (msg.image ? "[User sent an image attachment]" : "");
                        return{
                            role:msg.senderID.toString()===sender.toString()?"user":"model",
                            parts:[{text:textContent}]
                        };
                    });
                const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model=genAI.getGenerativeModel({model:"gemini-3.1-flash-lite"});
                //Calling gemini using prompt
                const prompt_text=text||"Analyze the image.";
                //Add text to prompt
                const prompt=[prompt_text];
                // Add image to prompt
                if(image){
                    const parsedImage=geminiImageHelper(image);
                    if(parsedImage){
                        prompt.push({
                            inlineData:{
                                data:parsedImage.data,
                                mimeType:parsedImage.mimeType}});}}
                const chatSession=model.startChat({history:formattedHistory});
                const result=await chatSession.sendMessage(prompt);
                const AIresponse=result.response.text();
                const botMessage=new Message({
                    senderID:botId,
                    receiverID:sender,
                    text:AIresponse,
                    image:""});
                await botMessage.save();
                const receiverSocketID=getReceiverSocketID(sender);
                if(receiverSocketID){
                io.to(receiverSocketID).emit("newMessage",botMessage);
        }
                 // 6. Return both messages to the client
                return res.status(201).json({
                    message: "AI responded successfully",
                    data: newMessage, // Your message
                    botResponse: botMessage // Gemini's response
                });}
            catch(AIError){
                 console.log("Error generating AI response:", AIError.message);
                // If AI fails, still return the user's message so the app doesn't break
                return res.status(201).json({
                    message: "Message sent, but AI response failed",
                    data: newMessage,
                    botResponse: null});
            }}
        console.log("Message Sent Successfully");
        res.status(201).json({message:"Message Sent Successfully",data:newMessage});}
    catch(error){
        console.log("Error in sendMessages Controller");
        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"});}
};

export const searchUsers=async(req,res)=>{
    try{
        const {query}=req.query;
        if(!query){
              return res.status(400).json({ message: "Search query is required" });}
        const currentUserId=req.user._id;
        const botId = process.env.CHATBOT_ID;
        const users=await User.find({
            $or:[
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ],});
         res.status(200).json({ DisplayContacts: users });
    }
    catch(error){
        console.log("Error in searchUsers Controller");
        console.log(error.message);
        res.status(500).json({ message: "User Not Found" });
    }
};

export const readMessages=async(req,res)=>{
    try{
        const currUser=req.user._id;
        const sender=req.params.id;
        await Message.updateMany({
            senderID:sender,
            receiverID:currUser},
            {$set:{
                isRead:true}});
        res.status(200).json({ message: "Messages marked as read" });}
    catch(error){
        console.log("Error in readMessages controller");
        console.log(error.message);
    }   
};
