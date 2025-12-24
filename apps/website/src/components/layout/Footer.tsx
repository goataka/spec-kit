import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">勤怠管理システム</h3>
            <p className="text-gray-400">
              クラウド型勤怠管理で、もっとシンプルに
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">製品</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  機能
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  料金
                </Link>
              </li>
              <li>
                <Link to="/releases" className="text-gray-400 hover:text-white transition">
                  リリースノート
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">サポート</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition">
                  ヘルプセンター
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition">
                  ドキュメント
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">会社情報</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  会社概要
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  利用規約
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} 勤怠管理システム. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
