import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useContext(AppContext)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="loading-spinner"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!userData || !userData.isAccountVerified) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute