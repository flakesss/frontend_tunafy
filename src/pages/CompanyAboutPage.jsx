import { useEffect } from 'react'
import { Agentation } from 'agentation'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './FooterPages.css'

export default function CompanyAboutPage() {
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
    <div className="footer-page">
      <Navbar scrollYProgress={null} contentRef={null} alwaysVisible />
      <main>
        <div className="footer-page__container">
          <h1 className="footer-page__title">{t('companyAbout.title')}</h1>
          <div className="footer-page__content">
            <p>{t('companyAbout.dummyContent1')}</p>
            <p>{t('companyAbout.dummyContent2')}</p>
          </div>
        </div>
      </main>
      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </div>
  )
}
