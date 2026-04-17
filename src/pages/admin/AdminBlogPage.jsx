import { useState, useEffect, useCallback } from 'react'
import AdminLayout from './AdminLayout'
import { adminApi } from '../../api/adminApi'

const CATEGORIES_ID = ['Industri', 'Teknologi', 'Nelayan', 'Panduan', 'Keberlanjutan', 'Tips', 'Umum']
const CATEGORIES_EN = ['Industry', 'Technology', 'Fishermen', 'Guide', 'Sustainability', 'Tips', 'General']

const EMPTY_FORM = {
  lang: 'id',
  category: 'Umum',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  author_name: 'Admin Flocify',
  read_time_min: 3,
  is_featured: false,
  is_published: false,
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminBlogPage() {
  const [articles, setArticles] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterLang, setFilterLang] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (search) params.search = search
      if (filterLang) params.lang = filterLang
      const res = await adminApi.getArticles(params)
      const { data, meta } = res.data.data
      setArticles(data || [])
      setMeta(meta || {})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, search, filterLang])

  useEffect(() => { fetchArticles() }, [fetchArticles])

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (article) => {
    setEditing(article)
    setForm({
      lang: article.lang,
      category: article.category,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content || '',
      cover_image: article.cover_image || '',
      author_name: article.author_name || 'Admin Flocify',
      read_time_min: article.read_time_min || 3,
      is_featured: article.is_featured || false,
      is_published: article.is_published || false,
    })
    setError('')
    setModalOpen(true)
  }

  const onSave = async () => {
    if (!form.title.trim()) { setError('Judul artikel wajib diisi'); return }
    if (!form.lang) { setError('Pilih bahasa artikel'); return }
    setSaving(true)
    try {
      if (editing) {
        await adminApi.updateArticle(editing.id, form)
      } else {
        await adminApi.createArticle(form)
      }
      setModalOpen(false)
      fetchArticles()
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal menyimpan artikel')
    } finally {
      setSaving(false)
    }
  }

  const onTogglePublish = async (article) => {
    try {
      await adminApi.togglePublishArticle(article.id)
      fetchArticles()
    } catch (e) { console.error(e) }
  }

  const onDelete = async (id) => {
    try {
      await adminApi.deleteArticle(id)
      setDeleteConfirm(null)
      fetchArticles()
    } catch (e) { console.error(e) }
  }

  /* Category list berdasarkan pilihan lang di form */
  const categoryOptions = form.lang === 'en' ? CATEGORIES_EN : CATEGORIES_ID

  return (
    <AdminLayout>
      {/* ── Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blog</h1>
          <p className="admin-page-subtitle">{meta.total ?? 0} total artikel</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Tambah Artikel
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="admin-table-card">
        <div className="admin-table-card__header">
          <h2 className="admin-table-card__title">Daftar Artikel</h2>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Language Filter */}
            <select
              className="admin-input"
              style={{ width: 130 }}
              value={filterLang}
              onChange={(e) => { setFilterLang(e.target.value); setPage(1) }}
            >
              <option value="">Semua Bahasa</option>
              <option value="id">🇮🇩 Indonesia</option>
              <option value="en">🇬🇧 English</option>
            </select>
            <input
              className="admin-input"
              style={{ width: 220 }}
              placeholder="Cari judul artikel..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <div className="admin-loading">Memuat artikel...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Bahasa</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr><td colSpan={6} className="admin-empty">Belum ada artikel</td></tr>
                ) : (
                  articles.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {a.cover_image ? (
                            <img
                              src={a.cover_image}
                              alt={a.title}
                              style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                            />
                          ) : (
                            <div style={{
                              width: 44, height: 44, borderRadius: 8, background: '#E8F2FF',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                              </svg>
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: '#111827', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {a.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                              {a.read_time_min} menit baca {a.is_featured && '· ⭐ Unggulan'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 10px', borderRadius: 999,
                          background: a.lang === 'id' ? '#DCFCE7' : '#DBEAFE',
                          color: a.lang === 'id' ? '#166534' : '#1E40AF',
                          fontSize: '0.75rem', fontWeight: 700
                        }}>
                          {a.lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
                        </span>
                      </td>
                      <td>{a.category}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${a.is_published ? 'active' : 'inactive'}`}>
                          {a.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ color: '#6B7280', fontSize: '0.85rem' }}>{formatDate(a.created_at)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(a)}>Edit</button>
                          <button
                            className={`admin-btn admin-btn--sm ${a.is_published ? 'admin-btn--danger' : 'admin-btn--ghost'}`}
                            onClick={() => onTogglePublish(a)}
                          >
                            {a.is_published ? 'Draft' : 'Publish'}
                          </button>
                          <button
                            className="admin-btn admin-btn--danger admin-btn--sm"
                            onClick={() => setDeleteConfirm(a)}
                          >
                            Hapus
                          </button>
                        </div>
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

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">Hapus Artikel</h3>
              <button className="admin-modal__close" onClick={() => setDeleteConfirm(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="admin-modal__form" style={{ paddingTop: 0 }}>
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                Apakah Anda yakin ingin menghapus artikel <strong>"{deleteConfirm.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="admin-modal__actions">
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteConfirm(null)}>Batal</button>
              <button className="admin-btn admin-btn--danger" onClick={() => onDelete(deleteConfirm.id)}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 700 }}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editing ? 'Edit Artikel' : 'Tambah Artikel'}</h3>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {error && <p style={{ color: '#DC2626', fontSize: '0.8rem', margin: '0 0 12px', padding: '0 4px' }}>{error}</p>}

            <div className="admin-modal__form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                {/* ── Language Toggle ── */}
                <div className="admin-modal__field" style={{ gridColumn: '1 / -1' }}>
                  <label>Bahasa Artikel *</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[
                      { value: 'id', label: '🇮🇩 Indonesia (ID)', bg: '#DCFCE7', color: '#166534', border: '#86EFAC' },
                      { value: 'en', label: '🇬🇧 English (EN)', bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
                    ].map(({ value, label, bg, color, border }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => { setField('lang', value); setField('category', value === 'en' ? 'General' : 'Umum') }}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          borderRadius: 10,
                          border: `2px solid ${form.lang === value ? border : '#E5E7EB'}`,
                          background: form.lang === value ? bg : '#fff',
                          color: form.lang === value ? color : '#6B7280',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Judul ── */}
                <div className="admin-modal__field" style={{ gridColumn: '1 / -1' }}>
                  <label>Judul Artikel *</label>
                  <input
                    className="admin-input"
                    type="text"
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    placeholder={form.lang === 'id' ? 'mis. Cara Tuna Premium Menembus Pasar Jepang' : 'e.g. How Premium Tuna Reaches the Market'}
                  />
                </div>

                {/* ── Kategori + Read Time ── */}
                <div className="admin-modal__field">
                  <label>Kategori</label>
                  <select className="admin-input" value={form.category} onChange={(e) => setField('category', e.target.value)}>
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="admin-modal__field">
                  <label>Waktu Baca (menit)</label>
                  <input className="admin-input" type="number" min={1} max={60} value={form.read_time_min} onChange={(e) => setField('read_time_min', parseInt(e.target.value, 10))} />
                </div>

                {/* ── Author ── */}
                <div className="admin-modal__field" style={{ gridColumn: '1 / -1' }}>
                  <label>Nama Penulis</label>
                  <input className="admin-input" type="text" value={form.author_name} onChange={(e) => setField('author_name', e.target.value)} />
                </div>

                {/* ── Cover Image ── */}
                <div className="admin-modal__field" style={{ gridColumn: '1 / -1' }}>
                  <label>URL Gambar Cover</label>
                  <input className="admin-input" type="url" value={form.cover_image} onChange={(e) => setField('cover_image', e.target.value)} placeholder="https://images.unsplash.com/..." />
                  {form.cover_image && (
                    <img src={form.cover_image} alt="preview" style={{ marginTop: 8, height: 100, borderRadius: 8, objectFit: 'cover', width: '100%' }} onError={(e) => { e.target.style.display = 'none' }} />
                  )}
                </div>

                {/* ── Excerpt ── */}
                <div className="admin-modal__field" style={{ gridColumn: '1 / -1' }}>
                  <label>Ringkasan (Excerpt)</label>
                  <textarea className="admin-input" rows={2} value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} placeholder="Deskripsi singkat artikel (1-2 kalimat)..." />
                </div>

                {/* ── Content ── */}
                <div className="admin-modal__field" style={{ gridColumn: '1 / -1' }}>
                  <label>Konten Artikel <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(HTML diperbolehkan)</span></label>
                  <textarea
                    className="admin-input"
                    rows={10}
                    value={form.content}
                    onChange={(e) => setField('content', e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.6 }}
                    placeholder="<p>Konten artikel...</p>&#10;<h2>Heading 2</h2>&#10;<p>Paragraf...</p>"
                  />
                  <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 4 }}>
                    Gunakan &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;, &lt;strong&gt;
                  </p>
                </div>

                {/* ── Toggles ── */}
                <div className="admin-modal__field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setField('is_featured', e.target.checked)} />
                    ⭐ Jadikan Artikel Unggulan
                  </label>
                </div>

                <div className="admin-modal__field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setField('is_published', e.target.checked)} />
                    🌐 Langsung Publikasikan
                  </label>
                </div>
              </div>
            </div>

            <div className="admin-modal__actions">
              <button className="admin-btn admin-btn--ghost" onClick={() => setModalOpen(false)}>Batal</button>
              <button className="admin-btn admin-btn--primary" onClick={onSave} disabled={saving}>
                {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Buat Artikel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
