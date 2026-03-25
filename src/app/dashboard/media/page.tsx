"use client";

import { useState, useRef } from "react";
import { Grid, List, Upload, Trash2, Search, Filter, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaFile {
  id: number;
  name: string;
  size: string;
  type: "image" | "file";
  url: string;
  date: string;
}

const initialFiles: MediaFile[] = [
  { id: 1, name: "banner-summer.jpg", size: "1.2 MB", type: "image", url: "https://picsum.photos/400/300?random=1", date: "2024-03-20" },
  { id: 2, name: "logo-dark.png", size: "450 KB", type: "image", url: "https://picsum.photos/200/200?random=2", date: "2024-03-19" },
  { id: 3, name: "annual-report.pdf", size: "2.5 MB", type: "file", url: "#", date: "2024-03-18" },
  { id: 4, name: "product-01.webp", size: "890 KB", type: "image", url: "https://picsum.photos/400/400?random=3", date: "2024-03-17" },
  { id: 5, name: "user-feedback.xlsx", size: "1.1 MB", type: "file", url: "#", date: "2024-03-16" },
  { id: 6, name: "team-photo.jpg", size: "3.2 MB", type: "image", url: "https://picsum.photos/600/400?random=4", date: "2024-03-15" },
];

export default function MediaManagerPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "file">("all");
  const [isDragging, setIsDragging] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || f.type === filter)
  );

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    setFiles(prev => prev.filter(f => !selected.includes(f.id)));
    setSelected([]);
  };

  const handleFiles = (fileList: FileList) => {
    const uploaded = Array.from(fileList).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      type: f.type.startsWith("image") ? "image" as const : "file" as const,
      url: f.type.startsWith("image") ? URL.createObjectURL(f) : "#",
      date: new Date().toISOString().split("T")[0],
    }));
    setFiles(prev => [...uploaded, ...prev]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Thư viện Media</h4>
          <p className="text-muted text-sm mb-0">Quản lý hình ảnh và tài liệu hệ thống</p>
        </div>
        <div className="d-flex gap-2">
          {selected.length > 0 && (
            <button className="btn btn-danger btn-sm rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={deleteSelected}>
              <Trash2 size={14} /> Xóa {selected.length} mục
            </button>
          )}
          <div className="btn-group shadow-sm rounded-pill overflow-hidden">
            <button className={`btn btn-sm px-3 ${view === "grid" ? "btn-primary" : "btn-light"}`} onClick={() => setView("grid")}><Grid size={16} /></button>
            <button className={`btn btn-sm px-3 ${view === "list" ? "btn-primary" : "btn-light"}`} onClick={() => setView("list")}><List size={16} /></button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="card content-card p-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Filter size={16} /> Bộ lọc</h6>
            <div className="list-group list-group-flush border-0">
              <button className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 px-3 py-2 fw-medium text-sm ${filter === "all" ? "bg-primary bg-opacity-10 text-primary fw-bold" : "text-secondary"}`} onClick={() => setFilter("all")}>Tất cả file <span className="badge badge-soft-primary float-end">{files.length}</span></button>
              <button className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 px-3 py-2 fw-medium text-sm ${filter === "image" ? "bg-primary bg-opacity-10 text-primary fw-bold" : "text-secondary"}`} onClick={() => setFilter("image")}>Hình ảnh <span className="badge badge-soft-primary float-end">{files.filter(f => f.type === "image").length}</span></button>
              <button className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 px-3 py-2 fw-medium text-sm ${filter === "file" ? "bg-primary bg-opacity-10 text-primary fw-bold" : "text-secondary"}`} onClick={() => setFilter("file")}>Tài liệu <span className="badge badge-soft-primary float-end">{files.filter(f => f.type === "file").length}</span></button>
            </div>

            <hr className="my-4 opacity-5" />

            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Upload size={16} /> Tải lên</h6>
            <div
              className={`upload-zone p-4 rounded-4 border-2 border-dashed text-center transition-all ${isDragging ? "border-primary bg-primary bg-opacity-10" : "border-secondary border-opacity-25"}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: "pointer" }}
            >
              <input 
                type="file" 
                multiple 
                hidden 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              />
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-2 shadow-sm">
                <Upload size={24} />
              </div>
              <p className="small text-muted mb-0 fw-medium">Kéo thả file vào đây hoặc click để chọn</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-lg-9">
          <div className="card content-card p-4">
            <div className="input-group mb-4 shadow-sm rounded-3 overflow-hidden">
              <span className="input-group-text bg-light border-0 px-3"><Search size={16} className="text-muted" /></span>
              <input type="text" className="form-control border-0 bg-light text-sm p-2" placeholder="Tìm kiếm tên file..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {view === "grid" ? (
              <div className="row g-3">
                {filtered.map(file => (
                  <div key={file.id} className="col-6 col-md-4 col-xl-3">
                    <div className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all media-card position-relative ${selected.includes(file.id) ? "ring-primary" : ""}`} style={{ border: selected.includes(file.id) ? "2px solid #6366f1" : "1px solid rgba(0,0,0,0.05)" }}>
                      <div className="position-absolute top-0 start-0 p-2 z-1">
                        <input type="checkbox" className="form-check-input shadow-sm" checked={selected.includes(file.id)} onChange={() => toggleSelect(file.id)} />
                      </div>
                      <div className="aspect-ratio-box bg-light d-flex align-items-center justify-content-center overflow-hidden position-relative" style={{ height: 140 }}>
                        {file.type === "image" ? (
                          <img src={file.url} className="w-100 h-100 object-fit-cover transition-all" alt={file.name} />
                        ) : (
                          <div className="text-primary opacity-50"><Upload size={48} /></div>
                        )}
                        <div className="hover-overlay position-absolute inset-0 bg-dark bg-opacity-40 d-flex align-items-center justify-content-center opacity-0 transition-all">
                          <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold" onClick={() => file.type === "image" && setLightbox(file.url)}>
                            <Eye size={14} className="me-1" /> Xem
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="fw-bold text-sm text-truncate mb-1">{file.name}</div>
                        <div className="text-muted text-xs d-flex justify-content-between">
                          <span>{file.size}</span>
                          <span className="fw-medium">{file.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle border-top">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 40 }}><input type="checkbox" className="form-check-input" onChange={(e) => setSelected(e.target.checked ? filtered.map(f => f.id) : [])} /></th>
                      <th className="text-xs fw-bold text-uppercase">Tên file</th>
                      <th className="text-xs fw-bold text-uppercase">Kích thước</th>
                      <th className="text-xs fw-bold text-uppercase">Ngày</th>
                      <th style={{ width: 80 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(file => (
                      <tr key={file.id} className={selected.includes(file.id) ? "table-light" : ""}>
                        <td><input type="checkbox" className="form-check-input" checked={selected.includes(file.id)} onChange={() => toggleSelect(file.id)} /></td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-3 bg-light d-flex align-items-center justify-content-center overflow-hidden shadow-sm" style={{ width: 40, height: 40 }}>
                              {file.type === "image" ? <img src={file.url} className="w-100 h-100 object-fit-cover" alt="" /> : <Upload size={16} className="text-muted" />}
                            </div>
                            <span className="fw-bold text-sm">{file.name}</span>
                          </div>
                        </td>
                        <td className="text-secondary text-sm">{file.size}</td>
                        <td className="text-secondary text-sm">{file.date}</td>
                        <td>
                          <button className="btn btn-sm btn-light border-0 text-primary" onClick={() => file.type === "image" && setLightbox(file.url)}><Eye size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {filtered.length === 0 && (
              <div className="text-center py-5">
                <div className="text-muted mb-2"><Search size={48} opacity={0.2} /></div>
                <p className="text-muted fw-medium">Không tìm thấy file nào khớp với tìm kiếm.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4 bg-black bg-opacity-75"
            style={{ zIndex: 1100, backdropFilter: "blur(10px)" }}
            onClick={() => setLightbox(null)}
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
                onClick={() => setLightbox(null)}
              >
                <X size={20} />
              </button>
              <img 
                src={lightbox} 
                className="img-fluid rounded-4 shadow-2xl border border-white border-opacity-20" 
                alt="preview"
                style={{ maxHeight: "85vh", objectFit: "contain" }} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .media-card:hover .hover-overlay { opacity: 1; }
        .aspect-ratio-box img:hover { transform: scale(1.1); }
        .ring-primary { outline: 2px solid var(--bs-primary); outline-offset: -2px; }
      `}</style>
    </>
  );
}
