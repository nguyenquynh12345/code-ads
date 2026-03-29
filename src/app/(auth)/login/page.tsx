"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);

        // Decode JWT payload to get user id (sub field)
        const payload = JSON.parse(atob(data.access_token.split(".")[1]));
        const userId = payload.sub;

        // Fetch full profile and persist so Topbar / Profile page can read it
        try {
          const profileRes = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
            headers: {
              "Authorization": `Bearer ${data.access_token}`
            }
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            localStorage.setItem("user", JSON.stringify(profileData));
          }
        } catch { }

        router.push("/dashboard");

      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch {
      setError("Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center p-3">
      <div className="w-100" style={{ maxWidth: 440 }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-3 mb-3"
            style={{ width: 56, height: 56 }}>
            <i className="bi bi-lightning-fill text-primary fs-3" />
          </div>
          <h3 className="text-white fw-bold mb-1">Chào mừng trở lại!</h3>
          <p className="text-white-50">Đăng nhập để tiếp tục sử dụng</p>
        </div>

        <div className="card auth-card p-4">
          <form onSubmit={handleLogin}>
            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

            <div className="mb-3">
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

            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label className="form-label small fw-medium">Mật khẩu</label>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock text-muted" />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 bg-light"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label small text-muted" htmlFor="remember">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-box-arrow-in-right me-2" />
              )}
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div className="text-center my-3">
              <span className="text-muted small">hoặc đăng nhập với</span>
            </div>

            <div className="row g-2">
              <div className="col-6">
                <button type="button" className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  Google
                </button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-github" />
                  GitHub
                </button>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center text-white-50 mt-3 small">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-white fw-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
