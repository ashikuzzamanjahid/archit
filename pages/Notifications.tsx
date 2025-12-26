
import React, { useState } from 'react';
import { storage } from '../services/storage';

const Activity: React.FC = () => {
  const [notifications, setNotifications] = useState(storage.getNotifications());

  const handleClear = () => {
    storage.clearNotifications();
    setNotifications([]);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Activity</h1>
        <button 
          onClick={handleClear}
          className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div key={n.id} className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex items-center gap-4 hover:bg-zinc-900/50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                n.type === 'REPLY' ? 'bg-blue-900/20 text-blue-400' : 
                n.type === 'VOTE' ? 'bg-amber-900/20 text-amber-400' :
                'bg-zinc-800 text-zinc-500'
              }`}>
                {n.type === 'REPLY' ? '💬' : n.type === 'VOTE' ? '↑' : '•'}
              </div>
              <div className="flex-grow">
                <p className="text-sm text-zinc-400">
                  <span className="font-bold text-zinc-200">{n.fromName}</span> {
                    n.type === 'REPLY' ? 'replied to your post.' : 
                    n.type === 'VOTE' ? 'upvoted your post.' :
                    'interacted with you.'
                  }
                </p>
                <span className="text-[10px] text-zinc-600 font-medium">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
            </div>
          ))
        ) : (
          <div className="py-24 text-center space-y-4 bg-zinc-900/10 border border-zinc-900 border-dashed rounded-3xl">
            <p className="text-zinc-700 text-sm">No new activity.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
