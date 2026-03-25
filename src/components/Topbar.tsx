"use client";

import Link from "next/link";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function Topbar({ title }: { title?: string }) {
  const { theme, toggleTheme } = useTheme();
  
  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    sidebar?.classList.toggle("show");
    overlay?.classList.toggle("show");
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
  };

  return (
    <div className="topbar d-flex align-items-center px-4 justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-light d-lg-none"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list fs-5" />
        </button>
        {title && <h5 className="mb-0 fw-semibold text-dark-emphasis">{title}</h5>}
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Search / Command Palette trigger */}
        <button
          className="btn btn-light rounded-pill px-3 d-none d-md-flex align-items-center gap-2 text-muted border"
          style={{ fontSize: "0.8rem" }}
          onClick={openCommandPalette}
          title="Tìm kiếm (Ctrl+K)"
        >
          <i className="bi bi-search" style={{ fontSize: "0.75rem" }} />
          <span>Tìm kiếm...</span>
          <kbd className="badge bg-light text-muted border rounded ms-1" style={{ fontSize: "0.65rem" }}>Ctrl K</kbd>
        </button>

        <button 
          className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 34, height: 34 }}
          onClick={toggleTheme}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <Link href="/dashboard/notifications" className="btn btn-sm btn-light position-relative">
          <i className="bi bi-bell" />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem" }}>
            3
          </span>
        </Link>

        <div className="dropdown">
          <button
            className="btn btn-sm d-flex align-items-center gap-2 border rounded-pill px-3"
            data-bs-toggle="dropdown"
          >
            <img
              src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff&size=32"
              alt="avatar"
              className="rounded-circle"
              width={28}
              height={28}
            />
            <span className="d-none d-sm-inline text-dark-emphasis small fw-medium">Admin</span>
            <i className="bi bi-chevron-down small text-muted" />
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-1">
            <li><a className="dropdown-item" href="/dashboard/profile">
              <i className="bi bi-person me-2" />Hồ sơ
            </a></li>
            <li><a className="dropdown-item" href="/dashboard/settings">
              <i className="bi bi-gear me-2" />Cài đặt
            </a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="/login">
              <i className="bi bi-box-arrow-left me-2" />Đăng xuất
            </a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
