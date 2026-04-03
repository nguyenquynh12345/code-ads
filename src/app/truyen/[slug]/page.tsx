import Link from "next/link";
import NovelHeader from "@/components/NovelHeader";
import NovelFooter from "@/components/NovelFooter";

const relatedNovels = [
  { title: "Đấu Phá Thương Khung", color: "#6366f1", chapters: 1648, views: "125M" },
  { title: "Võ Luyện Đỉnh Phong", color: "#dc2626", chapters: 3462, views: "210M" },
  { title: "Phàm Nhân Tu Tiên", color: "#065f46", chapters: 2348, views: "145M" },
  { title: "Toàn Chức Pháp Sư", color: "#7c3aed", chapters: 2892, views: "98M" },
  { title: "Tinh Thần Biến", color: "#1d4ed8", chapters: 3100, views: "88M" },
];

const comments = [
  { user: "DragonSlayer99", avatar: "#e74c3c", time: "5 phút trước", content: "Truyện hay quá, tác giả viết rất chi tiết và hấp dẫn. Đọc một hơi không nghỉ!", likes: 128 },
  { user: "NightReader", avatar: "#6366f1", time: "2 giờ trước", content: "Chương mới nhất cực kỳ hay, twist không ngờ đến. Mong tác giả ra chương tiếp nhanh thôi!", likes: 87 },
  { user: "TiênHiệpFan", avatar: "#16a34a", time: "5 giờ trước", content: "Nhân vật chính xây dựng rất tốt, không bị Mary Sue như nhiều truyện khác. Highly recommend!", likes: 64 },
  { user: "BookWorm2024", avatar: "#b45309", time: "1 ngày trước", content: "Mình đọc từ chương đầu đến giờ, câu chuyện phát triển rất logic và thú vị. Top tier!", likes: 203 },
  { user: "SakuraMoon", avatar: "#be185d", time: "2 ngày trước", content: "Thế giới quan của truyện này rất rộng lớn và chi tiết. Tác giả đã đầu tư rất nhiều công sức.", likes: 156 },
];

function generateChapters(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    num: count - i,
    title: `Chương ${count - i}: ${["Phong Vân Biến", "Thiên Địa Chuyển", "Long Tranh Hổ Đấu", "Vạn Pháp Quy Tông", "Thiên Kiêu Xuất Thế"][i % 5]}`,
    time: `${Math.floor(Math.random() * 24) + 1}h trước`,
    new: i < 3,
  }));
}

export default function TruyenDetailPage({ params }: { params: { slug: string } }) {
  const title = decodeURIComponent(params.slug);
  const chapters = generateChapters(30);
  const color = "#6366f1";

  return (
    <div style={{ background: "#f5f5f0", minHeight: "100vh" }}>
      <NovelHeader />

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
        <div className="container py-2">
          <ol className="breadcrumb mb-0 small">
            <li className="breadcrumb-item"><Link href="/" className="text-decoration-none" style={{ color: "#e74c3c" }}>Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link href="/the-loai/Tiên%20Hiệp" className="text-decoration-none" style={{ color: "#e74c3c" }}>Tiên Hiệp</Link></li>
            <li className="breadcrumb-item active text-muted">{title}</li>
          </ol>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Main */}
          <div className="col-lg-8">

            {/* Novel info card */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-4">
                <div className="d-flex gap-4 flex-wrap">
                  {/* Cover */}
                  <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{ width: 140, height: 196, background: color }}>
                    <i className="bi bi-book-half text-white" style={{ fontSize: 56, opacity: 0.85 }} />
                  </div>

                  {/* Info */}
                  <div className="flex-fill">
                    <h4 className="fw-bold mb-1">{title}</h4>

                    <div className="d-flex flex-wrap gap-3 text-muted small mb-3">
                      <span><i className="bi bi-person me-1" />Thiên Tằm Thổ Đậu</span>
                      <span><i className="bi bi-tag me-1" />Tiên Hiệp</span>
                      <span><i className="bi bi-journal-text me-1" />1.648 chương</span>
                      <span><i className="bi bi-eye me-1" />125M lượt đọc</span>
                      <span><i className="bi bi-star-fill text-warning me-1" />4.8/5 (3.2K đánh giá)</span>
                    </div>

                    {/* Status */}
                    <div className="d-flex gap-2 mb-3 flex-wrap">
                      <span className="badge bg-success">Hoàn thành</span>
                      <span className="badge" style={{ background: color + "20", color }}>Tiên Hiệp</span>
                      <span className="badge bg-danger">Hot</span>
                      <span className="badge bg-warning text-dark">Classic</span>
                    </div>

                    {/* Stats */}
                    <div className="row g-2 mb-3">
                      {[
                        { label: "Chương", val: "1,648", icon: "bi-journal-text" },
                        { label: "Lượt đọc", val: "125M", icon: "bi-eye" },
                        { label: "Theo dõi", val: "2.3M", icon: "bi-bookmark" },
                        { label: "Đánh giá", val: "4.8★", icon: "bi-star" },
                      ].map((s) => (
                        <div key={s.label} className="col-6 col-sm-3">
                          <div className="text-center p-2 rounded-2" style={{ background: "#f8f8f8" }}>
                            <i className={`bi ${s.icon} d-block mb-1 text-muted`} style={{ fontSize: "1.1rem" }} />
                            <div className="fw-bold" style={{ fontSize: "0.85rem" }}>{s.val}</div>
                            <div className="text-muted" style={{ fontSize: "0.7rem" }}>{s.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2 flex-wrap">
                      <Link href={`/truyen/${params.slug}/chuong-1`}
                        className="btn btn-sm fw-semibold"
                        style={{ background: "#e74c3c", color: "#fff" }}>
                        <i className="bi bi-play-fill me-1" />Đọc từ đầu
                      </Link>
                      <Link href={`/truyen/${params.slug}/chuong-1648`}
                        className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-skip-end me-1" />Đọc chương mới nhất
                      </Link>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-bookmark me-1" />Theo dõi
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-share me-1" />Chia sẻ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 16, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  Giới thiệu
                </h6>
                <p className="text-muted" style={{ lineHeight: 1.8, fontSize: "0.92rem" }}>
                  Tại đại lục Đấu Khí, không có ma pháp, chỉ có đấu khí. Tiêu Viêm từ một thiên tài năm xưa bỗng trở thành phế vật, con đường trở lại đỉnh cao đầy gian nan và thử thách. Nhận được sự chỉ dạy của một linh hồn kỳ lạ ẩn trong chiếc nhẫn cổ, Tiêu Viêm từng bước vươn lên, đối mặt với những kẻ thù mạnh hơn mình hàng trăm lần.
                </p>
                <p className="text-muted" style={{ lineHeight: 1.8, fontSize: "0.92rem" }}>
                  Hành trình của cậu không chỉ là tìm lại danh dự của bản thân, mà còn phải giải mã bí ẩn về mẹ đã mất tích từ thuở nhỏ, vượt qua mọi nghịch cảnh để đạt đến cảnh giới cao nhất của Đấu Khí — Đấu Thánh, Đấu Tôn...
                </p>
                <p className="text-muted mb-0" style={{ lineHeight: 1.8, fontSize: "0.92rem" }}>
                  Đây là câu chuyện về ý chí, tình thân, tình yêu và sự kiên trì không bao giờ khuất phục trước số phận. Một trong những bộ truyện tiên hiệp kinh điển nhất mọi thời đại với hàng triệu độc giả trung thành trên toàn thế giới.
                </p>
              </div>
            </div>

            {/* Chapter list */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <span style={{ width: 4, height: 16, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                    Danh sách chương
                    <span className="badge bg-secondary ms-1" style={{ fontSize: "0.7rem" }}>1,648</span>
                  </h6>
                  <div className="d-flex gap-2">
                    <Link href="#" className="btn btn-sm btn-outline-secondary">Cũ nhất</Link>
                    <Link href="#" className="btn btn-sm" style={{ background: "#e74c3c", color: "#fff" }}>Mới nhất</Link>
                  </div>
                </div>

                <div className="row g-2">
                  {chapters.map((ch) => (
                    <div key={ch.num} className="col-12">
                      <Link href={`/truyen/${params.slug}/chuong-${ch.num}`}
                        className="d-flex align-items-center justify-content-between px-3 py-2 rounded-2 text-decoration-none"
                        style={{ background: "#f8f8f8", transition: "background 0.1s" }}>
                        <div className="d-flex align-items-center gap-2">
                          {ch.new && <span className="badge bg-danger" style={{ fontSize: "0.6rem" }}>Mới</span>}
                          <span className="text-dark" style={{ fontSize: "0.83rem" }}>{ch.title}</span>
                        </div>
                        <small className="text-muted">{ch.time}</small>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-3">
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-chevron-down me-1" />Xem tất cả 1,648 chương
                  </button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 16, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  Bình luận
                  <span className="badge bg-secondary" style={{ fontSize: "0.7rem" }}>3,241</span>
                </h6>

                {/* Comment form */}
                <div className="d-flex gap-3 mb-4">
                  <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{ width: 38, height: 38, background: "#e74c3c", color: "#fff", fontSize: "0.9rem" }}>
                    <i className="bi bi-person" />
                  </div>
                  <div className="flex-fill">
                    <textarea className="form-control border-0 mb-2" rows={3}
                      placeholder="Viết bình luận của bạn..."
                      style={{ background: "#f8f8f8", resize: "none", fontSize: "0.88rem" }} />
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Đăng nhập để bình luận</small>
                      <button className="btn btn-sm" style={{ background: "#e74c3c", color: "#fff" }}>
                        <i className="bi bi-send me-1" />Gửi
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comment list */}
                <div className="d-flex flex-column gap-4">
                  {comments.map((c, i) => (
                    <div key={i} className="d-flex gap-3">
                      <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 text-white fw-bold"
                        style={{ width: 38, height: 38, background: c.avatar, fontSize: "0.8rem" }}>
                        {c.user.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-fill">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="fw-semibold" style={{ fontSize: "0.85rem" }}>{c.user}</span>
                          <small className="text-muted">{c.time}</small>
                        </div>
                        <p className="mb-1 text-dark" style={{ fontSize: "0.88rem", lineHeight: 1.6 }}>{c.content}</p>
                        <div className="d-flex gap-3">
                          <button className="btn btn-link btn-sm text-muted p-0 text-decoration-none"
                            style={{ fontSize: "0.75rem" }}>
                            <i className="bi bi-heart me-1" />{c.likes}
                          </button>
                          <button className="btn btn-link btn-sm text-muted p-0 text-decoration-none"
                            style={{ fontSize: "0.75rem" }}>
                            <i className="bi bi-reply me-1" />Trả lời
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Related novels */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 16, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  Truyện cùng thể loại
                </h6>
                <div className="d-flex flex-column gap-3">
                  {relatedNovels.map((n) => (
                    <Link key={n.title} href={`/truyen/${encodeURIComponent(n.title)}`}
                      className="text-decoration-none d-flex gap-3 align-items-center">
                      <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                        style={{ width: 52, height: 72, background: n.color }}>
                        <i className="bi bi-book-half text-white" style={{ fontSize: 20, opacity: 0.85 }} />
                      </div>
                      <div className="flex-fill min-w-0">
                        <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.82rem" }}>{n.title}</div>
                        <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                          <i className="bi bi-journal-text me-1" />{n.chapters.toLocaleString()} chương
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                          <i className="bi bi-eye me-1" />{n.views} lượt đọc
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-3 text-center">
                <h6 className="fw-bold mb-3">Đánh giá truyện</h6>
                <div className="display-6 fw-bold mb-1" style={{ color: "#f59e0b" }}>4.8</div>
                <div className="mb-2">
                  {[1,2,3,4,5].map((s) => (
                    <i key={s} className={`bi bi-star${s <= 4 ? "-fill" : "-half"} text-warning me-1`} />
                  ))}
                </div>
                <div className="text-muted small mb-3">3,241 lượt đánh giá</div>
                {[5,4,3,2,1].map((star) => (
                  <div key={star} className="d-flex align-items-center gap-2 mb-1">
                    <small className="text-muted" style={{ width: 16 }}>{star}</small>
                    <i className="bi bi-star-fill text-warning" style={{ fontSize: "0.7rem" }} />
                    <div className="flex-fill bg-light rounded-pill" style={{ height: 6 }}>
                      <div className="rounded-pill" style={{
                        height: 6,
                        width: `${[75, 15, 6, 3, 1][5 - star]}%`,
                        background: "#f59e0b"
                      }} />
                    </div>
                    <small className="text-muted" style={{ width: 28 }}>{[75, 15, 6, 3, 1][5 - star]}%</small>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3">Tags</h6>
                <div className="d-flex flex-wrap gap-2">
                  {["Tu Tiên", "Đấu Khí", "Thiên Tài", "Phế Vật Phản Nghịch", "Tình Yêu", "Gia Tộc", "Đại Lục", "Mạo Hiểm", "Hài Hước", "Hành Động"].map((tag) => (
                    <Link key={tag} href={`/tim-kiem?tag=${tag}`}
                      className="badge text-decoration-none"
                      style={{ background: "#f0f0f0", color: "#555", fontSize: "0.75rem", padding: "5px 10px" }}>
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NovelFooter />
    </div>
  );
}
