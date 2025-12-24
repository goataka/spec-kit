export interface User {
  userId: string;
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'EMPLOYEE';
  department?: string;
  position?: string;
  employeeId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
  department?: string;
  position?: string;
  employeeId?: string;
}

export interface UpdateUserDto {
  name?: string;
  department?: string;
  position?: string;
  role?: 'ADMIN' | 'EMPLOYEE';
}
