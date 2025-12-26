
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { User } from '../types';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const me = storage.getCurrentUser();
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const targetId = userId || me?.id;
    if (targetId) {
      const u = storage.getUserById(targetId);
      setUser(u || null);
      setIsFollowing(storage.isFollowing(targetId));
    }
  }, [userId, me]);

  if (!user) return null;

  const isMe = user.id === me?.id;

  const handleFollowToggle = () => {
    if (isFollowing) {
      storage.unfollowUser(user.id);
    } else {
      storage.followUser(user.id);
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="max-w-xl mx-auto space-y-12 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-3 shadow-2xl">
            <img 
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.avatarSeed}`} 
              alt="Avatar" 
              className="w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tighter">{user.username}</h2>
            <div className="flex items-center gap-2">
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Anonymous Member</p>
              {storage.isMutual(user.id) && (
                <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">Mutual</span>
              )}
            </div>
          </div>
        </div>

        {!isMe && (
          <div className="flex items-center gap-3">
            {storage.isMutual(user.id) && (
               <button 
                onClick={() => navigate(`/messages/${user.id}`)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-700"
              >
                DM
              </button>
            )}
            <button 
              onClick={handleFollowToggle}
              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                isFollowing 
                  ? 'bg-zinc-800 text-zinc-500 hover:text-red-400' 
                  : 'bg-zinc-100 text-zinc-950 hover:bg-white'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl">
          <span className="block text-2xl font-bold text-zinc-200">{user.interactionCount || 0}</span>
          <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Interactions</span>
        </div>
        <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl">
          <span className="block text-xl font-bold text-zinc-200">{new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
          <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Joined</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Resonances</h3>
        <div className="flex flex-wrap gap-2">
          {user.interests && user.interests.length > 0 ? user.interests.map((interest, i) => (
            <span key={i} className="px-3 py-1 bg-zinc-900 border border-zinc-900 rounded-full text-xs font-medium text-zinc-400">
              #{interest}
            </span>
          )) : (
            <p className="text-zinc-800 text-xs italic px-1">Identity profile in flux...</p>
          )}
        </div>
      </div>

      <div className="p-8 bg-zinc-900/10 border border-zinc-900 border-dashed rounded-3xl">
        <p className="text-zinc-700 text-[10px] uppercase font-bold tracking-widest text-center leading-relaxed">
          {isMe 
            ? "Your anonymous shadow in the machine. No names. Only thoughts." 
            : `You are viewing the anonymous trace of ${user.username}. Use mutual follows to connect.`}
        </p>
      </div>
    </div>
  );
};

export default Profile;
