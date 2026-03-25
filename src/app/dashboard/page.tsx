"use client";

import dynamic from "next/dynamic";
import { Users, DollarSign, ShoppingBag, UserPlus, TrendingUp } from "lucide-react";
import Link from "next/link";

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
      labels: { style: { colors: "#64748b", fontSize: "12px" } }
    },
    yaxis: { labels: { style: { colors: "#64748b", fontSize: "12px" } } },
    grid: { borderColor: "rgba(0,0,0,0.05)", strokeDashArray: 4 },
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
      labels: { style: { colors: "#64748b", fontSize: "12px" } }
    },
    yaxis: { labels: { formatter: (v) => `${v}M`, style: { colors: "#64748b", fontSize: "12px" } } },
    grid: { borderColor: "rgba(0,0,0,0.05)", strokeDashArray: 4 },
    legend: { show: true, position: "top", horizontalAlign: "right", labels: { colors: "#64748b" } },
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
    legend: { position: "bottom", fontSize: "12px", labels: { colors: "#64748b" } },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "75%", labels: { show: true, total: { show: true, label: "Tổng", fontSize: "12px", color: "#64748b", formatter: () => "100%" }, value: { color: "#1e293b", fontSize: "20px", fontWeight: 700 } } } } },
    stroke: { width: 4, colors: ["transparent"] },
  };
  const donutSeries = [35, 25, 20, 20];

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Tổng quan Dashboard</h4>
          <p className="text-muted text-sm mb-0">Hôm nay là một ngày tuyệt vời để kiểm tra số liệu!</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary border-0 rounded-pill px-3 bg-primary bg-opacity-10 fw-semibold text-xs">
            <TrendingUp size={14} className="me-1" /> Báo cáo
          </button>
        </div>
      </div>

      {/* ── Stat Cards with Sparklines ── */}
      <div className="row g-3 mb-4">
        {stats.map((stat, i) => (
          <div className="col-6 col-xl-3" key={i}>
            <div className="card stat-card p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className={`stat-icon ${stat.badgeClass}`}>
                  {stat.icon}
                </div>
                <small className={`${stat.change.startsWith("+") ? "text-success-emphasis" : "text-danger-emphasis"} fw-semibold text-xs py-1 px-2 rounded-pill bg-light bg-opacity-50`}>
                  {stat.change} <i className={`bi ${stat.change.startsWith("+") ? "bi-arrow-up" : "bi-arrow-down"}`} />
                </small>
              </div>
              <p className="text-muted text-xs fw-medium mb-1">{stat.label}</p>
              <h4 className="fw-bold mb-0">{stat.value}</h4>
              <div style={{ marginLeft: -12, marginRight: -12, marginBottom: -8, marginTop: 4 }}>
                <SparklineChart data={stat.spark} color={stat.sparkColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Area Chart + Donut ── */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card content-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-bold mb-0">Biểu đồ tăng trưởng</h6>
              <div className="dropdown">
                <button className="btn btn-sm btn-light rounded-pill px-3 text-xs fw-semibold border" data-bs-toggle="dropdown">
                  7 ngày qua <i className="bi bi-chevron-down ms-1" />
                </button>
              </div>
            </div>
            <Chart options={areaOptions} series={[{ name: "Doanh thu", data: [31, 40, 28, 51, 42, 109, 100] }]} type="area" height={220} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card content-card p-4 h-100">
            <h6 className="fw-bold mb-3">Nguồn chiến dịch</h6>
            <div className="mt-2">
              <Chart options={donutOptions} series={donutSeries} type="donut" height={280} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bar Chart + Schedule + Media ── */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card content-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0">Doanh thu 6 tháng</h6>
            </div>
            <Chart options={barOptions} series={barSeries} type="bar" height={240} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card content-card h-100">
            <div className="p-4 d-flex align-items-center justify-content-between border-bottom border-opacity-10">
              <h6 className="fw-bold mb-0">Lịch trình sắp tới</h6>
              <Link href="/dashboard/calendar" className="text-primary text-xs fw-bold text-decoration-none">Xem lịch</Link>
            </div>
            <div className="card-body p-4">
              {[
                { title: "Họp team tuần", time: "09:00 AM", type: "primary" },
                { title: "Review thiết kế", time: "02:30 PM", type: "warning" },
                { title: "Demo khách hàng", time: "04:00 PM", type: "success" },
              ].map((event, i) => (
                <div key={i} className={`d-flex align-items-center gap-3 p-3 rounded-4 mb-2 bg-${event.type} bg-opacity-10`}>
                  <div className={`bg-${event.type} rounded-3 p-2 text-white shadow-sm flex-shrink-0`}>
                    <i className="bi bi-calendar-event" />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold text-sm">{event.title}</h6>
                    <span className="text-muted text-xs">{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Media preview ── */}
      <div className="row g-3">
        <div className="col-12">
          <div className="card content-card">
            <div className="p-4 d-flex align-items-center justify-content-between border-bottom border-opacity-10">
              <h6 className="fw-bold mb-0">Kho Media gần đây</h6>
              <Link href="/dashboard/media" className="text-primary text-xs fw-bold text-decoration-none">Quản lý Media</Link>
            </div>
            <div className="card-body p-4">
              <div className="row g-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="col-6 col-md-3 col-lg-2 col-xl-1-5">
                    <img src={`https://picsum.photos/100/100?random=${i}`} className="img-fluid rounded-3 w-100 shadow-sm border" alt="media" style={{ aspectRatio: "1", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
