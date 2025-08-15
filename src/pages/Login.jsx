import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { Ship, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { backendURL, setIsLoggedIn, getUserData, userData, isLoggedIn } = useContext(AppContext)
  const navigate = useNavigate()

  // Redirect if already logged in and verified
  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate('/shipments')
    }
  }, [isLoggedIn, userData, navigate])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isCreateAccount) {
        const response = await axios.post(`${backendURL}/register`, { name, email, password })
        if (response.status === 201) {
          toast.success('Account created successfully! Please login.')
          setIsCreateAccount(false)
          setName('')
          setPassword('')
        }
      } else {
        const response = await axios.post(`${backendURL}/login`, { email, password })
        if (response.status === 200) {
          setIsLoggedIn(true)
          await getUserData()
          navigate('/')
          toast.success('Login successful!')
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.data) {
        // Handle validation errors
        const errors = error.response.data
        Object.values(errors).forEach(err => toast.error(err))
      } else {
        toast.error('Network error, please try again')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 flex items-center justify-center p-4">
      {/* Logo */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center space-x-2 text-white hover:text-primary-200 transition-colors group"
      >
        <div className="bg-white p-2 rounded-lg group-hover:bg-primary-50 transition-colors">
          <Ship className="w-6 h-6 text-primary-600" />
        </div>
        <span className="text-xl font-bold">ShipTrack</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Ship className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {isCreateAccount ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isCreateAccount ? 'Join ShipTrack today' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Name Field (Create Account Only) */}
          {isCreateAccount && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                className="input-field pl-10"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field pl-10 pr-10"
                placeholder="Enter your password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isCreateAccount && (
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Forgot Password Link */}
          {!isCreateAccount && (
            <div className="text-right">
              <Link 
                to="/reset-password" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={loading}
          >
            {loading && <div className="loading-spinner"></div>}
            <span>
              {loading 
                ? 'Loading...' 
                : isCreateAccount 
                ? 'Create Account' 
                : 'Sign In'
              }
            </span>
          </button>
        </form>

        {/* Toggle Form */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isCreateAccount ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setIsCreateAccount(false)
                    setName('')
                    setPassword('')
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  disabled={loading}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setIsCreateAccount(true)
                    setPassword('')
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  disabled={loading}
                >
                  Create Account
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login