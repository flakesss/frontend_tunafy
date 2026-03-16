import { useState, useEffect, useCallback } from 'react'
import AdminLayout from './AdminLayout'
import { adminApi } from '../../api/adminApi'

const ROLES = ['buyer', 'seller', 'admin']

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminApi.getUsers({ page, limit: 20 })
      const { data, meta } = res.data.data
      setUsers(data || [])
      setMeta(meta || {})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleRoleChange = async (userId, role) => {
    try {
      await adminApi.updateUserRole(userId, role)
      // Update local state optimistically
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
    } catch (e) {
      console.error(e)
      // Rollback on error
      fetchUsers()
    }
  }

  const getInitial = (user) => {
    const name = user.full_name || user.username || ''
    return name.charAt(0).toUpperCase() || '?'
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-subtitle">{meta.total ?? 0} total user terdaftar</p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card__header">
          <h2 className="admin-table-card__title">Daftar User</h2>
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <div className="admin-loading">Memuat data user...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th><th>Username</th>
                  <th>Role</th><th>Bergabung</th><th>Ubah Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="admin-empty">Tidak ada user</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: '#F6AA17', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 14, flexShrink: 0,
                          }}>
                            {getInitial(user)}
                          </div>
                          <span style={{ fontWeight: 600, color: '#111827' }}>
                            {user.full_name || '(Belum diisi)'}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: '#6B7280' }}>@{user.username}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${user.role}`}>{user.role}</span>
                      </td>
                      <td style={{ color: '#6B7280' }}>{formatDate(user.created_at)}</td>
                      <td>
                        <select
                          className="admin-select"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {meta.totalPages > 1 && (
          <div className="admin-pagination">
            <button className="admin-btn admin-btn--ghost admin-btn--sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
            <span>Halaman {page} / {meta.totalPages}</span>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
