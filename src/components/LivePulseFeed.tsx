"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, UserPlus, CreditCard, ArrowUpRight } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "order" | "user" | "payment";
  text: string;
  time: string;
  color: string;
  icon: React.ReactNode;
}

const icons = {
  order: <ShoppingCart size={14} />,
  user: <UserPlus size={14} />,
  payment: <CreditCard size={14} />,
};

export default function LivePulseFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: "1", type: "order", text: "Đơn hàng mới #8921", time: "Vừa xong", color: "primary", icon: icons.order },
    { id: "2", type: "user", text: "Người dùng mới Đăng ký", time: "2 phút trước", color: "success", icon: icons.user },
    { id: "3", type: "payment", text: "Thanh toán thành công ₫1.2M", time: "5 phút trước", color: "warning", icon: icons.payment },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: ("order" | "user" | "payment")[] = ["order", "user", "payment"];
      const type = types[Math.floor(Math.random() * types.length)];
      const names = ["Nguyễn An", "Trần Bình", "Lê Cường", "Phạm Dũng", "Hoàng Yến"];
      const name = names[Math.floor(Math.random() * names.length)];
      
      const newItem: ActivityItem = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        text: type === "order" ? `Đơn hàng mới từ ${name}` : type === "user" ? `${name} vừa tham gia` : `Thanh toán ₫${(Math.random() * 5).toFixed(1)}M`,
        time: "Vừa xong",
        color: type === "order" ? "primary" : type === "user" ? "success" : "warning",
        icon: icons[type],
      };

      setActivities(prev => [newItem, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-body p-0">
      <div className="d-flex flex-column gap-2 px-3 pb-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className="d-flex align-items-center gap-3 p-2 rounded-3 hover-bg-light transition-all border border-transparent hover-border-light animate-slide-in-left"
          >
            <div className={`position-relative flex-shrink-0 bg-${item.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-${item.color}`} style={{ width: 32, height: 32 }}>
              {item.icon}
              <span className={`position-absolute top-0 start-100 translate-middle p-1 bg-${item.color} border border-light rounded-circle shadow-sm pulse-dot`}></span>
            </div>
            <div className="flex-grow-1 min-w-0">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="mb-0 fw-bold text-truncate" style={{ fontSize: '0.8rem' }}>{item.text}</h6>
                <span className="text-muted flex-shrink-0 ms-2" style={{ fontSize: '0.65rem' }}>{item.time}</span>
              </div>
            </div>
            <div className="flex-shrink-0 opacity-25">
              <ArrowUpRight size={12} />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out forwards;
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .pulse-dot {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.95); box-shadow: 0 0 0 0 rgba(100, 100, 100, 0.7); }
          70% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 6px rgba(100, 100, 100, 0); }
          100% { transform: translate(-50%, -50%) scale(0.95); box-shadow: 0 0 0 0 rgba(100, 100, 100, 0); }
        }
        .hover-bg-light:hover {
           background: rgba(var(--bs-primary-rgb), 0.05);
        }
        .hover-border-light:hover {
           border-color: rgba(var(--bs-primary-rgb), 0.1) !important;
        }
      `}</style>
    </div>
  );
}
