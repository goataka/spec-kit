interface Release {
  version: string;
  date: string;
  title: string;
  description: string;
  features: string[];
  fixes: string[];
}

interface ReleaseDetailProps {
  release: Release;
}

export function ReleaseDetail({ release }: ReleaseDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          バージョン {release.version}
        </h2>
        <p className="text-gray-600">{release.date}</p>
      </div>

      <h3 className="text-2xl font-semibold mb-4">{release.title}</h3>
      <p className="text-gray-700 mb-6">{release.description}</p>

      {release.features.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-3">
            ✨ 新機能
          </h4>
          <ul className="space-y-2">
            {release.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-[#007CC0] mr-2">●</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {release.fixes.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold text-gray-900 mb-3">
            🐛 バグ修正
          </h4>
          <ul className="space-y-2">
            {release.fixes.map((fix, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-[#007CC0] mr-2">●</span>
                <span className="text-gray-700">{fix}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
