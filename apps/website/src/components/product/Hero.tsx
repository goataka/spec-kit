export function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#007CC0] to-[#005A8D] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            勤怠管理を、もっとシンプルに
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            クラウド型勤怠管理システムで、従業員の勤務時間を正確に記録・管理
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-[#007CC0] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              無料で始める
            </a>
            <a
              href="/support"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#007CC0] transition"
            >
              詳しく見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
