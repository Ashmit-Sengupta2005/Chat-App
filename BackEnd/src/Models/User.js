import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    username:{
        type:String,
        required:true,
    },
    lastUsernameChange:{
        type:Date,
        default:null
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    lastPasswordChange:{
        type:Date,
        default:null
    },
    profilePicture:{
        type:String,
        default:"", 
    },
    isBot:{ // for AI chatbot
        type:Boolean,
        default:false
    },
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
},
    {timestamps:true});

const User= mongoose.model("User",userSchema);
export default User;