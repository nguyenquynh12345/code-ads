import Link from "next/link";
import NovelHeader from "@/components/NovelHeader";
import NovelFooter from "@/components/NovelFooter";

const forumCategories = [
  {
    id: "trao-doi-truyen",
    icon: "bi-book-half",
    color: "#6366f1",
    name: "Trao đổi truyện",
    desc: "Thảo luận, đánh giá, giới thiệu truyện hay",
    threads: 18420,
    posts: 342100,
    lastPost: { user: "DragonSlayer99", title: "Đấu Phá chương mới cực đỉnh!", time: "2 phút trước" },
  },
  {
    id: "de-cu-truyen",
    icon: "bi-stars",
    color: "#e74c3c",
    name: "Đề cử truyện hay",
    desc: "Giới thiệu những bộ truyện đáng đọc nhất",
    threads: 9820,
    posts: 187300,
    lastPost: { user: "NightReader", title: "Top 10 truyện tiên hiệp hay nhất 2024", time: "15 phút trước" },
  },
  {
    id: "dich-thuat",
    icon: "bi-translate",
    color: "#0891b2",
    name: "Dịch thuật & Fan-fiction",
    desc: "Chia sẻ bản dịch, sáng tác fan-fiction",
    threads: 4310,
    posts: 98700,
    lastPost: { user: "TranslatorPro", title: "[Dịch] Nghịch Thiên Chí Tôn chương 450", time: "1 giờ trước" },
  },
  {
    id: "goc-doc-gia",
    icon: "bi-people",
    color: "#16a34a",
    name: "Góc độc giả",
    desc: "Tâm sự, chia sẻ cảm xúc sau khi đọc truyện",
    threads: 22100,
    posts: 541000,
    lastPost: { user: "EmotionalReader", title: "Khóc hết nước mắt vì cái kết này...", time: "30 phút trước" },
  },
  {
    id: "bao-loi",
    icon: "bi-bug",
    color: "#b45309",
    name: "Báo lỗi & Góp ý",
    desc: "Phản ánh lỗi website và đóng góp ý kiến",
    threads: 1230,
    posts: 18400,
    lastPost: { user: "TechUser", title: "Lỗi hiển thị chương trên mobile", time: "3 giờ trước" },
  },
  {
    id: "giai-tri",
    icon: "bi-emoji-laughing",
    color: "#7c3aed",
    name: "Giải trí & Linh tinh",
    desc: "Meme, gif, chủ đề ngoài truyện",
    threads: 8760,
    posts: 234000,
    lastPost: { user: "FunnyMeme", title: "Meme tháng này của cộng đồng TruyệnHay", time: "45 phút trước" },
  },
];

const hotThreads = [
  { title: "Top 20 truyện tiên hiệp hay nhất mọi thời đại — Bình chọn 2024", author: "TiênHiệpFan", category: "Đề cử truyện hay", replies: 342, views: "128K", time: "1 giờ trước", hot: true, pinned: true },
  { title: "[Thảo luận] Chương kết Đấu Phá Thương Khung — Cảm xúc của anh em?", author: "DragonSlayer99", category: "Trao đổi truyện", replies: 891, views: "234K", time: "2 giờ trước", hot: true, pinned: false },
  { title: "Giới thiệu: Hệ thống Vô Địch — Truyện ngắn nhưng cực kỳ chất lượng", author: "BookWorm2024", category: "Đề cử truyện hay", replies: 127, views: "45K", time: "3 giờ trước", hot: false, pinned: false },
  { title: "[Fan-fiction] Nếu Tiêu Viêm chọn con đường khác... (AU)", author: "FanWriter01", category: "Dịch thuật & Fan-fiction", replies: 256, views: "89K", time: "4 giờ trước", hot: true, pinned: false },
  { title: "Những câu quote bất hủ trong truyện tiên hiệp — Góc nhìn của mình", author: "QuoteCollector", category: "Góc độc giả", replies: 445, views: "167K", time: "5 giờ trước", hot: false, pinned: false },
  { title: "Anh em ơi, khóc hết nước mắt vì Tru Tiên mà không có ai chia sẻ", author: "EmotionalReader", category: "Góc độc giả", replies: 732, views: "312K", time: "6 giờ trước", hot: true, pinned: false },
  { title: "[Dịch] Chư Thiên Ký — Bản dịch chương 1200 đã ra mắt!", author: "TranslatorPro", category: "Dịch thuật & Fan-fiction", replies: 189, views: "67K", time: "8 giờ trước", hot: false, pinned: false },
  { title: "Meme tháng 3 của cộng đồng TruyệnHay — Hài quá không thể nhịn được", author: "FunnyMeme", category: "Giải trí & Linh tinh", replies: 564, views: "198K", time: "10 giờ trước", hot: false, pinned: false },
];

const activeUsers = [
  { name: "DragonSlayer99", posts: 4231, color: "#e74c3c" },
  { name: "NightReader", posts: 3187, color: "#6366f1" },
  { name: "TiênHiệpFan", posts: 2943, color: "#16a34a" },
  { name: "BookWorm2024", posts: 2541, color: "#b45309" },
  { name: "TranslatorPro", posts: 2134, color: "#0891b2" },
  { name: "FunnyMeme", posts: 1876, color: "#7c3aed" },
  { name: "EmotionalReader", posts: 1654, color: "#be185d" },
  { name: "QuoteCollector", posts: 1432, color: "#0f766e" },
];

const categoryColors: Record<string, string> = {
  "Trao đổi truyện": "#6366f1",
  "Đề cử truyện hay": "#e74c3c",
  "Dịch thuật & Fan-fiction": "#0891b2",
  "Góc độc giả": "#16a34a",
  "Báo lỗi & Góp ý": "#b45309",
  "Giải trí & Linh tinh": "#7c3aed",
};

export default function DienDanPage() {
  return (
    <div style={{ background: "#f5f5f0", minHeight: "100vh" }}>
      <NovelHeader />

      {/* Page header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)", borderBottom: "2px solid #e74c3c" }}>
        <div className="container py-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h4 className="fw-bold text-white mb-1">
                <i className="bi bi-chat-dots me-2 text-danger" />Diễn đàn TruyệnHay
              </h4>
              <p className="text-white-50 small mb-0">Cộng đồng độc giả, trao đổi và thảo luận về truyện chữ</p>
            </div>
            <div className="d-flex gap-2">
              <Link href="/tim-kiem" className="btn btn-sm btn-outline-light">
                <i className="bi bi-search me-1" />Tìm bài viết
              </Link>
              <button className="btn btn-sm" style={{ background: "#e74c3c", color: "#fff" }}>
                <i className="bi bi-pencil me-1" />Tạo chủ đề mới
              </button>
            </div>
          </div>

          {/* Forum stats */}
          <div className="d-flex gap-4 mt-3 flex-wrap">
            {[
              { label: "Thành viên", val: "2.1M", icon: "bi-people" },
              { label: "Chủ đề", val: "64,640", icon: "bi-chat-square-text" },
              { label: "Bài viết", val: "1,421,500", icon: "bi-chat-dots" },
              { label: "Online", val: "4,231", icon: "bi-circle-fill" },
            ].map((s) => (
              <div key={s.label} className="d-flex align-items-center gap-2">
                <i className={`bi ${s.icon} text-white-50`} style={{ fontSize: "0.9rem" }} />
                <div>
                  <div className="fw-bold text-white" style={{ fontSize: "0.9rem" }}>{s.val}</div>
                  <div className="text-white-50" style={{ fontSize: "0.7rem" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Main */}
          <div className="col-lg-8">

            {/* Forum categories */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <span style={{ width: 4, height: 16, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                Chuyên mục diễn đàn
              </h6>
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                {forumCategories.map((cat, i) => (
                  <Link key={cat.id} href={`/dien-dan/${cat.id}`}
                    className="text-decoration-none"
                    style={{ borderBottom: i < forumCategories.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                    <div className="d-flex gap-3 align-items-center p-3 hover-card"
                      style={{ background: "#fff", transition: "background 0.1s" }}>
                      {/* Icon */}
                      <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                        style={{ width: 48, height: 48, background: cat.color + "18" }}>
                        <i className={`bi ${cat.icon}`} style={{ color: cat.color, fontSize: "1.3rem" }} />
                      </div>

                      {/* Info */}
                      <div className="flex-fill min-w-0">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="fw-semibold text-dark" style={{ fontSize: "0.92rem" }}>{cat.name}</span>
                        </div>
                        <p className="text-muted mb-1" style={{ fontSize: "0.78rem" }}>{cat.desc}</p>
                        <div className="d-flex gap-3 text-muted" style={{ fontSize: "0.72rem" }}>
                          <span><i className="bi bi-chat-square-text me-1" />{cat.threads.toLocaleString()} chủ đề</span>
                          <span><i className="bi bi-chat-dots me-1" />{cat.posts.toLocaleString()} bài viết</span>
                        </div>
                      </div>

                      {/* Last post */}
                      <div className="text-end d-none d-md-block flex-shrink-0" style={{ minWidth: 160 }}>
                        <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.78rem", maxWidth: 160 }}>
                          {cat.lastPost.title}
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                          bởi <span style={{ color: cat.color }}>{cat.lastPost.user}</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.68rem" }}>
                          <i className="bi bi-clock me-1" />{cat.lastPost.time}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Hot threads */}
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <span style={{ width: 4, height: 16, background: "#e74c3c", borderRadius: 2, display: "inline-block" }} />
                  <i className="bi bi-fire text-danger me-1" />Chủ đề nổi bật
                </h6>
                <Link href="/dien-dan/hot" className="text-decoration-none small" style={{ color: "#e74c3c" }}>
                  Xem tất cả <i className="bi bi-chevron-right" />
                </Link>
              </div>

              <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                {hotThreads.map((t, i) => (
                  <div key={i} className="p-3 hover-card"
                    style={{ borderBottom: i < hotThreads.length - 1 ? "1px solid #f0f0f0" : "none", background: "#fff" }}>
                    <div className="d-flex gap-3 align-items-start">
                      {/* Avatar */}
                      <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 text-white fw-bold"
                        style={{
                          width: 36, height: 36,
                          background: categoryColors[t.category] ?? "#666",
                          fontSize: "0.78rem"
                        }}>
                        {t.author.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="flex-fill min-w-0">
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                          {t.pinned && (
                            <span className="badge bg-secondary" style={{ fontSize: "0.6rem" }}>
                              <i className="bi bi-pin me-1" />Ghim
                            </span>
                          )}
                          {t.hot && (
                            <span className="badge bg-danger" style={{ fontSize: "0.6rem" }}>
                              <i className="bi bi-fire me-1" />Hot
                            </span>
                          )}
                          <span className="badge"
                            style={{
                              background: (categoryColors[t.category] ?? "#666") + "20",
                              color: categoryColors[t.category] ?? "#666",
                              fontSize: "0.6rem"
                            }}>
                            {t.category}
                          </span>
                        </div>

                        <Link href={`/dien-dan/thread/${i + 1}`}
                          className="text-decoration-none text-dark fw-semibold d-block mb-1"
                          style={{ fontSize: "0.88rem" }}>
                          {t.title}
                        </Link>

                        <div className="d-flex gap-3 text-muted" style={{ fontSize: "0.72rem" }}>
                          <span>bởi <strong style={{ color: categoryColors[t.category] }}>{t.author}</strong></span>
                          <span><i className="bi bi-chat me-1" />{t.replies}</span>
                          <span><i className="bi bi-eye me-1" />{t.views}</span>
                          <span><i className="bi bi-clock me-1" />{t.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">

            {/* Quick post */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-pencil-square me-2 text-danger" />Tạo chủ đề mới
                </h6>
                <div className="mb-2">
                  <select className="form-select form-select-sm border-0 mb-2" style={{ background: "#f8f8f8" }}>
                    <option>Chọn chuyên mục...</option>
                    {forumCategories.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <input type="text" className="form-control form-control-sm border-0 mb-2"
                    placeholder="Tiêu đề chủ đề..."
                    style={{ background: "#f8f8f8" }} />
                  <textarea className="form-control form-control-sm border-0" rows={3}
                    placeholder="Nội dung..."
                    style={{ background: "#f8f8f8", resize: "none" }} />
                </div>
                <button className="btn btn-sm w-100" style={{ background: "#e74c3c", color: "#fff" }}>
                  <i className="bi bi-send me-1" />Đăng ngay
                </button>
              </div>
            </div>

            {/* Active users */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-trophy me-2 text-warning" />Thành viên tích cực
                </h6>
                {activeUsers.map((u, i) => (
                  <div key={u.name} className="d-flex align-items-center gap-3 mb-3">
                    <div className="fw-bold text-center flex-shrink-0"
                      style={{
                        width: 22, height: 22, fontSize: "0.72rem",
                        background: i < 3 ? ["#e74c3c", "#e67e22", "#f39c12"][i] : "#e0e0e0",
                        color: i < 3 ? "#fff" : "#666",
                        borderRadius: "50%", lineHeight: "22px"
                      }}>
                      {i + 1}
                    </div>
                    <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 text-white fw-bold"
                      style={{ width: 32, height: 32, background: u.color, fontSize: "0.75rem" }}>
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-fill min-w-0">
                      <div className="fw-semibold text-truncate" style={{ fontSize: "0.82rem" }}>{u.name}</div>
                      <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                        <i className="bi bi-chat-dots me-1" />{u.posts.toLocaleString()} bài viết
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Online users */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-circle-fill text-success me-2" style={{ fontSize: "0.7rem" }} />
                  Đang online
                  <span className="badge bg-success ms-2" style={{ fontSize: "0.7rem" }}>4,231</span>
                </h6>
                <div className="d-flex flex-wrap gap-1">
                  {["DragonSlayer99", "NightReader", "TiênHiệpFan", "BookWorm", "TransPro", "FunnyMeme", "Reader01", "LuckyDragon", "MoonLight", "SakuraMoon", "StarReader", "PhoenixRise"].map((u, i) => (
                    <span key={u} className="badge text-decoration-none"
                      style={{
                        background: ["#e74c3c", "#6366f1", "#16a34a", "#b45309", "#0891b2", "#7c3aed", "#be185d", "#0f766e"][i % 8] + "20",
                        color: ["#e74c3c", "#6366f1", "#16a34a", "#b45309", "#0891b2", "#7c3aed", "#be185d", "#0f766e"][i % 8],
                        fontSize: "0.72rem",
                        padding: "4px 8px"
                      }}>
                      {u}
                    </span>
                  ))}
                  <span className="badge" style={{ background: "#f0f0f0", color: "#888", fontSize: "0.72rem", padding: "4px 8px" }}>
                    +4,219 khác
                  </span>
                </div>
              </div>
            </div>

            {/* Forum rules */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-shield-check me-2 text-primary" />Nội quy diễn đàn
                </h6>
                <ul className="list-unstyled mb-0">
                  {[
                    "Tôn trọng các thành viên khác",
                    "Không spam, quảng cáo",
                    "Không đăng nội dung vi phạm",
                    "Viết tiêu đề rõ ràng, đúng chủ đề",
                    "Không tiết lộ spoiler quá nhiều",
                  ].map((rule, i) => (
                    <li key={i} className="d-flex gap-2 mb-2">
                      <i className="bi bi-check-circle-fill text-success mt-1" style={{ fontSize: "0.75rem", flexShrink: 0 }} />
                      <span className="text-muted" style={{ fontSize: "0.8rem" }}>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NovelFooter />
    </div>
  );
}
