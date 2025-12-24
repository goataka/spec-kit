import { apiClient } from './api';
import { Clock, QueryClocksDto } from '@repo/shared';

export const attendanceService = {
  async checkIn(): Promise<Clock> {
    return apiClient.post<Clock>('/attendance/check-in');
  },

  async checkOut(): Promise<Clock> {
    return apiClient.post<Clock>('/attendance/check-out');
  },

  async getTodayClocks(): Promise<Clock[]> {
    return apiClient.get<Clock[]>('/attendance/clocks/today');
  },

  async getClocks(params?: QueryClocksDto): Promise<Clock[]> {
    return apiClient.get<Clock[]>('/attendance/clocks', { params });
  },

  async getAllClocksAdmin(params?: QueryClocksDto): Promise<Clock[]> {
    return apiClient.get<Clock[]>('/attendance/clocks/admin', { params });
  },
};
