import React from 'react';
import { useAuthStore } from '../Store/UseAuthStore';
import { useChatStore } from '../Store/UseChatStore';
import { ArrowLeft, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlockedUsersPage = () => {
  const { authUser, unblockUser } = useAuthStore();
  const { users } = useChatStore();

  // Filter to get the full profile of each blocked user
  const blockedUserProfiles = users.filter(user => 
    authUser?.blockedUsers?.includes(user._id)
  );

  return (
    <div className="min-h-screen bg-base-200 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-white/5">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-base-100/50">
            <Link to="/settings" className="btn btn-ghost btn-circle btn-sm hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Blocked Contacts</h1>
              <p className="text-xs text-base-content/60 mt-1">
                {blockedUserProfiles.length} blocked {blockedUserProfiles.length === 1 ? 'user' : 'users'}
              </p>
            </div>
          </div>

          {/* List Container */}
          <div className="p-6">
            {blockedUserProfiles.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-base-200 border border-white/5 flex items-center justify-center mb-5">
                  <Ban className="w-10 h-10 text-base-content/30" />
                </div>
                <h3 className="text-lg font-medium text-base-content/70">No blocked contacts</h3>
                <p className="text-sm text-base-content/50 mt-2">When you block someone, they will show up here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedUserProfiles.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors border border-white/5 group">
                    <div className="flex items-center gap-4">
                      <img 
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                        alt={user.username} 
                        className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-white/10 transition-all"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{user.username}</span>
                        <span className="text-xs text-error/80 mt-0.5">Blocked</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => unblockUser(user._id)}
                      className="btn btn-sm btn-error btn-outline hover:!text-white hover:scale-105 transition-all shadow-[0_0_10px_rgba(239,68,68,0)] hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BlockedUsersPage;
