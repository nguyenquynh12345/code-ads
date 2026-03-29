"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Edit2, Newspaper, User, Clock, CheckCircle, FileText } from "lucide-react";
import { fetchWithAuth, API_BASE_URL } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

interface Post {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  status: string;
  createdAt: string;
  author?: {
    id: number;
    fullName: string;
    username: string;
  };
}

export default function PostsManagementPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth("${API_BASE_URL}/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      showToast("Không thể tải danh sách bài viết", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/posts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Xóa bài viết thành công", "success");
        setPosts(posts.filter(p => p.id !== id));
        setShowDeleteModal(null);
      }
    } catch (err) {
      showToast("Lỗi khi xóa bài viết", "danger");
    }
  };

  const filtered = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      {/* Header Area */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Newspaper className="text-primary" /> Quản lý Bản tin
          </h4>
          <p className="text-muted small mb-0">Xem và quản lý các bài viết trên hệ thống</p>
        </div>
        <Link 
          href="/dashboard/posts/new" 
          className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2 transition-all hover-scale"
        >
          <Plus size={18} /> Thêm bài viết
        </Link>
      </div>

      {/* Stats/Filter Bar */}
      <div className="card glass-card border-0 mb-4 shadow-sm overflow-hidden">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="input-group input-group-sm rounded-pill overflow-hidden border">
                <span className="input-group-text bg-light border-0 px-3"><Search size={16} className="text-muted" /></span>
                <input 
                  type="text" 
                  className="form-control border-0 bg-light text-sm p-2" 
                  placeholder="Tìm kiếm tiêu đề bài viết..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-8 d-flex justify-content-end gap-3 text-sm">
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                Tổng: {posts.length} bài viết
              </span>
              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                Đã đăng: {posts.filter(p => p.status === 'published').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="card content-card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 text-xs fw-bold text-uppercase text-secondary">Bài viết</th>
                <th className="py-3 border-0 text-xs fw-bold text-uppercase text-secondary">Tác giả</th>
                <th className="py-3 border-0 text-xs fw-bold text-uppercase text-secondary">Trạng thái</th>
                <th className="py-3 border-0 text-xs fw-bold text-uppercase text-secondary text-end px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    {search ? "Không tìm thấy bài viết nào khớp với tìm kiếm" : "Chưa có bài viết nào"}
                  </td>
                </tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id} className="transition-all hover-bg-light">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-3 bg-light overflow-hidden shadow-sm d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 48, height: 48 }}
                        >
                          {post.thumbnailUrl ? (
                            <img src={post.thumbnailUrl} className="w-100 h-100 object-fit-cover" alt="thumb" />
                          ) : (
                            <FileText size={24} className="text-muted" />
                          )}
                        </div>
                        <div>
                          <p className="fw-bold mb-0 text-dark">{post.title}</p>
                          <div className="d-flex align-items-center gap-2 text-xs text-muted mt-1">
                            <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, fontSize: '0.65rem' }}>
                          <User size={14} />
                        </div>
                        <span className="text-sm fw-medium">{post.author?.fullName || post.author?.username || "Ẩn danh"}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-3 py-2 text-capitalize ${post.status === 'published' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                        {post.status === 'published' ? <CheckCircle size={12} className="me-1" /> : <Clock size={12} className="me-1" />}
                        {post.status === 'published' ? "Đã đăng" : "Bản nháp"}
                      </span>
                    </td>
                    <td className="py-3 text-end px-4">
                      <div className="d-flex justify-content-center gap-2">
                        <Link href={`/dashboard/posts/${post.id}`} className="btn btn-light btn-sm rounded-pill p-2 shadow-none border-0 transition-all hover-bg-primary hover-text-white" title="Chỉnh sửa">
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          className="btn btn-light btn-sm rounded-pill p-2 shadow-none border-0 transition-all hover-bg-danger hover-text-white" 
                          title="Xóa"
                          onClick={() => setShowDeleteModal(post.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 p-3 d-flex align-items-center justify-content-center" 
          style={{ zIndex: 1200, background: "rgba(15,18,30,0.55)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowDeleteModal(null)}
        >
          <div 
            className="card glass-card border-0 shadow-lg p-4 p-md-5 text-center"
            style={{ maxWidth: 400, borderRadius: "1.5rem" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center justify-content-center mb-4" style={{ width: 64, height: 64 }}>
              <Trash2 size={32} />
            </div>
            <h5 className="fw-bold mb-2">Xác nhận xóa?</h5>
            <p className="text-muted small mb-4">Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</p>
            <div className="d-flex gap-3">
              <button className="btn btn-light flex-grow-1 rounded-pill" onClick={() => setShowDeleteModal(null)}>Hủy</button>
              <button className="btn btn-danger flex-grow-1 rounded-pill fw-bold" onClick={() => handleDelete(showDeleteModal)}>Xóa ngay</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-scale:hover { transform: translateY(-2px); shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .hover-bg-light:hover { background-color: rgba(0,0,0,0.02); }
        .hover-text-white:hover { color: white !important; }
      `}</style>
    </div>
  );
}
