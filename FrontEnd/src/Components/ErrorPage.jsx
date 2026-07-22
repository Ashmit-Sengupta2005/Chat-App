import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

const ErrorPage = ({ message = "An unexpected error has occurred.", onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-base-300 p-4 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_60%)] pointer-events-none" />
      
      {/* Glassmorphic Card */}
      <div className="w-full max-w-lg p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
        
        {/* Animated Glowing Error Icon Container */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-error/10 text-error">
          <div className="absolute inset-0 rounded-2xl bg-error/20 blur-md animate-pulse" />
          <div className="relative border border-error/30 p-4 rounded-xl">
            <AlertTriangle className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Oops! Error Occurred
          </h1>
          <p className="text-base text-base-content/70 leading-relaxed max-w-md">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row w-full gap-4 pt-2">
          {onRetry && (
            <button 
              type="button" 
              onClick={onRetry}
              className="flex-1 btn btn-outline btn-error gap-2.5 h-12 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-semibold"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}
          <Link 
            to="/" 
            className="flex-1 btn btn-primary bg-gradient-to-r from-primary to-secondary border-none text-primary-content gap-2.5 h-12 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-semibold shadow-lg shadow-primary/20"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ErrorPage;
