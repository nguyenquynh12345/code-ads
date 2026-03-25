"use client";

import { useState } from "react";
import { Plus, X, StickyNote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: number;
  text: string;
  color: string;
}

const COLORS = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#ddd6fe"];

export default function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, text: "Kiểm tra báo cáo tháng 10", color: "#fef08a" },
    { id: 2, text: "Họp với bên thiết kế lúc 2h", color: "#bbf7d0" },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: "",
      color: COLORS[notes.length % COLORS.length],
    };
    setNotes([...notes, newNote]);
    setIsOpen(true);
  };

  const updateNote = (id: number, text: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text } : n));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1060 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass-card p-3 mb-3 rounded-4 shadow-lg"
            style={{ width: 300, maxHeight: 400, overflowY: "auto" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <StickyNote size={18} className="text-warning" /> Ghi chú nhanh
              </h6>
              <button className="btn btn-sm btn-light rounded-circle" onClick={() => setIsOpen(false)}>
                <X size={14} />
              </button>
            </div>
            
            <div className="d-flex flex-column gap-2">
              {notes.map(note => (
                <motion.div 
                  layout
                  key={note.id} 
                  className="p-2 rounded-3 shadow-sm position-relative"
                  style={{ background: note.color, color: "#1e293b" }}
                >
                  <textarea
                    className="form-control bg-transparent border-0 p-0 text-sm fw-medium shadow-none"
                    rows={2}
                    value={note.text}
                    onChange={(e) => updateNote(note.id, e.target.value)}
                    placeholder="Nhập ghi chú..."
                    style={{ resize: "none" }}
                  />
                  <button 
                    className="btn btn-sm p-0 position-absolute top-0 end-0 m-1 opacity-50 hover-opacity-100"
                    onClick={() => deleteNote(note.id)}
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
              <button className="btn btn-sm btn-outline-primary border-dashed w-100 mt-2 py-2" onClick={addNote}>
                <Plus size={14} className="me-1" /> Thêm ghi chú
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center p-0"
        style={{ width: 56, height: 56 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <StickyNote size={24} />
      </button>
    </div>
  );
}
