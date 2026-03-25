"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MiniCalendar() {
  const [date, setDate] = useState(new Date());
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const month = date.getMonth();
  const year = date.getFullYear();
  const today = new Date();

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Pad start
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 text-center opacity-0" />);
  }

  // Actual days
  for (let i = 1; i <= totalDays; i++) {
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    days.push(
      <div 
        key={i} 
        className={`p-2 text-center text-sm rounded-3 transition-all cursor-pointer hover-bg-light ${isToday ? "bg-primary text-white fw-bold shadow-sm" : "text-dark-emphasis fw-medium"}`}
      >
        {i}
      </div>
    );
  }

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  return (
    <div className="p-1">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="fw-bold text-sm text-dark-emphasis px-2">{monthNames[month]} {year}</span>
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-light rounded-circle p-1" onClick={prevMonth}><ChevronLeft size={16} /></button>
          <button className="btn btn-sm btn-light rounded-circle p-1" onClick={nextMonth}><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="grid-calendar">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => (
          <div key={d} className="text-center text-xs fw-bold text-muted pb-2">{d}</div>
        ))}
        {days}
      </div>
      <style jsx>{`
        .grid-calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .hover-bg-light:hover { background: rgba(0,0,0,0.05); }
        [data-bs-theme="dark"] .hover-bg-light:hover { background: rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
}
