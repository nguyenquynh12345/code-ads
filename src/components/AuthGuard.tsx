"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  role: string;
}

const restrictedRoutes: Record<string, string[]> = {
  "/dashboard/users": ["Admin"],
  "/dashboard/media": ["Admin", "Editor"],
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(stored) as User;
      const requiredRoles = restrictedRoutes[pathname];

      if (requiredRoles && !requiredRoles.includes(user.role)) {
        // Not authorized for this specific route
        router.push("/dashboard"); // Redirect to home dashboard
      } else {
        setAuthorized(true);
      }
    } catch (e) {
      router.push("/login");
    }
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-medium">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
