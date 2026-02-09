export interface Post {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  badge: string;
  title: string;
  content: string;
  comments: number;
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

export type RegistrationStep = "form" | "waiting" | "success";