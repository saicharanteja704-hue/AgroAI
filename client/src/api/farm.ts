import { request } from './client';
import { Farm } from '../types';

export const getFarmsApi = () => {
  return request<{ success: boolean; farms: Farm[] }>('/farms');
};

export const getFarmByIdApi = (id: string) => {
  return request<{ success: boolean; farm: Farm }>(`/farms/${id}`);
};

export const createFarmApi = (farmData: Partial<Farm>) => {
  return request<{ success: boolean; message: string; farm: Farm }>('/farms', {
    method: 'POST',
    body: JSON.stringify(farmData),
  });
};

export const updateFarmApi = (id: string, farmData: Partial<Farm>) => {
  return request<{ success: boolean; message: string; farm: Farm }>(`/farms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(farmData),
  });
};

export const deleteFarmApi = (id: string) => {
  return request<{ success: boolean; message: string; id: string }>(`/farms/${id}`, {
    method: 'DELETE',
  });
};
