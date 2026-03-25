import Link from "next/link";

export default function RegisterPage() {
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
          <form>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-medium">Họ</label>
                <input type="text" className="form-control bg-light" placeholder="Nguyễn" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Tên</label>
                <input type="text" className="form-control bg-light" placeholder="Văn A" />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-envelope text-muted" />
                  </span>
                  <input type="email" className="form-control border-start-0 bg-light" placeholder="email@example.com" />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Mật khẩu</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-lock text-muted" />
                  </span>
                  <input type="password" className="form-control border-start-0 bg-light" placeholder="Ít nhất 8 ký tự" />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Xác nhận mật khẩu</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-lock-fill text-muted" />
                  </span>
                  <input type="password" className="form-control border-start-0 bg-light" placeholder="Nhập lại mật khẩu" />
                </div>
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="terms" />
                  <label className="form-check-label small text-muted" htmlFor="terms">
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-primary text-decoration-none">Điều khoản dịch vụ</a>
                    {" "}và{" "}
                    <a href="#" className="text-primary text-decoration-none">Chính sách bảo mật</a>
                  </label>
                </div>
              </div>
              <div className="col-12">
                <Link href="/dashboard" className="btn btn-primary w-100 py-2 fw-medium">
                  <i className="bi bi-person-plus me-2" />
                  Tạo tài khoản
                </Link>
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
