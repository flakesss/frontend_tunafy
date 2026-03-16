import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../api/articleApi';
import './BlogPreviewSection.css';

/**
 * BlogPreviewSection — ditampilkan di landing page antara WhyTunafySection
 * dan ScrollingLine. Menampilkan hingga 3 artikel terbaru dari API.
 */
const BlogPreviewSection = () => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id';

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await articleApi.getAll({ lang, limit: 3 });
        const data = res.data?.data?.data || [];
        // Prioritaskan artikel featured, sisanya urut terbaru
        const featured = data.find((a) => a.is_featured);
        const rest = data.filter((a) => !a.is_featured).slice(0, featured ? 2 : 3);
        setArticles(featured ? [featured, ...rest] : rest);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [lang]);

  // Selalu tampilkan section; state kosong ditangani di dalam

  return (
    <section className="blog-preview-section">
      <div className="blog-preview-container">
        {/* Header */}
        <div className="blog-preview-header">
          <p className="blog-preview-label">{t('blogPreview.label')}</p>
          <h2 className="blog-preview-heading">{t('blogPreview.heading')}</h2>
          <p className="blog-preview-subheading">{t('blogPreview.subheading')}</p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="blog-preview-loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="blog-preview-card blog-preview-card--skeleton" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="blog-preview-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
            <p className="blog-preview-empty__text">
              {lang === 'en' ? 'Articles coming soon. Stay tuned!' : 'Artikel segera hadir. Pantau terus!'}
            </p>
          </div>
        ) : (
          <div className="blog-preview-grid">
            {articles.map((article, idx) => (
              <Link
                key={article.id}
                to={`/blog/${article.slug}?lang=${lang}`}
                className={`blog-preview-card${idx === 0 ? ' blog-preview-card--featured' : ''}`}
              >
                {/* Image */}
                <div className="blog-preview-card__img-wrap">
                  {article.cover_image ? (
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="blog-preview-card__img"
                    />
                  ) : (
                    <div className="blog-preview-card__img-placeholder">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round">
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                      </svg>
                    </div>
                  )}
                  {idx === 0 && article.is_featured && (
                    <span className="blog-preview-card__badge">
                      {lang === 'en' ? 'Featured' : 'Unggulan'}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="blog-preview-card__body">
                  {article.category && (
                    <span className="blog-preview-card__cat">{article.category}</span>
                  )}
                  <h3 className="blog-preview-card__title">{article.title}</h3>
                  {article.excerpt && (
                    <p className="blog-preview-card__excerpt">{article.excerpt}</p>
                  )}
                  <div className="blog-preview-card__meta">
                    {article.author_name && <span>{article.author_name}</span>}
                    {article.author_name && <span className="blog-preview-card__dot" />}
                    <span>
                      {new Date(article.created_at).toLocaleDateString(
                        lang === 'en' ? 'en-US' : 'id-ID',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )}
                    </span>
                    {article.read_time_min && (
                      <>
                        <span className="blog-preview-card__dot" />
                        <span>{article.read_time_min} {lang === 'en' ? 'min read' : 'mnt baca'}</span>
                      </>
                    )}
                  </div>
                  <span className="blog-preview-card__read-more">
                    {t('blogPreview.readMore')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="blog-preview-cta">
          <Link to="/blog" className="blog-preview-cta-btn">
            {t('blogPreview.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
