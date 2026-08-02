import { Link } from 'react-router-dom';
import { MessageSquare, User, Mail, Lock, Eye,EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../Store/UseAuthStore';
import LoadingCard from '../Card/LoadingCard.jsx';
import { useGoogleLogin } from '@react-oauth/google';
import toast from "react-hot-toast";

const RegisterPage = () => {
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const {isSigningUp,register,googleAuth}=useAuthStore();
    const loginWithGoogle=useGoogleLogin({
        onSuccess: async(tokenResponse)=>{
          await googleAuth(tokenResponse.access_token);
        }
      });
    const handleSubmit=async (e)=>{
        e.preventDefault();
        if (username.trim().length < 3||username.trim().length>20) {
          return toast.error("Username must be at least 3 characters");}
        if (!email) {
          return toast.error("Email is required");}
        if (password.length < 6) {
          return toast.error("Password must be at least 6 characters");}
        if (password !== confirmPassword) {
          return toast.error("Passwords do not match");}
        const data={
          username:username,
          password:password,
          confirmPassword:confirmPassword,
          email:email}
        await register(data);}
    
    if (isSigningUp) {
        return <LoadingCard message="Creating your account..." />;}

  return (
    <div 
      className="h-screen grid lg:grid-cols-2 relative overflow-hidden font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80')" }}
    >
      {/* Background Deep Midnight Blue to Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b132b]/95 via-[#1c2541]/85 to-base-300/95 z-0"></div>

      {/* Left Column - Form Container */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 lg:translate-x-12 relative z-10">
        
        {/* Glassmorphic Form Card */}
        <div className="card w-full max-w-2xl bg-base-100/75 backdrop-blur-md border border-base-content/10 shadow-2xl overflow-y-auto">
          <div className="card-body gap-4 p-12 sm:p-14">
            
            {/* Logo & Header */}
            <div className="text-center">
              <div className="flex flex-col items-center gap-2">
                {/* Bouncing Logo Container */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 animate-bounce">
                  <MessageSquare className="w-7 h-7 text-primary-content" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mt-2">Create Account</h2>
                <p className="text-xs text-base-content/60">Get started with your free account</p>
              </div>
            </div>

            {/* Registration Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div className="form-control">
                <label className="label py-0.5">
                  <span className="label-text font-semibold text-xs opacity-75">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4.5 w-4.5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input input-bordered w-full pl-10 focus:input-primary text-sm bg-base-200/50 focus:bg-base-100 transition-all duration-200"
                    onChange={(e)=>setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label py-0.5">
                  <span className="label-text font-semibold text-xs opacity-75">Email Address</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full pl-10 focus:input-primary text-sm bg-base-200/50 focus:bg-base-100 transition-all duration-200"
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label py-0.5">
                  <span className="label-text font-semibold text-xs opacity-75">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword?"text":"password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10 focus:input-primary text-sm bg-base-200/50 focus:bg-base-100 transition-all duration-200"
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-primary transition-colors"
                    onClick={()=>{setShowPassword(prev=>!prev)}}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label py-0.5">
                  <span className="label-text font-semibold text-xs opacity-75">Confirm Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-base-content/40" />
                  </div>
                  <input
                    type={showConfirmPassword?"text":"password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10 focus:input-primary text-sm bg-base-200/50 focus:bg-base-100 transition-all duration-200"
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-primary transition-colors"
                    onClick={()=>{setShowConfirmPassword(prev=>!prev)}}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary w-full bg-gradient-to-r from-primary to-secondary border-none text-primary-content hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-lg mt-4"
              >
                Sign Up
              </button>
            </form>

            <div className="divider text-xs text-base-content/50 font-medium">OR</div>

            {/* Google Authentication Button */}
            <button
             onClick={() => loginWithGoogle()} 
              type="button"
              className="btn btn-outline w-full bg-base-100/50 hover:bg-base-200 hover:text-base-content border-base-content/20 hover:border-base-content/40 transition-all duration-200 shadow-sm flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Footer */}
            <div className="text-center text-sm text-base-content/60 pt-4 border-t border-base-content/10">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-bold transition-all duration-200">
                Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Right Column - Faded Text Overlay revealing the sunset image background */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 relative z-10">
        <div className="max-w-lg w-full text-center space-y-10 bg-slate-900/65 backdrop-blur-md border border-white/10 p-10 sm:p-12 rounded-3xl shadow-xl">
          
          {/* TABLET Branding placed at the top of the welcome card */}
          <div className="space-y-3 border-b border-white/10 pb-6">
            <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 bg-[length:200%_auto] animate-shimmer drop-shadow-md">
              TABLET
            </h1>
            <p className="text-white font-bold text-base tracking-wide">
              Take a break , Lets Enjoy Together ☕
            </p>
          </div>

          {/* Join our community info */}
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              Join our community
            </h2>
            <p className="text-white/90 text-base leading-relaxed drop-shadow-sm font-medium">
              Connect with friends, share moments, and stay in touch with your loved ones.
            </p>
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
