import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#007CC0]">
              勤怠管理システム
            </span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-[#007CC0] transition"
            >
              ホーム
            </Link>
            <Link
              to="/support"
              className="text-gray-700 hover:text-[#007CC0] transition"
            >
              サポート
            </Link>
            <Link
              to="/releases"
              className="text-gray-700 hover:text-[#007CC0] transition"
            >
              リリースノート
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <a
              href="http://localhost:5173/login"
              className="text-[#007CC0] font-semibold hover:text-[#005A8D] transition"
            >
              ログイン
            </a>
            <a
              href="http://localhost:5173/register"
              className="bg-[#007CC0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#005A8D] transition"
            >
              無料で始める
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
