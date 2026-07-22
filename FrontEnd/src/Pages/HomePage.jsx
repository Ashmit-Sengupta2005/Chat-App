import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';
import NoChatSelected from '../Card/NoChatSelected.jsx';
import { useChatStore } from '../Store/UseChatStore.js';
import ChatContainer from '../Components/ChatContainer.jsx';
import { useEffect } from 'react';
import { useAuthStore } from '../Store/UseAuthStore.js';


const HomePage = () => {
  const { selectedUser, getUsers} = useChatStore();
  const { socket,authUser } = useAuthStore();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      getUsers();

      //  If the message belongs to the currently open chat, add it to the screen
      const currentSelectedUser = useChatStore.getState().selectedUser;
      if (currentSelectedUser && newMessage.senderID === currentSelectedUser._id) {
          useChatStore.setState({
              messages: [...useChatStore.getState().messages, newMessage]
          });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, getUsers]);
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-base-200">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 font-sans overflow-hidden">
        <div className="bg-base-100 rounded-2xl border border-white/30 shadow-2xl w-full max-w-[85vw] h-full max-h-[calc(100vh-8rem)] flex overflow-hidden">
        
          <Sidebar />
          {!selectedUser&&<NoChatSelected />}
          {selectedUser &&<ChatContainer/>}
        </div>
      </div>
    </div>
  );
};

export default HomePage;