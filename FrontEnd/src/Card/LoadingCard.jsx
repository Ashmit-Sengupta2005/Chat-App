import { Loader } from "lucide-react";

const LoadingCard = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-base-300 px-4">
      {/* Glassmorphic Card container */}
      <div className="w-full max-w-sm p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
        
        {/* Animated outer glowing circle */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 size-20 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-30 blur-md animate-pulse"></div>
          <div className="relative size-16 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center animate-spin">
            <Loader className="size-8 text-primary animate-spin" />
          </div>
        </div>

        {/* Loading Text details */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-wide text-white/95">
            Please Wait
          </h2>
          <p className="text-sm font-medium text-primary-content/70 animate-pulse">
            {message}
          </p>
        </div>

        {/* Tiny decorative loading dots */}
        <div className="flex space-x-1.5 justify-center">
          <div className="size-2 rounded-full bg-primary/80 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="size-2 rounded-full bg-primary/40 animate-bounce"></div>
        </div>

      </div>
    </div>
  );
};

export default LoadingCard;
