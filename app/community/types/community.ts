export interface Post {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  badge: string;
  title: string;
  content: string;
  comments: number;
  // Additional fields for database
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: "student" | "professional";
  school: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export type RegistrationStep = "form" | "waiting" | "success";