
import React, { useState } from 'react';
import { storage } from '../services/storage';
import { generateAnonymousIdentity } from '../services/gemini';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleGenerate = async () => {
    if (!email) {
      setError('A working email is required for recovery.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const identity = await generateAnonymousIdentity();
      const newUser: User = {
        id: 'AL-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        email: email.toLowerCase(),
        username: identity.username,
        avatarSeed: Math.random().toString(),
        joinedAt: new Date().toISOString(),
        interests: [],
        interactionCount: 0
      };
      storage.setCurrentUser(newUser);
      onLogin(newUser);
    } catch (err) {
      setError('Failed to reach server. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = () => {
    if (!key) return;
    const user = storage.loginWithKey(key);
    if (user) {
      onLogin(user);
    } else {
      setError('Key or Email not found.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-12 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Archit</h1>
          <p className="text-zinc-500 text-sm">Minimalist text social.</p>
        </div>

        <div className="space-y-8">
          {isRegistering ? (
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-center text-sm font-medium focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-700"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-zinc-100 text-zinc-950 font-bold py-4 rounded-2xl hover:bg-white transition-all text-sm uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? 'Thinking...' : 'Create Account'}
              </button>
              <button onClick={() => setIsRegistering(false)} className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Back to Login</button>
            </div>
          ) : (
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Key or Email"
                value={key}
                onChange={e => setKey(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-center text-sm font-medium focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-700"
              />
              <button 
                onClick={handleRestore}
                className="w-full bg-zinc-100 text-zinc-950 font-bold py-4 rounded-2xl hover:bg-white transition-all text-sm uppercase tracking-widest"
              >
                Log In
              </button>
              <button onClick={() => setIsRegistering(true)} className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Create New Account</button>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

        <p className="text-[10px] text-zinc-600 leading-relaxed max-w-[240px] mx-auto uppercase tracking-tighter font-medium">
          Privacy is absolute. Your email is only for account identification and is never shared.
        </p>
      </div>
    </div>
  );
};

export default Login;
