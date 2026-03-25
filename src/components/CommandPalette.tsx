"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  label: string;
  desc: string;
  icon: string;
  href: string;
  category: string;
}

const pages: SearchResult[] = [
  { id: "dashboard", label: "Dashboard", desc: "Tổng quan hệ thống", icon: "bi-grid", href: "/dashboard", category: "Trang" },
  { id: "users", label: "Người dùng", desc: "Quản lý tài khoản người dùng", icon: "bi-people", href: "/dashboard/users", category: "Trang" },
  { id: "calendar", label: "Lịch trình", desc: "Quản lý sự kiện và lịch làm việc", icon: "bi-calendar3", href: "/dashboard/calendar", category: "Trang" },
  { id: "media", label: "Media Manager", desc: "Thư viện hình ảnh và tài liệu", icon: "bi-images", href: "/dashboard/media", category: "Trang" },
  { id: "notifications", label: "Thông báo", desc: "Thông báo từ hệ thống", icon: "bi-bell", href: "/dashboard/notifications", category: "Trang" },
  { id: "profile", label: "Hồ sơ cá nhân", desc: "Thông tin tài khoản của bạn", icon: "bi-person-circle", href: "/dashboard/profile", category: "Trang" },
  { id: "settings", label: "Cài đặt", desc: "Cấu hình hệ thống", icon: "bi-gear", href: "/dashboard/settings", category: "Trang" },
  { id: "support", label: "Hỗ trợ", desc: "Trung tâm hỗ trợ", icon: "bi-headset", href: "/dashboard/support", category: "Trang" },
  { id: "blog", label: "Blog", desc: "Quản lý bài viết", icon: "bi-newspaper", href: "/blog", category: "Trang" },
];

const users: SearchResult[] = [
  { id: "u1", label: "Nguyễn Văn An", desc: "admin@email.com — Admin", icon: "bi-person", href: "/dashboard/users", category: "Người dùng" },
  { id: "u2", label: "Trần Thị Bình", desc: "binh.tran@email.com — Editor", icon: "bi-person", href: "/dashboard/users", category: "Người dùng" },
  { id: "u3", label: "Lê Văn Cường", desc: "cuong.le@email.com — User", icon: "bi-person", href: "/dashboard/users", category: "Người dùng" },
];

const allResults = [...pages, ...users];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? allResults.filter(r =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.desc.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase())
      )
    : pages.slice(0, 6);

  const grouped = filtered.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.category] = acc[r.category] || []).push(r);
    return acc;
  }, {});

  const flatResults = Object.values(grouped).flat();

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closePalette = useCallback(() => setOpen(false), []);

  const navigate = (href: string) => {
    closePalette();
    router.push(href);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (open) closePalette(); else openPalette();
      }
      if (e.key === "Escape") closePalette();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, openPalette, closePalette]);

  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIndex(i => Math.min(i + 1, flatResults.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && flatResults[activeIndex]) {
          navigate(flatResults[activeIndex].href);
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [open, activeIndex, flatResults]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start justify-content-center pt-5"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999, backdropFilter: "blur(4px)" }}
      onClick={closePalette}
    >
      <div
        className="command-palette rounded-4 shadow-lg overflow-hidden"
        style={{ width: "100%", maxWidth: 560, background: "var(--bs-body-bg)", border: "1px solid var(--bs-border-color)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="d-flex align-items-center gap-3 px-4 py-3 border-bottom">
          <i className="bi bi-search text-muted fs-5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="form-control border-0 shadow-none p-0 fs-6"
            placeholder="Tìm kiếm trang, người dùng..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ background: "transparent", outline: "none" }}
          />
          <kbd className="badge bg-light text-muted border rounded flex-shrink-0">ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {flatResults.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-search d-block fs-3 mb-2" />
              <small>Không tìm thấy kết quả cho &quot;{query}&quot;</small>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-2 text-muted fw-semibold" style={{ fontSize: "0.72rem", letterSpacing: "0.05em", textTransform: "uppercase", background: "var(--bs-tertiary-bg)" }}>
                  {category}
                </div>
                {items.map(item => {
                  const idx = flatIndex++;
                  return (
                    <button
                      key={item.id}
                      className={`w-100 d-flex align-items-center gap-3 px-4 py-3 border-0 text-start transition-all ${activeIndex === idx ? "bg-primary bg-opacity-10" : ""}`}
                      style={{ background: activeIndex === idx ? undefined : "transparent", cursor: "pointer" }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => navigate(item.href)}
                    >
                      <div
                        className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm ${activeIndex === idx ? "bg-primary text-white scale-110" : "bg-light text-secondary opacity-75"}`}
                        style={{ width: 40, height: 40, transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
                      >
                        <i className={`bi ${item.icon} fs-5`} />
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className={`fw-bold text-sm ${activeIndex === idx ? "text-primary-emphasis" : "text-dark-emphasis"}`}>{item.label}</div>
                        <div className="text-secondary text-xs fw-medium mt-1 opacity-75">{item.desc}</div>
                      </div>
                      {activeIndex === idx && (
                        <kbd className="badge badge-soft-primary border rounded flex-shrink-0 px-2 py-1" style={{ fontSize: "0.6rem" }}>ENTER ↵</kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="d-flex align-items-center gap-3 px-4 py-2 border-top" style={{ fontSize: "0.72rem", color: "var(--bs-secondary-color)" }}>
          <span><kbd className="badge bg-light text-muted border rounded me-1">↑↓</kbd> Di chuyển</span>
          <span><kbd className="badge bg-light text-muted border rounded me-1">↵</kbd> Chọn</span>
          <span><kbd className="badge bg-light text-muted border rounded me-1">Ctrl+K</kbd> Đóng</span>
        </div>
      </div>
    </div>
  );
}
