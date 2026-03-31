export type Post = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnail: string;
  createdAt: number;
  viewCount: number;
  readTime: string;
  tags: string[];
  authorName: string;
  authorId: string; // New field
  shortDescription: string;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
};

export type Comment = {
  id?: string;
  postId: string;
  authorName: string;
  authorId: string;
  authorPhoto?: string | null;
  text: string;
  createdAt: number;
  likes: number;
  dislikes: number;
  likedBy?: string[];
  dislikedBy?: string[];
  parentId?: string; 
};

export type Report = {
  id?: string;
  commentId: string;
  commentText: string;
  reason: string;
  createdAt: number;
  status: 'pending' | 'resolved';
};

export type Author = {
  uid: string;
  slug: string;
  name: string;
  bio: string;
  profilePic: string;
  coverPic: string;
  designation: string;
  socials: {
    facebook?: string;
    instagram?: string;
    github?: string;
  };
  profilePos?: { x: number; y: number };
  coverPos?: { x: number; y: number };
  location?: string;
};
