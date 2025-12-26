
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import PostCard from './PostCard';
import CommentNode from './CommentNode';
import { Post, Stance } from '../types';

interface PostSidePanelProps {
  postId: string | null;
  onClose: () => void;
}

const PostSidePanel: React.FC<PostSidePanelProps> = ({ postId, onClose }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [thread, setThread] = useState<Post[]>([]);
  const [replyText, setReplyText] = useState('');
  const [selectedStance, setSelectedStance] = useState<Stance>('NEUTRAL');
  
  const MAX_CHARS = 1200;

  const loadData = () => {
    if (!postId) {
      setPost(null);
      setThread([]);
      return;
    }
    const mainPost = storage.getPostById(postId);
    if (!mainPost) {
      onClose();
      return;
    }
    setPost(mainPost);
    setThread(storage.getThreadReplies(postId));
  };

  useEffect(() => {
    loadData();
  }, [postId]);

  const handlePostReply = async () => {
    if (!replyText || !postId || replyText.length > MAX_CHARS) return;
    
    await storage.createPost({
      content: replyText,
      parentId: postId,
      stance: selectedStance
    });
    
    setReplyText('');
    setSelectedStance('NEUTRAL');
    loadData();
  };

  return (
    <div 
      className={`fixed top-[73px] right-0 bottom-0 z-40 bg-zinc-950 border-l border-zinc-900 shadow-2xl flex flex-col transition-all duration-500 ease-in-out ${
        postId ? 'translate-x-0 w-full md:w-[450px] lg:w-[500px] xl:w-[600px]' : 'translate-x-full w-0'
      }`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Signal Thread</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-100 transition-colors"
          title="Dismiss View"
        >
          ✕
        </button>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-10">
        {post ? (
          <>
            <PostCard post={post} isDetail={true} onVote={loadData} />

            <div className="space-y-8">
              {/* Thread Entry Point */}
              <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 space-y-4 shadow-inner">
                <textarea 
                  placeholder="Record your response..."
                  maxLength={MAX_CHARS}
                  className="w-full bg-transparent text-zinc-300 focus:outline-none resize-none text-sm placeholder:text-zinc-800 leading-relaxed"
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-[9px] text-zinc-600 font-bold uppercase mr-2 tracking-widest">Stance:</span>
                  {(['NEUTRAL', 'SUPPORT', 'DENY', 'CLARIFY'] as Stance[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedStance(s)}
                      className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase transition-all border ${
                        selectedStance === s 
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                          : 'bg-zinc-800 border-zinc-700 text-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      {s === 'NEUTRAL' ? 'None' : s === 'SUPPORT' ? 'Agree' : s === 'DENY' ? 'Disagree' : 'Question'}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                  <span className={`text-[9px] font-bold tracking-tighter ${replyText.length > MAX_CHARS ? 'text-red-500' : 'text-zinc-800'}`}>
                    {replyText.length} / {MAX_CHARS}
                  </span>
                  <button 
                    disabled={!replyText}
                    onClick={handlePostReply}
                    className="bg-zinc-100 text-zinc-950 px-5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white disabled:opacity-30 transition-all shadow-lg"
                  >
                    Transmit
                  </button>
                </div>
              </div>

              {/* Thread History */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">History Log</h3>
                  <div className="flex-grow h-[1px] bg-zinc-900/50"></div>
                </div>
                
                {thread.length > 0 ? (
                  <div className="space-y-2">
                    {thread.map((comment) => (
                      <CommentNode 
                        key={comment.id} 
                        comment={comment} 
                        depth={0} 
                        onRefresh={loadData} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-2 opacity-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Silence Recorded</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-10">
            <div className="text-4xl">⊚</div>
            <p className="text-xs font-bold uppercase tracking-widest">Awaiting Signal Input</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSidePanel;
