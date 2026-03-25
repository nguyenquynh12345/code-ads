"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <>
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Hồ sơ cá nhân</h4>
        <p className="text-muted small mb-0">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="card content-card text-center p-4">
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&size=100&background=6366f1&color=fff"
                alt="avatar"
                className="rounded-circle"
                width={100}
                height={100}
              />
              <button
                className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0"
                style={{ width: 28, height: 28, padding: 0 }}
              >
                <i className="bi bi-camera-fill" style={{ fontSize: "0.7rem" }} />
              </button>
            </div>
            <h5 className="fw-bold mb-1">Nguyễn Văn Admin</h5>
            <p className="text-muted small mb-3">admin@myapp.com</p>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 mb-4">
              Administrator
            </span>

            <div className="row g-2 text-center border-top pt-3">
              <div className="col-4">
                <div className="fw-bold">48</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>Projects</div>
              </div>
              <div className="col-4 border-start border-end">
                <div className="fw-bold">1.2K</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>Tasks</div>
              </div>
              <div className="col-4">
                <div className="fw-bold">4.8</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="col-lg-8">
          <div className="card content-card">
            <div className="card-header bg-transparent border-bottom">
              <ul className="nav nav-tabs card-header-tabs">
                {[
                  { key: "info", label: "Thông tin", icon: "bi-person" },
                  { key: "security", label: "Bảo mật", icon: "bi-shield-lock" },
                  { key: "notifications", label: "Thông báo", icon: "bi-bell" },
                ].map((tab) => (
                  <li className="nav-item" key={tab.key}>
                    <button
                      className={`nav-link d-flex align-items-center gap-1 ${activeTab === tab.key ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      <i className={`bi ${tab.icon}`} />
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-body p-4">
              {activeTab === "info" && (
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Họ</label>
                      <input className="form-control" defaultValue="Nguyễn Văn" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Tên</label>
                      <input className="form-control" defaultValue="Admin" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Email</label>
                      <input className="form-control" defaultValue="admin@myapp.com" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Số điện thoại</label>
                      <input className="form-control" defaultValue="0901 234 567" />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-medium">Địa chỉ</label>
                      <input className="form-control" defaultValue="123 Nguyễn Huệ, Quận 1, TP.HCM" />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-medium">Giới thiệu</label>
                      <textarea className="form-control" rows={3}
                        defaultValue="Quản trị viên hệ thống với 5+ năm kinh nghiệm." />
                    </div>
                    <div className="col-12">
                      <button type="button" className="btn btn-primary px-4">
                        <i className="bi bi-check2 me-1" />Lưu thay đổi
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-medium">Mật khẩu hiện tại</label>
                      <input type="password" className="form-control" placeholder="••••••••" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Mật khẩu mới</label>
                      <input type="password" className="form-control" placeholder="••••••••" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Xác nhận mật khẩu</label>
                      <input type="password" className="form-control" placeholder="••••••••" />
                    </div>
                    <div className="col-12">
                      <div className="alert alert-info border-0 d-flex gap-2 align-items-start p-3">
                        <i className="bi bi-info-circle-fill mt-1" />
                        <div className="small">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="button" className="btn btn-primary px-4">
                        <i className="bi bi-lock me-1" />Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === "notifications" && (
                <div>
                  <p className="text-muted small mb-3">Chọn loại thông báo bạn muốn nhận</p>
                  {[
                    { label: "Đơn hàng mới", desc: "Nhận thông báo khi có đơn hàng mới", checked: true },
                    { label: "Bình luận", desc: "Thông báo khi có bình luận mới", checked: true },
                    { label: "Cảnh báo hệ thống", desc: "Thông báo các sự cố hệ thống", checked: false },
                    { label: "Bản tin email", desc: "Nhận email tổng kết hàng tuần", checked: false },
                  ].map((item, i) => (
                    <div key={i} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                      <div>
                        <div className="fw-medium small">{item.label}</div>
                        <div className="text-muted" style={{ fontSize: "0.78rem" }}>{item.desc}</div>
                      </div>
                      <div className="form-check form-switch mb-0">
                        <input className="form-check-input" type="checkbox" defaultChecked={item.checked} />
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-primary px-4 mt-3">
                    <i className="bi bi-check2 me-1" />Lưu cài đặt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
