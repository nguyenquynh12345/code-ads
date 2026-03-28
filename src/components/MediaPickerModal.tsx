"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ToastProvider";
import { X, Upload, Trash2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

interface MediaFile {
  id: number;
  name?: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

interface MediaPickerModalProps {
  /** Called with the selected image URL and optionally its thumbnail */
  onSelect: (url: string, thumbnailUrl?: string) => void;
  onClose: () => void;
}

const API = "http://localhost:3002/media";

export default function MediaPickerModal({ onSelect, onClose }: MediaPickerModalProps) {
  const { showToast } = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hoverId, setHoverId] = useState<number | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 16;

  // Upload state
  const [uploadName, setUploadName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(API);
      if (res.ok) {
        const data: MediaFile[] = await res.json();
        // Only images
        setFiles(data.filter((f) => f.mimetype.startsWith("image")));
      }
    } catch {
      showToast("Không thể tải thư viện ảnh", "danger");
    } finally {
      setLoading(false);
    }
  };

  const filtered = files.filter((f) => {
    const label = (f.name || f.filename).toLowerCase();
    return label.includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // ── Upload ────────────────────────────────────────────────────────────────
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    if (uploadName.trim()) formData.append("name", uploadName.trim());
    try {
      setUploading(true);
      const res = await fetchWithAuth(`${API}/upload`, { method: "POST", body: formData });
      if (res.ok) {
        const uploaded: MediaFile = await res.json();
        if (uploaded.mimetype.startsWith("image")) {
          setFiles((prev) => [uploaded, ...prev]);
          // Auto-select immediately after upload
          onSelect(uploaded.url, uploaded.thumbnailUrl);
          onClose();
        }
        showToast("Tải ảnh lên thành công!", "success");
      } else {
        showToast("Tải ảnh lên thất bại", "danger");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ", "danger");
    } finally {
      setUploading(false);
    }
  };

  const handleLocalFile = (file: File) => {
    setPreviewFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    // Pre-fill name without extension
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    setUploadName(nameWithoutExt);
  };

  const clearPreview = () => {
    setPreviewFile(null);
    setPreviewUrl(null);
    setUploadName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleLocalFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) handleLocalFile(f);
  };

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <>
      <div
        className="modal d-block"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1055 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        style={{ maxWidth: 900 }}
      >
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Header */}
          <div className="modal-header border-0 pb-0 px-4 pt-4">
            <div>
              <h5 className="modal-title fw-bold mb-0 text-white">
                <i className="bi bi-images text-primary me-2" />
                Thư viện ảnh
              </h5>
              <p className="small mb-0 mt-1" style={{ color: "#94a3b8" }}>Chọn ảnh có sẵn hoặc tải lên ảnh mới</p>
            </div>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          <div className="modal-body px-4 pb-4">
            <div className="row g-4">
              {/* LEFT — Upload zone */}
              <div className="col-lg-4">
                <div className="p-3 rounded-4 h-100" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="text-xs fw-bold text-uppercase mb-3" style={{ color: "#6366f1", letterSpacing: "0.5px" }}>
                    <i className="bi bi-cloud-upload-fill me-1" />Tải ảnh mới
                  </div>

                  {/* Drop zone */}
                  <div
                    className={`rounded-4 text-center py-4 px-3 transition-all ${dragOver ? "bg-primary bg-opacity-20 border-primary" : ""}`}
                    style={{
                      border: `2px dashed ${dragOver ? "#6366f1" : "rgba(255,255,255,0.12)"}`,
                      background: dragOver ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.02)",
                      cursor: uploading ? "not-allowed" : "pointer",
                      minHeight: 140,
                    }}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); !uploading && setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileChange}
                    />
                    {uploading ? (
                      <>
                        <div className="spinner-border text-primary mb-2" style={{ width: 32, height: 32 }} />
                        <p className="text-muted small mb-0">Đang tải lên...</p>
                      </>
                    ) : (
                      <>
                        <div
                          className="bg-primary bg-opacity-20 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                          style={{ width: 48, height: 48, border: "1px solid rgba(99,102,241,0.2)" }}
                        >
                          <i className="bi bi-cloud-arrow-up-fill fs-4" />
                        </div>
                        <p className="small mb-1 fw-bold" style={{ color: "#e2e8f0" }}>Kéo thả ảnh vào đây</p>
                        <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>hoặc click để chọn file</p>
                        <p style={{ fontSize: "0.68rem", color: "#64748b" }}>JPG, PNG, GIF, WebP</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT — picker grid */}
              <div className="col-lg-8">
                {/* Search */}
                <div className="input-group mb-3 shadow-none rounded-3 overflow-hidden border border-white border-opacity-10">
                  <span className="input-group-text bg-dark border-0">
                    <i className="bi bi-search text-muted" style={{ fontSize: "0.85rem" }} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-dark text-white text-sm"
                    placeholder="Tìm kiếm ảnh theo tên..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="btn btn-dark border-0 px-3 text-muted" onClick={() => setSearch("")}>
                      <i className="bi bi-x" />
                    </button>
                  )}
                </div>

                {/* Grid */}
                {loading ? (
                  <div className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Đang tải...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-image fs-1 d-block mb-2 opacity-25" />
                    <span className="small">{search ? "Không tìm thấy ảnh nào" : "Thư viện trống"}</span>
                  </div>
                ) : (
                  <div
                    className="overflow-auto overflow-x-hidden pe-2"
                    style={{ maxHeight: 420 }}
                  >
                    <div className="row g-2">
                      {paginated.map((file) => (
                        <div key={file.id} className="col-4 col-md-3">
                          <div
                            className="rounded-3 overflow-hidden position-relative"
                            style={{
                              height: 90,
                              cursor: "pointer",
                              border: hoverId === file.id ? "2px solid #6366f1" : "2px solid transparent",
                              transition: "border 0.15s",
                            }}
                            onMouseEnter={() => setHoverId(file.id)}
                            onMouseLeave={() => setHoverId(null)}
                            onClick={() => { onSelect(file.url, file.thumbnailUrl); onClose(); }}
                          >
                            <img
                              src={file.thumbnailUrl || file.url}
                              alt={file.name || file.filename}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                            {hoverId === file.id && (
                              <div
                                className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                                style={{ background: "rgba(99,102,241,0.7)" }}
                              >
                                <i className="bi bi-check-circle-fill text-white fs-4 mb-1" />
                                <span
                                  className="text-white text-center px-1"
                                  style={{ fontSize: "0.6rem", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                                >
                                  {file.name || file.filename}
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            className="text-center mt-1"
                            style={{ fontSize: "0.62rem", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", color: "#94a3b8" }}
                            title={file.name || file.filename}
                          >
                            {file.name || file.filename}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && filtered.length > 0 && (
                  <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top border-white border-opacity-10">
                    <p className="text-xs mb-0" style={{ color: "#64748b" }}>
                      {search ? `Tìm thấy ${filtered.length} ảnh` : `Tổng cộng ${filtered.length} ảnh`}
                    </p>
                    {totalPages > 1 && (
                      <div className="d-flex gap-1">
                        <button 
                          className="btn btn-sm btn-dark border-0 px-2" 
                          disabled={page === 1} 
                          onClick={() => setPage(p => p - 1)}
                        >
                          <i className="bi bi-chevron-left text-muted" />
                        </button>
                        <span className="btn btn-sm btn-dark border-0 px-3 fw-medium text-white" style={{ pointerEvents: 'none', background: "rgba(255,255,255,0.05)" }}>
                          {page} / {totalPages}
                        </span>
                        <button 
                          className="btn btn-sm btn-dark border-0 px-2" 
                          disabled={page === totalPages} 
                          onClick={() => setPage(p => p + 1)}
                        >
                          <i className="bi bi-chevron-right text-muted" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {previewFile && previewUrl && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 p-3 d-flex align-items-center justify-content-center" 
          style={{ zIndex: 1200, background: "rgba(15,18,30,0.55)", backdropFilter: "blur(8px)" }}
          onClick={clearPreview}
        >
          <div 
            className="w-100 shadow-lg d-flex flex-column position-relative"
            style={{ maxWidth: "450px", background: "#181b2e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "1.25rem" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between px-4 pt-4 pb-2">
              <h2 className="mb-0 fw-bold" style={{ fontSize: "1.125rem", color: "#e2e8f0" }}>Xác nhận tải lên</h2>
              <button 
                onClick={clearPreview} 
                className="btn btn-link p-1 text-decoration-none shadow-none transition-all hover-opacity" 
                style={{ color: "#64748b", background: "transparent" }}
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 pb-4 pt-2 d-flex flex-column gap-3">
              {/* Preview */}
              <div 
                className="position-relative d-flex align-items-center justify-content-center overflow-hidden transition-all"
                style={{ 
                  border: "2px solid rgba(99,102,241,0.2)", 
                  background: "rgba(99,102,241,0.04)", 
                  minHeight: "220px", 
                  borderRadius: "0.75rem",
                }}
              >
                <div className="w-100 h-100 p-2 d-flex align-items-center justify-content-center">
                  <img src={previewUrl} className="w-100" style={{ maxHeight: "240px", objectFit: "contain", borderRadius: "0.5rem" }} alt="Preview" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); clearPreview(); }} 
                    className="btn btn-sm position-absolute top-0 end-0 m-3 shadow-sm d-flex align-items-center justify-content-center transition-all hover-scale"
                    style={{ background: "rgba(15,18,30,0.8)", color: "#f87171", borderRadius: "0.5rem", width: 32, height: 32 }}
                    disabled={uploading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* File info */}
              <div className="d-flex align-items-center gap-3 p-3" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "0.75rem" }}>
                 <div className="d-flex align-items-center justify-content-center"><Upload size={18} color="#818cf8"/></div>
                 <div className="flex-grow-1 overflow-hidden">
                   <p className="mb-0 fw-medium text-truncate" style={{ fontSize: "0.75rem", color: "#c7d2fe" }}>
                     {previewFile.name}
                   </p>
                   <p className="mb-0" style={{ fontSize: "0.75rem", color: "#64748b" }}>
                     {formatSize(previewFile.size)}
                   </p>
                 </div>
              </div>

              {/* Image Name Input */}
              <div>
                <label className="form-label fw-semibold mb-1" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Tên file (tuỳ chọn)</label>
                <input 
                  type="text" 
                  placeholder="Nhập tên mô tả ảnh..." 
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="form-control focus-ring-primary"
                  disabled={uploading}
                  style={{ 
                    background: "rgba(255,255,255,0.04)", 
                    border: "1px solid rgba(255,255,255,0.08)", 
                    color: "#e2e8f0", 
                    fontSize: "0.875rem", 
                    borderRadius: "0.75rem", 
                    padding: "0.625rem 1rem" 
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 pt-1">
                <button 
                  onClick={clearPreview} 
                  className="btn flex-grow-1 fw-semibold transition-all hover-opacity"
                  style={{ color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", borderRadius: "0.75rem", padding: "0.625rem", fontSize: "0.875rem" }}
                  disabled={uploading}
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => uploadFile(previewFile)} 
                  disabled={uploading}
                  className="btn flex-grow-1 fw-semibold transition-all hover-opacity d-flex align-items-center justify-content-center gap-2"
                  style={{ 
                    background: "linear-gradient(135deg, #6366f1, #818cf8)", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "0.75rem", 
                    padding: "0.625rem", 
                    fontSize: "0.875rem",
                    opacity: uploading ? 0.7 : 1
                  }}
                >
                  {uploading ? <><span className="spinner-border spinner-border-sm"/> Đang tải...</> : "Tải lên & Chọn"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-scale:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.2) !important; }
        .hover-opacity:hover { opacity: 0.8; }
        .focus-ring-primary:focus { box-shadow: 0 0 0 2px rgba(99,102,241,0.4) !important; outline: none !important; border-color: transparent !important; }
      `}</style>
    </>
  );
}
