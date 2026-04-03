import Link from "next/link";

export default function NovelFooter() {
  return (
    <footer style={{ background: "#1a1a2e", borderTop: "2px solid #e74c3c" }} className="mt-5">
      <div className="container py-4">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex align-items-center justify-content-center rounded-2"
                style={{ width: 36, height: 36, background: "#e74c3c" }}>
                <i className="bi bi-book-fill text-white" />
              </div>
              <span className="fw-bold text-white fs-5">TruyệnHay</span>
            </div>
            <p className="text-secondary small mb-3">
              Kho truyện chữ online lớn nhất Việt Nam. Đọc miễn phí, cập nhật nhanh nhất.
            </p>
            <div className="d-flex gap-2">
              {["bi-facebook", "bi-twitter-x", "bi-discord", "bi-tiktok"].map((ic) => (
                <a key={ic} href="#"
                  className="d-flex align-items-center justify-content-center rounded-circle text-white"
                  style={{ width: 32, height: 32, background: "rgba(255,255,255,0.1)", fontSize: "0.9rem" }}>
                  <i className={`bi ${ic}`} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="fw-semibold text-white mb-3" style={{ fontSize: "0.85rem" }}>Thể loại</h6>
            <ul className="list-unstyled mb-0">
              {["Tiên Hiệp", "Kiếm Hiệp", "Ngôn Tình", "Đô Thị", "Huyền Huyễn"].map((l) => (
                <li key={l} className="mb-2">
                  <Link href={`/the-loai/${encodeURIComponent(l)}`}
                    className="text-secondary text-decoration-none" style={{ fontSize: "0.82rem" }}>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="fw-semibold text-white mb-3" style={{ fontSize: "0.85rem" }}>Hỗ trợ</h6>
            <ul className="list-unstyled mb-0">
              {[
                { label: "Về chúng tôi", href: "#" },
                { label: "Diễn đàn", href: "/dien-dan" },
                { label: "Báo lỗi", href: "/contact" },
                { label: "Liên hệ", href: "/contact" },
              ].map((l) => (
                <li key={l.label} className="mb-2">
                  <Link href={l.href} className="text-secondary text-decoration-none" style={{ fontSize: "0.82rem" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="fw-semibold text-white mb-3" style={{ fontSize: "0.85rem" }}>
              <i className="bi bi-bell me-1" />Nhận thông báo
            </h6>
            <p className="text-secondary small mb-2">Đăng ký nhận thông báo truyện mới mỗi ngày.</p>
            <div className="input-group input-group-sm">
              <input type="email" className="form-control border-0"
                placeholder="Email của bạn..."
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }} />
              <button className="btn btn-sm" style={{ background: "#e74c3c", color: "#fff" }}>
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        <div className="border-top pt-3 d-flex flex-wrap justify-content-between align-items-center gap-2"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <small className="text-secondary">© 2024 TruyệnHay. All rights reserved.</small>
          <div className="d-flex gap-3">
            <Link href="#" className="text-secondary text-decoration-none small">Điều khoản</Link>
            <Link href="#" className="text-secondary text-decoration-none small">Bảo mật</Link>
            <Link href="/contact" className="text-secondary text-decoration-none small">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
