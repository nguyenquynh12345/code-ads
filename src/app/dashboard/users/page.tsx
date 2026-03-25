"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/components/ToastProvider";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "User";
  status: "active" | "inactive";
  joined: string;
}

const initialUsers: User[] = [
  { id: 1, name: "Nguyễn Văn An", email: "an.nguyen@email.com", role: "Admin", status: "active", joined: "15/01/2024" },
  { id: 2, name: "Trần Thị Bình", email: "binh.tran@email.com", role: "Editor", status: "active", joined: "22/02/2024" },
  { id: 3, name: "Lê Văn Cường", email: "cuong.le@email.com", role: "User", status: "inactive", joined: "05/03/2024" },
  { id: 4, name: "Phạm Thị Dung", email: "dung.pham@email.com", role: "User", status: "active", joined: "18/03/2024" },
  { id: 5, name: "Hoàng Văn Em", email: "em.hoang@email.com", role: "Editor", status: "active", joined: "01/04/2024" },
  { id: 6, name: "Vũ Thị Giang", email: "giang.vu@email.com", role: "User", status: "inactive", joined: "10/04/2024" },
  { id: 7, name: "Đặng Văn Hùng", email: "hung.dang@email.com", role: "User", status: "active", joined: "20/04/2024" },
  { id: 8, name: "Bùi Thị Kim", email: "kim.bui@email.com", role: "Editor", status: "active", joined: "03/05/2024" },
  { id: 9, name: "Đỗ Văn Long", email: "long.do@email.com", role: "User", status: "inactive", joined: "14/05/2024" },
  { id: 10, name: "Ngô Thị Mai", email: "mai.ngo@email.com", role: "User", status: "active", joined: "25/05/2024" },
  { id: 11, name: "Phan Văn Nam", email: "nam.phan@email.com", role: "User", status: "active", joined: "01/06/2024" },
  { id: 12, name: "Lý Thị Oanh", email: "oanh.ly@email.com", role: "Admin", status: "active", joined: "10/06/2024" },
];

const PAGE_SIZE = 5;

const emptyForm = { name: "", email: "", role: "User" as User["role"], status: "active" as User["status"] };

export default function UsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ ...emptyForm });

  // Edit Modal
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });

  // Delete Confirm
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || u.role === roleFilter;
      const matchStatus = !statusFilter || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  // Add
  const handleAdd = () => {
    if (!addForm.name.trim() || !addForm.email.trim()) return;
    const newUser: User = {
      id: Date.now(),
      ...addForm,
      joined: new Date().toLocaleDateString("vi-VN"),
    };
    setUsers([newUser, ...users]);
    setShowAddModal(false);
    setAddForm({ ...emptyForm });
    showToast("Đã thêm người dùng thành công", "success");
  };

  // Edit
  const openEdit = (u: User) => {
    setEditUser(u);
    setEditForm({ name: u.name, email: u.email, role: u.role, status: u.status });
  };
  const handleEdit = () => {
    if (!editForm.name.trim() || !editForm.email.trim() || !editUser) return;
    setUsers(users.map((u) => (u.id === editUser.id ? { ...u, ...editForm } : u)));
    setEditUser(null);
    showToast("Đã cập nhật người dùng", "success");
  };

  // Delete
  const handleDelete = () => {
    if (!deleteTarget) return;
    setUsers(users.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast("Đã xóa người dùng", "success");
    if (paginated.length === 1 && currentPage > 1) setPage(currentPage - 1);
  };

  const roleBadge = (role: User["role"]) =>
    role === "Admin"
      ? "badge-soft-danger"
      : role === "Editor"
      ? "badge-soft-primary"
      : "badge-soft-info";

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Người dùng</h4>
          <p className="text-muted text-sm mb-0">Quản lý tài khoản người dùng hệ thống</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg" />
          <span className="fw-semibold">Thêm người dùng</span>
        </button>
      </div>

      <div className="card content-card">
        <div className="card-body p-4">
          {/* Search & Filter */}
          <div className="row g-2 mb-4">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 bg-light text-sm"
                  placeholder="Tìm kiếm người dùng..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>
            <div className="col-auto">
              <select className="form-select bg-light text-sm fw-medium" value={roleFilter} onChange={handleFilterChange(setRoleFilter)}>
                <option value="">Tất cả vai trò</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="col-auto">
              <select className="form-select bg-light text-sm fw-medium" value={statusFilter} onChange={handleFilterChange(setStatusFilter)}>
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle border-top">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-3 text-xs fw-bold text-uppercase tracking-wider">Người dùng</th>
                  <th className="py-3 text-xs fw-bold text-uppercase tracking-wider">Email</th>
                  <th className="py-3 text-xs fw-bold text-uppercase tracking-wider">Vai trò</th>
                  <th className="py-3 text-xs fw-bold text-uppercase tracking-wider">Trạng thái</th>
                  <th className="py-3 text-xs fw-bold text-uppercase tracking-wider">Ngày tham gia</th>
                  <th className="py-3 text-xs fw-bold text-uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      <i className="bi bi-person-x fs-2 d-block mb-2" />
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  paginated.map((user) => (
                    <tr key={user.id}>
                      <td className="px-3">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=40&background=6366f1&color=fff&bold=true`}
                            alt={user.name}
                            className="rounded-circle shadow-sm"
                            width={40}
                            height={40}
                          />
                          <span className="fw-bold text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="text-secondary text-sm">{user.email}</td>
                      <td>
                        <span className={`badge rounded-pill ${roleBadge(user.role)} px-3 py-1 font-monospace`} style={{ fontSize: "0.7rem" }}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={`rounded-circle ${user.status === "active" ? "bg-success" : "bg-secondary"} shadow-sm`}
                            style={{ width: 8, height: 8, display: "inline-block" }}
                          />
                          <span className={`text-sm fw-medium ${user.status === "active" ? "text-success-emphasis" : "text-muted"}`}>
                            {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </div>
                      </td>
                      <td className="text-secondary text-xs fw-medium">{user.joined}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-light border shadow-sm rounded-3"
                            title="Sửa"
                            onClick={() => openEdit(user)}
                          >
                            <i className="bi bi-pencil text-primary" />
                          </button>
                          <button
                            className="btn btn-sm btn-light border shadow-sm rounded-3"
                            title="Xóa"
                            onClick={() => setDeleteTarget(user)}
                          >
                            <i className="bi bi-trash text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex align-items-center justify-content-between pt-4 pb-2 border-top">
            <small className="text-muted text-xs fw-bold text-uppercase">
              Hiển thị {paginated.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length} người dùng
            </small>
            <nav>
              <ul className="pagination pagination-sm mb-0 gap-1">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link rounded-3 border-0 bg-light" onClick={() => setPage(currentPage - 1)}>«</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                    <button className={`page-link rounded-3 border-0 ${p === currentPage ? "" : "bg-light text-muted"}`} onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link rounded-3 border-0 bg-light" onClick={() => setPage(currentPage + 1)}>»</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* ─── Modal Thêm ─── */}
      {showAddModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Thêm người dùng mới</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small fw-medium">Họ và tên <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập họ tên"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Email <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@example.com"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-medium">Vai trò</label>
                    <select className="form-select" value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value as User["role"] })}>
                      <option value="User">User</option>
                      <option value="Editor">Editor</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-medium">Trạng thái</label>
                    <select className="form-select" value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value as User["status"] })}>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light" onClick={() => setShowAddModal(false)}>Hủy</button>
                <button className="btn btn-primary px-4" onClick={handleAdd} disabled={!addForm.name.trim() || !addForm.email.trim()}>
                  Tạo người dùng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Sửa ─── */}
      {editUser && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={(e) => e.target === e.currentTarget && setEditUser(null)}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Chỉnh sửa người dùng</h5>
                <button className="btn-close" onClick={() => setEditUser(null)} />
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(editUser.name)}&size=48&background=6366f1&color=fff`}
                    className="rounded-circle"
                    width={48} height={48} alt=""
                  />
                  <div>
                    <div className="fw-bold">{editUser.name}</div>
                    <div className="text-muted small">ID: #{editUser.id}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Họ và tên</label>
                  <input type="text" className="form-control" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium">Email</label>
                  <input type="email" className="form-control" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-medium">Vai trò</label>
                    <select className="form-select" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as User["role"] })}>
                      <option value="User">User</option>
                      <option value="Editor">Editor</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-medium">Trạng thái</label>
                    <select className="form-select" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as User["status"] })}>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light" onClick={() => setEditUser(null)}>Hủy</button>
                <button className="btn btn-primary px-4" onClick={handleEdit}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Confirm Delete ─── */}
      {deleteTarget && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-body text-center p-4">
                <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 56, height: 56 }}>
                  <i className="bi bi-trash text-danger fs-4" />
                </div>
                <h6 className="fw-bold mb-1">Xóa người dùng?</h6>
                <p className="text-muted small mb-4">
                  Bạn có chắc muốn xóa <strong>{deleteTarget.name}</strong>?<br />Hành động này không thể hoàn tác.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-light px-4" onClick={() => setDeleteTarget(null)}>Hủy</button>
                  <button className="btn btn-danger px-4" onClick={handleDelete}>Xóa</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
