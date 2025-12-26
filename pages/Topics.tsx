
import React from 'react';
import { storage } from '../services/storage';

const Topics: React.FC = () => {
  const topics = storage.getTopics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Channel Hub</h1>
        <button className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
          Suggest New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map(topic => (
          <div key={topic.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold text-slate-200 group-hover:text-blue-400 transition-colors">#{topic.name}</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-[10px] mono text-slate-500 font-bold uppercase">
                {topic.postCount} Signals
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {topic.description}
            </p>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <img 
                  key={i}
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=topic-${topic.id}-${i}`} 
                  className="w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-800"
                  alt=""
                />
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[8px] text-slate-500 font-bold">
                +42
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topics;
