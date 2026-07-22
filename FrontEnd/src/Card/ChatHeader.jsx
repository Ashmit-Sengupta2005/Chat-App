import { X, Ban } from "lucide-react";
import { useAuthStore } from "../Store/UseAuthStore.js";
import { useChatStore } from "../Store/UseChatStore.js";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id) || selectedUser._id === "000000000000000000000000";

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/20">
      
      {/* Left side: Avatar and User Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.profilePicture || `https://ui-avatars.com/api/?name=${selectedUser.username}&background=random`}
            alt={selectedUser.username}
            className="w-10 h-10 object-cover rounded-full"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-base-100" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-medium">{selectedUser.username}</span>
          <span className="text-sm text-base-content/60">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-6">
        <button className="btn btn-sm flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200 border-none">
          <Ban className="w-4 h-4" />
          Block
        </button>

        <button 
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-white/10 text-base-content/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
    </div>
  );
};

export default ChatHeader;