"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import { fetchWithAuth, API_BASE_URL } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        showToast("Không tìm thấy bài viết", "danger");
      }
    } catch (err) {
      showToast("Lỗi khi tải thông tin bài viết", "danger");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary me-3" />
        <span className="fw-medium text-muted">Đang tải dữ liệu bài viết...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="card glass-card p-5 border-0 shadow-sm rounded-4 d-inline-block" style={{ maxWidth: 400 }}>
          <h5 className="fw-bold mb-3">Rất tiếc!</h5>
          <p className="text-muted mb-4">Chúng tôi không tìm thấy bài viết mà bạn yêu cầu chỉnh sửa.</p>
          <Link href="/dashboard/posts" className="btn btn-primary rounded-pill px-4">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0">
      <PostEditor initialData={post} isEditing={true} />
    </div>
  );
}
