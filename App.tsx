
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Activity from './pages/Notifications';
import Groups from './pages/Groups';
import Messages from './pages/Messages';
import Login from './pages/Login';
import { storage } from './services/storage';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(storage.getCurrentUser());

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    storage.logout();
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950 font-sans">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="max-w-5xl mx-auto px-6 py-12">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/u/:userId" element={<Profile />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:targetId" element={<Messages />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
