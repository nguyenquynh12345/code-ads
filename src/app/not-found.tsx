import Link from "next/link";

export default function NotFound() {
  return (
    <div className="auth-bg d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="text-center text-white p-4">
        <div className="display-1 fw-bold mb-2" style={{ fontSize: "8rem", opacity: 0.3 }}>404</div>
        <h2 className="fw-bold mb-3">Trang không tìm thấy</h2>
        <p className="text-white-50 mb-4">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link href="/" className="btn btn-light px-4 fw-medium text-primary">
            <i className="bi bi-house me-2" />Trang chủ
          </Link>
          <Link href="/dashboard" className="btn btn-outline-light px-4">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
