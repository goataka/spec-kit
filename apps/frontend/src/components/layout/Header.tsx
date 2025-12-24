import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            {isAdmin && (
              <button
                onClick={onMenuClick}
                className="mr-4 text-white hover:text-gray-200 focus:outline-none lg:hidden"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-bold text-white">Attendance System</h1>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="text-white">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-200">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
