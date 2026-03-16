import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Agentation } from 'agentation'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './LegalPage.css'

const PRIVACY_SECTIONS = ['s1','s2','s3','s4','s5','s6','s7','s8']

export default function PrivacyPage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff'
    document.documentElement.style.backgroundColor = '#ffffff'
    return () => {
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  return (
    <div className="legal-page">
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />

      {/* ── Hero ── */}
      <div className="legal-hero">
        <div className="legal-hero__inner">
          <div className="legal-hero__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            {t('privacy.heroBadge')}
          </div>
          <h1 className="legal-hero__title">{t('privacy.title')}</h1>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="legal-body">

        {/* Sidebar TOC */}
        <aside className="legal-toc">
          <p className="legal-toc__title">{t('privacy.toc')}</p>
          <ul className="legal-toc__list">
            {PRIVACY_SECTIONS.map((key, i) => (
              <li key={key} className="legal-toc__item">
                <a href={`#privacy-${key}`}>{i + 1}. {t(`privacy.${key}.title`)}</a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="legal-content">
          {/* Intro box */}
          <div className="legal-intro">
            <p>{t('privacy.intro')}</p>
          </div>

          {PRIVACY_SECTIONS.map((key, i) => {
            const isLast = key === 's8'
            return (
              <div key={key}>
                <section id={`privacy-${key}`} className="legal-section">
                  <div className="legal-section__header">
                    <div className="legal-section__num">{i + 1}</div>
                    <h2 className="legal-section__title">{t(`privacy.${key}.title`)}</h2>
                  </div>
                  <div className="legal-section__body">
                    <p>{t(`privacy.${key}.body`)}</p>
                    {isLast && (
                      <div className="legal-contact-box" style={{ marginTop: '24px' }}>
                        <div className="legal-contact-box__text">
                          <h3>{t('privacy.s8.title')}</h3>
                          <p>{t('privacy.s8.email')}</p>
                        </div>
                        <a href={`mailto:${t('privacy.s8.email')}`} className="legal-contact-box__email">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          {t('privacy.s8.cta')}
                        </a>
                      </div>
                    )}
                  </div>
                </section>
                {!isLast && <hr className="legal-divider" />}
              </div>
            )
          })}
        </main>
      </div>

      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </div>
  )
}
