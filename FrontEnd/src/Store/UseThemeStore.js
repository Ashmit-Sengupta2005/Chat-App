import {create} from "zustand";
import toast from "react-hot-toast";
export const useThemeStore=create((set)=>({
    theme:localStorage.getItem("chat-theme")||"night",
    setTheme:(theme)=>{
        localStorage.setItem("chat-theme",theme);
        set({theme});
        toast.success("Chat-theme updates successfully");
    }
}))