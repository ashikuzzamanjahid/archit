
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, Stance } from '../types';
import { storage } from '../services/storage';
import { VibeBadge } from './PostCard';

interface CommentNodeProps {
  comment: Post;
  depth: number;
  onRefresh: () => void;
}

const CommentNode: React.FC<CommentNodeProps> = ({ comment, depth, onRefresh }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedStance, setSelectedStance] = useState<Stance>('NEUTRAL');

  const userVote = storage.getUserVote(comment.id);
  const MAX_CHARS = 1200;

  const handleVote = (delta: 1 | -1) => {
    storage.vote(comment.id, delta);
    onRefresh();
  };

  const handleReply = async () => {
    if (!replyText || replyText.length > MAX_CHARS) return;
    
    await storage.createPost({
      content: replyText,
      parentId: comment.id,
      stance: selectedStance
    });
    
    setReplyText('');
    setSelectedStance('NEUTRAL');
    setIsReplying(false);
    onRefresh();
  };

  if (isCollapsed) {
    return (
      <button 
        onClick={() => setIsCollapsed(false)}
        className="text-[10px] font-bold text-zinc-700 hover:text-zinc-500 py-2 ml-4 md:ml-8"
      >
        + Show reply from {comment.authorName}
      </button>
    );
  }

  return (
    <div className={`${depth > 0 ? 'ml-4 md:ml-8 mt-6' : 'mt-8'}`}>
      <div className="flex gap-4">
        <div onClick={() => setIsCollapsed(true)} className="w-[1px] bg-zinc-800 hover:bg-zinc-600 cursor-pointer transition-colors" title="Collapse Thread" />

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-3 mb-2 text-[11px] font-medium text-zinc-500">
            <Link to={`/u/${comment.authorId}`} className="text-zinc-300 font-bold hover:underline">
              {comment.authorName}
            </Link>
            <span>•</span>
            <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <VibeBadge stance={comment.stance} />
          </div>

          <p className="text-zinc-400 text-[14px] leading-relaxed mb-4 whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleVote(1)} 
                className={`text-sm transition-all transform active:scale-150 ${userVote === 1 ? 'text-emerald-500' : 'text-zinc-700 hover:text-zinc-400'}`}
              >▲</button>
              <span className={`text-[11px] font-bold transition-colors ${userVote === 1 ? 'text-emerald-500' : userVote === -1 ? 'text-rose-500' : 'text-zinc-600'}`}>
                {comment.score}
              </span>
              <button 
                onClick={() => handleVote(-1)} 
                className={`text-sm transition-all transform active:scale-150 ${userVote === -1 ? 'text-rose-500' : 'text-zinc-700 hover:text-zinc-400'}`}
              >▼</button>
            </div>
            
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-[10px] font-bold text-zinc-700 hover:text-zinc-300 uppercase tracking-widest transition-colors"
            >
              Reply
            </button>
          </div>

          {isReplying && (
            <div className="mt-6 space-y-4 max-w-xl">
              <textarea 
                placeholder="Share your thoughts..."
                maxLength={MAX_CHARS}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-all resize-none placeholder:text-zinc-800"
                rows={3}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  {(['SUPPORT', 'DENY', 'CLARIFY'] as Stance[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedStance(s)}
                      className={`text-[9px] font-bold px-2 py-1 rounded uppercase border transition-all ${selectedStance === s ? 'border-zinc-100 text-zinc-100 bg-zinc-800' : 'border-zinc-800 text-zinc-700 hover:border-zinc-600'}`}
                    >
                      {s === 'SUPPORT' ? 'Agree' : s === 'DENY' ? 'Disagree' : 'Question'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                   <span className={`text-[9px] font-bold ${replyText.length > MAX_CHARS ? 'text-red-500' : 'text-zinc-800'}`}>
                    {replyText.length} / {MAX_CHARS}
                  </span>
                  <button onClick={() => setIsReplying(false)} className="text-[10px] font-bold text-zinc-600 uppercase">Cancel</button>
                  <button 
                    onClick={handleReply}
                    disabled={!replyText}
                    className="bg-zinc-100 text-zinc-950 px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-white disabled:opacity-50 transition-all"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}

          {comment.replies?.map(child => (
            <CommentNode key={child.id} comment={child} depth={depth + 1} onRefresh={onRefresh} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentNode;
