import { Routes, Route,Navigate } from "react-router-dom";
import  HomePage  from "./Pages/HomePage.jsx";
import SettingsPage from "./Pages/SettingsPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import { useAuthStore } from "./Store/UseAuthStore.js";
import { useChatStore } from "./Store/UseChatStore.js";
import { useThemeStore } from "./Store/UseThemeStore.js";
import { useEffect } from "react";
import LoadingCard from "./Card/LoadingCard.jsx";


const App = () => {
  const {authUser,checkAuth,isCheckingAuth,socket}=useAuthStore();
  const {theme}=useThemeStore();
  useEffect(()=>{checkAuth()},[checkAuth]);

  // Global notification sound listener — survives page navigation
  useEffect(() => {
    if (!socket) return;
    const handleNotificationSound = (newMessage) => {
      const { soundEnabled } = useChatStore.getState();
      const currentUser = useAuthStore.getState().authUser;
      if (currentUser && newMessage.senderID !== currentUser._id && soundEnabled) {
        const audio=new Audio(useChatStore.getState().selectedSound);
        audio.play().catch(e=>console.log("Audio blocked",e));
      }
    };
    socket.on("newMessage", handleNotificationSound);
    return () => socket.off("newMessage", handleNotificationSound);
  }, [socket]);
   if (isCheckingAuth && !authUser) {
    return <LoadingCard message="Verifying session..." />;}
  return (
    <div data-theme={theme} className="min-h-screen bg-base-100">
      <Routes>
          <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
          <Route path="/register" element={!authUser?<RegisterPage/>:<Navigate to="/"/>}/>
          <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>}/>
          <Route path="/settings" element={authUser?<SettingsPage/>:<Navigate to="/login"/>}/>
          <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>
          {/* The React 404 Catch-all */}
          <Route path="*" element={
          <div className="flex justify-center items-center h-screen">
          <h1>404 - Page Not Found 😢</h1></div>}/>
      </Routes>
    </div>
  )
}

export default App