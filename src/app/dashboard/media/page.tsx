"use client";

import { useState, useRef, useEffect } from "react";
import { Grid, List, Upload, Trash2, Search, Filter, Eye, X, Globe, Video } from "lucide-react";
import { fetchWithAuth, API_BASE_URL } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

interface MediaFile {
  id: number;
  name?: string;
  filename: string;
  size: number;
  mimetype: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
  uploader?: {
    id: number;
    fullName: string;
    username: string;
  };
}

interface User {
  id: number;
  fullName: string;
  username: string;
}

export default function MediaManagerPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const { showToast } = useToast();
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "video" | "file">("all");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOverModal, setDragOverModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uploaderId, setUploaderId] = useState<string>("");
  const [uploaderSearch, setUploaderSearch] = useState("");
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filtering, setFiltering] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    fetchUsers();

    // Set default uploader to current user and fetch initial media
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setUploaderId(user.id.toString());
      setUploaderSearch(user.fullName || user.username);
      // Fetch initial media for this user
      fetchMedia(user.id.toString());
    } else {
      fetchMedia();
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetchWithAuth("${API_BASE_URL}/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  const fetchMedia = async (uid?: string) => {
    try {
      setFiltering(true);
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      const targetUid = uid || uploaderId;
      if (targetUid) queryParams.append("uploaderId", targetUid);

      const response = await fetchWithAuth(`${API_BASE_URL}/media?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (err) {
      console.error("Failed to fetch media");
    } finally {
      setFiltering(false);
    }
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setUploaderId("");
    setUploaderSearch("");
    // Re-fetch all media
    fetchMedia("");
  };

  const filtered = files.filter(f =>
    (f.name || f.filename).toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" ||
      (filter === "image" ? f.mimetype.startsWith("image") :
        filter === "video" ? f.mimetype.startsWith("video") :
          (!f.mimetype.startsWith("image") && !f.mimetype.startsWith("video"))))
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await Promise.all(
        selected.map(id => fetchWithAuth(`${API_BASE_URL}/media/${id}`, { method: 'DELETE' }))
      );
      setFiles(prev => prev.filter(f => !selected.includes(f.id)));
      setSelected([]);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete media");
    } finally {
      setLoading(false);
    }
  };

  const handleFilesSelect = (fileList: FileList) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    setPendingFiles(filesArray);

    // Generate preview for the first file
    const firstFile = filesArray[0];
    if (firstFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setPreviewUrl(e.target.result as string);
      };
      reader.readAsDataURL(firstFile);
    } else {
      setPreviewUrl(null);
    }

    // Default name
    if (filesArray.length === 1) {
      const nameWithoutExt = firstFile.name.substring(0, firstFile.name.lastIndexOf('.')) || firstFile.name;
      setUploadName(nameWithoutExt);
    } else {
      setUploadName("");
    }
  };

  const cancelUpload = () => {
    setPendingFiles([]);
    setPreviewUrl(null);
    setUploadName("");
    setShowUploadModal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const executeUpload = async () => {
    if (pendingFiles.length === 0) return;
    setLoading(true);
    const uploadedFiles: MediaFile[] = [];

    for (let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i];
      const formData = new FormData();
      formData.append("file", file);
      if (uploadName.trim()) {
        const nameToUse = pendingFiles.length > 1 ? `${uploadName.trim()} ${i + 1}` : uploadName.trim();
        formData.append("name", nameToUse);
      }

      try {
        const response = await fetchWithAuth("${API_BASE_URL}/media/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedFiles.push(data);
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}`);
      }
    }

    setFiles(prev => [...uploadedFiles, ...prev]);
    cancelUpload();
    setLoading(false);
  };

  const executeDownload = async () => {
    if (!downloadUrl.trim()) return;
    try {
      setDownloading(true);
      const response = await fetchWithAuth("${API_BASE_URL}/media/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: downloadUrl.trim(),
          name: downloadName.trim() || undefined
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(prev => [data, ...prev]);
        showToast("Tải file từ URL thành công", "success");
        setShowDownloadModal(false);
        setDownloadUrl("");
        setDownloadName("");
      } else {
        showToast("Không thể tải file từ URL này", "danger");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ", "danger");
    } finally {
      setDownloading(false);
    }
  };

  const handleDropOnModal = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverModal(false);
    if (e.dataTransfer.files) handleFilesSelect(e.dataTransfer.files);
  };

  const handleDropGlobal = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setShowUploadModal(true);
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFilesSelect(e.target.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
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
            <button
              className="btn btn-danger btn-sm rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-2"
              onClick={() => setShowDeleteModal(true)}
            >
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
              <button className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 px-3 py-2 fw-medium text-sm ${filter === "image" ? "bg-primary bg-opacity-10 text-primary fw-bold" : "text-secondary"}`} onClick={() => setFilter("image")}>Hình ảnh <span className="badge badge-soft-primary float-end">{files.filter(f => f.mimetype.startsWith("image")).length}</span></button>
              <button className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 px-3 py-2 fw-medium text-sm ${filter === "video" ? "bg-primary bg-opacity-10 text-primary fw-bold" : "text-secondary"}`} onClick={() => setFilter("video")}>Video <span className="badge badge-soft-primary float-end">{files.filter(f => f.mimetype.startsWith("video")).length}</span></button>
              <button className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 px-3 py-2 fw-medium text-sm ${filter === "file" ? "bg-primary bg-opacity-10 text-primary fw-bold" : "text-secondary"}`} onClick={() => setFilter("file")}>Tài liệu <span className="badge badge-soft-primary float-end">{files.filter(f => !f.mimetype.startsWith("image") && !f.mimetype.startsWith("video")).length}</span></button>
            </div>

            <hr className="my-4 opacity-5" />

            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Globe size={16} /> Nhập từ URL</h6>
            <button
              className="btn btn-outline-primary w-100 rounded-4 py-2 border-2 fw-bold d-flex align-items-center justify-content-center gap-2 mb-4"
              onClick={() => setShowDownloadModal(true)}
            >
              <Globe size={18} /> Tải từ URL
            </button>

            <hr className="my-4 opacity-5" />

            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Upload size={16} /> Tải lên</h6>
            <button
              className="btn btn-primary w-100 rounded-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload size={18} /> Tải lên tài liệu
            </button>
            <div
              className={`mt-3 upload-zone p-4 rounded-4 border-2 border-dashed text-center transition-all ${isDragging ? "border-primary bg-primary bg-opacity-10" : "border-secondary border-opacity-25"}`}
              onDragOver={(e) => { e.preventDefault(); !loading && setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDropGlobal}
              onClick={() => setShowUploadModal(true)}
              style={{ cursor: "pointer" }}
            >
              <p className="small text-muted mb-0 fw-medium">Kéo thả file vào đây để tải lên nhanh</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-lg-9">
          <div className="card content-card p-4">
            <div className="input-group mb-4 shadow-sm rounded-pill overflow-hidden border">
              <span className="input-group-text bg-light border-0 px-3"><Search size={16} className="text-muted" /></span>
              <input type="text" className="form-control border-0 bg-light text-sm p-2" placeholder="Tìm nhanh tiêu đề tệp tin..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="card glass-card border-0 shadow-none mb-4" style={{ background: "rgba(0,0,0,0.02)", borderRadius: "1.25rem" }}>
              <div className="card-body p-3">
                <div className="row g-2 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary mb-2 px-1">Từ ngày</label>
                    <div className="input-group input-group-sm rounded-3 overflow-hidden border">
                      <span className="input-group-text bg-light border-0 px-2"><i className="bi bi-calendar-event text-muted" /></span>
                      <input type="date" className="form-control border-0 bg-light text-sm p-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary mb-2 px-1">Đến ngày</label>
                    <div className="input-group input-group-sm rounded-3 overflow-hidden border">
                      <span className="input-group-text bg-light border-0 px-2"><i className="bi bi-calendar-check text-muted" /></span>
                      <input type="date" className="form-control border-0 bg-light text-sm p-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-xs fw-bold text-uppercase text-secondary mb-2 px-1">Người tải lên</label>
                    <div className="position-relative" ref={dropdownRef}>
                      <div className="input-group input-group-sm shadow-none rounded-3 overflow-hidden border">
                        <span className="input-group-text bg-light border-0 px-2"><i className="bi bi-person text-muted" /></span>
                        <input
                          type="text"
                          className="form-control border-0 bg-light text-sm p-2"
                          placeholder="Tìm người tải..."
                          value={uploaderSearch}
                          onFocus={() => setShowUserSuggestions(true)}
                          onChange={(e) => {
                            setUploaderSearch(e.target.value);
                            if (!e.target.value) setUploaderId("");
                          }}
                        />
                        {uploaderSearch && (
                          <button className="btn btn-light btn-sm border-0 text-muted px-2" onClick={() => { setUploaderSearch(""); setUploaderId(""); }}>
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      {showUserSuggestions && (
                        <div
                          className="position-absolute top-100 start-0 w-100 mt-2 shadow-xl rounded-4 overflow-hidden z-3 border border-white border-opacity-10"
                          style={{
                            maxHeight: "250px",
                            overflowY: "auto",
                            background: "rgba(30, 41, 59, 0.98)",
                            backdropFilter: "blur(12px)"
                          }}
                        >
                          <div
                            className="px-3 py-2 text-xs fw-bold text-uppercase bg-dark bg-opacity-50 text-primary border-bottom border-white border-opacity-10 cursor-pointer transition-all hover-opacity"
                            onClick={() => { setUploaderId(""); setUploaderSearch(""); setShowUserSuggestions(false); }}
                          >
                            <i className="bi bi-people-fill me-2" />Tất cả người dùng
                          </div>
                          {users.filter(u => (u.fullName || u.username).toLowerCase().includes(uploaderSearch.toLowerCase())).map(user => (
                            <div
                              key={user.id}
                              className="px-3 cursor-pointer py-3 text-sm fw-medium border-bottom border-white border-opacity-5 cursor-pointer hover-bg-dark transition-all d-flex align-items-center justify-content-between text-white"
                              onClick={() => {
                                setUploaderId(user.id.toString());
                                setUploaderSearch(user.fullName || user.username);
                                setShowUserSuggestions(false);
                              }}
                            >
                              <div className="">
                                <span className="opacity-90">{user.fullName || user.username}</span>
                              </div>
                              {uploaderId === user.id.toString() && <i className="bi bi-check-circle-fill text-primary shadow-sm" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm rounded-pill flex-grow-1 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 py-2"
                        onClick={() => fetchMedia()}
                        disabled={filtering}
                        style={{ height: 38 }}
                      >
                        {filtering ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-funnel-fill" />}
                        Lọc dữ liệu
                      </button>
                      <button
                        className="btn btn-light btn-sm rounded-pill px-3 shadow-none border transition-all hover-bg-light fw-bold text-muted"
                        onClick={handleResetFilters}
                        title="Đặt lại bộ lọc"
                        style={{ height: 38 }}
                      >
                        <i className="bi bi-arrow-counterclockwise" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {view === "grid" ? (
              <div className="row g-3">
                {paginated.map(file => (
                  <div key={file.id} className="col-6 col-md-4 col-xl-3">
                    <div className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all media-card position-relative ${selected.includes(file.id) ? "ring-primary" : ""}`} style={{ border: selected.includes(file.id) ? "2px solid #6366f1" : "1px solid rgba(0,0,0,0.05)" }}>
                      <div className="position-absolute top-0 start-0 p-2 z-1">
                        <input type="checkbox" className="form-check-input shadow-sm" checked={selected.includes(file.id)} onChange={() => toggleSelect(file.id)} />
                      </div>
                      <div className="aspect-ratio-box bg-light d-flex align-items-center justify-content-center overflow-hidden position-relative" style={{ height: 140 }}>
                        {file.mimetype.startsWith("image") ? (
                          <img src={file.thumbnailUrl || file.url} className="w-100 h-100 object-fit-cover transition-all" alt={file.name || file.filename} />
                        ) : file.mimetype.startsWith("video") ? (
                          <div className="w-100 h-100 bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center">
                            <div className="text-primary opacity-50"><Video size={48} /></div>
                          </div>
                        ) : (
                          <div className="text-primary opacity-50"><Upload size={48} /></div>
                        )}
                        <div className="hover-overlay position-absolute inset-0 bg-dark bg-opacity-40 d-flex align-items-center justify-content-center opacity-0 transition-all">
                          <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold" onClick={() => (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) && setLightbox(file.url)}>
                            <Eye size={14} className="me-1" /> Xem
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="fw-bold text-sm text-truncate mb-1" title={file.name || file.filename}>{file.name || file.filename}</div>
                        <div className="text-secondary text-xs mb-2 opacity-75">
                          Tải bởi: <span className="fw-bold text-primary">{file.uploader?.fullName || file.uploader?.username || "Ẩn danh"}</span>
                        </div>
                        <div className="text-muted text-xs d-flex justify-content-between">
                          <span>{formatSize(file.size)}</span>
                          <span className="fw-medium">{formatDate(file.createdAt)}</span>
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
                      <th className="text-xs fw-bold text-uppercase">Người tải</th>
                      <th className="text-xs fw-bold text-uppercase">Ngày</th>
                      <th style={{ width: 80 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(file => (
                      <tr key={file.id} className={selected.includes(file.id) ? "table-light" : ""}>
                        <td><input type="checkbox" className="form-check-input" checked={selected.includes(file.id)} onChange={() => toggleSelect(file.id)} /></td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-3 bg-light d-flex align-items-center justify-content-center overflow-hidden shadow-sm" style={{ width: 40, height: 40 }}>
                              {file.mimetype.startsWith("image") ? <img src={file.thumbnailUrl || file.url} className="w-100 h-100 object-fit-cover" alt={file.name || file.filename} /> :
                                file.mimetype.startsWith("video") ? <div className="bg-dark w-100 h-100 d-flex align-items-center justify-content-center"><Video size={16} className="text-white" /></div> :
                                  <Upload size={16} className="text-muted" />}
                            </div>
                            <span className="fw-bold text-sm">{file.name || file.filename}</span>
                          </div>
                        </td>
                        <td className="text-secondary text-sm">{formatSize(file.size)}</td>
                        <td className="text-sm">
                          <span className="badge badge-soft-info rounded-pill">{file.uploader?.fullName || file.uploader?.username || "Hệ thống"}</span>
                        </td>
                        <td className="text-secondary text-sm">{formatDate(file.createdAt)}</td>
                        <td>
                          <button className="btn btn-sm btn-light border-0 text-primary" onClick={() => file.mimetype.startsWith("image") && setLightbox(file.url)}><Eye size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-5">
                <div className="text-muted mb-2"><Search size={48} opacity={0.2} /></div>
                <p className="text-muted fw-medium">Không tìm thấy file nào khớp với tìm kiếm.</p>
              </div>
            ) : filtered.length > itemsPerPage && (
              <div className="d-flex align-items-center justify-content-between mt-4 pt-4 border-top">
                <p className="text-muted text-sm mb-0">
                  Hiển thị <strong className="text-dark">{((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, filtered.length)}</strong> trên tổng số <strong className="text-dark">{filtered.length}</strong> mục
                </p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-light border px-3 fw-semibold shadow-sm rounded-pill transition-all hover-opacity"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Trước
                  </button>
                  <span className="btn btn-sm btn-primary border-0 px-3 fw-bold rounded-pill shadow-sm" style={{ pointerEvents: 'none' }}>
                    {page}
                  </span>
                  <button
                    className="btn btn-sm btn-light border px-3 fw-semibold shadow-sm rounded-pill transition-all hover-opacity"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Tiếp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4 bg-black bg-opacity-75"
          style={{ zIndex: 1100, backdropFilter: "blur(10px)" }}
          onClick={() => setLightbox(null)}
        >
          <div
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
            {lightbox.toLowerCase().match(/\.(mp4|webm|ogg)$/) || files.find(f => f.url === lightbox)?.mimetype.startsWith("video") ? (
              <video src={lightbox} controls autoPlay className="img-fluid rounded-4 shadow-2xl border border-white border-opacity-20" style={{ maxHeight: "85vh", maxWidth: "100%" }} />
            ) : (
              <img
                src={lightbox}
                className="img-fluid rounded-4 shadow-2xl border border-white border-opacity-20"
                alt="preview"
                style={{ maxHeight: "85vh", objectFit: "contain" }}
              />
            )}
          </div>
        </div>
      )}

      {showUploadModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 p-3 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1200, background: "rgba(15,18,30,0.55)", backdropFilter: "blur(8px)" }}
          onClick={cancelUpload}
          onDragOver={(e) => { e.preventDefault(); !loading && setDragOverModal(true); }}
          onDragLeave={() => setDragOverModal(false)}
          onDrop={handleDropOnModal}
        >
          <div
            className="w-100 shadow-lg d-flex flex-column position-relative"
            style={{ maxWidth: "450px", background: "#181b2e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "1rem" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between px-4 pt-4 pb-2">
              <h2 className="mb-0 fw-bold" style={{ fontSize: "1.125rem", color: "#e2e8f0" }}>Tải ảnh lên</h2>
              <button
                onClick={cancelUpload}
                className="btn btn-link p-1 text-decoration-none shadow-none transition-all hover-opacity"
                style={{ color: "#64748b", background: "transparent" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 pb-4 pt-2 d-flex flex-column gap-3">
              {/* Drop Zone / Preview */}
              <div
                className={`position-relative d-flex align-items-center justify-content-center overflow-hidden transition-all`}
                style={{
                  border: `2px dashed ${dragOverModal ? "#6366f1" : "rgba(99,102,241,0.3)"}`,
                  background: dragOverModal ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.04)",
                  minHeight: "200px",
                  borderRadius: "0.75rem",
                  cursor: previewUrl ? "default" : "pointer"
                }}
                onClick={() => !previewUrl && fileInputRef.current?.click()}
              >
                {!previewUrl ? (
                  <div className="d-flex flex-column align-items-center gap-3 py-4 text-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center upload-ring" style={{ width: 56, height: 56, background: "rgba(99,102,241,0.12)", border: "2px solid rgba(99,102,241,0.25)" }}>
                      <Upload size={26} color="#818cf8" />
                    </div>
                    <div>
                      <p className="fw-semibold mb-1" style={{ fontSize: "0.875rem", color: "#c7d2fe" }}>Kéo thả hoặc nhấn để chọn ảnh</p>
                      <p className="mb-0" style={{ fontSize: "0.75rem", color: "#64748b" }}>PNG, JPG, WEBP • Tối đa 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-100 h-100">
                    <img src={previewUrl} className="w-100" style={{ maxHeight: "240px", objectFit: "contain" }} alt="Preview" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setPendingFiles([]); setPreviewUrl(null); }}
                      className="btn btn-sm position-absolute top-0 end-0 m-2 shadow-sm d-flex align-items-center justify-content-center transition-all hover-scale"
                      style={{ background: "rgba(15,18,30,0.8)", color: "#f87171", borderRadius: "0.5rem", width: 32, height: 32 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                <input type="file" multiple className="d-none" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" />
              </div>

              {/* File info */}
              {pendingFiles.length > 0 && (
                <div className="d-flex align-items-center gap-3 p-3" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "0.75rem" }}>
                  <div className="d-flex align-items-center justify-content-center"><Upload size={18} color="#818cf8" /></div>
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="mb-0 fw-medium text-truncate" style={{ fontSize: "0.75rem", color: "#c7d2fe" }}>
                      {pendingFiles.length > 1 ? `${pendingFiles.length} file đã được chọn` : (pendingFiles[0].name)}
                    </p>
                    <p className="mb-0" style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {pendingFiles.length > 1 ? "" : formatSize(pendingFiles[0].size)}
                    </p>
                  </div>
                </div>
              )}

              {/* Image Name Input */}
              <div>
                <label className="form-label fw-semibold mb-1" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Tên ảnh</label>
                <input
                  type="text"
                  placeholder="Nhập tên cho ảnh..."
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="form-control focus-ring-primary"
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
                  onClick={cancelUpload}
                  className="btn flex-grow-1 fw-semibold transition-all hover-opacity"
                  style={{ color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", borderRadius: "0.75rem", padding: "0.625rem", fontSize: "0.875rem" }}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={executeUpload}
                  disabled={pendingFiles.length === 0 || !uploadName.trim() || loading}
                  className="btn flex-grow-1 fw-semibold transition-all hover-opacity d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.75rem",
                    padding: "0.625rem",
                    fontSize: "0.875rem",
                    opacity: (pendingFiles.length === 0 || !uploadName.trim() || loading) ? 0.4 : 1
                  }}
                >
                  {loading ? <><span className="spinner-border spinner-border-sm" /> Đang tải...</> : "Xác nhận"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {showDownloadModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 p-3 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1200, background: "rgba(15,18,30,0.55)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowDownloadModal(false)}
        >
          <div
            className="w-100 shadow-lg d-flex flex-column position-relative p-4"
            style={{ maxWidth: "450px", background: "#181b2e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "1rem" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="mb-0 fw-bold text-white">Tải file từ URL</h5>
              <button className="btn btn-link text-secondary p-0" onClick={() => setShowDownloadModal(false)}><X size={20} /></button>
            </div>

            <div className="mb-3">
              <label className="form-label text-xs fw-bold text-uppercase text-muted mb-2">Đường dẫn file (URL)</label>
              <input
                type="text"
                className="form-control bg-dark border-secondary bg-opacity-20 text-white"
                placeholder="https://example.com/video.mp4"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-xs fw-bold text-uppercase text-muted mb-2">Tên file gợi ý (Tùy chọn)</label>
              <input
                type="text"
                className="form-control bg-dark border-secondary bg-opacity-20 text-white"
                placeholder="Phim_ngan_hay"
                value={downloadName}
                onChange={(e) => setDownloadName(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-light flex-grow-1 rounded-pill" onClick={() => setShowDownloadModal(false)}>Hủy</button>
              <button 
                className="btn btn-primary flex-grow-1 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2" 
                onClick={executeDownload}
                disabled={!downloadUrl.trim() || downloading}
              >
                {downloading ? <span className="spinner-border spinner-border-sm" /> : <Globe size={18} />}
                Tải về ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 p-3 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1300, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="shadow-lg overflow-hidden position-relative p-4 p-md-5"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#181b2e",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "1.25rem"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 delete-ring"
                style={{
                  width: 72, height: 72,
                  background: "rgba(239,68,68,0.12)",
                  border: "2px solid rgba(239,68,68,0.25)"
                }}
              >
                <Trash2 size={32} color="#f87171" />
              </div>
              <h4 className="fw-bold mb-2" style={{ color: "#e2e8f0" }}>Xác nhận xóa</h4>
              <p className="mb-0" style={{ fontSize: "0.95rem", color: "#94a3b8" }}>
                Bạn có chắc chắn muốn xóa vĩnh viễn <strong style={{ color: "#f87171", background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: "6px" }}>{selected.length}</strong> mục đã chọn? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="d-flex gap-3">
              <button
                className="btn fw-semibold flex-grow-1 py-3 transition-all hover-opacity"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                style={{
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  borderRadius: "0.875rem",
                  fontSize: "0.95rem"
                }}
              >
                Hủy bỏ
              </button>
              <button
                className="btn fw-bold flex-grow-1 py-3 shadow-sm d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                onClick={confirmDelete}
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.875rem",
                  fontSize: "0.95rem"
                }}
              >
                {loading ? <span className="spinner-border spinner-border-sm" /> : "Xóa vĩnh viễn"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .media-card:hover .hover-overlay { opacity: 1; }
        .aspect-ratio-box img:hover { transform: scale(1.1); }
        .ring-primary { outline: 2px solid var(--bs-primary); outline-offset: -2px; }
        .hover-bg-light:hover { background-color: #f8f9fa !important; }
        .hover-scale:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.2) !important; }
        .hover-opacity:hover { opacity: 0.8; }
        .focus-ring-primary:focus { box-shadow: 0 0 0 2px rgba(99,102,241,0.4) !important; outline: none !important; border-color: transparent !important; }
        .upload-ring { animation: pulse-ring 2s ease-in-out infinite; }
        @keyframes pulse-ring {
          0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.18); }
          50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
        }
        .delete-ring { animation: delete-pulse 2s ease-in-out infinite; }
        @keyframes delete-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.25); }
          50% { box-shadow: 0 0 0 14px rgba(239,68,68,0); }
        }
      `}</style>
    </>
  );
}
