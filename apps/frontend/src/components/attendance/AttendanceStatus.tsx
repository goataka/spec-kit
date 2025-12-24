import { Clock } from '@repo/shared';

interface AttendanceStatusProps {
  clocks: Clock[];
  loading?: boolean;
}

export function AttendanceStatus({ clocks, loading }: AttendanceStatusProps) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Loading status...</p>
      </div>
    );
  }

  const activeCheckIn = clocks.find(
    (clock) => clock.type === 'CHECK_IN' && !clock.checkOutTime
  );

  const lastCheckOut = clocks
    .filter((clock) => clock.type === 'CHECK_OUT')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const currentStatus = activeCheckIn ? 'CHECKED_IN' : 'CHECKED_OUT';
  const statusTime = activeCheckIn?.checkInTime || lastCheckOut?.checkOutTime;

  return (
    <div className="text-center">
      <div className="mb-4">
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            currentStatus === 'CHECKED_IN'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {currentStatus === 'CHECKED_IN' ? (
            <>
              <svg
                className="mr-1.5 h-2 w-2 fill-green-500"
                viewBox="0 0 6 6"
                aria-hidden="true"
              >
                <circle cx={3} cy={3} r={3} />
              </svg>
              Currently Checked In
            </>
          ) : (
            <>
              <svg
                className="mr-1.5 h-2 w-2 fill-gray-500"
                viewBox="0 0 6 6"
                aria-hidden="true"
              >
                <circle cx={3} cy={3} r={3} />
              </svg>
              Currently Checked Out
            </>
          )}
        </span>
      </div>

      {statusTime && (
        <p className="text-sm text-gray-600">
          {currentStatus === 'CHECKED_IN' ? 'Checked in at' : 'Last checked out at'}:{' '}
          <span className="font-medium">
            {new Date(statusTime).toLocaleTimeString()}
          </span>
        </p>
      )}

      {activeCheckIn && activeCheckIn.checkInTime && (
        <p className="mt-2 text-xs text-gray-500">
          Working for: {calculateWorkingTime(activeCheckIn.checkInTime)}
        </p>
      )}
    </div>
  );
}

function calculateWorkingTime(checkInTime: string): string {
  const diff = Date.now() - new Date(checkInTime).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}
