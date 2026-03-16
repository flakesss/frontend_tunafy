import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Agentation } from 'agentation'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { articleApi } from '../api/articleApi'
import './ArticleDetailPage.css'
import './BlogPage.css'

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const [searchParams] = useSearchParams()

  // Prioritize the lang in the URL query param, then fall back to i18n language
  const urlLang = searchParams.get('lang')
  const lang = urlLang || (i18n.language?.startsWith('en') ? 'en' : 'id')

  const [article, setArticle]               = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState('')

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff'
    document.documentElement.style.backgroundColor = '#ffffff'
    return () => {
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug, lang])

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await articleApi.getBySlug(slug, lang)
        const art = res.data.data
        setArticle(art)

        // Fetch related articles in same category and lang
        const relRes = await articleApi.getAll({ lang, limit: 4 })
        const allArts = relRes.data.data.data || []
        const related = allArts
          .filter(a => a.slug !== slug)
          .slice(0, 3)
        setRelatedArticles(related)
      } catch (e) {
        setError(lang === 'en' ? 'Article not found.' : 'Artikel tidak ditemukan.')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [slug, lang])

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

  return (
    <>
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />

      <main className="article-page">
        <div className="article-container">

          {/* ── Back Link ── */}
          <Link to="/blog" className="article-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {lang === 'en' ? 'Back to Blog' : 'Kembali ke Blog'}
          </Link>

          {/* ── Loading ── */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'Montserrat, sans-serif', color: '#0373FF' }}>
              {lang === 'en' ? 'Loading article...' : 'Memuat artikel...'}
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'Montserrat, sans-serif', color: 'rgba(0,15,30,.45)' }}>
              <p>{error}</p>
              <Link to="/blog" className="article-back" style={{ marginTop: 16, justifyContent: 'center' }}>
                ← {lang === 'en' ? 'Back to Blog' : 'Kembali ke Blog'}
              </Link>
            </div>
          )}

          {/* ── Article ── */}
          {!loading && !error && article && (
            <>
              {/* Header */}
              <header className="article-header">
                <div className="article-header__cats">
                  <span className="article-header__cat">{article.category}</span>
                </div>
                <h1 className="article-header__title">{article.title}</h1>
                <div className="article-header__meta">
                  <div className="article-header__author-chip">
                    <div className="article-header__author-avatar">
                      {(article.author_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <span className="article-header__author-name">{article.author_name}</span>
                  </div>
                  <span className="blog-featured__meta-dot" />
                  <span>{formatDate(article.created_at)}</span>
                  <span className="blog-featured__meta-dot" />
                  <span>{article.read_time_min} {lang === 'en' ? 'min read' : 'menit baca'}</span>
                </div>
              </header>

              {/* Hero Image */}
              {article.cover_image && (
                <div className="article-hero-img-wrap">
                  <img src={article.cover_image} alt={article.title} className="article-hero-img" />
                </div>
              )}

              {/* Content */}
              {article.content && (
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}
            </>
          )}
        </div>

        {/* ── Related Articles ── */}
        {!loading && !error && relatedArticles.length > 0 && (
          <div className="article-related">
            <div className="article-related__divider" />
            <h2 className="article-related__title">
              {lang === 'en' ? 'Related Articles' : 'Artikel Terkait'}
            </h2>
            <div className="article-related__grid">
              {relatedArticles.map((rel) => (
                <Link to={`/blog/${rel.slug}?lang=${lang}`} key={rel.id} className="blog-card">
                  <div className="blog-card__img-wrap">
                    {rel.cover_image ? (
                      <img src={rel.cover_image} alt={rel.title} className="blog-card__img" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#E8F2FF,#DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="blog-card__body">
                    <span className="blog-card__cat">{rel.category}</span>
                    <h3 className="blog-card__title">{rel.title}</h3>
                    <p className="blog-card__excerpt">{rel.excerpt}</p>
                    <div className="blog-card__meta">
                      <span>{new Date(rel.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="blog-card__read-time">{rel.read_time_min} {lang === 'en' ? 'min' : 'mnt'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
