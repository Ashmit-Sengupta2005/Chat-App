import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-base-100/50 flex-1">
      
      {/* Animated Icon Container */}
      <div className="mb-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce shadow-lg shadow-primary/5">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <div className="text-center space-y-4 max-w-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome to TABLET!
        </h2>
        
        <p className="text-sm sm:text-base text-base-content/60 font-medium leading-relaxed">
          Select a conversation from the sidebar to start chatting with your friends or our AI assistant.
        </p>
      </div>
      
    </div>
  );
};

export default NoChatSelected;
