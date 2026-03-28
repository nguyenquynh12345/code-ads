"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/components/ToastProvider";
import MediaPickerModal from "@/components/MediaPickerModal";
import { fetchWithAuth } from "@/lib/api";

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

interface Profile {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: string;
  phone: string;
  bio: string;
  language: string;
}

const emptyProfile: Profile = {
  id: 0, username: "", fullName: "", email: "",
  avatarUrl: "", role: "User", phone: "", bio: "", language: "vi",
};

export default function SettingsPage() {
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("account");
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [accentColor, setAccentColor] = useState("#6366f1");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [notifySettings, setNotifySettings] = useState({
    orders: true, comments: true, security: false,
    newsletter: false, updates: true, marketing: false,
  });
  const [isCronEnabled, setIsCronEnabled] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const strength = newPassword ? getPasswordStrength(newPassword) : null;
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored) as Profile;
      setProfile({ ...emptyProfile, ...parsed });
      // Refresh from API
      fetch(`http://localhost:3002/auth/profile/${parsed.id}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            setProfile({ ...emptyProfile, ...data });
            localStorage.setItem("user", JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
    fetchCronStatus();
  }, []);

  const fetchCronStatus = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:3002/system/settings/is_cron_enabled");
      if (res.ok) {
        const data = await res.json();
        setIsCronEnabled(data.value === "true");
      }
    } catch {}
  };

  const handleToggleCron = async (val: boolean) => {
    try {
      const res = await fetchWithAuth("http://localhost:3002/system/settings/is_cron_enabled", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val ? "true" : "false" }),
      });
      if (res.ok) {
        setIsCronEnabled(val);
        showToast(`Đã ${val ? "Bật" : "Tắt"} tác vụ tự động`, "success");
      } else if (res.status === 403) {
        showToast("Bạn không có quyền thực hiện thao tác này", "danger");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ", "danger");
    }
  };

  const handleAvatarSelect = async (url: string) => {
    try {
      setUploading(true);
      const updated = { ...profile, avatarUrl: url };
      const saveRes = await fetch("http://localhost:3002/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!saveRes.ok) { showToast("Cập nhật ảnh thất bại", "danger"); return; }
      setProfile(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new Event("userUpdated"));
      showToast("Ảnh đại diện đã được cập nhật!", "success");
    } catch { showToast("Lỗi kết nối máy chủ", "danger"); }
    finally { setUploading(false); }
  };

  const handleSaveAccount = async () => {
    try {
      setSaving(true);
      const res = await fetch("http://localhost:3002/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(profile));
        window.dispatchEvent(new Event("userUpdated"));
        showToast("Đã lưu thay đổi", "success");
      } else {
        showToast("Lưu thất bại", "danger");
      }
    } catch { showToast("Lỗi kết nối máy chủ", "danger"); }
    finally { setSaving(false); }
  };

  const save = () => showToast("Đã lưu thay đổi", "success");

  const tabs = [
    { key: "account", icon: "bi-person", label: "Tài khoản" },
    { key: "security", icon: "bi-shield-lock", label: "Bảo mật" },
    { key: "appearance", icon: "bi-palette", label: "Giao diện" },
    { key: "notifications", icon: "bi-bell", label: "Thông báo" },
    { key: "system", icon: "bi-cpu", label: "Hệ thống" },
  ];

  return (
    <div className="settings-container">
      <div className="mb-4 px-1">
        <h4 className="fw-bold mb-1">Cài đặt hệ thống</h4>
        <p className="text-muted text-sm mb-0">Cấu hình tài khoản và tuỳ chọn ứng dụng</p>
      </div>

      <div className="row g-4">
        {/* Sidebar Nav */}
        <div className="col-lg-3">
          <div className="card content-card glass-card p-0 overflow-hidden shadow-sm border-0">
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
          <div className="card content-card glass-card p-4 shadow-sm min-vh-60 border-0">
            <div className="tab-content-wrapper">
              <div key={activeTab}>

                {/* ── Tài khoản ── */}
                {activeTab === "account" && (
                  <>
                    <h6 className="fw-bold mb-4 px-1">Thông tin tài khoản</h6>
                    <div className="d-flex align-items-center gap-4 mb-4 p-4 bg-light bg-opacity-50 rounded-4 border">
                      <div className="position-relative">
                        <img
                          src={
                            profile.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || profile.username || "User")}&size=100&background=6366f1&color=fff&bold=true`
                          }
                          alt="avatar"
                          className="rounded-circle shadow-sm border border-2 border-primary border-opacity-25"
                          width={80} height={80} style={{ objectFit: "cover" }}
                        />
                        <button
                          className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 shadow d-flex align-items-center justify-content-center"
                          style={{ width: 28, height: 28, padding: 0 }}
                          onClick={() => setShowPicker(true)}
                          disabled={uploading}
                        >
                          {uploading
                            ? <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
                            : <i className="bi bi-camera-fill" style={{ fontSize: "0.75rem" }} />
                          }
                        </button>
                      </div>
                      <div>
                        <div className="fw-bold mb-1">Ảnh đại diện</div>
                        <div className="text-secondary text-xs mb-2">JPG, PNG hoặc GIF. Tối đa 2MB.</div>
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold shadow-sm"
                          onClick={() => setShowPicker(true)}
                          disabled={uploading}
                        >
                          {uploading ? "Đang tải lên..." : "Thay đổi ảnh"}
                        </button>
                      </div>
                    </div>

                    <div className="row g-3 px-1">
                      <div className="col-md-6">
                        <label className="form-label text-xs fw-bold text-uppercase text-secondary">Họ và tên</label>
                        <input
                          className="form-control bg-light text-sm fw-medium p-2"
                          placeholder="Nguyễn Văn A"
                          value={profile.fullName || ""}
                          onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-xs fw-bold text-uppercase text-secondary">Tên đăng nhập</label>
                        <input
                          className="form-control bg-light text-sm fw-medium p-2"
                          value={profile.username || ""}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-xs fw-bold text-uppercase text-secondary">Email</label>
                        <input
                          type="email"
                          className="form-control bg-light text-sm fw-medium p-2"
                          placeholder="admin@myapp.com"
                          value={profile.email || ""}
                          onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-xs fw-bold text-uppercase text-secondary">Số điện thoại</label>
                        <input
                          className="form-control bg-light text-sm fw-medium p-2"
                          placeholder="0901 234 567"
                          value={profile.phone || ""}
                          onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-xs fw-bold text-uppercase text-secondary">Ngôn ngữ</label>
                        <select
                          className="form-select bg-light text-sm fw-medium p-2"
                          value={profile.language || "vi"}
                          onChange={(e) => setProfile(p => ({ ...p, language: e.target.value }))}
                        >
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-xs fw-bold text-uppercase text-secondary">Vai trò</label>
                        <input
                          className="form-control bg-light text-sm fw-medium p-2 text-muted"
                          value={profile.role || "User"}
                          disabled readOnly
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-xs fw-bold text-uppercase text-secondary">Giới thiệu</label>
                        <textarea
                          className="form-control bg-light text-sm fw-medium p-2"
                          rows={3}
                          placeholder="Viết vài dòng giới thiệu bản thân..."
                          value={profile.bio || ""}
                          onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                        />
                      </div>
                      <div className="col-12 mt-4">
                        <button
                          className="btn btn-primary px-4 me-2 fw-bold shadow-sm rounded-pill"
                          onClick={handleSaveAccount}
                          disabled={saving}
                        >
                          {saving
                            ? <><span className="spinner-border spinner-border-sm me-1" />Đang lưu...</>
                            : <><i className="bi bi-check2 me-1" />Lưu thay đổi</>
                          }
                        </button>
                        <button className="btn btn-light px-4 fw-bold rounded-pill text-secondary shadow-none border">Hủy</button>
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
                              className={`rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm transition-all`}
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
                    ].map((item) => (
                      <div key={item.key} className="d-flex align-items-center justify-content-between py-4 border-bottom border-opacity-10 px-1 rounded-3">
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

                {/* ── Hệ thống ── */}
                {activeTab === "system" && (
                  <>
                    <h6 className="fw-bold mb-4 px-1">Cấu hình hệ thống</h6>
                    <div className="card border-0 shadow-none bg-light bg-opacity-50 rounded-4 overflow-hidden mb-4">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-4">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-4 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 44, height: 44 }}>
                              <i className="bi bi-alarm-fill fs-5" />
                            </div>
                            <div>
                              <div className="fw-bold text-sm text-dark-emphasis">Tự động gửi thông báo Telegram (Cron)</div>
                              <div className="text-secondary text-xs opacity-75">Quét lịch hẹn mỗi phút</div>
                            </div>
                          </div>
                          <div className="form-check form-switch mb-0 ms-3">
                            <input
                              className="form-check-input shadow-sm"
                              type="checkbox"
                              style={{ height: 26, width: 52, cursor: "pointer" }}
                              checked={isCronEnabled}
                              onChange={(e) => handleToggleCron(e.target.checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPicker && (
        <MediaPickerModal
          onSelect={handleAvatarSelect}
          onClose={() => setShowPicker(false)}
        />
      )}

      <style jsx>{`
        .hover-scale:hover { transform: scale(1.1); }
        .hover-shadow:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .hover-bg-light:hover { background: var(--sidebar-hover); }
      `}</style>
    </div>
  );
}
