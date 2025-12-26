
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { label: 'Global Feed', path: '/', icon: '⊳' },
    { label: 'Messages', path: '/messages', icon: '⊚' },
    { label: 'Notifications', path: '/notifications', icon: '⊛' },
    { label: 'Archived', path: '/archived', icon: '⊠' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-slate-500 font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">Navigation</h3>
        <nav className="space-y-1">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                location.pathname === link.path 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner shadow-blue-500/5' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <h3 className="text-slate-500 font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">Active Channels</h3>
        <div className="space-y-2">
          {['Dev-Zero', 'Deep-Thought', 'Crypt-Talk'].map(channel => (
            <div key={channel} className="group flex items-center justify-between px-4 py-2 hover:bg-slate-900/50 rounded-lg cursor-pointer transition-colors">
              <span className="text-slate-400 text-sm font-medium group-hover:text-blue-400 transition-colors">/{channel}</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
