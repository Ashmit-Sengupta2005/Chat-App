import { Camera, User, Mail, Calendar, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from "../Components/Navbar.jsx";
import { useAuthStore } from '../Store/UseAuthStore.js';
import { useState } from 'react';
import LoadingCard from '../Card/LoadingCard.jsx';
const ProfilePage = () => {
  const [selectedImg,setSelectedImg]=useState(null);
  const {authUser,isUpdatingProfilePic,updateProfilePic}=useAuthStore();
  const username=authUser.username;
  const email=authUser.email;
  const memberSince=new Date(authUser.createdAt).toLocaleString("en-US",{
    day:"numeric",month:"long",year:"numeric"});
  const handleImageUpload=async(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=async()=>{
      const base64Image=reader.result;
      setSelectedImg(base64Image);
      await updateProfilePic({profilePicture:base64Image});}}
  return (
    <>
    {isUpdatingProfilePic && <LoadingCard message='Updating Profile Picture'/>}
    {!isUpdatingProfilePic && <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center font-sans">
        <div className="max-w-2xl w-full space-y-6">
          
          {/* Card 1: Profile Information */}
          <div className="bg-base-100/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 space-y-6 shadow-xl">
            {/* Header */}
            <div className="relative text-center space-y-1">
              <Link to="/settings" className="absolute left-0 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-white" title="Back to Settings">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-white">Profile</h1>
              <p className="text-sm text-base-content/60">Your profile information</p>
            </div>

            {/* Avatar Upload Display */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                {/* Large Avatar Circle */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-inner flex items-center justify-center bg-base-300">
                  {(selectedImg || authUser.profilePicture)?
                    (<img src={selectedImg || authUser.profilePicture} alt="Profile"  className="w-full h-full object-cover"/>)
                    :(
                  <User className="w-16 h-16 text-base-content/30" />)}
                </div>
                
                {/* Floating Camera Button */}
                <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
                  <Camera className="w-5 h-5 text-primary-content" />
                  <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfilePic} />
                </label>
              </div>
              <p className="text-xs text-base-content/50">
                Click the camera icon to update your photo
              </p>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4">
              {/* Full Name Input */}
              <div className="form-control">
                <label className="label py-1.5 flex items-center gap-2 text-base-content/60">
                  <User className="w-4.5 h-4.5 text-cyan-400" />
                  <span className="label-text text-sm font-bold tracking-wide text-base-content/85">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={username}
                  className="input input-bordered w-full bg-slate-900/40 border-cyan-500/20 text-cyan-200 font-semibold tracking-wide text-sm h-12 px-4 cursor-default focus:outline-none"
                  readOnly
                />
              </div>

              {/* Email Address Input */}
              <div className="form-control">
                <label className="label py-1.5 flex items-center gap-2 text-base-content/60">
                  <Mail className="w-4.5 h-4.5 text-fuchsia-400" />
                  <span className="label-text text-sm font-bold tracking-wide text-base-content/85">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  className="input input-bordered w-full bg-slate-900/40 border-fuchsia-500/20 text-fuchsia-200 font-semibold tracking-wide text-sm h-12 px-4 cursor-default focus:outline-none"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Card 2: Account Information */}
          <div className="bg-base-100/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 space-y-5 shadow-xl">
            <h2 className="text-lg font-bold text-white tracking-tight">Account Information</h2>
            
            <div className="divide-y divide-white/5">
              {/* Member Since Row */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-base-content/70">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Member Since</span>
                </div>
                <span className="text-sm font-medium text-base-content">{memberSince}</span>
              </div>

              {/* Account Status Row */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-base-content/70">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm">Account Status</span>
                </div>
                <span className="text-sm font-semibold text-success bg-success/10 px-3 py-1 rounded-full border border-success/20">
                  Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>}
    </>
  );
};

export default ProfilePage;