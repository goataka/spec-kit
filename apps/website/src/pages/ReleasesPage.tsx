import { ReleaseList } from '../components/releases/ReleaseList';

export function ReleasesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-[#007CC0] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">リリースノート</h1>
          <p className="text-xl text-blue-100">
            システムの更新履歴と新機能のご紹介
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <ReleaseList />
      </div>
    </div>
  );
}
