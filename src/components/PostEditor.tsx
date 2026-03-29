"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Save, Image as ImageIcon, X, Globe, Layout, Type, FileText, ArrowLeft, Eye, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import MediaPickerModal from "./MediaPickerModal";
import { useToast } from "./ToastProvider";
import { fetchWithAuth, API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Dynamically import our custom CKEditor component with NO SSR
const CKEditorCustom = dynamic(
  () => import("./CKEditorComponent"),
  { ssr: false, loading: () => <div className="p-5 text-center border rounded-4 bg-light text-muted">Đang tải trình soạn thảo...</div> }
);

export default function PostEditor({ initialData, isEditing = false }: { initialData?: any, isEditing?: boolean }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || "");
  const [status, setStatus] = useState(initialData?.status || "published");
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<number | string>(initialData?.categoryId || "");
  const [loading, setLoading] = useState(false);
  
  // Sidebar accordion state
  const [openSections, setOpenSections] = useState({ general: true, thumbnail: true, tips: false });
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section as keyof typeof prev]: !prev[section as keyof typeof prev] }));
  };
  
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"thumbnail" | "editor">("editor");
  
  // Ref to store the CKEditor instance
  const editorRef = useRef<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };


  const handleSave = async () => {
    if (!title.trim()) {
      showToast("Vui lòng nhập tiêu đề bài viết", "warning");
      return;
    }
    if (!content.trim()) {
      showToast("Nội dung bài viết không được để trống", "warning");
      return;
    }

    try {
      setLoading(true);
      const url = isEditing 
        ? `${API_BASE_URL}/posts/${initialData.id}`
        : `${API_BASE_URL}/posts`;
      
      const res = await fetchWithAuth(url, {
        method: isEditing ? "PATCH" : "POST",
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
          status,
          categoryId: categoryId || null
        })
      });

      if (res.ok) {
        showToast(isEditing ? "Cập nhật bài viết thành công" : "Đăng bài viết mới thành công", "success");
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        showToast("Lỗi khi lưu bài viết", "danger");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ", "danger");
    } finally {
      setLoading(false);
    }
  };

  const onMediaSelect = (url: string) => {
    if (mediaTarget === "thumbnail") {
      setThumbnailUrl(url);
    } else if (mediaTarget === "editor" && editorRef.current) {
      const editor = editorRef.current;
      // Programmatically insert image using CKEditor model API
      editor.model.change((writer: any) => {
         const imageElement = writer.createElement('imageBlock', {
            src: url
         });
         editor.model.insertContent(imageElement);
      });
      showToast("Đã chèn ảnh vào bài viết", "success");
    }
    setShowMediaModal(false);
  };

  return (
    <div className="container-fluid py-4 min-vh-100 bg-light bg-opacity-10">
      {showMediaModal && (
        <MediaPickerModal 
          onSelect={onMediaSelect} 
          onClose={() => setShowMediaModal(false)} 
        />
      )}

      <div className="row g-4">
        {/* Main Content Area */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center gap-2 mb-4">
                 <Link href="/dashboard/posts" className="btn btn-light rounded-circle p-2 border-0 shadow-none">
                   <ArrowLeft size={18} />
                 </Link>
                 <span className="text-muted small fw-medium">Quay lại danh sách</span>
              </div>

              <input 
                type="text" 
                className="form-control border-0 bg-transparent fs-1 fw-bold mb-4 p-0 shadow-none placeholder-dark" 
                placeholder="Tiêu đề bài viết..."
                style={{ color: "#1e293b" }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="d-flex gap-2 mb-4">
                <button className="btn btn-light btn-sm rounded-pill px-3 fw-medium text-muted border-0 shadow-none">
                   <Globe size={14} className="me-1" /> Công khai
                </button>
              </div>

              <div className="editor-wrapper rounded-4 overflow-hidden border">
                <CKEditorCustom
                  data={content}
                  onMediaPickerClick={() => { setMediaTarget("editor"); setShowMediaModal(true); }}
                  onReady={(editor: any) => {
                    editorRef.current = editor;
                  }}
                  onChange={(event: any, editor: any) => {
                    const data = editor.getData();
                    setContent(data);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="col-lg-4">
           {/* Actions Card */}
           <div className="card border-0 shadow-sm rounded-4 mb-4">
             <div className="card-body p-0">
                {/* General Settings Section */}
                <div className="border-bottom border-light border-opacity-10">
                  <div 
                    className="p-4 d-flex align-items-center justify-content-between cursor-pointer hover-bg-light transition-all"
                    onClick={() => toggleSection('general')}
                  >
                    <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                      <Layout size={18} className="text-primary" /> Thiết lập chung
                    </h6>
                    {openSections.general ? <ChevronUp size={18} className="text-secondary" /> : <ChevronDown size={18} className="text-secondary" />}
                  </div>
                  
                  {openSections.general && (
                    <div className="px-4 pb-4">
                      <div className="mb-4">
                        <label className="form-label text-xs fw-bold text-uppercase text-secondary mb-2">Trạng thái bài viết</label>
                        <select 
                          className="form-select border-0 bg-light rounded-3 text-sm fw-medium p-2 shadow-none"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="published">Công khai (Published)</option>
                          <option value="draft">Bản nháp (Draft)</option>
                        </select>
                      </div>

                      <div className="mb-0">
                        <label className="form-label text-xs fw-bold text-uppercase text-secondary mb-2">Chuyên mục</label>
                        <select 
                          className="form-select border-0 bg-light rounded-3 text-sm fw-medium p-2 shadow-none"
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                        >
                          <option value="">-- Chọn chuyên mục --</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Section */}
                <div className="border-bottom border-light border-opacity-10">
                  <div 
                    className="p-4 d-flex align-items-center justify-content-between cursor-pointer hover-bg-light transition-all"
                    onClick={() => toggleSection('thumbnail')}
                  >
                    <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                       <ImageIcon size={18} className="text-primary" /> Ảnh đại diện
                    </h6>
                    {openSections.thumbnail ? <ChevronUp size={18} className="text-secondary" /> : <ChevronDown size={18} className="text-secondary" />}
                  </div>

                  {openSections.thumbnail && (
                    <div className="px-4 pb-4">
                      <div className="mb-0 text-center">
                        <div 
                          className="thumbnail-picker rounded-4 border-2 border-dashed d-flex flex-column align-items-center justify-content-center overflow-hidden transition-all bg-light"
                          style={{ 
                            minHeight: 180, 
                            cursor: "pointer", 
                            border: "2px dashed rgba(99,102,241,0.1)",
                            position: "relative"
                          }}
                          onClick={() => { setMediaTarget("thumbnail"); setShowMediaModal(true); }}
                        >
                          {thumbnailUrl ? (
                            <>
                              <img src={thumbnailUrl} className="w-100 h-100 object-fit-cover" alt="thumbnail" />
                              <div className="position-absolute top-0 end-0 m-2">
                                <button 
                                  className="btn btn-danger btn-sm rounded-circle p-1 shadow-sm"
                                  onClick={(e) => { e.stopPropagation(); setThumbnailUrl(""); }}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="py-4 px-3 text-center">
                               <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                                 <ImageIcon size={24} />
                               </div>
                               <p className="text-muted small mb-0 fw-medium text-xs">Nhấn để chọn ảnh</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Buttons (Always visible) */}
                <div className="p-4">
                   <div className="d-grid gap-2">
                    <button 
                      className="btn btn-primary rounded-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? <span className="spinner-border spinner-border-sm" /> : <Save size={18} />}
                      {isEditing ? "Cập nhật bài viết" : "Lưu & Đăng bài"}
                    </button>
                    <button 
                      className="btn btn-light rounded-4 py-3 fw-bold text-muted border-0 shadow-none transition-all"
                      onClick={() => router.push("/dashboard/posts")}
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>
             </div>
           </div>

           {/* Tips Info (Also Collapsible for extra neatness) */}
           <div className="card border-0 shadow-none rounded-4 bg-primary bg-opacity-10 overflow-hidden">
             <div 
                className="card-header border-0 bg-transparent p-4 pb-2 d-flex align-items-center justify-content-between cursor-pointer"
                onClick={() => toggleSection('tips')}
             >
                <h6 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
                  <Type size={18} /> Mẹo soạn thảo
                </h6>
                {openSections.tips ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} className="text-primary" />}
             </div>
             {openSections.tips && (
               <div className="card-body p-4 pt-0 text-primary">
                  <ul className="small mb-0 ps-3">
                    <li className="mb-2 text-xs">Sử dụng <strong>Chèn Media</strong> để kết nối trực tiếp với thư viện ảnh đã tải lên.</li>
                    <li className="text-xs">Tiêu đề bài viết hấp dẫn sẽ giúp thu hút nhiều lượt đọc hơn.</li>
                  </ul>
               </div>
             )}
           </div>
        </div>
      </div>

      <style jsx>{`
        .placeholder-dark::placeholder { color: #cbd5e1; }
        .hover-scale:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.2) !important; }
        .thumbnail-picker:hover { border-color: #6366f1 !important; background: rgba(99,102,241,0.04) !important; }
        .cursor-pointer { cursor: pointer; }
        .hover-bg-light:hover { background-color: rgba(0,0,0,0.02); }
        .transition-all { transition: all 0.2s ease; }
        .text-xs { font-size: 0.7rem; }
        .ck-editor__editable_inline {
          min-height: 400px;
          border: none !important;
          padding: 1.5rem !important;
          font-size: 1.125rem !important;
          color: #1e293b !important;
        }
        .ck-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
          background: #f8fafc !important;
          padding: 0.5rem !important;
        }
      `}</style>
    </div>
  );
}
