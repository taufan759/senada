import AppLayout from '../components/AppLayouts';

const Budget = () => {
  return (
    <AppLayout>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Anggaran</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Ringkasan Anggaran</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Anggaran</span>
                <span className="font-medium">Rp 0</span>
              </div>
              <div className="flex justify-between">
                <span>Terpakai</span>
                <span className="font-medium text-red-600">Rp 0</span>
              </div>
              <div className="flex justify-between">
                <span>Sisa</span>
                <span className="font-medium text-green-600">Rp 0</span>
              </div>
            </div>
          </div>

          {/* Add Budget Button */}
          <div className="flex items-center justify-center">
            <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-3 rounded-md font-medium transition-colors">
              Tambah Anggaran
            </button>
          </div>
        </div>

        {/* Budget List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Daftar Anggaran</h2>
          <div className="text-center py-8 text-gray-500">
            Belum ada anggaran yang dibuat
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Budget;