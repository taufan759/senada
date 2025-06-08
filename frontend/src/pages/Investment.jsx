import AppLayout from '../components/AppLayouts';

const Investment = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Portfolio Investasi</h1>

          {/* Investment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Total Investasi</h3>
              <p className="text-xl font-bold text-blue-600">Rp 0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Keuntungan</h3>
              <p className="text-xl font-bold text-green-600">Rp 0</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Return</h3>
              <p className="text-xl font-bold text-purple-600">0%</p>
            </div>
          </div>
        </div>

        {/* Investment Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Rekomendasi Investasi</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Reksa Dana</h3>
              <p className="text-sm text-gray-600 mb-3">Investasi yang dikelola profesional dengan risiko terukur</p>
              <button className="text-primary hover:underline text-sm">Pelajari Lebih Lanjut →</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Saham</h3>
              <p className="text-sm text-gray-600 mb-3">Kepemilikan perusahaan dengan potensi return tinggi</p>
              <button className="text-primary hover:underline text-sm">Pelajari Lebih Lanjut →</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Obligasi</h3>
              <p className="text-sm text-gray-600 mb-3">Surat utang dengan bunga tetap dan risiko rendah</p>
              <button className="text-primary hover:underline text-sm">Pelajari Lebih Lanjut →</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Emas</h3>
              <p className="text-sm text-gray-600 mb-3">Aset safe haven untuk lindung nilai inflasi</p>
              <button className="text-primary hover:underline text-sm">Pelajari Lebih Lanjut →</button>
            </div>
          </div>
        </div>

        {/* Risk Profile */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Profil Risiko</h2>
          <p className="text-gray-600 mb-4">Tentukan profil risiko Anda untuk mendapatkan rekomendasi investasi yang sesuai</p>
          <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors">
            Mulai Assessment
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Investment;