import { Link } from 'react-router-dom';
import { 
  User, Shield, Palette, Trash2, ArrowLeft, Settings, 
  ChevronRight, KeyRound, AlertTriangle, Ban, Mail, Loader, Bell, Volume2,
  Music, Gamepad2, CircleCheck, Check
} from 'lucide-react';
import Navbar from "../Components/Navbar.jsx";
import { useAuthStore } from '../Store/UseAuthStore.js';
import { useChatStore } from '../Store/UseChatStore.js';
import { useThemeStore } from '../Store/UseThemeStore.js';
import { useState } from 'react';
import DeleteAccountModal from '../Components/DeleteAccountModal.jsx';
const SettingsPage = () => {
  const { authUser,isUpdatingUsername,
    updateUsername,isUpdatingEmail,updateEmail,
    isUpdatingPassword,updatePassword} = useAuthStore();
  const {soundEnabled,toggleSound,setSelectedSound,selectedSound}=useChatStore();
  const [name,setName]=useState(authUser.username);
  const [email,setEmail]=useState(authUser.email);
  const [emailPassword,setEmailPassword]=useState("");
  const [currentPassword,setCurrentPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [confirmNewPassword,setConfirmNewPassword]=useState("");
  const [deleteModal,showDeleteModal]=useState(false);
  const {theme,setTheme}=useThemeStore();
  const handleUsername=async(e)=>{
    e.preventDefault();
    const lowerName = name.toLowerCase();
    const result= await updateUsername({newUsername:lowerName});
    if(result){
      setName(lowerName);
    } else {
      setName(authUser.username);
    }
  }
  const handleEmail=async(e)=>{
    e.preventDefault();
    const lowerEmail = email.toLowerCase();
    const data={newEmail:lowerEmail, password:emailPassword};
    const result=await updateEmail(data);
    if(result){
      setEmail(lowerEmail);
    } else {
      setEmail(authUser.email);
    }
    setEmailPassword("");
  }
  const handlePassword=async(e)=>{
    e.preventDefault();
    const details={
     currentPassword:currentPassword,newPassword:newPassword,confirmNewPassword:confirmNewPassword}
    const result=await updatePassword(details);
    if(result){
    setConfirmNewPassword("");
    setCurrentPassword("");
    setNewPassword("");}
  }
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Top Navbar */}
      <Navbar/>

      {/* Settings Container */}
      <div className="flex-1 flex items-center justify-center p-4 font-sans overflow-hidden">
        <div className="bg-base-100/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl w-full max-w-6xl h-full max-h-[calc(100vh-8rem)] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative">
          {isUpdatingUsername && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm rounded-2xl">
              <div className="w-full max-w-sm p-8 rounded-2xl bg-base-100/80 border border-cyan-500/20 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 size-20 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 opacity-30 blur-md animate-pulse"></div>
                  <div className="relative size-16 rounded-full border-2 border-dashed border-cyan-400/40 flex items-center justify-center animate-spin">
                    <Loader className="size-8 text-cyan-400 animate-spin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-wide text-white">Updating Username</h2>
                  <p className="text-sm font-medium text-cyan-400 animate-pulse">Saving changes, please wait...</p>
                </div>
              </div>
            </div>
          )}
          
          {/* LEFT SIDEBAR: Navigation & Profile Header */}
          <aside className="w-full md:w-80 border-r border-white/10 flex flex-col h-auto md:h-full bg-base-100/30 shrink-0">
            {/* Header / Title */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                <span className="font-bold text-lg text-white">Settings</span>
              </div>
              <Link to="/" className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>

            {/* Profile Overview (Non-editable Avatar, just details display) */}
            <div className="p-6 border-b border-white/10 flex flex-col items-center text-center space-y-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-inner flex items-center justify-center bg-base-300">
                {authUser?.profilePicture ? (
                  <img src={authUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-base-content/30" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-400 tracking-tight">{authUser.username}</h2>
                <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-400/90 to-fuchsia-400/90 font-bold mt-0.5">{authUser.email}</p>
              </div>
            </div>

            {/* Navigation Options List */}
            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
              {/* Option 1: Profile (Takes user to Profile Page) */}
              <Link to="/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-base-content/80 hover:text-white group">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 text-base-content/35" />
              </Link>

              {/* Option 2: Privacy & Security */}
              <a href="#privacy-security" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-base-content/80 hover:text-white group">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Privacy & Security</span>
                </div>
                <ChevronRight className="w-4 h-4 text-base-content/35" />
              </a>

              {/* Option 3: Theme Settings */}
              <a href="#theme-settings" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-base-content/80 hover:text-white group">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Theme Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-base-content/35" />
              </a>

              {/* Option 3.5: Notifications & Sounds */}
              <a href="#notifications-sounds" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-base-content/80 hover:text-white group">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Notifications & Sounds</span>
                </div>
                <ChevronRight className="w-4 h-4 text-base-content/35" />
              </a>

              {/* Option 4: Blocked Users */}
              <a href="#blocked-users" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-base-content/80 hover:text-white group">
                <div className="flex items-center gap-3">
                  <Ban className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Blocked Users</span>
                </div>
                <ChevronRight className="w-4 h-4 text-base-content/35" />
              </a>

              {/* Option 5: Delete Account */}
              <a href="#delete-account" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-base-content/80 hover:text-white group text-error hover:bg-error/5">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-error group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Delete Account</span>
                </div>
                <ChevronRight className="w-4 h-4 text-error/40" />
              </a>
            </nav>
          </aside>

          {/* RIGHT PANELS AREA (Independent scrolling dashboard) */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-base-100/10 scroll-smooth">
            
            {/* 1. PRIVACY & SECURITY PANEL (With Username, Email & Password update forms) */}
            <section id="privacy-security" className="scroll-mt-6">
              <div className="bg-base-100/40 border border-white/5 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Privacy & Security</h3>
                </div>

                <div className="space-y-6">
                  {/* Change Username Form */}
                  <form onSubmit={handleUsername}
                   className="space-y-3.5 p-4 rounded-xl bg-slate-950/20 border border-white/5">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold">Change Username</span>
                    </div>

                    <div className="form-control">
                      <input 
                        type="text" 
                        value={name}
                        className="lowercase input input-bordered w-full bg-slate-900/40 border-cyan-500/30 text-cyan-400 placeholder-cyan-500/40 font-bold text-sm h-11 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.05)] focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                        readOnly={isUpdatingUsername}
                        onChange={(e)=>setName(e.target.value)}
                      />
                      <p className="text-[10px] text-base-content/45 mt-1">This will change your public profile name. Username can be changed once in 30 days.</p>
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button type="submit" disabled={isUpdatingUsername}
                       className="btn btn-outline btn-cyan btn-xs px-3 font-semibold border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:border-transparent">
                        Update Username
                      </button>
                    </div>
                  </form>

                  {/* Change Email Form */}
                  <form onSubmit={handleEmail}
                   className="space-y-3.5 p-4 rounded-xl bg-slate-950/20 border border-white/5">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Mail className="w-4 h-4 text-fuchsia-400" />
                      <span className="text-sm font-bold">Change Email Address</span>
                    </div>

                    <div className="form-control">
                      <input 
                        type="email" 
                        value={email}
                        className="lowercase input input-bordered w-full bg-slate-900/40 border-fuchsia-500/30 text-fuchsia-400 placeholder-fuchsia-500/40 font-bold text-sm h-11 px-3.5 focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50 focus:outline-none transition-all duration-200 shadow-[0_0_15px_rgba(217,70,239,0.05)] focus:shadow-[0_0_15px_rgba(217,70,239,0.15)]" 
                        onChange={(e)=>setEmail(e.target.value)}
                        readOnly={isUpdatingEmail}
                      />
                    </div>

                    <div className="form-control">
                      <input 
                        type="password" 
                        placeholder="Current Password" 
                        value={emailPassword}
                        onChange={(e)=>(setEmailPassword(e.target.value))}
                        className="input input-bordered w-full bg-slate-900/40 border-fuchsia-500/30 text-fuchsia-400 placeholder-fuchsia-500/40 font-bold text-sm h-11 px-3.5 focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50 focus:outline-none transition-all duration-200 shadow-[0_0_15px_rgba(217,70,239,0.05)] focus:shadow-[0_0_15px_rgba(217,70,239,0.15)]" 
                        readOnly={isUpdatingEmail}
                      />
                      <p className="text-[10px] text-base-content/45 mt-1">Please enter your password. This is only required when changing your email address.</p>
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button type="submit" disabled={isUpdatingEmail}
                       className="btn btn-outline btn-fuchsia btn-xs px-3 font-semibold border-fuchsia-500/40 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-slate-950 hover:border-transparent">
                        Update Email
                      </button>
                    </div>
                  </form>

                  {/* Change Password Form */}
                  <form onSubmit={handlePassword}
                  className="space-y-3.5 p-4 rounded-xl bg-slate-950/20 border border-white/5">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold">Change Password</span>
                    </div>

                    <div className="form-control">
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e)=>setCurrentPassword(e.target.value)}
                        placeholder="Current Password" 
                        className="input input-bordered w-full bg-slate-900/30 border-white/10 text-white font-medium text-xs h-10 px-3.5 focus:border-cyan-500/40 focus:outline-none" 
                        readOnly={isUpdatingPassword}
                      />
                    </div>

                    <div className="form-control">
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        placeholder="New Password" 
                        className="input input-bordered w-full bg-slate-900/30 border-white/10 text-white font-medium text-xs h-10 px-3.5 focus:border-cyan-500/40 focus:outline-none" 
                        readOnly={isUpdatingPassword}
                      />
                    </div>

                    <div className="form-control">
                      <input 
                        type="password" 
                        value={confirmNewPassword}
                        onChange={(e)=>setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm New Password" 
                        className="input input-bordered w-full bg-slate-900/30 border-white/10 text-white font-medium text-xs h-10 px-3.5 focus:border-cyan-500/40 focus:outline-none" 
                        readOnly={isUpdatingPassword}
                      />
                      <p className="text-[10px] text-base-content/45 mt-1">Password can be changed once in 60 days.</p>
                    </div>

                    <div className="pt-1.5 flex justify-end">
                      <button type="submit" disabled={isUpdatingPassword}
                      className="btn btn-outline btn-amber btn-xs px-3 font-semibold border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950 hover:border-transparent">
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            {/* 2. THEME SETTINGS PANEL */}
            <section id="theme-settings" className="scroll-mt-6">
              <div className="bg-base-100/40 border border-white/5 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                  <Palette className="w-5 h-5 text-fuchsia-400" />
                  <h3 className="text-lg font-bold text-white">Theme Settings</h3>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-base-content/60">Choose a default visual style for the application interface.</p>
                  
                  {/* Theme Selector Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["night", "dracula", "dark", "synthwave", "business", "luxury", "aqua", "dim"].map((t) => (
                      <button 
                        key={t}
                        type="button" 
                        onClick={() => setTheme(t)}
                        className={`btn btn-outline flex flex-col items-stretch p-3 h-auto justify-start text-left animate-none transition-all duration-200
                          ${theme === t 
                            ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                            : 'border-white/10 hover:border-cyan-400/40 bg-slate-900/20'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-bold capitalize ${theme === t ? 'text-white' : 'text-base-content/80'}`}>{t}</span>
                          
                          {theme === t && (
                            <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-slate-950 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div data-theme={t} className="flex gap-1.5 mt-1 bg-transparent rounded-full overflow-hidden">
                          <span className="w-3.5 h-3.5 rounded-full bg-primary" />
                          <span className="w-3.5 h-3.5 rounded-full bg-secondary" />
                          <span className="w-3.5 h-3.5 rounded-full bg-accent" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 2.5 NOTIFICATIONS & SOUNDS PANEL */}
            <section id="notifications-sounds" className="scroll-mt-6">
              <div className="bg-base-100/40 border border-white/5 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Notifications & Sounds</h3>
                </div>

                <div className="space-y-4">
                  {/* Enable Sounds Toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/20 border border-white/5 gap-4">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-cyan-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Message Sounds</span>
                        <span className="text-xs text-base-content/50">Play a sound when you receive a new message</span>
                      </div>
                    </div>
                    {/* USER TASK: Hook this toggle up to soundEnabled and toggleSound() from UseChatStore */}
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                      checked={soundEnabled} 
                      onChange={toggleSound}
                    />
                  </div>

                  {/* Sound Selector */}
                  <div className="flex flex-col p-4 rounded-xl bg-slate-900/20 border border-white/5 gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">Notification Tone</span>
                      <span className="text-xs text-base-content/50">Tap a tone to preview and select it</span>
                    </div>
                    
                  
                    <div className="space-y-2">

                      {/* Option 1: Bell */}
                      <button onClick={()=>setSelectedSound('/Bell.mp3')}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border ${selectedSound === '/Bell.mp3' ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/15'} transition-all duration-200 group cursor-pointer`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <Bell className="w-4.5 h-4.5 text-cyan-400" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold text-white">Bell</span>
                            <span className="text-[10px] text-base-content/40">Bell.mp3</span>
                          </div>
                        </div>
                        {selectedSound === '/Bell.mp3' && (
                          <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3} />
                          </div>
                        )}
                      </button>

                      {/* Option 2: Interface Start */}
                      <button onClick={() => setSelectedSound('/InterfaceStart.wav')}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border ${selectedSound === '/InterfaceStart.wav' ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/15'} transition-all duration-200 group cursor-pointer`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                            <Music className="w-4.5 h-4.5 text-fuchsia-400" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold text-white">Interface Start</span>
                            <span className="text-[10px] text-base-content/40">InterfaceStart.wav</span>
                          </div>
                        </div>
                        {selectedSound === '/InterfaceStart.wav' && (
                          <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3} />
                          </div>
                        )}
                      </button>

                      {/* Option 3: Gaming Lock */}
                      <button onClick={() => setSelectedSound('/GamingLock.wav')}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border ${selectedSound === '/GamingLock.wav' ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/15'} transition-all duration-200 group cursor-pointer`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Gamepad2 className="w-4.5 h-4.5 text-amber-400" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold text-white">Gaming Lock</span>
                            <span className="text-[10px] text-base-content/40">GamingLock.wav</span>
                          </div>
                        </div>
                        {selectedSound === '/GamingLock.wav' && (
                          <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3} />
                          </div>
                        )}
                      </button>

                      {/* Option 4: Correct Answer */}
                      <button onClick={() => setSelectedSound('/CorrectAnswer.wav')}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border ${selectedSound === '/CorrectAnswer.wav' ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/15'} transition-all duration-200 group cursor-pointer`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <CircleCheck className="w-4.5 h-4.5 text-emerald-400" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold text-white">Correct Answer</span>
                            <span className="text-[10px] text-base-content/40">CorrectAnswer.wav</span>
                          </div>
                        </div>
                        {selectedSound === '/CorrectAnswer.wav' && (
                          <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3} />
                          </div>
                        )}
                      </button>

                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* 3. BLOCKED USERS PANEL */}
            <section id="blocked-users" className="scroll-mt-6">
              <div className="bg-base-100/40 border border-white/5 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                  <Ban className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Blocked Users</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col p-4 rounded-xl bg-slate-900/20 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Blocked Contacts</span>
                        <span className="text-xs text-base-content/50">Blocked contacts cannot message you or see your online status.</span>
                      </div>
                      <span className="badge badge-error badge-sm font-semibold">0 Blocked</span>
                    </div>
                    
                    {/* Block Action Input */}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Search contact to block..." 
                        className="input input-bordered input-xs flex-1 bg-slate-900/40 border-white/10 text-white text-xs h-8 px-2.5 focus:border-cyan-500/40 focus:outline-none" 
                      />
                      <button type="button" className="btn btn-error btn-xs h-8 px-4 font-bold text-white">
                        Block User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. DELETE ACCOUNT PANEL */}
            <section id="delete-account" className="scroll-mt-6">
              <div className="bg-error/5 border border-error/10 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-error/10">
                  <Trash2 className="w-5 h-5 text-error animate-pulse" />
                  <h3 className="text-lg font-bold text-error">Delete Account</h3>
                </div>

                <div className="p-4 rounded-xl bg-error/10 border border-error/20 space-y-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-error">Permanently Delete Account</h4>
                      <p className="text-xs text-error/80 mt-1">
                        Warning: Deleting your account will permanently wipe out all messages, active contacts, and configuration profile info. This action is irreversible.
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => showDeleteModal(true)}
                    className="btn btn-error btn-sm w-full font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:scale-[1.01] transition-transform"
                  >
                    Delete Account Forever
                  </button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {deleteModal && <DeleteAccountModal onClose={() => showDeleteModal(false)} />}
    </div>);
};

export default SettingsPage;