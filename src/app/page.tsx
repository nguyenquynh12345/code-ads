import Link from "next/link";

export default function Home() {
  const features = [
    { icon: "bi-speedometer2", title: "Hiệu suất cao", desc: "Xây dựng trên Next.js 14 với App Router, tối ưu tốc độ tải trang và SEO." },
    { icon: "bi-palette2", title: "Bootstrap 5", desc: "Giao diện đẹp, responsive hoàn hảo trên mọi thiết bị với Bootstrap 5." },
    { icon: "bi-shield-check", title: "Bảo mật", desc: "Tích hợp xác thực, phân quyền và các biện pháp bảo mật hiện đại." },
    { icon: "bi-grid-1x2", title: "Đa màn hình", desc: "Sẵn có dashboard, trang đăng nhập, quản lý người dùng và nhiều hơn nữa." },
    { icon: "bi-code-slash", title: "TypeScript", desc: "Toàn bộ codebase viết bằng TypeScript giúp phát triển an toàn hơn." },
    { icon: "bi-lightning-charge", title: "Dễ mở rộng", desc: "Cấu trúc rõ ràng, dễ thêm tính năng và tích hợp với các dịch vụ bên ngoài." },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "Miễn phí",
      desc: "Phù hợp cho cá nhân và dự án nhỏ",
      features: ["5 người dùng", "10GB lưu trữ", "Hỗ trợ qua email", "Cập nhật miễn phí"],
      btnClass: "btn-outline-primary",
      popular: false,
    },
    {
      name: "Pro",
      price: "₫299K",
      period: "/tháng",
      desc: "Dành cho team và doanh nghiệp vừa",
      features: ["50 người dùng", "100GB lưu trữ", "Hỗ trợ ưu tiên", "API access", "Analytics nâng cao"],
      btnClass: "btn-primary",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Liên hệ",
      desc: "Giải pháp tùy chỉnh cho doanh nghiệp lớn",
      features: ["Không giới hạn", "Lưu trữ tuỳ chỉnh", "Hỗ trợ 24/7", "SLA đảm bảo", "Triển khai riêng"],
      btnClass: "btn-outline-dark",
      popular: false,
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg landing-nav sticky-top">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <div className="bg-primary rounded-2 d-flex align-items-center justify-content-center"
              style={{ width: 34, height: 34 }}>
              <i className="bi bi-lightning-fill text-white" />
            </div>
            <span className="fw-bold text-dark">MyApp</span>
          </a>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav mx-auto gap-1">
              <li className="nav-item">
                <a href="/#tính năng" className="nav-link text-dark px-3">Tính năng</a>
              </li>
              <li className="nav-item">
                <a href="/#bảng giá" className="nav-link text-dark px-3">Bảng giá</a>
              </li>
              <li className="nav-item">
                <Link href="/blog" className="nav-link text-dark px-3">Blog</Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link text-dark px-3">Liên hệ</Link>
              </li>
            </ul>
            <div className="d-flex gap-2">
              <Link href="/login" className="btn btn-outline-primary">Đăng nhập</Link>
              <Link href="/register" className="btn btn-primary">Dùng thử miễn phí</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section d-flex align-items-center py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <span className="badge bg-white bg-opacity-25 text-white mb-3 px-3 py-2">
                <i className="bi bi-stars me-1" />Mới: Phiên bản 2.0 đã ra mắt
              </span>
              <h1 className="display-4 fw-bold mb-4 lh-sm">
                Giải pháp quản lý<br />
                <span style={{ color: "#c4b5fd" }}>toàn diện</span> cho doanh nghiệp
              </h1>
              <p className="lead mb-5 text-white-75" style={{ opacity: 0.85 }}>
                Xây dựng ứng dụng web hiện đại với Next.js và Bootstrap 5.
                Dashboard đẹp, tính năng đầy đủ, dễ tùy chỉnh.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/dashboard" className="btn btn-light btn-lg px-5 fw-semibold text-primary">
                  <i className="bi bi-play-circle me-2" />Xem demo
                </Link>
                <Link href="/register" className="btn btn-outline-light btn-lg px-5">
                  Bắt đầu ngay →
                </Link>
              </div>

              <div className="d-flex align-items-center gap-4 mt-5 pt-2">
                {[
                  { value: "10K+", label: "Người dùng" },
                  { value: "500+", label: "Doanh nghiệp" },
                  { value: "99.9%", label: "Uptime" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="fw-bold h4 mb-0 text-white">{stat.value}</div>
                    <div className="text-white-50 small">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="card border-0 rounded-4 shadow-lg p-3" style={{ background: "rgba(255,255,255,0.95)" }}>
                {/* Mini dashboard preview */}
                <div className="d-flex gap-2 mb-3">
                  <div className="rounded-circle bg-danger" style={{ width: 12, height: 12 }} />
                  <div className="rounded-circle bg-warning" style={{ width: 12, height: 12 }} />
                  <div className="rounded-circle bg-success" style={{ width: 12, height: 12 }} />
                </div>
                <div className="row g-2 mb-3">
                  {[
                    { label: "Doanh thu", val: "₫48.2M", icon: "bi-currency-dollar", bg: "bg-primary" },
                    { label: "Đơn hàng", val: "3,821", icon: "bi-bag", bg: "bg-success" },
                    { label: "Người dùng", val: "12,450", icon: "bi-people", bg: "bg-warning" },
                  ].map((s) => (
                    <div className="col-4" key={s.label}>
                      <div className={`${s.bg} text-white rounded-3 p-2 text-center`}>
                        <i className={`bi ${s.icon} d-block mb-1`} />
                        <div className="fw-bold small">{s.val}</div>
                        <div style={{ fontSize: "0.65rem", opacity: 0.85 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-light rounded-3 p-2 mb-2">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="bg-primary rounded" style={{ width: 4, height: 16 }} />
                    <small className="fw-medium">Biểu đồ doanh thu tuần</small>
                  </div>
                  <div className="d-flex align-items-end gap-1" style={{ height: 60 }}>
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-fill bg-primary rounded-top" style={{ height: `${h}%`, opacity: 0.7 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="tính năng" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 mb-3">Tính năng</span>
            <h2 className="fw-bold display-6">Mọi thứ bạn cần trong một nơi</h2>
            <p className="text-muted col-lg-6 mx-auto">
              Bộ template hoàn chỉnh với các trang và component thường dùng nhất
            </p>
          </div>
          <div className="row g-4">
            {features.map((f) => (
              <div className="col-md-6 col-lg-4" key={f.title}>
                <div className="p-4 h-100 rounded-4 border hover-card" style={{ transition: "all 0.2s" }}>
                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 48, height: 48 }}>
                    <i className={`bi ${f.icon} fs-4`} />
                  </div>
                  <h5 className="fw-semibold mb-2">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="bảng giá" className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 mb-3">Bảng giá</span>
            <h2 className="fw-bold display-6">Giá cả minh bạch</h2>
            <p className="text-muted">Chọn gói phù hợp với nhu cầu của bạn</p>
          </div>
          <div className="row g-4 justify-content-center">
            {pricing.map((plan) => (
              <div className="col-md-6 col-lg-4" key={plan.name}>
                <div className={`card h-100 border-0 rounded-4 shadow-sm ${plan.popular ? "border border-primary border-2" : ""}`}>
                  {plan.popular && (
                    <div className="card-header bg-primary text-white text-center border-0 rounded-top-4 py-2">
                      <small className="fw-semibold"><i className="bi bi-star-fill me-1" />Phổ biến nhất</small>
                    </div>
                  )}
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-1">{plan.name}</h5>
                    <p className="text-muted small mb-3">{plan.desc}</p>
                    <div className="mb-4">
                      <span className="display-6 fw-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted">{plan.period}</span>}
                    </div>
                    <ul className="list-unstyled mb-4">
                      {plan.features.map((f) => (
                        <li key={f} className="d-flex align-items-center gap-2 mb-2">
                          <i className="bi bi-check-circle-fill text-success" />
                          <span className="small">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/register" className={`btn ${plan.btnClass} w-100`}>
                      Bắt đầu ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="container py-4 text-center text-white">
          <h2 className="fw-bold display-6 mb-3">Sẵn sàng bắt đầu?</h2>
          <p className="mb-4 text-white-75" style={{ opacity: 0.85 }}>
            Dùng thử miễn phí 14 ngày, không cần thẻ tín dụng
          </p>
          <Link href="/register" className="btn btn-light btn-lg px-5 fw-semibold text-primary me-3">
            Tạo tài khoản miễn phí
          </Link>
          <Link href="/login" className="btn btn-outline-light btn-lg px-5">
            Đăng nhập
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-primary rounded-2 d-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34 }}>
                  <i className="bi bi-lightning-fill text-white" />
                </div>
                <span className="fw-bold fs-5">MyApp</span>
              </div>
              <p className="text-secondary small">
                Giải pháp quản lý toàn diện cho doanh nghiệp hiện đại.
              </p>
            </div>
            {[
              { title: "Sản phẩm", links: [{ l: "Tính năng", h: "/#tính năng" }, { l: "Bảng giá", h: "/#bảng giá" }, { l: "Changelog", h: "#" }, { l: "Roadmap", h: "#" }] },
              { title: "Công ty", links: [{ l: "Về chúng tôi", h: "#" }, { l: "Blog", h: "/blog" }, { l: "Tuyển dụng", h: "#" }, { l: "Liên hệ", h: "/contact" }] },
            ].map((col) => (
              <div className="col-6 col-lg-2" key={col.title}>
                <h6 className="fw-semibold mb-3">{col.title}</h6>
                <ul className="list-unstyled">
                  {col.links.map((link) => (
                    <li key={link.l} className="mb-2">
                      <Link href={link.h} className="text-secondary text-decoration-none small">{link.l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-top border-secondary pt-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
            <small className="text-secondary">© 2024 MyApp. All rights reserved.</small>
            <div className="d-flex gap-3">
              {["bi-twitter-x", "bi-github", "bi-linkedin", "bi-facebook"].map((icon) => (
                <a key={icon} href="#" className="text-secondary fs-5">
                  <i className={`bi ${icon}`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
