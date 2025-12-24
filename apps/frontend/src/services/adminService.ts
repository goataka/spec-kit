import { apiClient } from './api';
import { User, Employee, Clock, QueryClocksDto } from '@repo/shared';

export const adminService = {
  async getUsers(): Promise<Omit<User, 'password'>[]> {
    return apiClient.get<Omit<User, 'password'>[]>('/users');
  },

  async getUser(userId: string): Promise<Omit<User, 'password'>> {
    return apiClient.get<Omit<User, 'password'>>(`/users/${userId}`);
  },

  async getEmployees(): Promise<Employee[]> {
    return apiClient.get<Employee[]>('/employees');
  },

  async getEmployee(userId: string): Promise<Employee> {
    return apiClient.get<Employee>(`/employees/${userId}`);
  },

  async getClocks(params?: QueryClocksDto): Promise<Clock[]> {
    return apiClient.get<Clock[]>('/attendance/clocks/admin', { params });
  },
};
