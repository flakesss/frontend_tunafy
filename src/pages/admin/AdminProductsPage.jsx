import { useState, useEffect, useCallback, useRef } from 'react'
import AdminLayout from './AdminLayout'
import { adminApi } from '../../api/adminApi'

const SPECIES = ['Bluefin Tuna', 'Bigeye Tuna', 'Yellowfin Tuna']
const FORMS   = ['Loin (Skin-on)', 'Steak', 'Whole', 'Fillet']
const GRADES  = ['A+', 'A', 'B+']
const MAX_IMAGES = 10

const EMPTY_FORM = {
  name: '', species: SPECIES[0], form: FORMS[0], grade: GRADES[0],
  price_per_kg: '', min_order_kg: 1, stock_kg: '', location: '', description: '',
  images: [],
  catch_date: '', vessel_name: '', ocean_zone: '', vessel_id: '',
}

// ─── ImageUploader Component ─────────────────────────────────────────
function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = async (files) => {
    const fileArr = Array.from(files)
    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) { setUploadError(`Sudah mencapai batas ${MAX_IMAGES} foto.`); return }
    const toUpload = fileArr.slice(0, remaining)
    setUploadError('')
    setUploading(true)
    try {
      const formData = new FormData()
      toUpload.forEach(f => formData.append('images', f))
      const res = await adminApi.uploadProductImages(formData)
      const newUrls = res.data.data.urls
      onChange([...images, ...newUrls])
    } catch (e) {
      setUploadError(e.response?.data?.message || 'Upload gagal, coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  const onInputChange = (e) => { if (e.target.files?.length) handleFiles(e.target.files) }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx))

  const canAdd = images.length < MAX_IMAGES

  return (
    <div className="img-uploader">
      {/* Drop Zone */}
      {canAdd && (
        <div
          className={`img-uploader__zone ${isDragging ? 'dragging' : ''} ${uploading ? 'loading' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: 'none' }}
            onChange={onInputChange}
          />
          {uploading ? (
            <>
              <div className="img-uploader__spinner" />
              <p className="img-uploader__hint">Mengupload...</p>
            </>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p className="img-uploader__cta">Klik atau drag foto ke sini</p>
              <p className="img-uploader__hint">JPEG, PNG, WebP · Maks 5 MB/foto · {images.length}/{MAX_IMAGES} foto</p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {uploadError && <p className="img-uploader__error">{uploadError}</p>}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="img-uploader__grid">
          {images.map((url, idx) => (
            <div key={url} className="img-uploader__thumb">
              <img src={url} alt={`Foto ${idx + 1}`} />
              <button
                className="img-uploader__remove"
                onClick={() => removeImage(idx)}
                title="Hapus foto"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              {idx === 0 && <span className="img-uploader__main-badge">Utama</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── AdminProductsPage ───────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminApi.getProducts({ page, limit: 15, search: search || undefined })
      const { data, meta } = res.data.data
      setProducts(data || [])
      setMeta(meta || {})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true) }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name, species: product.species, form: product.form,
      grade: product.grade, price_per_kg: product.price_per_kg,
      min_order_kg: product.min_order_kg, stock_kg: product.stock_kg,
      location: product.location || '', description: product.description || '',
      images: product.images || [],
      catch_date: product.catch_date || '',
      vessel_name: product.vessel_name || '',
      ocean_zone: product.ocean_zone || '',
      vessel_id: product.vessel_id || '',
    })
    setError('')
    setModalOpen(true)
  }

  const onSave = async () => {
    if (!form.name || !form.price_per_kg) { setError('Nama dan harga wajib diisi'); return }
    setSaving(true)
    try {
      if (editing) {
        await adminApi.updateProduct(editing.id, form)
      } else {
        await adminApi.createProduct(form)
      }
      setModalOpen(false)
      fetchProducts()
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal menyimpan produk')
    } finally {
      setSaving(false)
    }
  }

  const onToggleActive = async (product) => {
    try {
      await adminApi.updateProduct(product.id, { is_active: !product.is_active })
      fetchProducts()
    } catch (e) { console.error(e) }
  }

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const formatRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID')

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Produk</h1>
          <p className="admin-page-subtitle">{meta.total ?? 0} total produk</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Produk
        </button>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card__header">
          <h2 className="admin-table-card__title">Daftar Produk</h2>
          <input
            className="admin-input"
            style={{ width: 240 }}
            placeholder="Cari nama produk..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <div className="admin-loading">Memuat produk...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produk</th><th>Species</th><th>Form</th><th>Grade</th>
                  <th>Harga/kg</th><th>Stok</th><th>Status</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={8} className="admin-empty">Tidak ada produk</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* Thumbnail foto pertama */}
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                            />
                          ) : (
                            <div style={{
                              width: 40, height: 40, borderRadius: 8, background: '#F1F5F9',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                              </svg>
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{p.images?.length || 0} foto</div>
                          </div>
                        </div>
                      </td>
                      <td>{p.species}</td>
                      <td>{p.form}</td>
                      <td>{p.grade}</td>
                      <td>{formatRp(p.price_per_kg)}</td>
                      <td>{p.stock_kg} kg</td>
                      <td>
                        <span className={`admin-badge admin-badge--${p.is_active ? 'active' : 'inactive'}`}>
                          {p.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(p)}>Edit</button>
                          <button className={`admin-btn admin-btn--sm ${p.is_active ? 'admin-btn--danger' : 'admin-btn--ghost'}`} onClick={() => onToggleActive(p)}>
                            {p.is_active ? 'Nonaktif' : 'Aktifkan'}
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

      {/* Modal Tambah/Edit */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 620 }}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editing ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {error && <p style={{ color: '#DC2626', fontSize: '0.8rem', marginBottom: 12 }}>{error}</p>}

            <div className="admin-modal__form">
              {/* ── Foto Produk ── */}
              <div className="admin-modal__field">
                <label>Foto Produk <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(maks. {MAX_IMAGES})</span></label>
                <ImageUploader
                  images={form.images}
                  onChange={(imgs) => setField('images', imgs)}
                />
              </div>

              {/* ── Info Dasar (2 kolom) ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-modal__field" style={{ gridColumn: '1 / -1' }}>
                  <label>Nama Produk *</label>
                  <input className="admin-input" type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="mis. Bluefin Loin Premium" />
                </div>

                {[
                  { label: 'Harga per kg (Rp) *', key: 'price_per_kg', type: 'number' },
                  { label: 'Stok (kg)', key: 'stock_kg', type: 'number' },
                  { label: 'Min Order (kg)', key: 'min_order_kg', type: 'number' },
                  { label: 'Lokasi', key: 'location', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div className="admin-modal__field" key={key}>
                    <label>{label}</label>
                    <input className="admin-input" type={type} value={form[key]} onChange={(e) => setField(key, e.target.value)} />
                  </div>
                ))}

                {[
                  { label: 'Species', key: 'species', options: SPECIES },
                  { label: 'Form', key: 'form', options: FORMS },
                  { label: 'Grade', key: 'grade', options: GRADES },
                ].map(({ label, key, options }) => (
                  <div className="admin-modal__field" key={key}>
                    <label>{label}</label>
                    <select className="admin-input" value={form[key]} onChange={(e) => setField(key, e.target.value)}>
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}

                <div className="admin-modal__field" style={{ gridColumn: '1 / -1' }}>
                  <label>Deskripsi</label>
                  <textarea className="admin-input" rows={3} value={form.description} onChange={(e) => setField('description', e.target.value)} />
                </div>

                {/* ── Separator Detail Penangkapan ── */}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #E5E7EB', paddingTop: 12, marginTop: 4 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Detail Penangkapan</p>
                </div>

                {[
                  { label: 'Catch Date', key: 'catch_date', type: 'date' },
                  { label: 'Vessel Name', key: 'vessel_name', type: 'text', placeholder: 'mis. Mina Laut' },
                  { label: 'Ocean Zone', key: 'ocean_zone', type: 'text', placeholder: 'mis. Banda Sea' },
                  { label: 'Vessel ID', key: 'vessel_id', type: 'text', placeholder: 'mis. #1234567' },
                ].map(({ label, key, type, placeholder }) => (
                  <div className="admin-modal__field" key={key}>
                    <label>{label}</label>
                    <input
                      className="admin-input"
                      type={type}
                      value={form[key]}
                      placeholder={placeholder || ''}
                      onChange={(e) => setField(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-modal__actions">
              <button className="admin-btn admin-btn--ghost" onClick={() => setModalOpen(false)}>Batal</button>
              <button className="admin-btn admin-btn--primary" onClick={onSave} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Produk'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
