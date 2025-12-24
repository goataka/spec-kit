import { useState, useEffect } from 'react';
import { ClockInButton } from '../components/attendance/ClockInButton';
import { ClockOutButton } from '../components/attendance/ClockOutButton';
import { AttendanceStatus } from '../components/attendance/AttendanceStatus';
import { attendanceService } from '../services/attendanceService';
import { Clock } from '@repo/shared';

export function AttendancePage() {
  const [todayClocks, setTodayClocks] = useState<Clock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodayClocks = async () => {
    try {
      setLoading(true);
      const clocks = await attendanceService.getTodayClocks();
      setTodayClocks(clocks);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayClocks();
  }, []);

  const handleCheckIn = async () => {
    try {
      await attendanceService.checkIn();
      await loadTodayClocks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkOut();
      await loadTodayClocks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check-out failed');
    }
  };

  const hasActiveCheckIn = todayClocks.some(
    (clock) => clock.type === 'CHECK_IN' && !clock.checkOutTime
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-2 text-sm text-gray-600">Record your work hours</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <AttendanceStatus clocks={todayClocks} loading={loading} />
          
          <div className="mt-6 flex gap-4">
            <ClockInButton
              onClick={handleCheckIn}
              disabled={hasActiveCheckIn || loading}
            />
            <ClockOutButton
              onClick={handleCheckOut}
              disabled={!hasActiveCheckIn || loading}
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Today's Records
          </h3>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : todayClocks.length === 0 ? (
            <p className="text-sm text-gray-500">No records for today</p>
          ) : (
            <div className="space-y-3">
              {todayClocks.map((clock) => (
                <div
                  key={clock.clockId}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {clock.type === 'CHECK_IN' ? 'Check In' : 'Check Out'}
                    </span>
                    <p className="text-xs text-gray-500">
                      {new Date(clock.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {clock.checkInTime && clock.checkOutTime && (
                    <span className="text-sm text-gray-600">
                      Duration: {calculateDuration(clock.checkInTime, clock.checkOutTime)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function calculateDuration(checkIn: string, checkOut: string): string {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}
