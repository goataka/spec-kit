export function CallToAction() {
  return (
    <section className="py-20 bg-[#007CC0] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          今すぐ始めましょう
        </h2>
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          無料プランで今すぐ始められます。クレジットカードは不要です。
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
            お問い合わせ
          </a>
        </div>
      </div>
    </section>
  );
}
