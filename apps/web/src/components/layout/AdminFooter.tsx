export function AdminFooter() {
  return (
    <footer className="h-14 border-t bg-white px-8 flex items-center justify-between text-sm text-gray-500">
      <div>
        &copy; {new Date().getFullYear()}{' '}
        <span className="font-semibold text-gray-700">LUU SAC Portal</span>. Đã đăng ký bản quyền.
      </div>
      <div className="flex items-center gap-6">
        <a href="#" className="hover:text-gray-900 transition-colors">
          Tài liệu
        </a>
        <a href="#" className="hover:text-gray-900 transition-colors">
          Hỗ trợ
        </a>
        <a href="#" className="hover:text-gray-900 transition-colors">
          Điều khoản
        </a>
      </div>
    </footer>
  );
}
