import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

async function getData() {
  try {
    const [featuredRes, hotRes, newRes, rankingRes, categoriesRes, menusRes] = await Promise.all([
      fetch(`${API_BASE_URL}/posts/featured`, { next: { revalidate: 60 } }),
      fetch(`${API_BASE_URL}/posts/hot`, { next: { revalidate: 60 } }),
      fetch(`${API_BASE_URL}/posts/new-updates`, { next: { revalidate: 60 } }),
      fetch(`${API_BASE_URL}/posts/rankings`, { next: { revalidate: 60 } }),
      fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 60 } }),
      fetch(`${API_BASE_URL}/menus`, { next: { revalidate: 60 } }),
    ]);

    const featured = await featuredRes.json();
    const hotNovels = await hotRes.json();
    const newUpdates = await newRes.json();
    const rankings = await rankingRes.json();
    const categoryList = await categoriesRes.json();
    const menus = await menusRes.json();

    return { 
      featured: featured.length > 0 ? featured : null, 
      hotNovels: hotNovels.length > 0 ? hotNovels : null, 
      newUpdates: newUpdates.length > 0 ? newUpdates : null, 
      rankings: rankings.length > 0 ? { daily: rankings } : null,
      categoryList: categoryList.length > 0 ? categoryList : null,
      menus: menus.length > 0 ? menus : null
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { featured: null, hotNovels: null, newUpdates: null, rankings: null, categoryList: null, menus: null };
  }
}

import NovelHeader from "@/components/NovelHeader";
import NovelFooter from "@/components/NovelFooter";

function NovelCover({ color, icon = "bi-book-half", size = 80 }: { color: string; icon?: string; size?: number }) {
  return (
    <div
      className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
      style={{ width: size, height: size * 1.4, background: color, opacity: 0.9 }}
    >
      <i className={`bi ${icon} text-white`} style={{ fontSize: size * 0.35 }} />
    </div>
  );
}

export default async function Home() {
  const data = await getData();

  const genres = data.menus 
    ? data.menus.map((m: any) => m.title) 
    : ["Tiên Hiệp", "Kiếm Hiệp", "Ngôn Tình", "Đô Thị", "Huyền Huyễn", "Dị Giới", "Võng Du", "Trinh Thám", "Lịch Sử", "Xuyên Không"];

  const featuredData = data.featured || [
    {
      title: "Đấu Phá Thương Khung",
      author: { username: "Thiên Tàm Thổ Đậu" },
      category: { name: "Tiên Hiệp" },
      chapters: 1648,
      views: 125000000,
      description: "Tại đại lục Đấu Khí, không có ma pháp, chỉ có đấu khí...",
      color: "#6366f1",
      badge: "Hot",
    }
  ];

  const hotNovelsData = data.hotNovels || [
    { title: "Toàn Chức Pháp Sư", author: { username: "Loạn" }, category: { name: "Huyền Huyễn" }, chapters: 2892, views: 98000000, color: "#7c3aed", status: "Đang ra" },
  ];

  const newUpdatesData = data.newUpdates?.map((n: any) => ({
    title: n.title,
    chapter: `Chương ${n.chapters}`,
    time: "vừa xong",
    author: n.author?.username || "Ẩn danh"
  })) || [
    { title: "Trọng Sinh Chi Đô Thị Tu Tiên", chapter: "Chương 312", time: "5 phút trước", author: "Mộng Nhập Thần Cơ" },
  ];

  const rankingsData = data.rankings || {
    daily: [
      { title: "Long Vương Truyền Thuyết", author: { username: "Thiên Hạ Bá Xướng" }, views: 1200000 },
    ],
  };

  const categoryListData = data.categoryList?.map((c: any) => ({
    name: c.name,
    count: c.postCount || 0,
    icon: c.icon || "bi-book"
  })) || [
    { name: "Tiên Hiệp", count: 12430, icon: "bi-stars" },
  ];
  return (
    <div style={{ background: "#f5f5f0", minHeight: "100vh" }}>
      <NovelHeader />

      {/* ── Main ── */}
      <div className="container py-4">
        <div className="row g-4">

          {/* ── Left: main content ── */}
          <div className="col-lg-8">

            {/* Featured novels */}
            <div className="mb-4">
              <div className="row g-3">
                {/* Big featured */}
                <div className="col-md-6">
                  <div className="card border-0 h-100 shadow-sm rounded-3 overflow-hidden position-relative"
                    style={{ background: featuredData[0].color || "#6366f1", minHeight: 220 }}>
                    <div className="card-body d-flex flex-column justify-content-end p-3"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}>
                      <span className="badge bg-danger mb-1" style={{ width: "fit-content" }}>
                        <i className="bi bi-fire me-1" />{featuredData[0].badge || "Hot"}
                      </span>
                      <h5 className="fw-bold text-white mb-1">{featuredData[0].title}</h5>
                      <small className="text-white-50 mb-2">{featuredData[0].author?.username || "Tác giả"} · {featuredData[0].category?.name || "Thể loại"}</small>
                      <p className="text-white small mb-2" style={{ opacity: 0.85, fontSize: "0.78rem" }}>
                        {(featuredData[0].description || "").slice(0, 100)}...
                      </p>
                      <div className="d-flex gap-3">
                        <small className="text-white-50"><i className="bi bi-journal-text me-1" />{featuredData[0].chapters} chương</small>
                        <small className="text-white-50"><i className="bi bi-eye me-1" />{featuredData[0].views?.toLocaleString() || 0}</small>
                      </div>
                    </div>
                    <div className="position-absolute top-0 end-0 m-3">
                      <i className="bi bi-book-half text-white" style={{ fontSize: 60, opacity: 0.15 }} />
                    </div>
                  </div>
                </div>

                {/* Small featured */}
                <div className="col-md-6">
                  <div className="d-flex flex-column gap-3 h-100">
                    {featuredData.slice(1, 3).map((f: any) => (
                      <div key={f.title} className="card border-0 shadow-sm rounded-3 overflow-hidden flex-fill"
                        style={{ background: f.color || "#0891b2" }}>
                        <div className="card-body d-flex flex-column justify-content-end p-3"
                          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}>
                          <span className="badge bg-primary mb-1" style={{ width: "fit-content", fontSize: "0.7rem" }}>
                            {f.badge || "New"}
                          </span>
                          <div className="fw-semibold text-white" style={{ fontSize: "0.9rem" }}>{f.title}</div>
                          <small className="text-white-50" style={{ fontSize: "0.75rem" }}>{f.author?.username || "Tác giả"} · {f.chapters} chương</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hot novels */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 18, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  <i className="bi bi-fire text-danger me-1" />Truyện Hot
                </h6>
                <Link href="/blog" className="text-decoration-none small" style={{ color: "#e74c3c" }}>
                  Xem tất cả <i className="bi bi-chevron-right" />
                </Link>
              </div>

              <div className="row g-2">
                {hotNovelsData.map((n: any) => (
                  <div key={n.title} className="col-6 col-md-3">
                    <Link href={`/truyen/${encodeURIComponent(n.title)}`} className="text-decoration-none">
                      <div className="card border-0 shadow-sm rounded-3 h-100 hover-card" style={{ transition: "transform 0.15s" }}>
                        <div className="rounded-top-3 d-flex align-items-center justify-content-center"
                          style={{ height: 120, background: n.color || "#7c3aed" }}>
                          <i className="bi bi-book-half text-white" style={{ fontSize: 36, opacity: 0.8 }} />
                        </div>
                        <div className="card-body p-2">
                          <div className="fw-semibold text-dark small text-truncate">{n.title}</div>
                          <div className="text-muted" style={{ fontSize: "0.72rem" }}>{n.author?.username || "Tác giả"}</div>
                          <div className="d-flex justify-content-between align-items-center mt-1">
                            <span className="badge rounded-pill"
                              style={{ background: "#f0f0f0", color: "#555", fontSize: "0.65rem" }}>
                              {n.category?.name || "Thể loại"}
                            </span>
                            <span className={`badge ${n.status === "Hoàn" ? "bg-success" : "bg-warning text-dark"}`}
                              style={{ fontSize: "0.65rem" }}>
                              {n.status === 'published' ? 'Đang ra' : n.status}
                            </span>
                          </div>
                          <div className="text-muted mt-1" style={{ fontSize: "0.7rem" }}>
                            <i className="bi bi-journal-text me-1" />{n.chapters.toLocaleString()} chương
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* New updates */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 18, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  <i className="bi bi-clock-history text-primary me-1" />Mới Cập Nhật
                </h6>
                <Link href="/blog" className="text-decoration-none small" style={{ color: "#e74c3c" }}>
                  Xem tất cả <i className="bi bi-chevron-right" />
                </Link>
              </div>

              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-0">
                  {newUpdatesData.map((n: any, i: number) => (
                    <div key={n.title}
                      className={`d-flex align-items-center gap-3 px-3 py-2 ${i < newUpdatesData.length - 1 ? "border-bottom" : ""}`}
                      style={{ transition: "background 0.1s", cursor: "pointer" }}>
                      <span className="text-muted fw-bold" style={{ width: 20, fontSize: "0.8rem", textAlign: "center" }}>{i + 1}</span>
                      <div className="flex-fill min-w-0">
                        <div className="d-flex align-items-center gap-2">
                          <Link href={`/truyen/${encodeURIComponent(n.title)}`}
                            className="text-decoration-none text-dark fw-semibold text-truncate small"
                            style={{ maxWidth: 220 }}>
                            {n.title}
                          </Link>
                          <span className="badge bg-primary" style={{ fontSize: "0.65rem", flexShrink: 0 }}>
                            {n.chapter}
                          </span>
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.72rem" }}>{n.author}</div>
                      </div>
                      <small className="text-muted text-nowrap" style={{ fontSize: "0.7rem" }}>
                        <i className="bi bi-clock me-1" />{n.time}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Completed novels */}
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 18, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  <i className="bi bi-check-circle text-success me-1" />Truyện Đã Hoàn
                </h6>
                <Link href="/blog" className="text-decoration-none small" style={{ color: "#e74c3c" }}>
                  Xem tất cả <i className="bi bi-chevron-right" />
                </Link>
              </div>
              <div className="row g-2">
                {hotNovelsData.filter((n: any) => n.status === "Hoàn").map((n: any) => (
                  <div key={n.title} className="col-md-6">
                    <Link href={`/truyen/${encodeURIComponent(n.title)}`} className="text-decoration-none">
                      <div className="card border-0 shadow-sm rounded-3 hover-card" style={{ transition: "transform 0.15s" }}>
                        <div className="card-body d-flex gap-3 p-3">
                          <NovelCover color={n.color || "#065f46"} size={52} />
                          <div className="flex-fill min-w-0">
                            <div className="fw-semibold text-dark small text-truncate">{n.title}</div>
                            <div className="text-muted" style={{ fontSize: "0.72rem" }}>{n.author?.username || "Tác giả"}</div>
                            <div className="d-flex gap-2 mt-1">
                              <span className="badge bg-success" style={{ fontSize: "0.65rem" }}>Hoàn</span>
                              <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                                <i className="bi bi-eye me-1" />{n.views?.toLocaleString() || 0}
                              </span>
                              <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                                <i className="bi bi-journal-text me-1" />{n.chapters.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: sidebar ── */}
          <div className="col-lg-4">

            {/* Ranking */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-header border-0 pb-0 pt-3 px-3" style={{ background: "transparent" }}>
                <div className="d-flex gap-0 border-bottom">
                  <button className="btn btn-sm border-0 border-bottom border-danger border-2 rounded-0 fw-semibold px-3 pb-2"
                    style={{ color: "#e74c3c", fontSize: "0.82rem" }}>
                    <i className="bi bi-trophy me-1" />Ngày
                  </button>
                  <button className="btn btn-sm border-0 text-muted rounded-0 px-3 pb-2"
                    style={{ fontSize: "0.82rem" }}>Tuần</button>
                  <button className="btn btn-sm border-0 text-muted rounded-0 px-3 pb-2"
                    style={{ fontSize: "0.82rem" }}>Tháng</button>
                </div>
              </div>
              <div className="card-body p-0 pt-2">
                {rankingsData.daily.map((r: any, i: number) => (
                  <div key={r.title} className="d-flex align-items-center gap-2 px-3 py-2 border-bottom">
                    <div className="fw-bold text-center flex-shrink-0"
                      style={{
                        width: 24, height: 24, fontSize: "0.75rem",
                        background: i < 3 ? ["#e74c3c", "#e67e22", "#f39c12"][i] : "#e0e0e0",
                        color: i < 3 ? "#fff" : "#666",
                        borderRadius: "50%", lineHeight: "24px"
                      }}>
                      {i + 1}
                    </div>
                    <div className="flex-fill min-w-0">
                      <div className="fw-semibold text-truncate" style={{ fontSize: "0.82rem" }}>{r.title}</div>
                      <div className="text-muted" style={{ fontSize: "0.7rem" }}>{r.author?.username || "Tác giả"}</div>
                    </div>
                    <small className="text-muted text-nowrap" style={{ fontSize: "0.7rem" }}>
                      <i className="bi bi-eye me-1" />{r.views?.toLocaleString() || 0}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-header border-0 px-3 pt-3 pb-2" style={{ background: "transparent" }}>
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 16, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  Thể Loại
                </h6>
              </div>
              <div className="card-body px-3 pt-0 pb-2">
                <div className="row g-1">
                  {categoryListData.map((c: any) => (
                    <div key={c.name} className="col-6">
                      <Link href={`/the-loai/${encodeURIComponent(c.name)}`}
                        className="text-decoration-none d-flex align-items-center gap-2 py-2 px-2 rounded-2">
                        <i className={`bi ${c.icon} text-muted`} style={{ fontSize: "0.85rem" }} />
                        <span className="text-dark small flex-fill">{c.name}</span>
                        <span className="text-muted" style={{ fontSize: "0.7rem" }}>{c.count.toLocaleString()}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 16, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  Thống Kê
                </h6>
                {[
                  { icon: "bi-book", label: "Tổng số truyện", value: "95,420", color: "#6366f1" },
                  { icon: "bi-journal-text", label: "Tổng số chương", value: "12,340,000", color: "#0891b2" },
                  { icon: "bi-people", label: "Thành viên", value: "2,100,000", color: "#16a34a" },
                  { icon: "bi-eye", label: "Lượt đọc hôm nay", value: "8,400,000", color: "#e74c3c" },
                ].map((s) => (
                  <div key={s.label} className="d-flex align-items-center gap-3 mb-3">
                    <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                      style={{ width: 36, height: 36, background: s.color + "20" }}>
                      <i className={`bi ${s.icon}`} style={{ color: s.color }} />
                    </div>
                    <div>
                      <div className="fw-bold" style={{ fontSize: "0.9rem" }}>{s.value}</div>
                      <div className="text-muted" style={{ fontSize: "0.72rem" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <NovelFooter />
    </div>
  );
}
