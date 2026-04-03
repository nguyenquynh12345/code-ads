import Link from "next/link";
import NovelHeader from "@/components/NovelHeader";
import NovelFooter from "@/components/NovelFooter";

const genres = ["Tất cả", "Tiên Hiệp", "Kiếm Hiệp", "Ngôn Tình", "Đô Thị", "Huyền Huyễn", "Dị Giới", "Võng Du", "Trinh Thám", "Lịch Sử", "Xuyên Không"];
const statuses = ["Tất cả", "Đang ra", "Hoàn thành", "Tạm dừng"];
const sortOptions = ["Liên quan", "Mới nhất", "Hot nhất", "Đánh giá cao", "Nhiều chương nhất"];

const sampleResults = [
  { title: "Đấu Phá Thương Khung", author: "Thiên Tằm Thổ Đậu", genre: "Tiên Hiệp", chapters: 1648, views: "125M", color: "#6366f1", status: "Hoàn", rating: 4.9, desc: "Tiêu Viêm từ thiên tài trở thành phế vật, hành trình trở lại đỉnh cao đầy gian nan trên đại lục Đấu Khí huyền bí." },
  { title: "Võ Luyện Đỉnh Phong", author: "Mạc Mặc Thực Thần Dương", genre: "Huyền Huyễn", chapters: 3462, views: "210M", color: "#dc2626", status: "Hoàn", rating: 4.8, desc: "Dương Khai với viên đá đen kỳ lạ, bước vào con đường tu luyện chinh phục thiên hà." },
  { title: "Phàm Nhân Tu Tiên", author: "Vong Ngữ", genre: "Tiên Hiệp", chapters: 2348, views: "145M", color: "#065f46", status: "Hoàn", rating: 4.9, desc: "Hàn Lập, một nông dân bình thường tình cờ bước vào thế giới tu tiên đầy nguy hiểm." },
  { title: "Toàn Chức Pháp Sư", author: "Loạn", genre: "Huyền Huyễn", chapters: 2892, views: "98M", color: "#7c3aed", status: "Hoàn", rating: 4.7, desc: "Mặc Phàm trong thế giới ma pháp, từ một học sinh kém cỏi vươn lên thành pháp sư toàn năng vô địch." },
  { title: "Tinh Thần Biến", author: "Ngã Cật Tây Hồng Thị", genre: "Huyền Huyễn", chapters: 3100, views: "88M", color: "#1d4ed8", status: "Đang ra", rating: 4.6, desc: "Thang Sâm với chí hướng cao xa, vào Tinh Linh Điện tu luyện, hành trình đầy thử thách." },
  { title: "Long Vương Truyền Thuyết", author: "Thiên Hạ Bá Xướng", genre: "Đô Thị", chapters: 5300, views: "312M", color: "#c2410c", status: "Hoàn", rating: 4.5, desc: "Đường Tam từ một thanh niên bình thường, gia nhập Linh Hồn Sư Học Viện và viết nên huyền thoại." },
  { title: "Tru Tiên", author: "Tiêu Đỉnh", genre: "Kiếm Hiệp", chapters: 347, views: "89M", color: "#0891b2", status: "Hoàn", rating: 4.8, desc: "Trương Tiểu Phàm giữa thiện và ác, đi giữa ranh giới mỏng manh của tình yêu và trách nhiệm." },
  { title: "Thần Mộ", author: "Thần Đông", genre: "Tiên Hiệp", chapters: 1200, views: "67M", color: "#0f766e", status: "Hoàn", rating: 4.6, desc: "Dương Nhược Thần hành trình khám phá bí ẩn Thần Mộ, nơi chôn cất những vị thần cổ đại." },
];

const hotSearches = ["Đấu Phá Thương Khung", "Phàm Nhân Tu Tiên", "Ngôn Tình hay", "Trọng sinh", "Hệ thống", "Long Vương", "Võ Luyện Đỉnh Phong", "Xuyên không"];

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; genre?: string; status?: string; sort?: string };
}) {
  const query = searchParams.q ?? "";
  const selectedGenre = searchParams.genre ?? "Tất cả";
  const selectedStatus = searchParams.status ?? "Tất cả";
  const selectedSort = searchParams.sort ?? "Liên quan";

  const hasQuery = query.trim().length > 0;

  return (
    <div style={{ background: "#f5f5f0", minHeight: "100vh" }}>
      <NovelHeader />

      {/* Search hero */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)", borderBottom: "2px solid #e74c3c" }}>
        <div className="container py-5">
          <div className="text-center mb-4">
            <h4 className="fw-bold text-white mb-1">
              <i className="bi bi-search me-2 text-danger" />
              {hasQuery ? `Kết quả tìm kiếm: "${query}"` : "Tìm kiếm truyện"}
            </h4>
            <p className="text-white-50 small">
              {hasQuery ? `Tìm thấy ${sampleResults.length} kết quả phù hợp` : "Nhập tên truyện, tác giả hoặc từ khóa để tìm kiếm"}
            </p>
          </div>

          {/* Main search box */}
          <form action="/tim-kiem" method="get" className="mx-auto" style={{ maxWidth: 640 }}>
            <div className="input-group input-group-lg shadow">
              <input
                type="text"
                name="q"
                defaultValue={query}
                className="form-control border-0"
                placeholder="Tên truyện, tác giả, từ khóa..."
                style={{ background: "#fff", fontSize: "1rem" }}
              />
              <button type="submit" className="btn btn-lg px-4" style={{ background: "#e74c3c", color: "#fff" }}>
                <i className="bi bi-search me-1" />Tìm
              </button>
            </div>
          </form>

          {/* Hot searches */}
          {!hasQuery && (
            <div className="text-center mt-4">
              <small className="text-white-50 me-2">Tìm kiếm phổ biến:</small>
              {hotSearches.map((s) => (
                <Link key={s} href={`/tim-kiem?q=${encodeURIComponent(s)}`}
                  className="badge text-decoration-none me-2 mb-2"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.78rem", padding: "6px 12px" }}>
                  {s}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Filters sidebar */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 mb-3">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-funnel me-2 text-danger" />Bộ lọc
                </h6>

                {/* Genre filter */}
                <div className="mb-4">
                  <div className="fw-semibold small mb-2 text-muted">Thể loại</div>
                  <div className="d-flex flex-column gap-1">
                    {genres.map((g) => (
                      <Link key={g} href={`/tim-kiem?q=${query}&genre=${encodeURIComponent(g)}&status=${selectedStatus}&sort=${selectedSort}`}
                        className={`d-flex align-items-center px-2 py-1 rounded-2 text-decoration-none`}
                        style={{
                          fontSize: "0.83rem",
                          background: selectedGenre === g ? "#e74c3c10" : "transparent",
                          color: selectedGenre === g ? "#e74c3c" : "#555",
                          fontWeight: selectedGenre === g ? 600 : 400,
                        }}>
                        {selectedGenre === g && <i className="bi bi-check2 me-2" />}
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Status filter */}
                <div className="mb-4">
                  <div className="fw-semibold small mb-2 text-muted">Trạng thái</div>
                  <div className="d-flex flex-column gap-1">
                    {statuses.map((s) => (
                      <Link key={s} href={`/tim-kiem?q=${query}&genre=${selectedGenre}&status=${encodeURIComponent(s)}&sort=${selectedSort}`}
                        className="d-flex align-items-center px-2 py-1 rounded-2 text-decoration-none"
                        style={{
                          fontSize: "0.83rem",
                          background: selectedStatus === s ? "#e74c3c10" : "transparent",
                          color: selectedStatus === s ? "#e74c3c" : "#555",
                          fontWeight: selectedStatus === s ? 600 : 400,
                        }}>
                        {selectedStatus === s && <i className="bi bi-check2 me-2" />}
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <div className="fw-semibold small mb-2 text-muted">Sắp xếp theo</div>
                  <div className="d-flex flex-column gap-1">
                    {sortOptions.map((s) => (
                      <Link key={s} href={`/tim-kiem?q=${query}&genre=${selectedGenre}&status=${selectedStatus}&sort=${encodeURIComponent(s)}`}
                        className="d-flex align-items-center px-2 py-1 rounded-2 text-decoration-none"
                        style={{
                          fontSize: "0.83rem",
                          background: selectedSort === s ? "#e74c3c10" : "transparent",
                          color: selectedSort === s ? "#e74c3c" : "#555",
                          fontWeight: selectedSort === s ? 600 : 400,
                        }}>
                        {selectedSort === s && <i className="bi bi-check2 me-2" />}
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="col-lg-9">
            {hasQuery ? (
              <>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-muted small">
                    Tìm thấy <strong>{sampleResults.length}</strong> kết quả
                    {selectedGenre !== "Tất cả" && <> · Thể loại: <strong>{selectedGenre}</strong></>}
                    {selectedStatus !== "Tất cả" && <> · {selectedStatus}</>}
                  </span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary active"><i className="bi bi-list-ul" /></button>
                    <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-grid-3x3-gap" /></button>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3 mb-4">
                  {sampleResults.map((n) => (
                    <Link key={n.title} href={`/truyen/${encodeURIComponent(n.title)}`}
                      className="text-decoration-none">
                      <div className="card border-0 shadow-sm rounded-3 hover-card">
                        <div className="card-body p-3 d-flex gap-3">
                          {/* Cover */}
                          <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                            style={{ width: 72, height: 100, background: n.color }}>
                            <i className="bi bi-book-half text-white" style={{ fontSize: 28, opacity: 0.85 }} />
                          </div>

                          {/* Info */}
                          <div className="flex-fill min-w-0">
                            <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                              <h6 className="fw-bold text-dark mb-0">{n.title}</h6>
                              <span className={`badge flex-shrink-0 ${n.status === "Hoàn" ? "bg-success" : "bg-warning text-dark"}`}
                                style={{ fontSize: "0.65rem" }}>
                                {n.status}
                              </span>
                            </div>

                            <div className="d-flex flex-wrap gap-2 text-muted mb-2" style={{ fontSize: "0.75rem" }}>
                              <span><i className="bi bi-person me-1" />{n.author}</span>
                              <span><i className="bi bi-tag me-1" />{n.genre}</span>
                              <span><i className="bi bi-journal-text me-1" />{n.chapters.toLocaleString()} chương</span>
                              <span><i className="bi bi-eye me-1" />{n.views}</span>
                              <span><i className="bi bi-star-fill text-warning me-1" />{n.rating}</span>
                            </div>

                            <p className="text-muted mb-0 small" style={{ lineHeight: 1.5 }}>
                              {n.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className="page-item disabled"><span className="page-link">«</span></li>
                    {[1, 2, 3, 4, 5].map((p) => (
                      <li key={p} className={`page-item ${p === 1 ? "active" : ""}`}>
                        <Link href={`/tim-kiem?q=${query}&page=${p}`} className="page-link"
                          style={p === 1 ? { background: "#e74c3c", borderColor: "#e74c3c" } : {}}>
                          {p}
                        </Link>
                      </li>
                    ))}
                    <li className="page-item">
                      <Link href={`/tim-kiem?q=${query}&page=2`} className="page-link">»</Link>
                    </li>
                  </ul>
                </nav>
              </>
            ) : (
              /* No query — show suggestions */
              <div>
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 16, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  Đề xuất cho bạn
                </h6>
                <div className="row g-3">
                  {sampleResults.map((n) => (
                    <div key={n.title} className="col-6 col-md-4">
                      <Link href={`/truyen/${encodeURIComponent(n.title)}`} className="text-decoration-none">
                        <div className="card border-0 shadow-sm rounded-3 h-100 hover-card">
                          <div className="rounded-top-3 d-flex align-items-center justify-content-center"
                            style={{ height: 120, background: n.color }}>
                            <i className="bi bi-book-half text-white" style={{ fontSize: 36, opacity: 0.8 }} />
                          </div>
                          <div className="card-body p-2">
                            <div className="fw-semibold text-dark text-truncate small">{n.title}</div>
                            <div className="text-muted" style={{ fontSize: "0.72rem" }}>{n.author}</div>
                            <div className="d-flex justify-content-between mt-1">
                              <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                                <i className="bi bi-star-fill text-warning me-1" />{n.rating}
                              </span>
                              <span className={`badge ${n.status === "Hoàn" ? "bg-success" : "bg-warning text-dark"}`}
                                style={{ fontSize: "0.6rem" }}>
                                {n.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <NovelFooter />
    </div>
  );
}
