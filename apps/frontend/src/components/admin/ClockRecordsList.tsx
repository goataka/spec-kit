import { Clock } from '@repo/shared';

interface ClockRecordsListProps {
  clocks: Clock[];
  loading?: boolean;
}

export function ClockRecordsList({ clocks, loading }: ClockRecordsListProps) {
  if (loading) {
    return (
      <div className="px-4 py-5 sm:p-6">
        <p className="text-center text-gray-500">Loading clock records...</p>
      </div>
    );
  }

  if (clocks.length === 0) {
    return (
      <div className="px-4 py-5 sm:p-6">
        <p className="text-center text-gray-500">No clock records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check In Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check Out Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clocks.map((clock) => (
            <tr key={clock.clockId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {clock.userId.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    clock.type === 'CHECK_IN'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {clock.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {clock.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(clock.timestamp).toLocaleTimeString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {clock.checkInTime
                  ? new Date(clock.checkInTime).toLocaleTimeString()
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {clock.checkOutTime
                  ? new Date(clock.checkOutTime).toLocaleTimeString()
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {clock.checkInTime && clock.checkOutTime
                  ? calculateDuration(clock.checkInTime, clock.checkOutTime)
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function calculateDuration(checkIn: string, checkOut: string): string {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}
