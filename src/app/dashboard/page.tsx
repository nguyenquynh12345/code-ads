"use client";

import dynamic from "next/dynamic";
import { Users, DollarSign, ShoppingBag, UserPlus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import MiniCalendar from "@/components/MiniCalendar";
import { X } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Sparkline data per stat card
const sparkData = [
  [31, 40, 28, 51, 42, 109, 100],
  [22, 30, 18, 45, 55, 70, 80],
  [10, 25, 35, 20, 45, 30, 55],
  [50, 40, 35, 30, 25, 18, 22],
];

function SparklineChart({ data, color }: { data: number[]; color: string }) {
  const options: ApexCharts.ApexOptions = {
    chart: { type: "area", sparkline: { enabled: true }, animations: { enabled: true } },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0, stops: [0, 100] } },
    colors: [color],
    tooltip: { enabled: false },
  };
  return <Chart options={options} series={[{ data }]} type="area" height={50} width="100%" />;
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const isDark = theme === "dark";
  const labelColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const stats = [
    { label: "Tổng người dùng", value: "12,450", change: "+12%", icon: <Users size={20} />, badgeClass: "badge-soft-primary", iconColor: "text-primary", sparkColor: "#6366f1", spark: sparkData[0] },
    { label: "Doanh thu", value: "₫48.2M", change: "+8.1%", icon: <DollarSign size={20} />, badgeClass: "badge-soft-success", iconColor: "text-success", sparkColor: "#22c55e", spark: sparkData[1] },
    { label: "Đơn hàng", value: "3,821", change: "+5.3%", icon: <ShoppingBag size={20} />, badgeClass: "badge-soft-warning", iconColor: "text-warning", sparkColor: "#f59e0b", spark: sparkData[2] },
    { label: "Khách mới", value: "1,204", change: "-2.4%", icon: <UserPlus size={20} />, badgeClass: "badge-soft-danger", iconColor: "text-danger", sparkColor: "#ef4444", spark: sparkData[3] },
  ];

  // Area chart — weekly revenue
  const areaOptions: ApexCharts.ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [20, 100] } },
    colors: ["#6366f1"],
    xaxis: {
      categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      axisBorder: { show: false }, axisTicks: { show: false },
      labels: { style: { colors: labelColor, fontSize: "12px" } }
    },
    yaxis: { labels: { style: { colors: labelColor, fontSize: "12px" } } },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    tooltip: { theme: "dark" },
  };

  // Bar chart — 6-month revenue
  const barOptions: ApexCharts.ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    colors: ["#6366f1", "#cbd5e1"],
    xaxis: {
      categories: ["T10", "T11", "T12", "T1", "T2", "T3"],
      axisBorder: { show: false }, axisTicks: { show: false },
      labels: { style: { colors: labelColor, fontSize: "12px" } }
    },
    yaxis: { labels: { formatter: (v) => `${v}M`, style: { colors: labelColor, fontSize: "12px" } } },
    grid: { borderColor: gridColor, strokeDashArray: 4 },
    legend: { show: true, position: "top", horizontalAlign: "right", labels: { colors: labelColor } },
    tooltip: { theme: "dark" },
  };
  const barSeries = [
    { name: "Năm nay", data: [40, 55, 48, 62, 58, 72] },
    { name: "Năm trước", data: [30, 42, 38, 50, 44, 60] },
  ];

  // Donut chart — campaign breakdown
  const donutOptions: ApexCharts.ApexOptions = {
    chart: { type: "donut", fontFamily: "Inter, sans-serif" },
    labels: ["Email Marketing", "Facebook Ads", "Google Search", "Organic"],
    colors: ["#6366f1", "#22c55e", "#f59e0b", "#06b6d4"],
    legend: { position: "bottom", fontSize: "12px", labels: { colors: labelColor } },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "75%", labels: { show: true, total: { show: true, label: "Tổng", fontSize: "12px", color: labelColor, formatter: () => "100%" }, value: { color: isDark ? "#f1f5f9" : "#1e293b", fontSize: "20px", fontWeight: 700 } } } } },
    stroke: { width: 4, colors: ["transparent"] },
  };
  const donutSeries = [35, 25, 20, 20];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Tổng quan Dashboard</h4>
          <p className="text-muted text-sm mb-0">Hôm nay là một ngày tuyệt vời để kiểm tra số liệu!</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary border-0 rounded-pill px-3 bg-primary bg-opacity-10 fw-semibold text-xs text-primary">
            <TrendingUp size={14} className="me-1" /> Báo cáo
          </button>
        </div>
      </motion.div>

      {/* ── Stat Cards with Sparklines ── */}
      <div className="row g-3 mb-4">
        {stats.map((stat, i) => (
          <motion.div variants={itemVariants} className="col-6 col-xl-3" key={i}>
            <div className="card stat-card glass-card p-3">
              {loading ? (
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <Skeleton width={40} height={40} className="rounded-3" />
                    <Skeleton width={60} height={20} className="rounded-pill" />
                  </div>
                  <Skeleton width="60%" height={12} className="mb-2" />
                  <Skeleton width="40%" height={24} className="mb-3" />
                  <Skeleton width="100%" height={40} />
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className={`stat-icon ${stat.badgeClass}`}>
                      {stat.icon}
                    </div>
                    <small className={`${stat.change.startsWith("+") ? "text-success-emphasis" : "text-danger-emphasis"} fw-semibold text-xs py-1 px-2 rounded-pill bg-light bg-opacity-10`}>
                      {stat.change} <i className={`bi ${stat.change.startsWith("+") ? "bi-arrow-up" : "bi-arrow-down"}`} />
                    </small>
                  </div>
                  <p className="text-muted text-xs fw-medium mb-1">{stat.label}</p>
                  <h4 className="fw-bold mb-0">{stat.value}</h4>
                  <div style={{ marginLeft: -12, marginRight: -12, marginBottom: -8, marginTop: 4 }}>
                    <SparklineChart data={stat.spark} color={stat.sparkColor} />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Area Chart + Donut ── */}
      <div className="row g-3 mb-4">
        <motion.div variants={itemVariants} className="col-lg-8">
          <div className="card content-card glass-card p-4 h-100">
            {loading ? (
              <div className="d-flex flex-column gap-3">
                <Skeleton width="30%" height={24} />
                <Skeleton width="100%" height={200} />
              </div>
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="fw-bold mb-0">Biểu đồ tăng trưởng</h6>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light rounded-pill px-3 text-xs fw-semibold border" data-bs-toggle="dropdown">
                      7 ngày qua <i className="bi bi-chevron-down ms-1" />
                    </button>
                  </div>
                </div>
                <Chart options={areaOptions} series={[{ name: "Doanh thu", data: [31, 40, 28, 51, 42, 109, 100] }]} type="area" height={220} />
              </>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="col-lg-4">
          <div className="card content-card glass-card p-4 h-100">
            {loading ? (
              <div className="d-flex flex-column gap-3 align-items-center">
                <Skeleton width="50%" height={24} />
                <Skeleton width={180} height={180} circle />
              </div>
            ) : (
              <>
                <h6 className="fw-bold mb-3">Nguồn chiến dịch</h6>
                <div className="mt-2">
                  <Chart options={donutOptions} series={donutSeries} type="donut" height={280} />
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Bar Chart + Schedule + Media ── */}
      <div className="row g-3 mb-4">
        <motion.div variants={itemVariants} className="col-lg-8">
          <div className="card content-card glass-card p-4">
            <h6 className="fw-bold mb-3">Doanh thu 6 tháng</h6>
            <Chart options={barOptions} series={barSeries} type="bar" height={240} />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="col-lg-4">
          <div className="card content-card glass-card h-100">
            <div className="p-4 d-flex align-items-center justify-content-between border-bottom border-opacity-10">
              <h6 className="fw-bold mb-0">Lịch trình & Sự kiện</h6>
            </div>
            <div className="card-body px-3 py-4">
              <MiniCalendar />
              <hr className="my-4 opacity-5" />
              <h6 className="fw-bold text-xs text-uppercase text-muted px-2 d-block mb-3">Sắp tới</h6>
              {[
                { title: "Họp team tuần", time: "09:00 AM", type: "primary" },
                { title: "Review thiết kế", time: "02:30 PM", type: "warning" },
              ].map((event, i) => (
                <div key={i} className={`d-flex align-items-center gap-3 p-2 rounded-3 mb-2 bg-${event.type} bg-opacity-10 border border-${event.type} border-opacity-10 mx-2`}>
                   <div className={`bg-${event.type} rounded-2 p-2 text-white shadow-sm flex-shrink-0`} style={{width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <i className="bi bi-calendar-event" style={{fontSize: '0.8rem'}} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold text-xs">{event.title}</h6>
                    <span className="text-muted" style={{fontSize: '0.65rem'}}>{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Media preview ── */}
      <motion.div variants={itemVariants} className="row g-3">
        <div className="col-12">
          <div className="card content-card glass-card">
            <div className="p-4 d-flex align-items-center justify-content-between border-bottom border-opacity-10">
              <h6 className="fw-bold mb-0">Kho Media gần đây</h6>
              <Link href="/dashboard/media" className="text-primary text-xs fw-bold text-decoration-none">Quản lý Media</Link>
            </div>
            <div className="card-body p-4">
              <div className="row g-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="col-6 col-md-3 col-lg-2 col-xl-1-5">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      src={`https://picsum.photos/400/400?random=${i}`} 
                      className="img-fluid rounded-3 w-100 shadow-sm border" 
                      alt="media" 
                      style={{ aspectRatio: "1", objectFit: "cover", cursor: 'pointer' }} 
                      onClick={() => setSelectedImg(`https://picsum.photos/800/800?random=${i}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Image Preview Modal ── */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4 bg-black bg-opacity-75"
            style={{ zIndex: 1100, backdropFilter: "blur(10px)" }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="position-relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-lg d-flex align-items-center justify-content-center p-0"
                style={{ width: 40, height: 40, zIndex: 1101 }}
                onClick={() => setSelectedImg(null)}
              >
                <X size={20} />
              </button>
              <img 
                src={selectedImg || undefined} 
                className="img-fluid rounded-4 shadow-2xl border border-white border-opacity-20" 
                alt="preview"
                style={{ maxHeight: "85vh", objectFit: "contain" }} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
