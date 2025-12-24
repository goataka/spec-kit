export interface Employee {
  userId: string;
  name: string;
  employeeNumber: string;
  department: string;
  position: string;
  employmentType: 'FULL_TIME' | 'CONTRACT' | 'PART_TIME';
  hireDate: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateEmployeeDto {
  name: string;
  employeeNumber?: string;
  department?: string;
  position?: string;
  employmentType?: 'FULL_TIME' | 'CONTRACT' | 'PART_TIME';
  hireDate?: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  department?: string;
  position?: string;
  employmentType?: 'FULL_TIME' | 'CONTRACT' | 'PART_TIME';
}
