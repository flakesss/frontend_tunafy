import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Guard route — hanya bisa diakses oleh user dengan role admin atau seller.
 * Jika belum login → redirect ke /login
 * Jika login tapi bukan admin/seller → redirect ke /
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) return null // tunggu auth check selesai

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const role = user?.user_metadata?.role
  if (role !== 'admin' && role !== 'seller') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
