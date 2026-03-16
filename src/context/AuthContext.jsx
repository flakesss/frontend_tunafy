import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user dari localStorage saat app dimuat
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        forceClear()
      }
    }
    setLoading(false)
  }, [])

  // Fungsi login
  const login = (userData, sessionToken) => {
    const tokenToStore = sessionToken || userData.token || userData.session?.access_token
    
    if (tokenToStore) {
      localStorage.setItem('token', tokenToStore)
      setToken(tokenToStore)
    }
    
    const userDataToStore = { ...userData }
    delete userDataToStore.token
    delete userDataToStore.session
    
    localStorage.setItem('user', JSON.stringify(userDataToStore))
    setUser(userDataToStore)
  }

  // Fungsi logout
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      forceClear()
    }
  }

  // Force clear - untuk membersihkan data yang tidak lengkap
  const forceClear = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  // Check apakah user sudah login
  const isAuthenticated = !!token && !!user

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    forceClear,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
