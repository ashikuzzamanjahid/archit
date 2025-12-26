
import React, { useState } from 'react';
import { storage } from '../services/storage';

const Groups: React.FC = () => {
  const [groups, setGroups] = useState(storage.getGroups());
  const me = storage.getCurrentUser();

  const handleJoinLeave = (groupId: string) => {
    if (storage.isGroupMember(groupId)) {
      storage.leaveGroup(groupId);
    } else {
      storage.joinGroup(groupId);
    }
    setGroups(storage.getGroups());
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Active Cells</h1>
        <button className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-300">
          + Create Cell
        </button>
      </div>

      <div className="space-y-4">
        {groups.map(group => {
          const isMember = storage.isGroupMember(group.id);
          return (
            <div key={group.id} className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl flex items-center justify-between group hover:bg-zinc-900/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${isMember ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                  {isMember ? '◈' : '◇'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">{group.name}</h3>
                  <p className="text-xs text-zinc-500">{group.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                  {group.memberCount} Members
                </span>
                <button 
                  onClick={() => handleJoinLeave(group.id)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isMember 
                      ? 'bg-zinc-800 text-zinc-400 hover:text-red-400' 
                      : 'bg-zinc-100 text-zinc-950 hover:bg-white'
                  }`}
                >
                  {isMember ? 'Leave' : 'Join'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-zinc-900/10 border border-zinc-900 border-dashed rounded-3xl">
        <div className="text-center space-y-2">
          <p className="text-zinc-400 font-bold text-sm">Searching for deeper circles?</p>
          <p className="text-zinc-600 text-xs">Cells marked as "Encrypted" only appear to users with a direct Invitation Key.</p>
        </div>
      </div>
    </div>
  );
};

export default Groups;
