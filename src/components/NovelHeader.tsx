import Link from "next/link";

const genres = [
  "Tiên Hiệp", "Kiếm Hiệp", "Ngôn Tình", "Đô Thị", "Huyền Huyễn",
  "Dị Giới", "Võng Du", "Trinh Thám", "Lịch Sử", "Xuyên Không",
];

export default function NovelHeader() {
  return (
    <header style={{ background: "#1a1a2e" }}>
      {/* Topbar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="container d-flex justify-content-between align-items-center py-1">
          <small className="text-white-50">
            <i className="bi bi-lightning-fill text-warning me-1" />
            Đọc truyện online miễn phí, cập nhật nhanh nhất
          </small>
          <div className="d-flex gap-3">
            <Link href="/login" className="text-white-50 text-decoration-none small">
              <i className="bi bi-person me-1" />Đăng nhập
            </Link>
            <Link href="/register" className="text-white-50 text-decoration-none small">
              <i className="bi bi-person-plus me-1" />Đăng ký
            </Link>
          </div>
        </div>
      </div>

      {/* Logo + Search */}
      <div className="container py-3">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <Link href="/" className="text-decoration-none d-flex align-items-center gap-2">
            <div className="d-flex align-items-center justify-content-center rounded-2"
              style={{ width: 40, height: 40, background: "#e74c3c" }}>
              <i className="bi bi-book-fill text-white fs-5" />
            </div>
            <div>
              <div className="fw-bold text-white fs-5 lh-1">TruyệnHay</div>
              <div style={{ fontSize: "0.65rem", color: "#aaa" }}>Kho truyện triệu chương</div>
            </div>
          </Link>

          <form className="flex-fill" style={{ maxWidth: 520 }} action="/tim-kiem" method="get">
            <div className="input-group">
              <input
                type="text"
                name="q"
                className="form-control border-0"
                placeholder="Tìm kiếm truyện, tác giả..."
                style={{ background: "#2d2d44", color: "#fff" }}
              />
              <button type="submit" className="btn" style={{ background: "#e74c3c", color: "#fff" }}>
                <i className="bi bi-search" />
              </button>
            </div>
          </form>

          <div className="ms-auto d-flex gap-2">
            <Link href="/dashboard" className="btn btn-sm" style={{ background: "#e74c3c", color: "#fff" }}>
              <i className="bi bi-person-circle me-1" />Tủ sách
            </Link>
          </div>
        </div>
      </div>

      {/* Genre nav */}
      <div style={{ background: "#e74c3c" }}>
        <div className="container">
          <nav className="d-flex gap-0 overflow-auto" style={{ scrollbarWidth: "none" }}>
            <Link href="/" className="nav-link text-white px-3 py-2 text-nowrap"
              style={{ fontSize: "0.85rem" }}>
              <i className="bi bi-house-fill me-1" />Trang chủ
            </Link>
            {genres.map((g) => (
              <Link key={g} href={`/the-loai/${encodeURIComponent(g)}`}
                className="nav-link text-white px-3 py-2 text-nowrap"
                style={{ fontSize: "0.85rem" }}>
                {g}
              </Link>
            ))}
            <Link href="/dien-dan" className="nav-link text-white px-3 py-2 text-nowrap"
              style={{ fontSize: "0.85rem" }}>
              <i className="bi bi-chat-dots me-1" />Diễn đàn
            </Link>
            <Link href="/tim-kiem" className="nav-link text-white px-3 py-2 text-nowrap ms-auto"
              style={{ fontSize: "0.85rem" }}>
              <i className="bi bi-search me-1" />Tìm kiếm
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
