import Link from "next/link";
import NovelHeader from "@/components/NovelHeader";
import NovelFooter from "@/components/NovelFooter";

const genreColors: Record<string, string> = {
  "Tiên Hiệp": "#6366f1",
  "Kiếm Hiệp": "#0891b2",
  "Ngôn Tình": "#ec4899",
  "Đô Thị": "#16a34a",
  "Huyền Huyễn": "#7c3aed",
  "Dị Giới": "#b45309",
  "Võng Du": "#0f766e",
  "Trinh Thám": "#374151",
  "Lịch Sử": "#92400e",
  "Xuyên Không": "#1d4ed8",
};

const genreIcons: Record<string, string> = {
  "Tiên Hiệp": "bi-stars",
  "Kiếm Hiệp": "bi-shield",
  "Ngôn Tình": "bi-heart-fill",
  "Đô Thị": "bi-building",
  "Huyền Huyễn": "bi-magic",
  "Dị Giới": "bi-globe",
  "Võng Du": "bi-controller",
  "Trinh Thám": "bi-search",
  "Lịch Sử": "bi-book",
  "Xuyên Không": "bi-clock-history",
};

function generateNovels(genre: string, count: number) {
  const titles = [
    "Thiên Đạo Đồ Thư Quán", "Vĩnh Hằng Thánh Vương", "Chư Thiên Ký",
    "Cửu Tinh Bá Thể Quyết", "Đại Đạo Triều Thiên", "Hỗn Độn Kiếm Thần",
    "Thần Hồn Cửu Biến", "Thiên Mệnh Chi Tử", "Vạn Giới Thần Chủ",
    "Trùng Sinh Chi Cuồng Bá Thiên Hạ", "Linh Khí Phục Tô", "Vô Địch Từ Lúc Bắt Đầu",
    "Đỉnh Cao Trở Lại", "Hệ Thống Siêu Cấp", "Nghịch Thiên Trọng Sinh",
    "Thần Y Đô Thị", "Tiên Giới Quy Lai", "Vương Bài Thiếu Gia",
  ];
  const authors = [
    "Nhất Lạp Tiểu Thuỷ", "Phong Lưu Thư Đãi", "Thiên Tằm Thổ Đậu",
    "Canh Tân Tắc Cải", "Mặc Vũ Tiêu Tiêu", "Đại Lực Kim Cang Chỉ",
    "Lão Lão Thật Thật", "Thần Kiếm Thiên Tôn", "Mộng Nhập Thần Cơ",
  ];
  const statuses = ["Đang ra", "Hoàn", "Đang ra", "Đang ra", "Hoàn"];
  const bgColors = ["#6366f1", "#0891b2", "#7c3aed", "#16a34a", "#b45309", "#1d4ed8", "#be185d", "#0f766e", "#92400e", "#374151"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length],
    author: authors[i % authors.length],
    genre,
    chapters: Math.floor(Math.random() * 3000) + 100,
    views: `${(Math.random() * 50 + 1).toFixed(1)}M`,
    color: bgColors[i % bgColors.length],
    status: statuses[i % statuses.length],
    updated: `${Math.floor(Math.random() * 24) + 1} giờ trước`,
    latestChapter: Math.floor(Math.random() * 3000) + 100,
  }));
}

const allGenres = ["Tiên Hiệp", "Kiếm Hiệp", "Ngôn Tình", "Đô Thị", "Huyền Huyễn", "Dị Giới", "Võng Du", "Trinh Thám", "Lịch Sử", "Xuyên Không"];

export default function TheLoaiPage({ params }: { params: { slug: string } }) {
  const genre = decodeURIComponent(params.slug);
  const color = genreColors[genre] ?? "#e74c3c";
  const icon = genreIcons[genre] ?? "bi-book";
  const novels = generateNovels(genre, 24);

  return (
    <div style={{ background: "#f5f5f0", minHeight: "100vh" }}>
      <NovelHeader />

      {/* Breadcrumb + Title */}
      <div style={{ background: color, borderBottom: "3px solid rgba(0,0,0,0.15)" }}>
        <div className="container py-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <Link href="/" className="text-white-50 text-decoration-none small">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active text-white small">Thể loại</li>
              <li className="breadcrumb-item active text-white small">{genre}</li>
            </ol>
          </nav>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center rounded-3"
              style={{ width: 48, height: 48, background: "rgba(255,255,255,0.2)" }}>
              <i className={`bi ${icon} text-white fs-4`} />
            </div>
            <div>
              <h4 className="fw-bold text-white mb-0">Truyện {genre}</h4>
              <small className="text-white-50">{novels.length * 100}+ truyện · Cập nhật liên tục</small>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Main */}
          <div className="col-lg-9">
            {/* Filters */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-3 d-flex flex-wrap gap-2 align-items-center">
                <span className="text-muted small me-2">Sắp xếp:</span>
                {["Mới nhất", "Hot nhất", "Đánh giá cao", "Số chương", "Đã hoàn"].map((f, i) => (
                  <Link key={f} href={`/the-loai/${params.slug}?sort=${f}`}
                    className={`btn btn-sm rounded-pill ${i === 0 ? "" : "btn-outline-secondary"}`}
                    style={i === 0 ? { background: color, color: "#fff", border: `1px solid ${color}` } : {}}>
                    {f}
                  </Link>
                ))}
                <div className="ms-auto d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-grid-3x3-gap" />
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-list-ul" />
                  </button>
                </div>
              </div>
            </div>

            {/* Novel grid */}
            <div className="row g-3 mb-4">
              {novels.map((n) => (
                <div key={n.id} className="col-6 col-md-4 col-lg-3">
                  <Link href={`/truyen/${encodeURIComponent(n.title)}`} className="text-decoration-none">
                    <div className="card border-0 shadow-sm rounded-3 h-100 hover-card">
                      {/* Cover */}
                      <div className="rounded-top-3 d-flex align-items-center justify-content-center position-relative"
                        style={{ height: 140, background: n.color }}>
                        <i className="bi bi-book-half text-white" style={{ fontSize: 40, opacity: 0.8 }} />
                        <span className={`position-absolute top-0 end-0 m-2 badge ${n.status === "Hoàn" ? "bg-success" : "bg-warning text-dark"}`}
                          style={{ fontSize: "0.65rem" }}>
                          {n.status}
                        </span>
                      </div>
                      <div className="card-body p-2">
                        <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.82rem" }}>{n.title}</div>
                        <div className="text-muted text-truncate" style={{ fontSize: "0.72rem" }}>{n.author}</div>
                        <div className="text-muted mt-1" style={{ fontSize: "0.7rem" }}>
                          <i className="bi bi-journal-text me-1" />Ch.{n.latestChapter}
                          <span className="ms-2"><i className="bi bi-eye me-1" />{n.views}</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                          <i className="bi bi-clock me-1" />{n.updated}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <nav>
              <ul className="pagination justify-content-center">
                <li className="page-item disabled"><span className="page-link">«</span></li>
                {[1, 2, 3, 4, 5].map((p) => (
                  <li key={p} className={`page-item ${p === 1 ? "active" : ""}`}>
                    <Link href={`/the-loai/${params.slug}?page=${p}`} className="page-link"
                      style={p === 1 ? { background: color, borderColor: color } : {}}>
                      {p}
                    </Link>
                  </li>
                ))}
                <li className="page-item"><Link href={`/the-loai/${params.slug}?page=2`} className="page-link">»</Link></li>
              </ul>
            </nav>
          </div>

          {/* Sidebar */}
          <div className="col-lg-3">
            {/* All genres */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-grid me-2 text-danger" />Tất cả thể loại
                </h6>
                <div className="d-flex flex-column gap-1">
                  {allGenres.map((g) => (
                    <Link key={g} href={`/the-loai/${encodeURIComponent(g)}`}
                      className={`d-flex align-items-center gap-2 px-2 py-2 rounded-2 text-decoration-none ${g === genre ? "fw-semibold" : ""}`}
                      style={{
                        background: g === genre ? color + "20" : "transparent",
                        color: g === genre ? color : "#555",
                        fontSize: "0.83rem"
                      }}>
                      <i className={`bi ${genreIcons[g] ?? "bi-book"}`} style={{ width: 16 }} />
                      {g}
                      {g === genre && <i className="bi bi-chevron-right ms-auto" style={{ fontSize: "0.7rem" }} />}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Top in genre */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-trophy me-2 text-warning" />Top {genre}
                </h6>
                {novels.slice(0, 5).map((n, i) => (
                  <div key={n.id} className="d-flex gap-2 align-items-start mb-3">
                    <div className="fw-bold text-center flex-shrink-0"
                      style={{
                        width: 22, height: 22, fontSize: "0.72rem",
                        background: i < 3 ? ["#e74c3c", "#e67e22", "#f39c12"][i] : "#e0e0e0",
                        color: i < 3 ? "#fff" : "#666",
                        borderRadius: "50%", lineHeight: "22px"
                      }}>
                      {i + 1}
                    </div>
                    <div className="flex-fill min-w-0">
                      <Link href={`/truyen/${encodeURIComponent(n.title)}`}
                        className="text-decoration-none text-dark fw-semibold text-truncate d-block"
                        style={{ fontSize: "0.8rem" }}>
                        {n.title}
                      </Link>
                      <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                        <i className="bi bi-eye me-1" />{n.views}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NovelFooter />
    </div>
  );
}
