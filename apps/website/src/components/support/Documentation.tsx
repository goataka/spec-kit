const docs = [
  {
    title: 'クイックスタート',
    description: 'システムの導入から初期設定までの手順',
    link: '#quickstart',
  },
  {
    title: 'ユーザーガイド',
    description: '従業員向けの打刻方法と基本操作',
    link: '#user-guide',
  },
  {
    title: '管理者ガイド',
    description: '管理者機能の使い方と設定方法',
    link: '#admin-guide',
  },
  {
    title: 'API リファレンス',
    description: '外部システムとの連携方法',
    link: '#api-reference',
  },
];

export function Documentation() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          ドキュメント
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docs.map((doc, index) => (
            <a
              key={index}
              href={doc.link}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-[#007CC0] transition"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {doc.title}
              </h3>
              <p className="text-gray-600">{doc.description}</p>
              <div className="mt-4 text-[#007CC0] font-semibold">
                詳しく見る →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
