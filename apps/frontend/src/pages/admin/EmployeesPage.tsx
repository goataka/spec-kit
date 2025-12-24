import { useState, useEffect } from 'react';
import { EmployeeList } from '../../components/admin/EmployeeList';
import { adminService } from '../../services/adminService';
import { Employee } from '@repo/shared';

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await adminService.getEmployees();
      setEmployees(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        <p className="mt-2 text-sm text-gray-600">Manage all employees in the system</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <EmployeeList employees={employees} loading={loading} />
      </div>
    </div>
  );
}
