import {create} from "zustand";
import { axiosInstance } from "../Lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const baseURL=import.meta.env.MODE==="production"?"/":"http://localhost:5002"
export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isLoggingOut:false,
    isUpdatingProfilePic:false,
    isCheckingAuth:true,
    isUpdatingUsername:false,
    isUpdatingEmail:false,
    isUpdatingPassword:false,
    isDeletingAccount:false,
    onlineUsers:[],
    socket:null,
    checkAuth: async()=>{
        set({isCheckingAuth:true});
        try{
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data.user}); //sets logged in user
            get().connectSocket();
        }
        catch{
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
    login:async(details)=>{
        set({isLoggingIn:true});
        try{
            const res=await axiosInstance.post("/auth/login",details);
            const user=res.data.user;
            set({authUser:user});
            get().connectSocket();
        }
        catch(error){
             const errorMessage = error.response?.data?.message || "Something went wrong";
             toast.error(errorMessage);
            set({authUser:null});
        }
        finally{
            set({isLoggingIn:false});
        }
    },
    logout:async()=>{
        set({isLoggingOut:true});
        try{
            await axiosInstance.post("/auth/logout");
            set({isLoggingOut:false});
            set({authUser:null});
            get().disconnectSocket();}
        catch(error){
            const errorMessage = error.response?.data?.message || "Something went wrong";
             toast.error(errorMessage);
        }
        finally{
            set({isLoggingOut:false});
        }
    },
    register:async(details)=>{
        set({isSigningUp:true});
        try{
            const res=await axiosInstance.post("/auth/register",details);
            set({authUser:res.data.user});}
        catch(error){
            const errorMessage = error.response?.data?.message || "Something went wrong";
             toast.error(errorMessage);
            set({authUser:null});
        }
        finally{
            set({isSigningUp:false});
        }
    },
    googleAuth: async (token) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/google", { token });
            const user = res.data.user;
            set({ authUser: user });
            get().connectSocket();
            // toast.success("Logged in with Google successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Google Login failed";
            toast.error(errorMessage);
            set({ authUser: null });
        } finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfilePic:async(pic)=>{
        set({isUpdatingProfilePic:true});
        try{
            const res=await axiosInstance.put("/auth/updateProfilePicture",pic);
            toast.success("Profile Picture Updated Successfully");
            set({authUser:res.data.user});}
        catch(error){
            const errorMessage = error.response?.data?.message || "Something went wrong";
             toast.error(errorMessage);}
        finally{
            set({isUpdatingProfilePic:false});}
    },
    updateUsername:async(data)=>{
        set({isUpdatingUsername:true});
        try{
            const res=await axiosInstance.put("/auth/updateUsername",data);
            set({authUser:res.data.user});
            toast.success("Username updated successfully");
            console.log("Username updated successfully");
            return true;}
        catch(error){
             const errorMessage = error.response?.data?.message || "Something went wrong";
             toast.error(errorMessage);
             return false;}
        finally{
            set({isUpdatingUsername:false});}
    },
    updateEmail:async(data)=>{
        set({isUpdatingEmail:true});
        try{
            const res=await axiosInstance.put("/auth/updateEmail",data);
            set({authUser:res.data.user});
            toast.success("Email updated successfully");
            console.log("Email updated successfully");
            return true;}
        catch(error){
            const errorMessage = error.response?.data?.message || "Something went wrong";
             toast.error(errorMessage);
             return false;
        }
        finally{
            set({isUpdatingEmail:false});
        }
    },
    updatePassword:async(data)=>{
        set({ isUpdatingPassword: true });
        try{
             await axiosInstance.put("/auth/updatePassword", data);
             toast.success("Password updated successfully");
            console.log("Password updated successfully"); 
            return true;}
        catch(error){
            const errorMessage = error.response?.data?.message || "Something went wrong";
             toast.error(errorMessage);
             return false;}
        finally{
            set({ isUpdatingPassword: false });}
    },
    deleteAccount:async(details)=>{
        set({ isDeletingAccount: true });
        try{
            // NOTE: We pass the body inside { data: details } as axios syntax is different
            await axiosInstance.delete("/auth/deleteAccount", { data: details });
            toast.success("Account deleted successfully");
            set({authUser:null});
            return true;
        }
        catch(error){
            const errorMessage = error.response?.data?.message || "Something went wrong";
             toast.error(errorMessage);
             return false;
        }
        finally{
            set({ isDeletingAccount: false });
        }
    },
    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser||get().socket?.connected) return;
        const socket=io(baseURL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds});
        })
    },
    disconnectSocket:()=>{
        if(get().socket?.connected)
            get().socket.disconnect();
    }       
}));