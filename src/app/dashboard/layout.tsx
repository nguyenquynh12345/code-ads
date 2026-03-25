"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import CommandPalette from "@/components/CommandPalette";
import StickyNotes from "@/components/StickyNotes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Sidebar />
      <CommandPalette />
      <div className="main-content">
        <Topbar />
        <div className="p-4">{children}</div>
      </div>
      <StickyNotes />
    </div>
  );
}
