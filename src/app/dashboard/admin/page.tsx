"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiUserPlus,
  FiTrash2,
  FiShield,
  FiUser,
  FiMail,
  FiLock,
  FiX,
  FiCheck,
  FiSlash,
  FiRefreshCw,
  FiSearch,
  FiEdit2,
} from "react-icons/fi";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  disabled: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      setMessage({ type: "error", text: "Kullanıcılar yüklenemedi" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (!confirm(`"${username}" kullanıcısını silmek istediğinize emin misiniz?`))
      return;

    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg("success", `"${username}" silindi`);
        fetchUsers();
      } else {
        const data = await res.json();
        showMsg("error", data.error || "Silme başarısız");
      }
    } catch {
      showMsg("error", "Sunucu hatası");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRole = async (user: UserData) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    setActionLoading(user.id + "-role");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        showMsg(
          "success",
          `"${user.username}" rolü ${newRole === "admin" ? "Yönetici" : "Kullanıcı"} olarak değiştirildi`
        );
        fetchUsers();
      } else {
        const data = await res.json();
        showMsg("error", data.error || "Güncelleme başarısız");
      }
    } catch {
      showMsg("error", "Sunucu hatası");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleDisabled = async (user: UserData) => {
    setActionLoading(user.id + "-disable");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: !user.disabled }),
      });
      if (res.ok) {
        showMsg(
          "success",
          `"${user.username}" ${user.disabled ? "aktifleştirildi" : "devre dışı bırakıldı"}`
        );
        fetchUsers();
      } else {
        const data = await res.json();
        showMsg("error", data.error || "Güncelleme başarısız");
      }
    } catch {
      showMsg("error", "Sunucu hatası");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    active: users.filter((u) => !u.disabled).length,
    disabled: users.filter((u) => u.disabled).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Paneli</h1>
          <p className="text-text-secondary text-sm mt-1">
            Kullanıcı yönetimi ve sistem ayarları
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="gradient-red text-white font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 text-sm w-fit"
        >
          <FiUserPlus className="w-4 h-4" />
          Yeni Kullanıcı
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Toplam Kullanıcı",
            value: stats.total,
            icon: FiUsers,
            color: "text-neon-red",
            bg: "bg-neon-red/10",
          },
          {
            label: "Yönetici",
            value: stats.admins,
            icon: FiShield,
            color: "text-teal",
            bg: "bg-teal/10",
          },
          {
            label: "Aktif",
            value: stats.active,
            icon: FiCheck,
            color: "text-green-400",
            bg: "bg-green-400/10",
          },
          {
            label: "Devre Dışı",
            value: stats.disabled,
            icon: FiSlash,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Refresh */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kullanıcı ara..."
            className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 transition-all"
          />
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchUsers();
          }}
          className="p-2.5 rounded-xl bg-surface border border-border hover:bg-surface-light transition-all"
        >
          <FiRefreshCw
            className={`w-4 h-4 text-text-secondary ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-xl text-sm font-medium text-center ${
              message.type === "success"
                ? "bg-teal/10 border border-teal/20 text-teal"
                : "bg-neon-red/10 border border-neon-red/20 text-neon-red"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-neon-red/30 border-t-neon-red rounded-full animate-spin mx-auto" />
            <p className="text-text-muted text-sm mt-3">Yükleniyor...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <FiUsers className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-text-muted text-sm">Kullanıcı bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">
                    E-posta
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">
                    Kayıt Tarihi
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-surface-light/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            user.role === "admin"
                              ? "gradient-red"
                              : "bg-surface-light"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <FiShield className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <FiUser className="w-3.5 h-3.5 text-text-secondary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {user.username}
                          </p>
                          <p className="text-xs text-text-muted md:hidden">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-text-secondary">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-neon-red/10 text-neon-red"
                            : "bg-surface-light text-text-secondary"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <FiShield className="w-3 h-3" />
                        ) : (
                          <FiUser className="w-3 h-3" />
                        )}
                        {user.role === "admin" ? "Yönetici" : "Kullanıcı"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-text-muted">
                        {new Date(user.created_at).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.disabled
                            ? "bg-yellow-400/10 text-yellow-400"
                            : "bg-green-400/10 text-green-400"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.disabled ? "bg-yellow-400" : "bg-green-400"
                          }`}
                        />
                        {user.disabled ? "Devre Dışı" : "Aktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleRole(user)}
                          disabled={actionLoading === user.id + "-role"}
                          title={
                            user.role === "admin"
                              ? "Kullanıcıya düşür"
                              : "Yöneticiye yükselt"
                          }
                          className="p-2 rounded-lg hover:bg-surface-light text-text-muted hover:text-teal transition-all disabled:opacity-50"
                        >
                          <FiShield className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleDisabled(user)}
                          disabled={actionLoading === user.id + "-disable"}
                          title={
                            user.disabled ? "Aktifleştir" : "Devre dışı bırak"
                          }
                          className="p-2 rounded-lg hover:bg-surface-light text-text-muted hover:text-yellow-400 transition-all disabled:opacity-50"
                        >
                          <FiSlash className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          title="Düzenle"
                          className="p-2 rounded-lg hover:bg-surface-light text-text-muted hover:text-blue-400 transition-all"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteUser(user.id, user.username)
                          }
                          disabled={actionLoading === user.id}
                          title="Sil"
                          className="p-2 rounded-lg hover:bg-surface-light text-text-muted hover:text-neon-red transition-all disabled:opacity-50"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateUserModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => {
              setShowCreateModal(false);
              fetchUsers();
              showMsg("success", "Kullanıcı oluşturuldu");
            }}
            onError={(msg) => showMsg("error", msg)}
          />
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onUpdated={() => {
              setEditingUser(null);
              fetchUsers();
              showMsg("success", "Kullanıcı güncellendi");
            }}
            onError={(msg) => showMsg("error", msg)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateUserModal({
  onClose,
  onCreated,
  onError,
}: {
  onClose: () => void;
  onCreated: () => void;
  onError: (msg: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        onCreated();
      } else {
        setError(data.error || "Oluşturma başarısız");
      }
    } catch {
      onError("Sunucu hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-primary">
            Yeni Kullanıcı Oluştur
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-light transition-colors"
          >
            <FiX className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adı"
                className="w-full bg-surface-light border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              E-posta
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresi"
                className="w-full bg-surface-light border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full bg-surface-light border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Rol
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  role === "user"
                    ? "bg-surface-light border-neon-red/50 text-neon-red"
                    : "border-border text-text-muted hover:border-border"
                }`}
              >
                <FiUser className="w-4 h-4" />
                Kullanıcı
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  role === "admin"
                    ? "bg-teal/10 border-teal/50 text-teal"
                    : "border-border text-text-muted hover:border-border"
                }`}
              >
                <FiShield className="w-4 h-4" />
                Yönetici
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-neon-red/10 border border-neon-red/20 rounded-lg p-3 text-neon-red text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !email || !password}
            className="w-full gradient-red text-white font-medium py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiUserPlus className="w-4 h-4" />
                Oluştur
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function EditUserModal({
  user,
  onClose,
  onUpdated,
  onError,
}: {
  user: UserData;
  onClose: () => void;
  onUpdated: () => void;
  onError: (msg: string) => void;
}) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const updates: Record<string, string> = {};
    if (username !== user.username) updates.username = username;
    if (email !== user.email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (res.ok) {
        onUpdated();
      } else {
        setError(data.error || "Güncelleme başarısız");
      }
    } catch {
      onError("Sunucu hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-primary">
            Kullanıcı Düzenle
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-light transition-colors"
          >
            <FiX className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-light border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-neon-red/50 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              E-posta
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-light border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-neon-red/50 transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-neon-red/10 border border-neon-red/20 rounded-lg p-3 text-neon-red text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-border text-text-secondary hover:bg-surface-light transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 gradient-red text-white font-medium py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
