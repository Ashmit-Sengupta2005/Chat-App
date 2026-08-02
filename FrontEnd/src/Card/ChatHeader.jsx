import { X, Ban } from "lucide-react";
import { useAuthStore } from "../Store/UseAuthStore.js";
import { useChatStore } from "../Store/UseChatStore.js";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers,authUser,blockUser,unblockUser} = useAuthStore();
  const [showModal,setShowModal]=useState(false);
  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id) || selectedUser._id === "000000000000000000000000";
  const isBlocked=authUser?.blockedUsers?.includes(selectedUser?._id);

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
        {selectedUser._id !== "000000000000000000000000" && selectedUser._id !== authUser._id && (
          <button 
            onClick={() => setShowModal(true)}
            className={`btn btn-sm flex items-center gap-1 text-white transition-all duration-200 border-none hover:-translate-y-0.5 hover:shadow-lg ${
              isBlocked 
                ? "bg-green-600 hover:bg-green-700 hover:shadow-green-900/50" 
                : "bg-red-600 hover:bg-red-700 hover:shadow-red-900/50"
            }`}
          >
            <Ban className="w-4 h-4" />
            {isBlocked ? "Unblock" : "Block"}
          </button>
        )}
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-white/10 text-base-content/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Custom Block/Unblock Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-base-100 p-6 rounded-2xl shadow-2xl w-96 border border-white/10">
            
            <h3 className="text-xl font-bold mb-3">
              {isBlocked ? "Unblock User" : "Block User"}
            </h3>
            
            <p className="mb-6 text-base-content/70">
              {isBlocked 
                ? `Are you sure you want to unblock ${selectedUser.username}?` 
                : `Are you sure you want to block ${selectedUser.username}? They will no longer be able to message you.`}
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                className="btn btn-ghost rounded-xl" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              
              <button 
                className={`btn rounded-xl text-white border-none ${
                  isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
                onClick={() => {
                  if (isBlocked) {
                    unblockUser(selectedUser._id);
                  } else {
                    blockUser(selectedUser._id);
                  }
                  setShowModal(false);
                }}
              >
                {isBlocked ? "Unblock" : "Block"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;