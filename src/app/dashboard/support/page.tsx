"use client";

import React from "react";

const faqs = [
  {
    q: "Làm thế nào để thay đổi mật khẩu?",
    a: "Bạn có thể thay đổi mật khẩu trong mục Cài đặt -> Bảo mật. Nhập mật khẩu hiện tại và mật khẩu mới của bạn.",
  },
  {
    q: "Tôi có thể xuất dữ liệu sang Excel không?",
    a: "Có, hầu hết các bảng dữ liệu trong Dashboard đều có nút 'Xuất' (Export) ở góc trên bên phải.",
  },
  {
    q: "Làm sao để thêm thành viên mới vào nhóm?",
    a: "Vào mục Quản lý người dùng, nhấn nút 'Thêm người dùng' và nhập email của họ để gửi lời mời.",
  },
  {
    q: "Gói Pro có những tính năng gì nổi bật?",
    a: "Gói Pro bao gồm Analytics nâng cao, không giới hạn lưu trữ và hỗ trợ ưu tiên 24/7.",
  },
];

export default function SupportPage() {
  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Trung tâm hỗ trợ</h4>
        <p className="text-muted small mb-0">Chúng tôi luôn sẵn sàng giải đáp thắc mắc của bạn.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4">Câu hỏi thường gặp (FAQ)</h5>
            <div className="accordion accordion-flush" id="faqAccordion">
              {faqs.map((faq, i) => (
                <div className="accordion-item mb-3 border rounded-3 overflow-hidden" key={i}>
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed fw-medium"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#faq${i}`}
                    >
                      {faq.q}
                    </button>
                  </h2>
                  <div
                    id={`faq${i}`}
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body text-muted small">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4">Gửi yêu cầu hỗ trợ</h5>
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Chủ đề</label>
                  <select className="form-select border-0 bg-light">
                    <option>Hỗ trợ kỹ thuật</option>
                    <option>Vấn đề thanh toán</option>
                    <option>Góp ý tính năng</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Mức độ ưu tiên</label>
                  <select className="form-select border-0 bg-light">
                    <option>Thấp</option>
                    <option>Trung bình</option>
                    <option>Cao</option>
                    <option>Khẩn cấp</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Nội dung chi tiết</label>
                  <textarea className="form-control border-0 bg-light" rows={4} placeholder="Mô tả vấn đề bạn đang gặp phải..."></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary px-4">Gửi yêu cầu</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-primary text-white">
            <h5 className="fw-bold mb-3">Liên hệ trực tiếp</h5>
            <p className="small mb-4 text-white-75">Nếu bạn không tìm thấy câu trả lời, hãy liên hệ với chúng tôi qua các kênh sau:</p>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-white bg-opacity-25 rounded p-2">
                  <i className="bi bi-envelope" />
                </div>
                <span className="small">support@myapp.com</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-white bg-opacity-25 rounded p-2">
                  <i className="bi bi-chat-dots" />
                </div>
                <span className="small">Live Chat (24/7)</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-white bg-opacity-25 rounded p-2">
                  <i className="bi bi-telephone" />
                </div>
                <span className="small">+84 123 456 789</span>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Tài liệu hướng dẫn</h5>
            <p className="text-muted small mb-4">Xem chi tiết các hướng dẫn sử dụng tính năng của hệ thống.</p>
            <a href="#" className="btn btn-outline-dark btn-sm w-100 mb-2">Xem tài liệu (Wiki)</a>
            <a href="#" className="btn btn-outline-dark btn-sm w-100">Video hướng dẫn</a>
          </div>
        </div>
      </div>
    </div>
  );
}
