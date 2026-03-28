"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import CommandPalette from "@/components/CommandPalette";
import StickyNotes from "@/components/StickyNotes";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem("sidebar-collapsed", String(newVal));
  };

  return (
    <AuthGuard>
      <div>
        <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        <CommandPalette />
        <div className={`main-content ${isCollapsed ? "collapsed" : ""}`}>
          <Topbar />
          <div className="p-4">{children}</div>
        </div>
        <StickyNotes />
      </div>
    </AuthGuard>
  );
}
