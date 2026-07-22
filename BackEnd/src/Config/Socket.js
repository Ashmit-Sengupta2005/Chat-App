import {Server} from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin: [process.env.CLIENT_URL || "http://localhost:5173"]
    },
});

export function getReceiverSocketID(userId){
    return userSocketMap[userId];
};
// socket.io assigns a temporary id to online users
// to know who is who we create a map to link user id and socket id
// as in our mongo db we identify a user by unique ID
const userSocketMap={};//{userId:socketId}
 io.on("connection",(socket)=>{
     console.log("A user connected", socket.id);
     const userId=socket.handshake.query.userId;
     if(userId) userSocketMap[userId]=socket.id;

     // io.emit() emit to all users that a new user is online
     io.emit("getOnlineUsers",Object.keys(userSocketMap));

     socket.on("disconnect",()=>{
         console.log("A user disconnected", socket.id);
         delete userSocketMap[userId];
         io.emit("getOnlineUsers",Object.keys(userSocketMap));
     });
 });
export {io,app,server};