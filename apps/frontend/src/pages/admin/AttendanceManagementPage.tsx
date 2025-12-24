import { useState, useEffect } from 'react';
import { ClockRecordsList } from '../../components/admin/ClockRecordsList';
import { adminService } from '../../services/adminService';
import { Clock, QueryClocksDto } from '@repo/shared';

export function AttendanceManagementPage() {
  const [clocks, setClocks] = useState<Clock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryClocksDto>({});

  useEffect(() => {
    loadClocks();
  }, [filters]);

  const loadClocks = async () => {
    try {
      setLoading(true);
      const data = await adminService.getClocks(filters);
      setClocks(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load clock records');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: QueryClocksDto) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <p className="mt-2 text-sm text-gray-600">View all employee clock records</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-6 bg-white shadow sm:rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={filters.date || ''}
              onChange={(e) => handleFilterChange({ date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange({ type: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">All</option>
              <option value="CHECK_IN">Check In</option>
              <option value="CHECK_OUT">Check Out</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadClocks}
              className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <ClockRecordsList clocks={clocks} loading={loading} />
      </div>
    </div>
  );
}
