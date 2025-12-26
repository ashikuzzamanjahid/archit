
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [showKey, setShowKey] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          archit
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isActive('/') ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-100'}`}>
            Feed
          </Link>
          <Link to="/groups" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isActive('/groups') ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-100'}`}>
            Groups
          </Link>
          <Link to="/messages" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isActive('/messages') ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-100'}`}>
            Messages
          </Link>
          <Link to="/activity" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isActive('/activity') ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-100'}`}>
            Activity
          </Link>
          <Link to="/profile" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isActive('/profile') ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-100'}`}>
            Profile
          </Link>
          <div className="relative">
            <button 
              onClick={() => setShowKey(!showKey)}
              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest border border-zinc-800 px-2 py-1 rounded"
            >
              {user?.username}
            </button>
            
            {showKey && (
              <div className="absolute top-full right-0 mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-[100] w-64">
                <p className="text-[9px] text-zinc-500 uppercase font-bold mb-2">Account Key</p>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800 flex items-center justify-between">
                  <code className="text-[10px] text-zinc-400 font-mono break-all pr-2">{user?.id}</code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(user?.id || '');
                      setShowKey(false);
                    }}
                    className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-white"
                  >
                    Copy
                  </button>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full mt-4 py-2 bg-red-900/10 text-red-500 text-[10px] font-bold uppercase rounded-lg hover:bg-red-900/20 transition-colors"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
