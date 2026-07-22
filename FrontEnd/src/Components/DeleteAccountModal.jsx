import { X, AlertTriangle, Trash2, Loader } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../Store/UseAuthStore.js";

const DeleteAccountModal = ({ onClose }) => {
  const { deleteAccount, isDeletingAccount } = useAuthStore();
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteAccount({ confirmText, password });
    onClose();
  };

  // Only allow submit if they typed the exact phrase and entered a password
  const isFormValid = confirmText.trim().toLowerCase() === "delete my account" && password.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-base-100 border border-error/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-error/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            <h3 className="font-bold text-lg text-error">Delete Account</h3>
          </div>
          <button 
            onClick={onClose}
            disabled={isDeletingAccount}
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-error/10 border border-error/20 p-4 rounded-xl text-sm text-error/90 space-y-2">
            <p className="font-bold">This action cannot be undone.</p>
            <p>You will permanently lose all your messages, contacts, and account configuration. If you are sure, please verify below.</p>
          </div>

          <form id="delete-account-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Confirm Text Input */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold text-base-content/80">
                  Type <span className="font-extrabold text-white select-all">delete my account</span> to confirm
                </span>
              </label>
              <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete my account"
                className="input input-bordered w-full bg-slate-900/40 border-error/30 text-white font-medium focus:border-error focus:ring-1 focus:ring-error/50"
                disabled={isDeletingAccount}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold text-base-content/80">Password</span>
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                className="input input-bordered w-full bg-slate-900/40 border-error/30 text-white font-medium focus:border-error focus:ring-1 focus:ring-error/50"
                disabled={isDeletingAccount}
                required
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 bg-slate-900/30 flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isDeletingAccount}
            className="btn btn-ghost text-base-content/80 hover:text-white"
          >
            Cancel
          </button>
          
          <button 
            form="delete-account-form"
            type="submit" 
            disabled={!isFormValid || isDeletingAccount}
            className="btn btn-error text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:scale-[1.02] transition-transform"
          >
            {isDeletingAccount ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Permanently Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
