
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { User, Message } from '../types';

const Messages: React.FC = () => {
  const { targetId } = useParams<{ targetId: string }>();
  const [conversations, setConversations] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const me = storage.getCurrentUser();

  useEffect(() => {
    setConversations(storage.getConversations());
    if (targetId) {
      setMessages(storage.getMessagesWith(targetId));
    }
  }, [targetId]);

  // Mock "real-time" polling
  useEffect(() => {
    const interval = setInterval(() => {
      if (targetId) {
        setMessages(storage.getMessagesWith(targetId));
      }
      setConversations(storage.getConversations());
    }, 2000);
    return () => clearInterval(interval);
  }, [targetId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || !targetId) return;
    storage.sendMessage(targetId, inputText);
    setInputText('');
    setMessages(storage.getMessagesWith(targetId));
  };

  const selectedUser = targetId ? storage.getUserById(targetId) : null;

  return (
    <div className="h-[calc(100vh-140px)] flex bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-zinc-900 flex flex-col">
        <div className="p-6 border-b border-zinc-900 bg-zinc-900/10">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Mutual Signals</h2>
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {conversations.length > 0 ? (
            conversations.map(user => (
              <Link 
                key={user.id} 
                to={`/messages/${user.id}`}
                className={`flex items-center gap-4 p-5 hover:bg-zinc-900/40 transition-all ${targetId === user.id ? 'bg-zinc-900' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs opacity-60">
                  <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.avatarSeed}`} className="w-full h-full p-1" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-zinc-100 truncate">{user.username}</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-tight">Active Channel</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-10 text-center space-y-2">
              <p className="text-[10px] text-zinc-700 font-bold uppercase">No Mutuals Found</p>
              <p className="text-[9px] text-zinc-800 leading-relaxed">Follow someone and have them follow you back to unlock secure messaging.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/10">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <h3 className="text-sm font-bold text-zinc-100">{selectedUser.username}</h3>
              </div>
              <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">E2E Secure</span>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === me?.id;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                      isMe 
                        ? 'bg-zinc-100 text-zinc-950 rounded-tr-none' 
                        : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'
                    }`}>
                      {msg.content}
                      <span className={`block text-[8px] mt-1 font-bold ${isMe ? 'text-zinc-500' : 'text-zinc-600'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} className="p-6 border-t border-zinc-900 bg-zinc-950">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Type a secure message..."
                  className="flex-grow bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-zinc-700 transition-all text-zinc-300"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!inputText}
                  className="p-3 bg-zinc-100 text-zinc-950 rounded-2xl hover:bg-white disabled:opacity-30 transition-all"
                >
                  <span className="block transform -rotate-45">⊳</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-10 space-y-4 text-center">
            <div className="text-5xl opacity-10">⊚</div>
            <h3 className="text-lg font-bold text-zinc-700 uppercase tracking-widest">Select a signal</h3>
            <p className="text-xs text-zinc-800 max-w-xs leading-relaxed">
              Communication is strictly limited to mutual resonances. Build relationships to open channels.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
