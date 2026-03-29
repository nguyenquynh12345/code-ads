"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import MediaPickerModal from "@/components/MediaPickerModal";
import { fetchWithAuth, API_BASE_URL } from "@/lib/api";

interface Profile {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  avatarThumbnailUrl?: string;
  role: string;
  phone?: string;
  bio?: string;
  language?: string;
}

export default function ProfilePage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    username: "",
    fullName: "",
    email: "",
    avatarUrl: "",
    role: "User",
    phone: "",
    bio: "",
    language: "vi",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);


  useEffect(() => {
    // Read user id from localStorage (saved at login)
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored) as Profile;
      setProfile(parsed);
      fetchProfile(parsed.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/auth/profile/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        // Keep localStorage in sync
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch {
      showToast("Không thể tải hồ sơ", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ── Avatar selected from picker ──────────────────────────────────────────
  const handleAvatarSelect = async (url: string, thumbnailUrl?: string) => {
    try {
      setUploading(true);
      const updated = { ...profile, avatarUrl: url, avatarThumbnailUrl: thumbnailUrl };
      
      // Explicitly send only necessary fields to prevent DB write rejection of readonly columns
      const payload = { id: profile.id, avatarUrl: url, avatarThumbnailUrl: thumbnailUrl };
      
      const res = await fetchWithAuth("${API_BASE_URL}/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setProfile(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        window.dispatchEvent(new Event("userUpdated"));
        showToast("Ảnh đại diện đã được cập nhật!", "success");
      } else {
        showToast("Cập nhật ảnh thất bại", "danger");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ", "danger");
    } finally {
      setUploading(false);
    }
  };

  // (upload flow now handled inside MediaPickerModal)

  // ── Save info ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Explicitly send editable fields
      const payload = {
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        language: profile.language,
      };

      const res = await fetchWithAuth("${API_BASE_URL}/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        // Keep localStorage in sync
        localStorage.setItem("user", JSON.stringify(profile));
        // Notify Topbar (same-tab)
        window.dispatchEvent(new Event("userUpdated"));
        showToast("Cập nhật hồ sơ thành công!", "success");
      } else {
        showToast("Cập nhật thất bại", "danger");
      }
    } catch {
      showToast("Lỗi kết nối server", "danger");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 text-muted">
        <div className="spinner-border spinner-border-sm text-primary me-2" />
        Đang tải hồ sơ...
      </div>
    );
  }

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
                src={
                  profile.avatarThumbnailUrl ||
                  profile.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile.fullName || profile.username || "User"
                  )}&size=100&background=6366f1&color=fff`
                }
                alt="avatar"
                className="rounded-circle border"
                style={{ objectFit: "cover", width: 100, height: 100 }}
              />
              <button
                className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32, padding: 0 }}
                onClick={() => setShowPicker(true)}
                disabled={uploading}
                title="Chọn hoặc tải lên ảnh đại diện"
              >
                {uploading ? (
                  <span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} />
                ) : (
                  <i className="bi bi-camera-fill" style={{ fontSize: "0.75rem" }} />
                )}
              </button>
            </div>
            <h5 className="fw-bold mb-1">{profile.fullName || profile.username || "Người dùng"}</h5>
            <p className="text-muted small mb-3">{profile.email || "Chưa cập nhật email"}</p>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 mb-2">
              {profile.role || "User"}
            </span>
            <p className="text-muted" style={{ fontSize: "0.72rem" }}>
              <i className="bi bi-person-badge me-1" />@{profile.username}
            </p>
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
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label className="form-label small fw-medium">Họ và tên</label>
                      <input
                        className="form-control"
                        value={profile.fullName}
                        onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-medium">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                        placeholder="admin@myapp.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Số điện thoại</label>
                      <input
                        className="form-control"
                        type="text"
                        value={profile.phone || ""}
                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="0912345678"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Ngôn ngữ</label>
                      <select 
                        className="form-select" 
                        value={profile.language || "vi"} 
                        onChange={(e) => setProfile((p) => ({ ...p, language: e.target.value }))}
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English (US)</option>
                      </select>
                    </div>
                    <div className="col-md-12">
                       <label className="form-label small fw-medium">Tiểu sử (Bio)</label>
                       <textarea 
                         className="form-control" 
                         rows={3} 
                         value={profile.bio || ""}
                         onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                         placeholder="Một vài lời giới thiệu về bạn..."
                       />
                    </div>
                    <div className="col-md-12 text-muted small mt-3">
                      <i className="bi bi-info-circle me-1" />
                      Tên đăng nhập: <strong>{profile.username}</strong>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check2 me-1" />
                            Lưu thay đổi
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <div className="py-2 text-center text-muted">
                  Chức năng đổi mật khẩu đang được phát triển.
                </div>
              )}
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
    </>
  );
}

