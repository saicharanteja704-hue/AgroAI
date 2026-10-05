import { request } from './client';
import { Advisory, AdvisoryCategory, AdvisoryRequest, DashboardStats } from '../types';

export const createAdvisoryApi = (data: AdvisoryRequest) => {
  return request<{ success: boolean; message: string; advisory: Advisory }>('/advisories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getAdvisoriesApi = (params: {
  category?: string;
  search?: string;
  favorite?: boolean;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params.category && params.category !== 'all') searchParams.set('category', params.category);
  if (params.search) searchParams.set('search', params.search);
  if (params.favorite) searchParams.set('favorite', 'true');
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return request<{
    success: boolean;
    advisories: Advisory[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>(`/advisories${queryStr}`);
};

export const getAdvisoryByIdApi = (id: string) => {
  return request<{ success: boolean; advisory: Advisory }>(`/advisories/${id}`);
};

export const toggleFavoriteApi = (id: string) => {
  return request<{ success: boolean; is_favorite: boolean }>(`/advisories/${id}/favorite`, {
    method: 'PATCH',
  });
};

export const deleteAdvisoryApi = (id: string) => {
  return request<{ success: boolean; message: string; id: string }>(`/advisories/${id}`, {
    method: 'DELETE',
  });
};

export const getDashboardStatsApi = () => {
  return request<{ success: boolean; stats: DashboardStats }>('/advisories/dashboard-stats');
};
