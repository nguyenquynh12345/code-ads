"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Tag, Trash2, Edit2, X, Check } from "lucide-react";
import { fetchWithAuth, API_BASE_URL } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal/Form state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: 0, name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      showToast("Lỗi khi tải danh sách chuyên mục", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Vui lòng nhập tên chuyên mục", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const url = isEditing 
        ? `${API_BASE_URL}/categories/${formData.id}` 
        : `${API_BASE_URL}/categories`;
      
      const res = await fetchWithAuth(url, {
        method: isEditing ? "PATCH" : "POST",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description
        })
      });

      if (res.ok) {
        showToast(isEditing ? "Cập nhật thành công" : "Thêm chuyên mục thành công", "success");
        setShowModal(false);
        fetchCategories();
      } else {
        showToast("Lỗi khi lưu chuyên mục", "danger");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chuyên mục này?")) return;
    
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showToast("Đã xóa chuyên mục", "success");
        fetchCategories();
      } else {
        showToast("Không thể xóa chuyên mục", "danger");
      }
    } catch (err) {
      showToast("Lỗi kết nối", "danger");
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: 0, name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setIsEditing(true);
    setFormData({ id: cat.id, name: cat.name, description: cat.description || "" });
    setShowModal(true);
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Chuyên mục bài viết</h4>
          <p className="text-muted small mb-0">Quản lý các phân loại chủ đề cho bản tin</p>
        </div>
        <button 
          className="btn btn-primary rounded-3 px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
          onClick={openAddModal}
        >
          <Plus size={18} /> Thêm chuyên mục
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 p-4">
          <div className="position-relative" style={{ maxWidth: 350 }}>
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
            <input 
              type="text" 
              className="form-control ps-5 rounded-pill border-light bg-light py-2" 
              placeholder="Tìm kiếm chuyên mục..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table dropdown-table table-hover align-middle mb-0">
            <thead className="bg-light bg-opacity-50">
              <tr>
                <th className="px-4 py-3 text-uppercase text-xs fw-bold text-muted" style={{ width: 80 }}>ID</th>
                <th className="px-4 py-3 text-uppercase text-xs fw-bold text-muted">Tên chuyên mục</th>
                <th className="px-4 py-3 text-uppercase text-xs fw-bold text-muted">Slug</th>
                <th className="px-4 py-3 text-uppercase text-xs fw-bold text-muted">Mô tả</th>
                <th className="px-4 py-3 text-uppercase text-xs fw-bold text-muted text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">Không tìm thấy chuyên mục nào</td></tr>
              ) : filtered.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-4 py-3 fw-medium text-muted">#{cat.id}</td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                       <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2 d-flex align-items-center justify-content-center">
                         <Tag size={16} />
                       </div>
                       <span className="fw-bold text-dark-emphasis">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="badge bg-light text-muted border py-1 px-2 font-monospace">{cat.slug}</span></td>
                  <td className="px-4 py-3 text-muted small">{cat.description || "—"}</td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button 
                        className="btn btn-sm btn-light rounded-2 p-2 border-0" 
                        title="Chỉnh sửa"
                        onClick={() => openEditModal(cat)}
                      >
                        <Edit2 size={16} className="text-primary" />
                      </button>
                      <button 
                        className="btn btn-sm btn-light rounded-2 p-2 border-0" 
                        title="Xóa"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 size={16} className="text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 px-4 pt-4">
                <h5 className="modal-title fw-bold">{isEditing ? "Chỉnh sửa chuyên mục" : "Thêm chuyên mục mới"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body px-4 pb-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Tên chuyên mục</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3 py-2 border-2" 
                      placeholder="Ví dụ: Công nghệ, Đời sống..." 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-bold text-uppercase text-muted">Mô tả (Tuỳ chọn)</label>
                    <textarea 
                      className="form-control rounded-3 border-2" 
                      rows={3} 
                      placeholder="Mô tả nội dung chuyên mục này..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 px-4 pb-4 pt-0 gap-2">
                  <button type="button" className="btn btn-light rounded-3 px-4 py-2 fw-medium text-muted" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2" disabled={submitting}>
                    {submitting ? <span className="spinner-border spinner-border-sm" /> : <Check size={18} />}
                    {isEditing ? "Cập nhật" : "Lưu chuyên mục"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-section-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #64748b; padding: 1.5rem 1.5rem 0.5rem; letter-spacing: 0.5px; }
        .nav-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; color: #94a3b8; transition: all 0.2s; white-space: nowrap; }
        .nav-link:hover { color: #f8fafc; background: rgba(255,255,255,0.05); }
        .nav-link.active { color: #fff; background: rgba(99,102,241,0.1); border-right: 3px solid #6366f1; }
        .nav-link i { font-size: 1.1rem; }
      `}</style>
    </>
  );
}
