import { LogOut } from 'lucide-react';
import { useAuthStore } from '../Store/UseAuthStore.js';
import LoadingCard from '../Card/LoadingCard.jsx';
const LogOutModalPage = ({onClose}) => {
  const {isLoggingOut,logout}=useAuthStore();
  if (isLoggingOut) {
        return <LoadingCard message="Successfully Logging Out..." />;}
  const handleSubmit=async ()=>{
    onClose();
    await logout();}
  return (
    <>
    { !isLoggingOut && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark background overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 " onClick={onClose} />
      
      {/* Modal Box */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-base-100/90 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 scale-100">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Glowing Red Warning Icon Container */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-error/15 text-error">
            <div className="absolute inset-0 rounded-full bg-error/10 blur-sm animate-pulse" />
            <LogOut className="w-6 h-6 relative" />
          </div>
          
          {/* Text Content */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-base-content">
              Logout
            </h3>
            <p className="text-sm text-base-content/60">
              Do you want to logout?
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex w-full gap-3 mt-2">
            <button 
              type="button" 
              className="flex-1 btn btn-outline btn-sm h-11 border-base-content/20 hover:bg-base-200 transition-colors"
              onClick={onClose}
            >
              No
            </button>
            <button 
              type="button" 
              className="flex-1 btn btn-error btn-sm h-11 text-error-content font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              onClick={handleSubmit}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>}
    </>
  );
};

export default LogOutModalPage;
