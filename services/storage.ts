
import { User, Post, Topic, Group, Notification, Stance, Vote, Follow, Message, GroupMember } from '../types';
import { extractInterests } from './gemini';

const STORAGE_KEY = 'archit_lock_data_v6';

interface Database {
  users: User[];
  posts: Post[];
  votes: Vote[];
  topics: Topic[];
  groups: Group[];
  notifications: Notification[];
  follows: Follow[];
  messages: Message[];
  groupMembers: GroupMember[];
  currentUser: User | null;
}

const initialDb: Database = {
  users: [],
  posts: [
    {
      id: 'p1',
      authorId: 'sys',
      authorName: 'u_ARCHITECT',
      title: 'The Primordial Signal',
      content: 'Welcome to Archit-Lock. A net-positive discourse engine. Your contributions are weightless but your signals are permanent. Vote with intent. Speak with focus.',
      createdAt: new Date().toISOString(),
      upvotes: 420,
      downvotes: 12,
      score: 408,
      stance: 'NEUTRAL',
      topicId: 't1'
    }
  ],
  votes: [],
  topics: [{ id: 't1', name: 'General', description: 'The un-partitioned stream.', postCount: 1 }],
  groups: [
    { id: 'g1', name: 'Dev-Zero', description: 'Architectural discussions.', memberCount: 50, isPrivate: false },
    { id: 'g2', name: 'Deep-Thought', description: 'Existential inquiries.', memberCount: 20, isPrivate: false }
  ],
  notifications: [],
  follows: [],
  messages: [],
  groupMembers: [],
  currentUser: null
};

class StorageService {
  private db: Database;

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    this.db = stored ? JSON.parse(stored) : initialDb;
    if (!this.db.follows) this.db.follows = [];
    if (!this.db.messages) this.db.messages = [];
    if (!this.db.groupMembers) this.db.groupMembers = [];
    if (!this.db.votes) this.db.votes = [];
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
  }

  getCurrentUser() { return this.db.currentUser; }
  setCurrentUser(user: User | null) { 
    this.db.currentUser = user; 
    if (user && !this.db.users.find(u => u.id === user.id)) {
      this.db.users.push(user);
    }
    this.save();
  }
  loginWithKey(idOrEmail: string): User | null {
    const user = this.db.users.find(u => u.id === idOrEmail || u.email === idOrEmail);
    if (user) {
      this.db.currentUser = user;
      this.save();
      return user;
    }
    return null;
  }
  logout() { this.db.currentUser = null; this.save(); }

  followUser(targetId: string) {
    const user = this.db.currentUser;
    if (!user || user.id === targetId) return;
    if (this.db.follows.some(f => f.followerId === user.id && f.followingId === targetId)) return;
    this.db.follows.push({ followerId: user.id, followingId: targetId });
    this.db.notifications.unshift({
      id: Math.random().toString(36).substring(2, 9),
      type: 'FOLLOW',
      fromId: user.id,
      fromName: user.username,
      createdAt: new Date().toISOString(),
      read: false
    });
    this.save();
  }
  unfollowUser(targetId: string) {
    const user = this.db.currentUser;
    if (!user) return;
    this.db.follows = this.db.follows.filter(f => !(f.followerId === user.id && f.followingId === targetId));
    this.save();
  }
  isFollowing(targetId: string) {
    return this.db.follows.some(f => f.followerId === this.db.currentUser?.id && f.followingId === targetId);
  }
  isMutual(targetId: string) {
    const myId = this.db.currentUser?.id;
    if (!myId) return false;
    const iFollowTheme = this.db.follows.some(f => f.followerId === myId && f.followingId === targetId);
    const theyFollowMe = this.db.follows.some(f => f.followerId === targetId && f.followingId === myId);
    return iFollowTheme && theyFollowMe;
  }

  sendMessage(receiverId: string, content: string) {
    const user = this.db.currentUser;
    if (!user || !this.isMutual(receiverId)) return null;
    const msg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: user.id,
      receiverId,
      content,
      createdAt: new Date().toISOString()
    };
    this.db.messages.push(msg);
    this.save();
    return msg;
  }
  getMessagesWith(otherUserId: string) {
    const myId = this.db.currentUser?.id;
    return this.db.messages.filter(m => 
      (m.senderId === myId && m.receiverId === otherUserId) || 
      (m.senderId === otherUserId && m.receiverId === myId)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  getConversations() {
    const myId = this.db.currentUser?.id;
    if (!myId) return [];
    const mutualIds = this.db.follows
      .filter(f => f.followerId === myId)
      .map(f => f.followingId)
      .filter(id => this.isMutual(id));
    return mutualIds.map(id => this.db.users.find(u => u.id === id)).filter(Boolean) as User[];
  }

  getGroups() { return this.db.groups; }
  getTopics() { return this.db.topics; }
  joinGroup(groupId: string) {
    const user = this.db.currentUser;
    if (!user || this.isGroupMember(groupId)) return;
    this.db.groupMembers.push({ userId: user.id, groupId });
    const group = this.db.groups.find(g => g.id === groupId);
    if (group) group.memberCount++;
    this.save();
  }
  leaveGroup(groupId: string) {
    const user = this.db.currentUser;
    if (!user) return;
    this.db.groupMembers = this.db.groupMembers.filter(m => !(m.userId === user.id && m.groupId === groupId));
    const group = this.db.groups.find(g => g.id === groupId);
    if (group) group.memberCount = Math.max(0, group.memberCount - 1);
    this.save();
  }
  isGroupMember(groupId: string) {
    return this.db.groupMembers.some(m => m.userId === this.db.currentUser?.id && m.groupId === groupId);
  }

  getPosts() { return this.db.posts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
  getPostById(id: string) { return this.db.posts.find(p => p.id === id) || null; }
  getThreadReplies(rootId: string) { return this.db.posts.filter(p => p.parentId === rootId).sort((a,b) => b.score - a.score); }
  getUserById(id: string) { return this.db.users.find(u => u.id === id); }

  async createPost(post: Partial<Post>) {
    const user = this.db.currentUser;
    if (!user) return null;
    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 9),
      authorId: user.id,
      authorName: user.username,
      content: post.content || '',
      title: post.title,
      parentId: post.parentId,
      groupId: post.groupId,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      score: 0,
      stance: post.stance || 'NEUTRAL'
    };
    this.db.posts.push(newPost);
    extractInterests(newPost.content).then(ints => {
      const dbUser = this.db.users.find(u => u.id === user.id);
      if (dbUser && ints.length > 0) {
        dbUser.interests = Array.from(new Set([...(dbUser.interests || []), ...ints])).slice(-10);
        this.save();
      }
    });
    this.save();
    return newPost;
  }

  vote(postId: string, value: 1 | -1) {
    const userId = this.db.currentUser?.id;
    if (!userId) return;
    
    const existingIdx = this.db.votes.findIndex(v => v.postId === postId && v.userId === userId);
    if (existingIdx !== -1) {
      if (this.db.votes[existingIdx].value === value) {
        // Toggle Off
        this.db.votes.splice(existingIdx, 1);
      } else {
        // Flip Vote
        this.db.votes[existingIdx].value = value;
      }
    } else {
      // Initial Vote
      this.db.votes.push({ userId, postId, value });
    }
    
    const post = this.db.posts.find(p => p.id === postId);
    if (post) {
      const vs = this.db.votes.filter(v => v.postId === postId);
      post.upvotes = vs.filter(v => v.value === 1).length;
      post.downvotes = vs.filter(v => v.value === -1).length;
      post.score = post.upvotes - post.downvotes;
    }
    this.save();
  }

  getNotifications() { return this.db.notifications; }
  clearNotifications() { this.db.notifications = []; this.save(); }
  getUserVote(postId: string) { 
    return this.db.votes.find(v => v.postId === postId && v.userId === this.db.currentUser?.id)?.value || 0; 
  }
}

export const storage = new StorageService();
