
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import PostCard from '../components/PostCard';
import { Post, Stance } from '../types';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStance, setSelectedStance] = useState<Stance>('NEUTRAL');
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const navigate = useNavigate();
  
  const MAX_CHARS = 1200;

  const refreshPosts = () => {
    setPosts(storage.getPosts().filter(p => !p.parentId));
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const handleCreate = async () => {
    if (!newPost.content || newPost.content.length > MAX_CHARS) return;
    
    await storage.createPost({
      title: newPost.title,
      content: newPost.content,
      stance: selectedStance
    });
    
    setNewPost({ title: '', content: '' });
    setSelectedStance('NEUTRAL');
    setIsCreating(false);
    refreshPosts();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Post Creation */}
      <div className="space-y-4">
        {!isCreating ? (
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full text-left p-6 bg-zinc-900/20 border border-zinc-900 rounded-2xl hover:bg-zinc-900/40 transition-all text-zinc-500 text-sm font-medium border-dashed"
          >
            Initiate a new thought trace...
          </button>
        ) : (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <input 
              type="text" 
              placeholder="Header (Optional)"
              className="w-full bg-transparent text-xl font-bold text-zinc-100 focus:outline-none placeholder:text-zinc-800"
              value={newPost.title}
              onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))}
            />
            <textarea 
              placeholder="Your message to the collective..."
              maxLength={MAX_CHARS}
              rows={5}
              className="w-full bg-transparent text-zinc-300 focus:outline-none resize-none text-[15px] leading-relaxed placeholder:text-zinc-800"
              value={newPost.content}
              onChange={e => setNewPost(prev => ({ ...prev, content: e.target.value }))}
            />
            
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[10px] text-zinc-600 font-bold uppercase mr-2 tracking-widest">Alignment:</span>
              {(['NEUTRAL', 'SUPPORT', 'DENY', 'CLARIFY'] as Stance[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStance(s)}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all border ${
                    selectedStance === s 
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {s === 'NEUTRAL' ? 'Neutral' : s === 'SUPPORT' ? 'Agree' : s === 'DENY' ? 'Disagree' : 'Inquiry'}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
              <span className={`text-[9px] font-bold tracking-widest ${newPost.content.length > MAX_CHARS ? 'text-red-500' : 'text-zinc-700'}`}>
                {newPost.content.length} / {MAX_CHARS}
              </span>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="text-[10px] font-bold text-zinc-600 uppercase hover:text-zinc-400"
                >
                  Discard
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={!newPost.content}
                  className="bg-zinc-100 text-zinc-950 px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-30"
                >
                  Transmit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onVote={refreshPosts} 
              onClick={() => navigate(`/post/${post.id}`)}
            />
          ))
        ) : (
          <div className="py-32 text-center space-y-4">
            <div className="text-4xl opacity-10">⊚</div>
            <p className="text-zinc-800 text-sm font-bold uppercase tracking-[0.3em]">No Signal Detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
