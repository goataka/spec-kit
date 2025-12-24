import { useState, useEffect } from 'react';

interface Release {
  version: string;
  date: string;
  title: string;
  description: string;
  features: string[];
  fixes: string[];
}

export function ReleaseList() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/releases.json')
      .then((res) => res.json())
      .then((data) => {
        setReleases(data.releases);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load releases:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {releases.map((release, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                バージョン {release.version}
              </h3>
              <p className="text-gray-600">{release.date}</p>
            </div>
            <span className="bg-[#007CC0] text-white px-3 py-1 rounded-full text-sm font-semibold">
              {index === 0 ? '最新' : ''}
            </span>
          </div>
          <h4 className="text-xl font-semibold mb-2">{release.title}</h4>
          <p className="text-gray-600 mb-4">{release.description}</p>

          {release.features.length > 0 && (
            <div className="mb-4">
              <h5 className="font-semibold text-gray-900 mb-2">✨ 新機能</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {release.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {release.fixes.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">🐛 修正</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {release.fixes.map((fix, idx) => (
                  <li key={idx}>{fix}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
