import { useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { useChatStore } from "../Store/UseChatStore";
import ChatHeader from "../Card/ChatHeader";
import MessageInput from "../Card/MessageInput";
import MessageSkeleton from "../Card/MessageSkeleton";
import { useAuthStore } from "../Store/UseAuthStore";

const ChatContainer = () => {
  const { messages, getMessages, selectedUser, isMessagesLoading } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return <MessageSkeleton />;
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader />
      
      {/* Removed space-y-2 to manually control margins */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => {
          const isMyMessage = message.senderID === authUser._id;
          
          // 1. Surrounding messages logic
          const previousMessage = messages[index - 1];
          const nextMessage = messages[index + 1];

          const isPrevMessageSameUser = previousMessage && previousMessage.senderID === message.senderID;
          const isNextMessageSameUser = nextMessage && nextMessage.senderID === message.senderID;

          // 2. Dynamic Gaps
          // DaisyUI adds default padding to .chat, so we will use py-0 to override it.
          // For same-sender messages, we use a tiny 1px margin. For different senders, we use mb-4.
          const gapClass = isNextMessageSameUser ? "mb-[3px]" : "mb-4";

          // 3. Dynamic Corners (Instagram style)
          let cornerClass = "!rounded-2xl"; // Default all round
          
          if (isMyMessage) {
            // My messages (Right side)
            if (isPrevMessageSameUser) cornerClass += " !rounded-tr-[4px]";
            if (isNextMessageSameUser) cornerClass += " !rounded-br-[4px]";
          } else {
            // Their messages (Left side)
            if (isPrevMessageSameUser) cornerClass += " !rounded-tl-[4px]";
            if (isNextMessageSameUser) cornerClass += " !rounded-bl-[4px]";
          }

          // 4. Avatar Logic: Only show the avatar on the LAST message of their group
          // We use 'invisible' so it keeps the vertical alignment perfect!
          const showAvatar = !isMyMessage && !isNextMessageSameUser;

          return (
            <div
              key={message._id}
              className={`chat ${isMyMessage ? "chat-end" : "chat-start"} ${gapClass} py-0`}
            >
              {!isMyMessage && (
                <div className={`chat-image avatar ${!showAvatar ? "invisible" : ""}`}>
                  <div className="w-8 rounded-full border border-base-300">
                    <img
                      src={
                        selectedUser.profilePicture ||
                        `https://ui-avatars.com/api/?name=${selectedUser.username}&background=random`
                      }
                      alt="profile avatar"
                    />
                  </div>
                </div>
              )}
              
              <div
                className={`chat-bubble flex flex-col min-h-0 before:hidden pl-4 pr-[55px] pt-2 pb-1.5 relative ${cornerClass} ${
                  isMyMessage ? "bg-blue-600 text-white" : "bg-slate-700 text-white"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && (
                  <div className="space-y-2 break-words">
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside ml-2" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                )}
                
                {/* Timestamp (Telegram Style) */}
                <div 
                  className={`text-[10px] absolute bottom-1 right-2 select-none ${
                    isMyMessage ? "text-blue-200" : "text-slate-400"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {/* Invisible div to automatically snap scroll to bottom */}
        <div ref={messageEndRef}></div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;