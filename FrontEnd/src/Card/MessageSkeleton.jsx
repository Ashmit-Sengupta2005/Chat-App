import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";

const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {skeletonMessages.map((_, idx) => (
          <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full skeleton" />
            </div>
            
            <div className="chat-header mb-1">
              <div className="skeleton h-4 w-16" />
            </div>
            
            <div className="chat-bubble bg-transparent p-0">
              <div className="skeleton h-12 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
      
      <MessageInput />
    </div>
  );
};

export default MessageSkeleton;
