import React from "react";
import Link from "next/link";

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  // Demo data - in reality, fetch by slug
  const post = {
    slug: params.slug,
    title: "Hướng dẫn làm chủ Bootstrap 5 trong 15 phút",
    content: `
      <p>Bootstrap 5 là phiên bản mới nhất của framework CSS phổ biến nhất thế giới. Trong bài viết này, chúng ta sẽ cùng điểm qua những thay đổi quan trọng và cách bắt đầu một dự án mới với Bootstrap 5.</p>
      
      <h4>1. Loại bỏ jQuery</h4>
      <p>Thay đổi lớn nhất trong Bootstrap 5 là việc loại bỏ hoàn toàn sự phụ thuộc vào jQuery. Giờ đây, Bootstrap sử dụng vanilla JavaScript, giúp giảm dung lượng file và tăng hiệu suất tải trang.</p>
      
      <h4>2. Cập nhật hệ thống Grid</h4>
      <p>Hệ thống grid được bổ sung thêm breakpoint mới (xxl cho màn hình trên 1400px). Các class gutter cũng được cải tiến để dễ dàng kiểm soát khoảng cách giữa các cột.</p>
      
      <h4>3. Utility API mới</h4>
      <p>Bootstrap 5 giới thiệu bộ Utility API mạnh mẽ, cho phép bạn tạo ra các class tiện ích tùy chỉnh một cách dễ dàng thông qua Sass.</p>
      
      <p>Kết luận: Bootstrap 5 mang đến sự hiện đại, nhẹ nhàng và linh hoạt hơn cho các nhà phát triển web. Nếu bạn đang bắt đầu một dự án mới, không có lý do gì để không chọn Bootstrap 5.</p>
    `,
    date: "20 Th3, 2024",
    author: "Admin",
    category: "Thiết kế",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80",
  };

  return (
    <div className="bg-white min-vh-100 pb-5">
      {/* Navbar */}
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
              <li className="nav-item"><Link href="/blog" className="nav-link text-primary fw-bold px-3">Blog</Link></li>
              <li className="nav-item"><Link href="/contact" className="nav-link text-dark px-3">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: 800 }}>
        <Link href="/blog" className="btn btn-link text-primary text-decoration-none p-0 mb-4 fw-medium">
          <i className="bi bi-arrow-left me-1" /> Quay lại Blog
        </Link>
        
        <div className="mb-4">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 mb-3">{post.category}</span>
          <h1 className="fw-bold display-6 mb-3">{post.title}</h1>
          <div className="d-flex align-items-center gap-3 text-muted small">
            <div className="d-flex align-items-center gap-2">
              <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} className="rounded-circle" width={28} height={28} alt={post.author} />
              <span className="fw-medium text-dark">{post.author}</span>
            </div>
            <span>•</span>
            <time>{post.date}</time>
            <span>•</span>
            <span>8 phút đọc</span>
          </div>
        </div>

        <img src={post.image} className="img-fluid rounded-4 mb-5 shadow-sm" alt={post.title} />

        <div className="blog-content mb-5 lh-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="border-top pt-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex gap-2">
              {["Bootstrap", "WebDev", "Frontend"].map(tag => (
                <span key={tag} className="badge border text-dark bg-light px-3 py-2 fw-normal">#{tag}</span>
              ))}
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-dark btn-sm rounded-pill px-3"><i className="bi bi-share me-1" /> Chia sẻ</button>
              <button className="btn btn-outline-dark btn-sm rounded-pill px-3"><i className="bi bi-bookmark me-1" /> Lưu</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
