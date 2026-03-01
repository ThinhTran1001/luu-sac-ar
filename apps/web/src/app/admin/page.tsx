export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tổng Quan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Tổng Sản Phẩm</h2>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Tổng Đơn Hàng</h2>
          <p className="text-3xl font-bold text-green-600">--</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Doanh Thu</h2>
          <p className="text-3xl font-bold text-purple-600">--</p>
        </div>
      </div>
    </div>
  );
}
