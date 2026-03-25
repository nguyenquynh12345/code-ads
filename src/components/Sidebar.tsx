"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    section: "Main",
    items: [
      { href: "/dashboard", icon: "bi-grid-fill", label: "Dashboard" },
      { href: "/dashboard/users", icon: "bi-people-fill", label: "Người dùng" },
      { href: "/dashboard/notifications", icon: "bi-bell-fill", label: "Thông báo" },
    ],
  },
  {
    section: "Công cụ",
    items: [
      { href: "/dashboard/media", icon: "bi-images", label: "Media" },
      { href: "/dashboard/calendar", icon: "bi-calendar-date-fill", label: "Lịch trình" },
    ],
  },
  {
    section: "Tài nguyên",
    items: [
      { href: "/dashboard/profile", icon: "bi-person-circle", label: "Hồ sơ" },
      { href: "/dashboard/settings", icon: "bi-gear-fill", label: "Cài đặt" },
      { href: "/dashboard/support", icon: "bi-info-circle-fill", label: "Hỗ trợ" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="sidebar-overlay" id="sidebarOverlay" onClick={() => {
        document.getElementById("sidebar")?.classList.remove("show");
        document.getElementById("sidebarOverlay")?.classList.remove("show");
      }} />

      <nav className="sidebar" id="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary rounded-2 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}>
              <i className="bi bi-lightning-fill text-white fs-5" />
            </div>
            <span className="text-white fw-bold fs-5">MyApp</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-grow-1 py-3 overflow-auto">
          {navItems.map((group) => (
            <div key={group.section}>
              <div className="nav-section-title">{group.section}</div>
              <ul className="nav flex-column">
                {group.items.map((item) => (
                  <li className="nav-item" key={item.href}>
                    <Link
                      href={item.href}
                      className={`nav-link ${pathname === item.href ? "active" : ""}`}
                    >
                      <i className={`bi ${item.icon}`} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-top border-secondary">
          <Link href="/login" className="nav-link text-danger">
            <i className="bi bi-box-arrow-left" />
            Đăng xuất
          </Link>
        </div>
      </nav>
    </>
  );
}
