"use client";

import React, { useState } from "react";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info" | "primary" | "danger";
  badgeClass: string;
  icon: string;
  isRead: boolean;
  isImportant: boolean;
  removing?: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, title: "Đơn hàng mới #10235", description: "Bạn có một đơn hàng mới từ Nguyễn Văn A.", time: "2 phút trước", type: "success", badgeClass: "badge-soft-success", icon: "bi-bag-check", isRead: false, isImportant: true },
  { id: 2, title: "Cập nhật hệ thống", description: "Hệ thống sẽ bảo trì vào lúc 2:00 AM ngày mai.", time: "1 giờ trước", type: "warning", badgeClass: "badge-soft-warning", icon: "bi-exclamation-triangle", isRead: false, isImportant: true },
  { id: 3, title: "Người dùng mới", description: "Trần Thị B vừa đăng ký tài khoản mới.", time: "3 giờ trước", type: "info", badgeClass: "badge-soft-info", icon: "bi-person-plus", isRead: false, isImportant: false },
  { id: 4, title: "Báo cáo doanh thu tháng", description: "Báo cáo doanh thu tháng 2 đã sẵn sàng để tải về.", time: "5 giờ trước", type: "primary", badgeClass: "badge-soft-primary", icon: "bi-file-earmark-bar-graph", isRead: true, isImportant: false },
  { id: 5, title: "Cảnh báo bảo mật", description: "Phát hiện đăng nhập lạ từ địa chỉ IP 192.168.1.100.", time: "1 ngày trước", type: "danger", badgeClass: "badge-soft-danger", icon: "bi-shield-lock", isRead: true, isImportant: true },
  { id: 6, title: "Media đã tải lên", description: "Ảnh banner-summer.jpg đã được tải lên thành công.", time: "2 ngày trước", type: "info", badgeClass: "badge-soft-info", icon: "bi-image", isRead: true, isImportant: false },
];

type FilterTab = "all" | "unread" | "important";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<FilterTab>("all");

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const importantCount = notifications.filter(n => n.isImportant).length;

  const filtered = notifications.filter(n => {
    if (n.removing) return false;
    if (filter === "unread") return !n.isRead;
    if (filter === "important") return n.isImportant;
    return true;
  });

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, removing: true } : n));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Thông báo</h4>
          <p className="text-muted text-sm mb-0">Quản lý các thông báo từ hệ thống của bạn.</p>
        </div>
        <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold border-2" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <i className="bi bi-check-all me-1" />Đánh dấu tất cả đã đọc
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4">
        {([
          { key: "all", label: "Tất cả", count: notifications.length },
          { key: "unread", label: "Chưa đọc", count: unreadCount },
          { key: "important", label: "Quan trọng", count: importantCount },
        ] as { key: FilterTab; label: string; count: number }[]).map(tab => (
          <button
            key={tab.key}
            className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 border-0 fw-semibold ${filter === tab.key ? "btn-primary shadow-sm" : "btn-light text-secondary"}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className={`badge rounded-pill ${filter === tab.key ? "bg-white bg-opacity-25 text-white" : "bg-primary bg-opacity-10 text-primary"}`} style={{ fontSize: "0.65rem" }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="card content-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-5 text-center">
            <i className="bi bi-bell-slash text-muted display-4 mb-3 d-block" />
            <p className="text-muted fw-medium">
              {filter === "unread" ? "Không có thông báo chưa đọc." : filter === "important" ? "Không có thông báo quan trọng." : "Bạn không có thông báo nào."}
            </p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {filtered.map(n => (
              <div
                key={n.id}
                className={`list-group-item p-4 border-start border-4 ${n.isRead ? "border-transparent" : `border-${n.type}`} ${!n.isRead ? "bg-light bg-opacity-25" : ""}`}
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: n.removing ? 0 : 1,
                  transform: n.removing ? "translateX(30px)" : "translateX(0)",
                  maxHeight: n.removing ? 0 : 500,
                  overflow: "hidden",
                }}
              >
                <div className="d-flex gap-4">
                  <div
                    className={`flex-shrink-0 ${n.badgeClass} rounded-circle d-flex align-items-center justify-content-center shadow-sm`}
                    style={{ width: 48, height: 48 }}
                  >
                    <i className={`bi ${n.icon} fs-5`} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between mb-1 gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className={`fw-bold mb-0 ${!n.isRead ? "text-dark-emphasis" : "text-secondary"}`}>{n.title}</h6>
                        {n.isImportant && <span className="badge badge-soft-danger rounded-pill px-2 py-0 fw-bold" style={{ fontSize: "0.6rem" }}>Quan trọng</span>}
                        {!n.isRead && <span className="bg-primary rounded-circle" style={{ width: 8, height: 8, display: "inline-block" }} />}
                      </div>
                      <small className="text-secondary fw-bold text-xs">{n.time}</small>
                    </div>
                    <p className={`mb-2 text-sm ${!n.isRead ? "text-dark-emphasis opacity-75" : "text-muted"}`} style={{ lineHeight: "1.6" }}>{n.description}</p>
                    <div className="d-flex gap-3 mt-1">
                      {!n.isRead && (
                        <button
                          className="btn btn-sm btn-link text-primary p-0 text-decoration-none text-xs fw-bold"
                          onClick={() => markRead(n.id)}
                        >
                          <i className="bi bi-check2 me-1" />ĐÁNH DẤU ĐÃ ĐỌC
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-link text-danger p-0 text-decoration-none text-xs fw-bold"
                        onClick={() => removeNotification(n.id)}
                      >
                        <i className="bi bi-trash me-1" />XÓA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
