import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/i18n'
import App from './App.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterStep1.jsx'
import BlogPage from './pages/BlogPage.jsx'
import ArticleDetailPage from './pages/ArticleDetailPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import { AuthProvider } from './context/AuthContext'
import AdminRoute from './router/AdminRoute.jsx'
import ScrollToTop from './components/common/ScrollToTop.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'
import AdminBlogPage from './pages/admin/AdminBlogPage.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import HubungiKamiPage from './pages/HubungiKamiPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000814', color: '#fff', fontSize: '1rem' }}>Loading...</div>}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<ArticleDetailPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/hubungi" element={<HubungiKamiPage />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />

            {/* Admin Routes — dilindungi AdminRoute (role: admin / seller) */}
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/blog" element={<AdminRoute><AdminBlogPage /></AdminRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Suspense>
  </StrictMode>,
)


