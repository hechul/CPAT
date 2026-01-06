export type BoardType = 'free' | 'gallery' | 'notice'

export interface Profile {
  id: string;
  email: string;
  nickname: string;
  created_at: string;
}

export interface Post {
  id: number;
  category: string; // 'free' | 'gallery' | 'notice'
  title: string;
  content: string;
  image_url: string | null;
  user_id: string;
  nickname: string;
  view_count: number;
  created_at: string;
  comment_count?: number;
}

export interface Comment {
  id: number;
  post_id: number;
  content: string;
  user_id: string;
  nickname: string;
  created_at: string;
}
