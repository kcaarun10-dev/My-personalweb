export type Post = {
  id?: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  thumbnail: string;
  category: string;
  readTime: string;
  createdAt: number;
  published: boolean;
};

export type Comment = {
  id?: string;
  postId: string;
  authorName: string;
  text: string;
  createdAt: number;
};
