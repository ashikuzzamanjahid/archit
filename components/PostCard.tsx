
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, Stance } from '../types';
import { storage } from '../services/storage';

interface PostCardProps {
  post: Post;
  onVote?: () => void;
  isDetail?: boolean;
  onClick?: () => void;
}

export const VibeBadge: React.FC<{ stance: Stance }> = ({ stance }) => {
  if (stance === 'NEUTRAL') return null;
  const labels = { SUPPORT: 'Agree', DENY: 'Disagree', CLARIFY: 'Question', NEUTRAL: '' };
  const colors = {
    SUPPORT: 'text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded',
    DENY: 'text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded',
    CLARIFY: 'text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded',
    NEUTRAL: ''
  };

  return (
    <span className={`text-[9px] font-bold uppercase tracking-tight ${colors[stance]}`}>
      {labels[stance]}
    </span>
  );
};

const PostCard: React.FC<PostCardProps> = ({ post, onVote, isDetail = false, onClick }) => {
  const userVote = storage.getUserVote(post.id);
  const navigate = useNavigate();

  const handleVote = (e: React.MouseEvent, delta: 1 | -1) => {
    e.stopPropagation();
    storage.vote(post.id, delta);
    if (onVote) onVote();
  };

  return (
    <div 
      onClick={() => !isDetail && onClick && onClick()}
      className={`bg-zinc-900/30 border border-zinc-900/50 rounded-2xl transition-all ${
        isDetail ? 'p-8 shadow-xl' : 'p-6 hover:bg-zinc-900/50 cursor-pointer group active:scale-[0.995]'
      }`}
    >
      <div className="flex gap-6">
        {/* Net Scoring Block */}
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={(e) => handleVote(e, 1)}
            className={`text-xl transition-all transform active:scale-150 ${userVote === 1 ? 'text-emerald-500 scale-110 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]' : 'text-zinc-700 hover:text-zinc-400'}`}
          >▲</button>
          <span className={`text-xs font-bold ${userVote === 1 ? 'text-emerald-500' : userVote === -1 ? 'text-rose-500' : 'text-zinc-500'}`}>
            {post.score}
          </span>
          <button 
            onClick={(e) => handleVote(e, -1)}
            className={`text-xl transition-all transform active:scale-150 ${userVote === -1 ? 'text-rose-500 scale-110 drop-shadow-[0_0_5px_rgba(244,63,94,0.3)]' : 'text-zinc-700 hover:text-zinc-400'}`}
          >▼</button>
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-500">
              <span 
                onClick={(e) => { e.stopPropagation(); navigate(`/u/${post.authorId}`); }} 
                className="text-zinc-300 font-bold hover:underline"
              >
                {post.authorName}
              </span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <VibeBadge stance={post.stance} />
            </div>
          </div>

          {post.title && (
            <h2 className="text-xl font-bold text-zinc-100 mb-3 group-hover:text-white transition-opacity tracking-tight leading-snug">
              {post.title}
            </h2>
          )}

          <p className="text-zinc-400 text-[15px] leading-relaxed mb-6 whitespace-pre-wrap">
            {isDetail ? post.content : post.content.length > 250 ? post.content.slice(0, 250) + '...' : post.content}
          </p>

          {!isDetail && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-600 group-hover:text-zinc-300 uppercase tracking-widest transition-colors">
                {storage.getThreadReplies(post.id).length || 0} Replies
              </span>
              <span className="text-[10px] text-zinc-800 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                Trace Signal →
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
