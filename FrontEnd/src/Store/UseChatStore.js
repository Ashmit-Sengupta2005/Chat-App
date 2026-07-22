import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../Lib/axios.js";
export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    searchUsersArray:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    sendingMessage:false,
    isSearchingUser:false,
    selectedSound:localStorage.getItem('selectedSound') || '/Bell.mp3',
    soundEnabled:localStorage.getItem('soundEnabled')!=='false',
    getUsers:async()=>{
        set({isUsersLoading:true});
        try{
            const res=await axiosInstance.get("/msg/users");
            set({users:res.data.DisplayContacts});
            //toast.success("All contacts fetched successfully")
            return true;
        }
        catch(error){
            toast.error("Failed to fetch your contacts");
            console.log(error.message);
            return false;
        }
        finally{
          set({isUsersLoading:false});  
        }
    },
    getMessages:async(userID)=>{
        set({isMessagesLoading:true});
        try{
            const res=await axiosInstance.get(`/msg/getMessages/${userID}`);
            set({messages:res.data.msg});
           // toast.success("Messages Fetched Successfully");
        }
        catch(error){
            toast.error("Failed to fetch your messages");
            console.log(error.message);
        }
        finally{
            set({isMessagesLoading:false});
        }
    },
    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
        if (selectedUser) {
            get().readMessages();
        }
    },
    sendMessage:async(msg,userID)=>{
        set({sendingMessage:true});
        try{
            const res=await axiosInstance.post(`/msg/send/${userID}`,msg);
            set((state)=>{
                const updatedMessages=[...state.messages,res.data.data];
                if(res.data.botResponse){
                    updatedMessages.push(res.data.botResponse);
                }
            return {messages:updatedMessages};
            })
            get().getUsers();}
        catch(error){
           toast.error("Failed to send your message");
            console.log(error.message); }
        finally{
            set({sendingMessage:false});
        }
    },
    searchUser:async(details)=>{
        try{
            set({isSearchingUser:true});
            const res=await axiosInstance.get("/msg/search",{params:{query:details}});
            set ({searchUsersArray:res.data.DisplayContacts});
        }
        catch(error){
            console.log("Error in searchUser in useChatStore");
            console.log(error.message);
            toast.error("Failed to search");
        }
        finally{
            set({isSearchingUser:false});
        }
    },
    readMessages:async()=>{
        const { selectedUser } = get();
        if (!selectedUser) return;
        try{
            set((state)=>({
                users:state.users.map(user=>user._id===selectedUser._id?{...user,unreadMessages:0}:user)}));
             await axiosInstance.put(`/msg/read/${selectedUser._id}`);
        }
        catch(error){
            console.log("Failed to mark messages as read:", error.message);
        }
    },
    toggleSound:()=>set((state)=>{
        const newSetting=!state.soundEnabled;
        localStorage.setItem('soundEnabled',newSetting);
        return {soundEnabled:newSetting};
    }),
    setSelectedSound:(soundPath)=>{
        localStorage.setItem('selectedSound',soundPath);
        set({selectedSound:soundPath});
        const preview=new Audio(soundPath);
        preview.play().catch(e=>console.log("Preview blocked",e));
    }
}))