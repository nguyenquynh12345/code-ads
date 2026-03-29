"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { API_BASE_URL } from "@/lib/api";

interface CalendarEvent {
  id: number;
  day: number;
  month: number;
  year: number;
  title: string;
  type: "primary" | "success" | "warning" | "danger" | "info";
  time: string;
}

// Map API scheduler record → CalendarEvent
interface SchedulerRecord {
  id: number;
  title: string;
  description: string;
  type: string;
  scheduledAt: string;
}

function mapToCalendarEvent(r: SchedulerRecord): CalendarEvent {
  const d = new Date(r.scheduledAt);
  return {
    id: r.id,
    day: d.getDate(),
    month: d.getMonth(),
    year: d.getFullYear(),
    title: r.title,
    type: (r.type as CalendarEvent["type"]) || "primary",
    time: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  };
}

const eventTypes = [
  { value: "primary", label: "Họp / Cuộc gặp" },
  { value: "success", label: "Hoàn thành" },
  { value: "warning", label: "Deadline" },
  { value: "danger", label: "Khẩn cấp" },
  { value: "info", label: "Nhắc nhở" },
];

const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const API = `${API_BASE_URL}/scheduler`;

export default function CalendarPage() {
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailDay, setShowDetailDay] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", type: "primary" as CalendarEvent["type"], time: "09:00" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      if (res.ok) {
        const data: SchedulerRecord[] = await res.json();
        setEvents(data.map(mapToCalendarEvent));
      }
    } catch {
      showToast("Không thể tải lịch trình", "danger");
    } finally {
      setLoading(false);
    }
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = new Date(year, month, 1).getDay();

  const eventsForDay = (d: number) =>
    events.filter(e => e.day === d && e.month === month && e.year === year);

  const upcomingEvents = events
    .filter(e => e.month === month && e.year === year)
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));

  const today = new Date();

  const openAddModal = (day: number) => {
    setSelectedDay(day);
    setForm({ title: "", description: "", type: "primary", time: "09:00" });
    setShowModal(true);
    setShowDetailDay(null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || selectedDay === null) return;
    try {
      setSaving(true);
      // Build scheduledAt from selected day + form.time
      const [hh, mm] = form.time.split(":").map(Number);
      const scheduledAt = new Date(year, month, selectedDay, hh, mm).toISOString();
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          type: form.type,
          scheduledAt,
          status: "pending",
          repeatInterval: "none",
        }),
      });
      if (res.ok) {
        showToast("Đã thêm sự kiện", "success");
        setShowModal(false);
        fetchEvents();
      } else {
        showToast("Lỗi khi lưu sự kiện", "danger");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Đã xóa sự kiện", "success");
        setEvents(prev => prev.filter(e => e.id !== id));
      } else {
        showToast("Lỗi khi xóa sự kiện", "danger");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ", "danger");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark-emphasis mb-1">Lịch trình</h4>
          <p className="text-muted small mb-0">Quản lý các sự kiện và lịch làm việc của bạn.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm"
          onClick={() => { setSelectedDay(today.getDate()); setForm({ title: "", description: "", type: "primary", time: "09:00" }); setShowModal(true); }}
        >
          <Plus size={18} /> Thêm sự kiện
        </button>
      </div>

      {loading && (
        <div className="text-center py-4 text-muted">
          <div className="spinner-border spinner-border-sm text-primary me-2" />
          Đang tải lịch...
        </div>
      )}

      {!loading && (
        <div className="row g-3">
          {/* Calendar Grid */}
          <div className="col-lg-8">
            <div className="card content-card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">{monthNames[month]} {year}</h5>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-light rounded-circle p-2" onClick={prevMonth}><ChevronLeft size={18} /></button>
                  <button className="btn btn-sm btn-light px-3 rounded-pill" onClick={() => setCurrentDate(new Date())}>Hôm nay</button>
                  <button className="btn btn-sm btn-light rounded-circle p-2" onClick={nextMonth}><ChevronRight size={18} /></button>
                </div>
              </div>

              <div className="calendar-grid">
                {dayNames.map(day => (
                  <div key={day} className="calendar-header-day p-3 text-center fw-bold text-muted small">{day}</div>
                ))}

                {/* Blank days */}
                {Array.from({ length: offset }, (_, i) => (
                  <div key={`blank-${i}`} className="calendar-day disabled" />
                ))}

                {/* Month days */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const d = i + 1;
                  const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  const dayEvents = eventsForDay(d);
                  return (
                    <div
                      key={d}
                      className={`calendar-day ${isToday ? "today" : ""} ${showDetailDay === d ? "selected" : ""}`}
                      onClick={() => setShowDetailDay(showDetailDay === d ? null : d)}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className={`day-number ${isToday ? "today-badge" : ""}`}>{d}</span>
                        {dayEvents.length > 0 && (
                          <span className="badge bg-primary rounded-pill" style={{ fontSize: "0.55rem" }}>{dayEvents.length}</span>
                        )}
                      </div>
                      {dayEvents.slice(0, 2).map(ev => (
                        <div
                          key={ev.id}
                          className={`badge bg-${ev.type} bg-opacity-15 text-${ev.type} w-100 text-truncate text-start px-2 py-1 mb-1 border-0`}
                          style={{ fontSize: "0.6rem" }}
                        >
                          {ev.time} {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-muted" style={{ fontSize: "0.6rem" }}>+{dayEvents.length - 2} nữa</div>
                      )}
                      <button
                        className="btn-add-day"
                        title="Thêm sự kiện"
                        onClick={(e) => { e.stopPropagation(); openAddModal(d); }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar — event list */}
          <div className="col-lg-4">
            {showDetailDay !== null ? (
              <div className="card content-card border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold mb-0">Ngày {showDetailDay}/{month + 1}</h6>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => openAddModal(showDetailDay!)}>
                      <Plus size={14} className="me-1" />Thêm
                    </button>
                    <button className="btn btn-sm btn-light rounded-circle" onClick={() => setShowDetailDay(null)}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
                {eventsForDay(showDetailDay).length === 0 ? (
                  <p className="text-muted small text-center py-3">Không có sự kiện nào trong ngày này.</p>
                ) : (
                  eventsForDay(showDetailDay).map(ev => (
                    <div key={ev.id} className="d-flex align-items-center gap-3 p-3 rounded-4 mb-3 border bg-light bg-opacity-40 shadow-sm">
                      <div className={`bg-${ev.type} rounded-3 p-2 text-white flex-shrink-0`}>
                        <i className="bi bi-calendar-event" style={{ fontSize: "0.8rem" }} />
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="fw-bold small text-truncate">{ev.title}</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>{ev.time}</div>
                      </div>
                      <button
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={() => handleDelete(ev.id)}
                        disabled={deletingId === ev.id}
                      >
                        {deletingId === ev.id
                          ? <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
                          : <X size={14} />
                        }
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="card content-card border-0 shadow-sm rounded-4 p-4">
                <h6 className="fw-bold mb-3">Sự kiện tháng này</h6>
                {upcomingEvents.length === 0 ? (
                  <p className="text-muted small text-center py-3">Chưa có sự kiện nào.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {upcomingEvents.map(ev => (
                      <div key={ev.id} className="d-flex align-items-center gap-3">
                        <div className={`bg-${ev.type} rounded-3 text-white d-flex align-items-center justify-content-center flex-shrink-0`}
                          style={{ width: 36, height: 36, fontSize: "0.75rem", fontWeight: 700 }}>
                          {ev.day}
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <div className="fw-medium small text-truncate">{ev.title}</div>
                          <div className="text-muted" style={{ fontSize: "0.72rem" }}>{ev.time} — {monthNames[ev.month]}</div>
                        </div>
                        <button
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={() => handleDelete(ev.id)}
                          disabled={deletingId === ev.id}
                        >
                          {deletingId === ev.id
                            ? <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
                            : <X size={13} />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Add Event Modal ─── */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  Thêm sự kiện {selectedDay !== null ? `— Ngày ${selectedDay}/${month + 1}` : ""}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small fw-medium">Tiêu đề sự kiện <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tiêu đề..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="row g-2">
                  <div className="col-7">
                    <label className="form-label small fw-medium">Loại sự kiện</label>
                    <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CalendarEvent["type"] })}>
                      {eventTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="col-5">
                    <label className="form-label small fw-medium">Giờ</label>
                    <input type="time" className="form-control" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label small fw-medium">Mô tả chi tiết</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Nhập nội dung chi tiết của lịch hẹn..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="mt-3">
                  <div className="d-flex gap-2 flex-wrap">
                    {eventTypes.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        className={`btn btn-sm border-0 rounded-pill px-3 bg-${t.value} bg-opacity-${form.type === t.value ? "100 text-white" : "15 text-white"}`}
                        onClick={() => setForm({ ...form, type: t.value as CalendarEvent["type"] })}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="btn btn-primary px-4" onClick={handleSave} disabled={!form.title.trim() || saving}>
                  {saving ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                  Lưu sự kiện
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        .calendar-day {
          min-height: 110px;
          border-right: 1px solid rgba(0,0,0,0.05);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding: 8px;
          transition: background 0.2s;
          cursor: pointer;
          position: relative;
        }
        .calendar-day:hover:not(.disabled) {
          background: rgba(99,102,241,0.04);
        }
        .calendar-day.selected {
          background: rgba(99,102,241,0.08);
        }
        .calendar-day.disabled {
          background: rgba(0,0,0,0.02);
          opacity: 0.3;
          cursor: default;
        }
        .calendar-day.today {
          background: rgba(99, 102, 241, 0.05);
        }
        .day-number {
          font-weight: 600;
          font-size: 0.85rem;
        }
        .today-badge {
          background: #6366f1;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }
        .calendar-header-day {
          background: rgba(0,0,0,0.02);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        [data-bs-theme="dark"] .calendar-day:hover:not(.disabled) {
          background: rgba(255,255,255,0.03);
        }
        [data-bs-theme="dark"] .calendar-header-day {
          background: rgba(255,255,255,0.03);
        }
        .btn-add-day {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid rgba(99,102,241,0.3);
          color: #6366f1;
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: all 0.15s;
        }
        .calendar-day:hover .btn-add-day {
          display: flex;
        }
        .btn-add-day:hover {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }
      `}</style>
    </div>
  );
}
