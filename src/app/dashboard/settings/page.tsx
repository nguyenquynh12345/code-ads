"use client";

import { useState, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/components/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

const accentColors = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Orange", value: "#f97316" },
];

function getPasswordStrength(pw: string): { score: number; label: string; color: string; bg: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Rất yếu", color: "danger-emphasis", bg: "badge-soft-danger" };
  if (score === 2) return { score, label: "Yếu", color: "warning-emphasis", bg: "badge-soft-warning" };
  if (score === 3) return { score, label: "Trung bình", color: "info-emphasis", bg: "badge-soft-info" };
  if (score === 4) return { score, label: "Mạnh", color: "primary-emphasis", bg: "badge-soft-primary" };
  return { score, label: "Rất mạnh", color: "success-emphasis", bg: "badge-soft-success" };
}

export default function SettingsPage() {
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("account");
  const [avatarSrc, setAvatarSrc] = useState("https://ui-avatars.com/api/?name=Admin+User&size=100&background=6366f1&color=fff&bold=true");
  const [accentColor, setAccentColor] = useState("#6366f1");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [notifySettings, setNotifySettings] = useState({
    orders: true,
    comments: true,
    security: false,
    newsletter: false,
    updates: true,
    marketing: false,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const strength = newPassword ? getPasswordStrength(newPassword) : null;
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAvatarSrc(URL.createObjectURL(f));
  };

  const save = () => showToast("Đã lưu thay đổi", "success");

  const tabs = [
    { key: "account", icon: "bi-person", label: "Tài khoản" },
    { key: "security", icon: "bi-shield-lock", label: "Bảo mật" },
    { key: "appearance", icon: "bi-palette", label: "Giao diện" },
    { key: "notifications", icon: "bi-bell", label: "Thông báo" },
  ];

  return (
    <>
      <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Cài đặt hệ thống</h4>
        <p className="text-muted text-sm mb-0">Cấu hình tài khoản và tuỳ chọn ứng dụng</p>
      </div>

      <div className="row g-4">
        {/* Sidebar Nav */}
        <div className="col-lg-3">
          <div className="card content-card glass-card p-0 overflow-hidden shadow-sm">
            <div className="list-group list-group-flush border-0">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 px-4 border-0 transition-all fw-medium text-sm ${activeTab === tab.key ? "bg-primary bg-opacity-10 text-primary border-start border-4 border-primary fw-bold" : "text-secondary border-start border-4 border-transparent"}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <i className={`bi ${tab.icon} fs-5`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-lg-9">
          <div className="card content-card glass-card p-4 shadow-sm min-vh-60">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >

            {/* ── Tài khoản ── */}
            {activeTab === "account" && (
              <>
                <h6 className="fw-bold mb-4 px-1">Thông tin tài khoản</h6>
                {/* Avatar upload */}
                <div className="d-flex align-items-center gap-4 mb-4 p-4 bg-light bg-opacity-50 rounded-4 border">
                  <div className="position-relative">
                    <img src={avatarSrc} alt="avatar" className="rounded-circle shadow-sm border border-2 border-primary border-opacity-25" width={80} height={80} style={{ objectFit: "cover" }} />
                    <button
                      className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 shadow"
                      style={{ width: 28, height: 28, padding: 0 }}
                      onClick={() => fileRef.current?.click()}
                    >
                      <i className="bi bi-camera-fill" style={{ fontSize: "0.75rem" }} />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="d-none" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <div className="fw-bold mb-1">Ảnh đại diện</div>
                    <div className="text-secondary text-xs mb-2">JPG, PNG hoặc GIF. Tối đa 2MB.</div>
                    <button className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => fileRef.current?.click()}>
                      Thay đổi ảnh
                    </button>
                  </div>
                </div>
                <div className="row g-3 px-1">
                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Họ</label>
                    <input className="form-control bg-light text-sm fw-medium p-2" defaultValue="Nguyễn Văn" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Tên</label>
                    <input className="form-control bg-light text-sm fw-medium p-2" defaultValue="Admin" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Email</label>
                    <input type="email" className="form-control bg-light text-sm fw-medium p-2" defaultValue="admin@myapp.com" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Số điện thoại</label>
                    <input className="form-control bg-light text-sm fw-medium p-2" defaultValue="0901 234 567" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Ngôn ngữ</label>
                    <select className="form-select bg-light text-sm fw-medium p-2">
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Múi giờ</label>
                    <select className="form-select bg-light text-sm fw-medium p-2">
                      <option>Asia/Ho_Chi_Minh (GMT+7)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Giới thiệu</label>
                    <textarea className="form-control bg-light text-sm fw-medium p-2" rows={3} defaultValue="Quản trị viên hệ thống với 5+ năm kinh nghiệm." />
                  </div>
                  <div className="col-12 mt-4">
                    <button className="btn btn-primary px-4 me-2 fw-bold shadow-sm rounded-pill" onClick={save}><i className="bi bi-check2 me-1" />Lưu thay đổi</button>
                    <button className="btn btn-light px-4 fw-bold rounded-pill text-secondary">Hủy</button>
                  </div>
                </div>
              </>
            )}

            {/* ── Bảo mật ── */}
            {activeTab === "security" && (
              <>
                <h6 className="fw-bold mb-4 px-1">Bảo mật tài khoản</h6>
                <div className="row g-3 px-1">
                  <div className="col-12">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      className="form-control bg-light text-sm fw-medium p-2"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Mật khẩu mới</label>
                    <input
                      type="password"
                      className={`form-control bg-light text-sm fw-medium p-2 ${newPassword ? (strength!.score >= 3 ? "is-valid" : "is-invalid") : ""}`}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                    {/* Strength indicator */}
                    {newPassword && (
                      <div className="mt-2 text-center p-2 rounded-3 border bg-light bg-opacity-50">
                        <div className="d-flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`flex-grow-1 rounded-pill`}
                              style={{ height: 4, background: i <= strength!.score ? (i<=2 ? "#ef4444" : "#22c55e") : "rgba(0,0,0,0.1)", transition: "background 0.3s" }} />
                          ))}
                        </div>
                        <span className={`text-xs fw-bold text-uppercase ${strength!.color}`}>{strength!.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      className={`form-control bg-light text-sm fw-medium p-2 ${confirmPassword ? (passwordsMatch ? "is-valid" : "is-invalid") : ""}`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    {confirmPassword && !passwordsMatch && (
                      <div className="invalid-feedback text-xs fw-bold">Mật khẩu không khớp</div>
                    )}
                  </div>
                  <div className="col-12">
                    <div className="alert-custom d-flex gap-3 p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-20 small">
                      <i className="bi bi-info-circle-fill fs-5 text-primary" />
                      <div className="text-primary-emphasis fw-medium">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt để đảm bảo an toàn tối đa.</div>
                    </div>
                  </div>
                  <div className="col-12 mt-4">
                    <button
                      className="btn btn-primary px-4 fw-bold shadow-sm rounded-pill"
                      disabled={!passwordsMatch || !currentPassword || !strength || strength.score < 2}
                      onClick={() => { showToast("Đã đổi mật khẩu thành công", "success"); setNewPassword(""); setConfirmPassword(""); setCurrentPassword(""); }}
                    >
                      <i className="bi bi-lock-fill me-1" />Đổi mật khẩu
                    </button>
                  </div>
                </div>

                <hr className="my-5 opacity-5" />
                <h6 className="fw-bold mb-3 px-1">Phiên đăng nhập gần đây</h6>
                {[
                  { device: "Chrome trên Windows", ip: "192.168.1.100", time: "Hiện tại", current: true },
                  { device: "Safari trên iPhone", ip: "203.162.10.55", time: "2 giờ trước", current: false },
                  { device: "Firefox trên macOS", ip: "115.79.88.10", time: "Hôm qua", current: false },
                ].map((s, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between py-3 px-1 border-bottom border-opacity-10">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light rounded-3 p-2 border shadow-sm"><i className={`bi ${i === 1 ? "bi-phone" : "bi-laptop"} text-secondary`} /></div>
                      <div>
                        <div className="fw-bold text-sm text-dark-emphasis">{s.device}</div>
                        <div className="text-secondary text-xs fw-medium">{s.ip} · {s.time}</div>
                      </div>
                    </div>
                    {s.current ? (
                      <span className="badge badge-soft-success rounded-pill px-3 py-1 font-monospace text-xs fw-bold">HIỆN TẠI</span>
                    ) : (
                      <button className="btn btn-sm btn-outline-danger rounded-pill px-3 text-xs fw-bold transition-all hover-shadow">ĐĂNG XUẤT</button>
                    )}
                  </div>
                ))}
              </>
            )}

            {/* ── Giao diện ── */}
            {activeTab === "appearance" && (
              <>
                <h6 className="fw-bold mb-4 px-1">Tuỳ chỉnh giao diện</h6>

                {/* Dark/Light mode */}
                <div className="mb-5 px-1">
                  <label className="form-label text-xs fw-bold text-uppercase text-secondary mb-3">Chế độ hiển thị</label>
                  <div className="row g-3">
                    {[
                      { value: "light", label: "Sáng", icon: "bi-sun-fill", desc: "Tối ưu cho môi trường ánh sáng mạnh" },
                      { value: "dark", label: "Tối", icon: "bi-moon-stars-fill", desc: "Giảm mỏi mắt trong bóng tối" },
                    ].map(opt => (
                      <div className="col-6" key={opt.value}>
                        <div
                          className={`p-4 rounded-4 border-2 text-center transition-all ${theme === opt.value ? "border-primary bg-primary bg-opacity-10 shadow-sm" : "border-opacity-10 shadow-none border"}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => { if (theme !== opt.value) toggleTheme(); }}
                        >
                          <i className={`bi ${opt.icon} fs-2 d-block mb-3 ${theme === opt.value ? "text-primary" : "text-secondary opacity-50"}`} />
                          <div className={`fw-bold text-sm ${theme === opt.value ? "text-primary-emphasis" : "text-secondary"}`}>{opt.label}</div>
                          <div className="text-secondary text-xs mt-1" style={{ opacity: 0.8 }}>{opt.desc}</div>
                          {theme === opt.value && <div className="badge badge-soft-primary rounded-pill mt-3 px-3 fw-bold">SỬ DỤNG</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div className="mb-4 px-1">
                  <label className="form-label text-xs fw-bold text-uppercase text-secondary mb-3">Màu chủ đạo</label>
                  <div className="d-flex gap-4 flex-wrap">
                    {accentColors.map(c => (
                      <div key={c.value} className="text-center">
                        <button
                          className={`rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm transition-all hover-scale`}
                          style={{
                            width: 44, height: 44,
                            background: c.value,
                            boxShadow: accentColor === c.value ? `0 0 0 3px white, 0 0 0 5px ${c.value}, 0 4px 6px rgba(0,0,0,0.1)` : "none",
                            transform: accentColor === c.value ? "scale(1.1)" : "scale(1)",
                          }}
                          onClick={() => setAccentColor(c.value)}
                          title={c.name}
                        >
                          {accentColor === c.value && <i className="bi bi-check-lg text-white fw-bold fs-5" />}
                        </button>
                        <div className={`mt-2 text-xs fw-bold text-uppercase ${accentColor === c.value ? "text-dark-emphasis" : "text-muted"}`}>{c.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Thông báo ── */}
            {activeTab === "notifications" && (
              <>
                <h6 className="fw-bold mb-4 px-1">Cài đặt thông báo</h6>
                <p className="text-secondary text-sm mb-4 px-1">Chọn loại thông báo bạn muốn nhận qua hệ thống và email. Tinh chỉnh theo nhu cầu của bạn.</p>
                {[
                  { key: "orders" as const, icon: "bi-bag-check-fill", label: "Đơn hàng mới", desc: "Nhận thông báo tức thì khi có đơn hàng thành công" },
                  { key: "comments" as const, icon: "bi-chat-dots-fill", label: "Bình luận", desc: "Thông báo khi có tương tác trên bài viết hoặc sản phẩm" },
                  { key: "security" as const, icon: "bi-shield-fill-check", label: "Cảnh báo bảo mật", desc: "Thông báo về các hoạt động đăng nhập không rõ nguồn gốc" },
                  { key: "newsletter" as const, icon: "bi-envelope-paper-fill", label: "Bản tin tổng hợp", desc: "Báo cáo tóm tắt hàng tuần về doanh thu và người dùng" },
                  { key: "updates" as const, icon: "bi-lightning-fill", label: "Tính năng mới", desc: "Luôn là người đầu tiên biết về các cập nhật phần mềm" },
                  { key: "marketing" as const, icon: "bi-megaphone-fill", label: "Chiến dịch quảng cáo", desc: "Ưu đãi và chương trình khuyến mãi theo mùa" },
                ].map((item, idx) => (
                  <div key={item.key} className="d-flex align-items-center justify-content-between py-4 border-bottom border-opacity-10 px-1 hover-bg-light transition-all rounded-3">
                    <div className="d-flex align-items-center gap-4">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-4 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 44, height: 44 }}>
                        <i className={`bi ${item.icon} fs-5`} />
                      </div>
                      <div>
                        <div className="fw-bold text-sm text-dark-emphasis">{item.label}</div>
                        <div className="text-secondary text-xs opacity-75">{item.desc}</div>
                      </div>
                    </div>
                    <div className="form-check form-switch mb-0 ms-3">
                      <input
                        className="form-check-input shadow-sm"
                        type="checkbox"
                        style={{ height: 24, width: 48, cursor: "pointer" }}
                        checked={notifySettings[item.key]}
                        onChange={() => setNotifySettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      />
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary px-5 mt-5 fw-bold shadow rounded-pill" onClick={save}>
                  <i className="bi bi-check2-circle me-2" />LƯU CẤU HÌNH
                </button>
              </>
            )}
            </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      </motion.div>
      <style jsx>{`
        .hover-scale:hover { transform: scale(1.1); }
        .hover-shadow:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .hover-bg-light:hover { background: var(--sidebar-hover); }
      `}</style>
    </>
  );
}
