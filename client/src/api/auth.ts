import { request } from './client';
import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const registerApi = (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  preferred_language?: string;
}) => {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const loginApi = (data: { email: string; password: string }) => {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const logoutApi = () => {
  return request<{ success: boolean; message: string }>('/auth/logout', {
    method: 'POST',
  });
};

export const getMeApi = () => {
  return request<{ success: boolean; user: User }>('/auth/me');
};

export const updateProfileApi = (data: Partial<User>) => {
  return request<{ success: boolean; message: string; profile: User }>('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
