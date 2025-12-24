export interface Clock {
  clockId: string;
  userId: string;
  timestamp: string;
  date: string;
  type: 'CHECK_IN' | 'CHECK_OUT';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CheckInDto {
  notes?: string;
}

export interface CheckOutDto {
  notes?: string;
}

export interface QueryClocksDto {
  userId?: string;
  type?: 'CHECK_IN' | 'CHECK_OUT';
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface ClocksResponse {
  clocks: Clock[];
  count: number;
}
