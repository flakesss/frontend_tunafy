import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/i18n'
import App from './App.jsx'
import MarketplacePage from './pages/MarketplacePage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterStep1.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import ArticleDetailPage from './pages/ArticleDetailPage.jsx'
import CompanyAboutPage from './pages/CompanyAboutPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import { AuthProvider } from './context/AuthContext'
import AdminRoute from './router/AdminRoute.jsx'
import ScrollToTop from './components/common/ScrollToTop.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx'
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'
import AdminBlogPage from './pages/admin/AdminBlogPage.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'

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
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<ArticleDetailPage />} />
            <Route path="/company-about" element={<CompanyAboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />

            {/* Admin Routes — dilindungi AdminRoute (role: admin / seller) */}
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/blog" element={<AdminRoute><AdminBlogPage /></AdminRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Suspense>
  </StrictMode>,
)


