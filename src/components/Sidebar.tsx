"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    section: "Main",
    items: [
      { href: "/dashboard", icon: "bi-grid-fill", label: "Dashboard" },
      { href: "/dashboard/users", icon: "bi-people-fill", label: "Người dùng", roles: ["Admin"] },
      { href: "/dashboard/notifications", icon: "bi-bell-fill", label: "Thông báo" },
    ],
  },
  {
    section: "Công cụ",
    items: [
      { href: "/dashboard/media", icon: "bi-images", label: "Media", roles: ["Admin", "Editor"] },
      { href: "/dashboard/posts", icon: "bi-newspaper", label: "Bản tin", roles: ["Admin", "Editor"] },
      { href: "/dashboard/categories", icon: "bi-tag-fill", label: "Chuyên mục", roles: ["Admin", "Editor"] },
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

import { useState, useEffect } from "react";

export default function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserRole(user.role || "User");
      } catch (e) {
        console.error("Failed to parse user role", e);
      }
    }
  }, []);

  // Initialize expanded sections based on current path
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    navItems.forEach(group => {
      const hasActiveChild = group.items.some(item => pathname === item.href || pathname.startsWith(item.href + "/"));
      initialExpanded[group.section] = hasActiveChild || true; // Default to true if not specified, but we'll manage it
    });
    setExpandedSections(initialExpanded);
  }, [pathname]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredNavItems = navItems.map(group => ({
    ...group,
    items: group.items.filter(item => !item.roles || (userRole && item.roles.includes(userRole)))
  })).filter(group => group.items.length > 0);

  return (
    <>
      <div className="sidebar-overlay" id="sidebarOverlay" onClick={() => {
        document.getElementById("sidebar")?.classList.remove("show");
        document.getElementById("sidebarOverlay")?.classList.remove("show");
      }} />

      <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`} id="sidebar">
        {/* Brand */}
        <div className="sidebar-brand d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 36, height: 36 }}>
              <i className="bi bi-lightning-fill text-white fs-5" />
            </div>
            <span className="text-white fw-bold fs-5 overflow-hidden">MyApp</span>
          </div>
          <button 
            className="btn btn-sm btn-link text-secondary p-0 border-0 d-none d-lg-block" 
            onClick={onToggle}
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            <i className={`bi bi-chevron-${isCollapsed ? "right" : "left"}`} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-grow-1 py-1 overflow-auto">
          {filteredNavItems.map((group) => {
            const isExpanded = expandedSections[group.section] !== false;
            return (
              <div key={group.section} className="mb-2">
                <div 
                  className={`nav-section-title d-flex align-items-center justify-content-between cursor-pointer py-2 px-3 ${isCollapsed ? 'justify-content-center px-0' : ''}`}
                  onClick={() => !isCollapsed && toggleSection(group.section)}
                  style={{ cursor: isCollapsed ? 'default' : 'pointer' }}
                >
                  <span className={isCollapsed ? 'd-none' : ''}>{group.section}</span>
                  {!isCollapsed && (
                    <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} small opacity-50`} />
                  )}
                  {isCollapsed && <div className="border-bottom border-secondary opacity-25 w-50" />}
                </div>
                
                <ul className={`nav flex-column transition-all overflow-hidden ${isExpanded || isCollapsed ? 'show' : 'd-none'}`}>
                  {group.items.map((item) => (
                    <li className="nav-item" key={item.href}>
                      <Link
                        href={item.href}
                        className={`nav-link ${pathname === item.href ? "active" : ""}`}
                        title={isCollapsed ? item.label : ""}
                      >
                        <i className={`bi ${item.icon}`} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-top border-secondary">
          <Link href="/login" className="nav-link text-danger" title={isCollapsed ? "Đăng xuất" : ""}>
            <i className="bi bi-box-arrow-left" />
            <span>Đăng xuất</span>
          </Link>
        </div>
      </nav>

      <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.3s ease-in-out; }
        .nav-section-title:hover { color: #fff !important; }
      `}</style>
    </>
  );
}
