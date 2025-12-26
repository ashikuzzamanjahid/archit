
export type Stance = 'SUPPORT' | 'DENY' | 'CLARIFY' | 'NEUTRAL';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarSeed: string;
  joinedAt: string;
  interests: string[];
  interactionCount: number;
}

export interface Follow {
  followerId: string;
  followingId: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export interface GroupMember {
  userId: string;
  groupId: string;
}

// Added missing Vote interface
export interface Vote {
  userId: string;
  postId: string;
  value: 1 | -1;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title?: string;
  content: string;
  topicId?: string;
  groupId?: string;
  parentId?: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  score: number;
  stance: Stance;
  replies?: Post[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  postCount: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
}

export interface Notification {
  id: string;
  type: 'REPLY' | 'VOTE' | 'MESSAGE' | 'FOLLOW';
  fromId: string;
  fromName: string;
  postId?: string;
  createdAt: string;
  read: boolean;
}