import React from "react";
import Link from "next/link";

const blogPosts = [
  {
    slug: "huong-dan-bootstrap-5",
    title: "Hướng dẫn làm chủ Bootstrap 5 trong 15 phút",
    excerpt: "Tìm hiểu những tính năng mới nhất của Bootstrap 5 và cách áp dụng vào dự án của bạn một cách hiệu quả.",
    date: "20 Th3, 2024",
    author: "Admin",
    category: "Thiết kế",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
  },
  {
    slug: "nextjs-14-co-gi-moi",
    title: "Next.js 14 và sức mạnh của App Router",
    excerpt: "Khám phá các cải tiến về hiệu suất và trải nghiệm nhà phát triển trong phiên bản Next.js mới nhất.",
    date: "18 Th3, 2024",
    author: "Sơn Tùng",
    category: "Phát triển",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80",
  },
  {
    slug: "bi-quyet-toi-uu-seo",
    title: "Bí quyết tối ưu SEO cho ứng dụng React",
    excerpt: "Làm thế nào để ứng dụng React của bạn thân thiện với công cụ tìm kiếm và đạt thứ hạng cao.",
    date: "15 Th3, 2024",
    author: "Minh Anh",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    slug: "xu-huong-ui-ux-2024",
    title: "Xu hướng thiết kế UI/UX nổi bật năm 2024",
    excerpt: "Cập nhật các phong cách thiết kế đang làm mưa làm gió trong giới công nghệ hiện nay.",
    date: "12 Th3, 2024",
    author: "Thảo Vy",
    category: "Thiết kế",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
  },
  {
    slug: "quan-ly-state-trong-react",
    title: "Quản lý State trong React: Redux hay Context API?",
    excerpt: "So sánh và lựa chọn công cụ quản lý state phù hợp nhất cho quy mô dự án của bạn.",
    date: "10 Th3, 2024",
    author: "Admin",
    category: "Phát triển",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
  {
    slug: "bao-mat-ung-dung-web",
    title: "Các kỹ thuật bảo mật ứng dụng web hiện đại",
    excerpt: "Hướng dẫn bảo vệ ứng dụng của bạn khỏi các cuộc tấn công phổ biến như XSS hay CSRF.",
    date: "05 Th3, 2024",
    author: "Hoàng Long",
    category: "Bảo mật",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Navbar duplicate for landing style */}
       <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm mb-5">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
            <div className="bg-primary rounded-2 d-flex align-items-center justify-content-center"
              style={{ width: 34, height: 34 }}>
              <i className="bi bi-lightning-fill text-white" />
            </div>
            <span className="fw-bold text-dark">MyApp</span>
          </Link>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav mx-auto gap-1">
              <li className="nav-item"><Link href="/" className="nav-link text-dark px-3">Trang chủ</Link></li>
              <li className="nav-item"><Link href="/#tính năng" className="nav-link text-dark px-3">Tính năng</Link></li>
              <li className="nav-item"><Link href="/blog" className="nav-link text-primary fw-bold px-3">Blog</Link></li>
              <li className="nav-item"><Link href="/contact" className="nav-link text-dark px-3">Liên hệ</Link></li>
            </ul>
            <div className="d-flex gap-2">
              <Link href="/login" className="btn btn-outline-primary btn-sm">Đăng nhập</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5 mb-3">Blog & Tin tức</h1>
          <p className="text-muted col-lg-6 mx-auto">
            Cập nhật những thông tin mới nhất về công nghệ, thiết kế và các giải pháp quản lý doanh nghiệp.
          </p>
        </div>

        <div className="row g-4">
          {blogPosts.map((post) => (
            <div className="col-md-6 col-lg-4" key={post.slug}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card" style={{ transition: "all 0.3s" }}>
                <img src={post.image} className="card-img-top" alt={post.title} style={{ height: 200, objectFit: "cover" }} />
                <div className="card-body p-4">
                  <div className="mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1">{post.category}</span>
                  </div>
                  <h5 className="fw-bold mb-3">
                    <Link href={`/blog/${post.slug}`} className="text-dark text-decoration-none hover-primary">
                      {post.title}
                    </Link>
                  </h5>
                  <p className="text-muted small mb-4 line-clamp-2" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.excerpt}
                  </p>
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} className="rounded-circle" width={24} height={24} alt={post.author} />
                      <span className="small text-muted fw-medium">{post.author}</span>
                    </div>
                    <small className="text-muted">{post.date}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <button className="btn btn-primary px-5 py-2">Xem thêm bài viết</button>
        </div>
      </div>
    </div>
  );
}
