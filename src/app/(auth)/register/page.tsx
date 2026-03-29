"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login?registered=true");
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch {
      setError("Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center p-3">
      <div className="w-100" style={{ maxWidth: 480 }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-3 mb-3"
            style={{ width: 56, height: 56 }}>
            <i className="bi bi-lightning-fill text-primary fs-3" />
          </div>
          <h3 className="text-white fw-bold mb-1">Tạo tài khoản mới</h3>
          <p className="text-white-50">Đăng ký để bắt đầu sử dụng dịch vụ</p>
        </div>

        <div className="card auth-card p-4">
          <form onSubmit={handleRegister}>
            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
            
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-medium">Tên đăng nhập</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-person text-muted" />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-start-0 bg-light" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Mật khẩu</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-lock text-muted" />
                  </span>
                  <input 
                    type="password" 
                    className="form-control border-start-0 bg-light" 
                    placeholder="Ít nhất 8 ký tự" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Xác nhận mật khẩu</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-lock-fill text-muted" />
                  </span>
                  <input 
                    type="password" 
                    className="form-control border-start-0 bg-light" 
                    placeholder="Nhập lại mật khẩu" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="terms" required />
                  <label className="form-check-label small text-muted" htmlFor="terms">
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-primary text-decoration-none">Điều khoản dịch vụ</a>
                    {" "}và{" "}
                    <a href="#" className="text-primary text-decoration-none">Chính sách bảo mật</a>
                  </label>
                </div>
              </div>
              <div className="col-12">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 fw-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="bi bi-person-plus me-2" />
                  )}
                  {loading ? "Đang xử lý..." : "Tạo tài khoản"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center text-white-50 mt-3 small">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-white fw-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
