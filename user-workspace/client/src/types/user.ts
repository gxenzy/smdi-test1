export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  STAFF = 'STAFF',
  USER = 'USER'
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  link?: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
  timezone?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string;
  settings: UserSettings;
  notifications: Notification[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  settings?: Partial<UserSettings>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
