
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import PostCard from '../components/PostCard';
import CommentNode from '../components/CommentNode';
import { Post, Stance } from '../types';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Post[]>([]);
  const [replyText, setReplyText] = useState('');
  const [selectedStance, setSelectedStance] = useState<Stance>('NEUTRAL');
  
  const MAX_CHARS = 1200;

  const loadData = () => {
    if (!id) return;
    const p = storage.getPostById(id);
    if (!p) {
      navigate('/');
      return;
    }
    setPost(p);
    setReplies(storage.getThreadReplies(id));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handlePostReply = async () => {
    if (!replyText || !id) return;
    await storage.createPost({
      content: replyText,
      parentId: id,
      stance: selectedStance
    });
    setReplyText('');
    setSelectedStance('NEUTRAL');
    loadData();
  };

  if (!post) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-12">
      <button 
        onClick={() => navigate('/')}
        className="text-[10px] font-bold text-zinc-600 hover:text-zinc-300 uppercase tracking-widest flex items-center gap-2 mb-4"
      >
        ← Back to Feed
      </button>

      <PostCard post={post} isDetail={true} onVote={loadData} />

      <div className="space-y-8">
        {/* Comment Box */}
        <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 space-y-4 shadow-inner">
          <textarea 
            placeholder="Record your response to this thread..."
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
                className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all border ${
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
              className="bg-zinc-100 text-zinc-950 px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white disabled:opacity-30 transition-all shadow-lg"
            >
              Post Comment
            </button>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Responses</h3>
            <div className="flex-grow h-[1px] bg-zinc-900/50"></div>
          </div>
          
          {replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((comment) => (
                <CommentNode 
                  key={comment.id} 
                  comment={comment} 
                  depth={0} 
                  onRefresh={loadData} 
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-2 opacity-10 italic">
              <p className="text-xs">No responses recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
