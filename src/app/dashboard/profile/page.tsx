"use client";

import { useState, useEffect, useRef } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState({
    id: 1, // Defaulting to 1 for verification
    username: "",
    fullName: "",
    email: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3002/auth/profile/${profile.id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Failed to fetch profile");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3002/media/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => ({ ...prev, avatarUrl: data.url }));
        setSuccess("Ảnh đại diện đã được tải lên!");
      }
    } catch (err) {
      setError("Không thể tải ảnh lên");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3002/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setSuccess("Cập nhật hồ sơ thành công!");
      } else {
        setError("Cập nhật thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Hồ sơ cá nhân</h4>
        <p className="text-muted small mb-0">Quản lý thông tin tài khoản của bạn</p>
      </div>

      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
      {success && <div className="alert alert-success py-2 small mb-3">{success}</div>}

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="card content-card text-center p-4">
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img
                src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.fullName || profile.username || 'User'}&size=100&background=6366f1&color=fff`}
                alt="avatar"
                className="rounded-circle border"
                style={{ objectFit: 'cover' }}
                width={100}
                height={100}
              />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="d-none" 
                onChange={handleAvatarChange}
                accept="image/*"
              />
              <button
                className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0"
                style={{ width: 28, height: 28, padding: 0 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <i className="bi bi-camera-fill" style={{ fontSize: "0.7rem" }} />
                )}
              </button>
            </div>
            <h5 className="fw-bold mb-1">{profile.fullName || profile.username || "Người dùng"}</h5>
            <p className="text-muted small mb-3">{profile.email || "Chưa cập nhật email"}</p>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 mb-4">
              Administrator
            </span>
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
                        onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-medium">Email</label>
                      <input 
                        className="form-control" 
                        value={profile.email} 
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@myapp.com"
                      />
                    </div>
                    <div className="col-md-12 text-muted small">
                      <i className="bi bi-info-circle me-1"></i> Tên đăng nhập: <strong>{profile.username}</strong>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                        {loading ? 'Đang lưu...' : <><i className="bi bi-check2 me-1" /> Lưu thay đổi</>}
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
    </>
  );
}
