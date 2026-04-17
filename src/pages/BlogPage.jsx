import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Agentation } from 'agentation'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { articleApi } from '../api/articleApi'
import heroBg from '../assets/images/Tangkapan-Tuna-di-Perairan-Maluku-Utara.-Foto-USAID-for-Kieraha.com_.jpg'
import './BlogPage.css'

const CATS_BY_LANG = {
  id: ['Semua', 'Industri', 'Teknologi', 'Nelayan', 'Panduan', 'Keberlanjutan', 'Tips'],
  en: ['All', 'Industry', 'Technology', 'Fishermen', 'Guide', 'Sustainability', 'Tips'],
}

export default function BlogPage() {
  const { i18n, t } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'  // mapsnya: 'id' atau 'en'

  const allLabel = lang === 'en' ? 'All' : 'Semua'
  const cats = CATS_BY_LANG[lang] || CATS_BY_LANG.id

  const [activeCategory, setActiveCategory] = useState(allLabel)
  const [articles, setArticles]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  /* Language switcher resets category to "Semua/All" */
  useEffect(() => {
    setActiveCategory(lang === 'en' ? 'All' : 'Semua')
  }, [lang])

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { lang, limit: 50 }
      if (activeCategory !== allLabel) params.category = activeCategory
      const res = await articleApi.getAll(params)
      setArticles(res.data.data.data || [])
    } catch (e) {
      setError('Gagal memuat artikel.')
    } finally {
      setLoading(false)
    }
  }, [lang, activeCategory, allLabel])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff'
    document.documentElement.style.backgroundColor = '#ffffff'
    return () => {
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  const featuredArticle = articles.find((a) => a.is_featured)
  const gridArticles    = articles.filter((a) => !a.is_featured)

  return (
    <>
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />

      <main className="blog-page">

        {/* ── Header ── */}
        <header className="blog-header">
          <div className="blog-header__bg" style={{ backgroundImage: `url(${heroBg})` }} />
          <div className="blog-header__overlay" />
          <div className="blog-header__content">
            <span className="blog-header__label">BLOG FLOCIFY</span>
            <h1 className="blog-header__title">{t('blog.title')}</h1>
            <p className="blog-header__subtitle">{t('blog.subtitle')}</p>
          </div>
          <div className="blog-header__wave" aria-hidden="true">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#ffffff"/>
            </svg>
          </div>
        </header>

        <div className="blog-container">

          {/* ── Category Filters ── */}
          <div className="blog-cats">
            {cats.map((cat) => (
              <button
                key={cat}
                className={`blog-cat-btn${activeCategory === cat ? ' blog-cat-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Loading / Error ── */}
          {loading && (
            <div className="blog-empty">
              <p style={{ color: '#0373FF' }}>Memuat artikel...</p>
            </div>
          )}

          {!loading && error && (
            <div className="blog-empty">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="blog-empty">
              <p>{lang === 'en' ? 'No articles available yet.' : 'Belum ada artikel tersedia.'}</p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <>
              {/* ── Featured Article ── */}
              {featuredArticle && (
                <Link to={`/blog/${featuredArticle.slug}`} className="blog-featured">
                  <div className="blog-featured__img-wrap">
                    {featuredArticle.cover_image ? (
                      <img src={featuredArticle.cover_image} alt={featuredArticle.title} className="blog-featured__img" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#E8F2FF,#DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="blog-featured__body">
                    <div className="blog-featured__label">
                      <span className="blog-featured__badge">{lang === 'en' ? 'FEATURED' : 'UNGGULAN'}</span>
                      <span className="blog-featured__cat">{featuredArticle.category}</span>
                    </div>
                    <h2 className="blog-featured__title">{featuredArticle.title}</h2>
                    <p className="blog-featured__excerpt">{featuredArticle.excerpt}</p>
                    <div className="blog-featured__meta">
                      <span>{featuredArticle.author_name}</span>
                      <span className="blog-featured__meta-dot" />
                      <span>{new Date(featuredArticle.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="blog-featured__meta-dot" />
                      <span>{featuredArticle.read_time_min} {lang === 'en' ? 'min read' : 'menit baca'}</span>
                    </div>
                    <span className="blog-featured__read-more">
                      {lang === 'en' ? 'Read Article' : 'Baca Artikel'}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              )}

              {/* ── Articles Grid ── */}
              {gridArticles.length > 0 && (
                <>
                  <h2 className="blog-section-title">{t('blog.latestArticles')}</h2>
                  <div className="blog-grid">
                    {gridArticles.map((article) => (
                      <Link to={`/blog/${article.slug}?lang=${lang}`} key={article.id} className="blog-card">
                        <div className="blog-card__img-wrap">
                          {article.cover_image ? (
                            <img src={article.cover_image} alt={article.title} className="blog-card__img" />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#E8F2FF,#DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="blog-card__body">
                          <span className="blog-card__cat">{article.category}</span>
                          <h3 className="blog-card__title">{article.title}</h3>
                          <p className="blog-card__excerpt">{article.excerpt}</p>
                          <div className="blog-card__meta">
                            <span>{new Date(article.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span className="blog-card__read-time">{article.read_time_min} {lang === 'en' ? 'min' : 'mnt'}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
