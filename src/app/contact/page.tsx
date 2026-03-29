"use client";

import React from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function ContactPage() {
  const { showToast } = useToast();
  return (
    <div className="bg-light min-vh-100 pb-5">
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
              <li className="nav-item"><Link href="/blog" className="nav-link text-dark px-3">Blog</Link></li>
              <li className="nav-item"><Link href="/contact" className="nav-link text-primary fw-bold px-3">Liên hệ</Link></li>
            </ul>
             <div className="d-flex gap-2">
              <Link href="/register" className="btn btn-primary btn-sm">Bắt đầu ngay</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5 mb-3">Liên hệ với chúng tôi</h1>
          <p className="text-muted col-lg-6 mx-auto">
            Bạn có câu hỏi hay phản hồi? Hãy để lại thông tin, chúng tôi sẽ liên hệ lại sớm nhất có thể.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                <div className="col-md-5 bg-primary p-5 text-white">
                  <h4 className="fw-bold mb-4">Thông tin liên hệ</h4>
                  <p className="text-white-75 mb-5">Hãy kết nối với chúng tôi qua các kênh sau để được hỗ trợ tốt nhất.</p>
                  
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex align-items-start gap-3">
                      <i className="bi bi-geo-alt fs-5" />
                      <div>
                        <h6 className="mb-1 fw-bold">Văn phòng chính</h6>
                        <p className="small mb-0 text-white-75">123 Đường Láng, Đống Đa, Hà Nội, Việt Nam</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <i className="bi bi-telephone fs-5" />
                      <div>
                        <h6 className="mb-1 fw-bold">Điện thoại</h6>
                        <p className="small mb-0 text-white-75">+84 123 456 789</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <i className="bi bi-envelope fs-5" />
                      <div>
                        <h6 className="mb-1 fw-bold">Email</h6>
                        <p className="small mb-0 text-white-75">contact@myapp.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-5">
                    <h6 className="mb-3 fw-bold">Theo dõi chúng tôi</h6>
                    <div className="d-flex gap-3">
                      {["facebook", "twitter-x", "linkedin", "github"].map(icon => (
                        <a key={icon} href="#" className="text-white fs-5 opacity-75 hover-opacity-100">
                          <i className={`bi bi-${icon}`} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-7 p-5 bg-white">
                  <h4 className="fw-bold mb-4 text-dark">Gửi tin nhắn</h4>
                  <form onSubmit={(e) => { e.preventDefault(); showToast("Đã gửi tin nhắn! Chúng tôi sẽ liên hệ lại sớm.", "success"); }}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-medium">Họ và tên</label>
                        <input type="text" className="form-control bg-light border-0 py-2" placeholder="Nguyễn Văn A" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-medium">Địa chỉ Email</label>
                        <input type="email" className="form-control bg-light border-0 py-2" placeholder="email@example.com" required />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-medium">Chủ đề</label>
                        <input type="text" className="form-control bg-light border-0 py-2" placeholder="Tôi cần tư vấn về..." required />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-medium">Lời nhắn</label>
                        <textarea className="form-control bg-light border-0 py-2" rows={5} placeholder="Nhập nội dung tin nhắn của bạn..." required></textarea>
                      </div>
                      <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-primary btn-lg w-100 py-3 shadow-primary">Gửi tin nhắn ngay</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
