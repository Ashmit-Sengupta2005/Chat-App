import { Link } from 'react-router-dom';
import { MessageSquare, Settings, LogOut } from 'lucide-react';
import {  useState } from 'react';
import LogOutModalPage from './LogOutModalPage.jsx';
const Navbar = () => {
  const [showModal,setShowModal]=useState(false);
  const handleClick=()=>{
    setShowModal(true);
  }
  const onClose=()=>{
      setShowModal(false);}
  return (
    <>
    {showModal && <LogOutModalPage onClose={onClose}/>}
    <header className="bg-base-100 border-b border-base-200 sticky top-0 z-40 backdrop-blur-lg bg-base-100/80 h-24">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Left Side: Logo & Author (TABLET Branding) */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3.5 hover:opacity-80 transition-all">
              <div className="w-13 h-13 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black leading-none tracking-tight bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                  TABLET
                </span>
                <span className="text-xs font-semibold mt-1 tracking-wide text-base-content/85">
                  Take a break , Lets Enjoy Together ☕
                </span>
                <span className="text-[10px] text-primary/80 font-bold mt-0.5 tracking-wide">
                  BY ASHMIT SENGUPTA
                </span>
              </div>
            </Link>
          </div>

          {/* Right Side: Navigation Actions */}
          <div className="flex items-center gap-3">
            
            {/* Settings Link (Always visible) */}
            <Link to="/settings" className="btn btn-ghost hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white border border-base-content/10 hover:border-transparent shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_22px_rgba(6,182,212,0.55)] gap-2.5 group text-sm sm:text-base font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
              <Settings className="w-5.5 h-5.5 transition-all duration-500 group-hover:rotate-180 group-hover:text-cyan-200" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* Logout Button */}
            <button className="btn btn-error border-none text-error-content shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:shadow-[0_0_22px_rgba(239,68,68,0.55)] gap-2.5 group text-sm sm:text-base font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all duration-300" onClick={handleClick}>
              <LogOut className="w-5.5 h-5.5 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>

        </div>
      </div>
    </header>
    </>
  );
};

export default Navbar;