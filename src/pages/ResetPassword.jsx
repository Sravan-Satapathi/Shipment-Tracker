import { Link, useNavigate } from 'react-router-dom'
import { useContext, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Ship, Mail, Lock, Eye, EyeOff } from 'lucide-react'

const ResetPassword = () => {
  const inputRef = useRef([])
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const { backendURL } = useContext(AppContext)

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, '')
    e.target.value = value
    if (value && index < 5) {
      inputRef.current[index + 1]?.focus()
    }
  }

  const handleKeydown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').slice(0, 6).split('')
    paste.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit
      }
    })
    const next = paste.length < 6 ? paste.length : 5
    inputRef.current[next]?.focus()
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${backendURL}/send-reset-otp?email=${email}`)
      if (response.status === 200) {
        toast.success('Reset code sent to your email!')
        setIsEmailSent(true)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset code'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = () => {
    const otpValue = inputRef.current.map(input => input.value).join('')
    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits of the OTP')
      return
    }
    setOtp(otpValue)
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${backendURL}/reset-password`, { 
        email, 
        otp, 
        newPassword 
      })
      if (response.status === 200) {
        toast.success('Password reset successfully!')
        navigate('/login')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 flex items-center justify-center p-4">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center space-x-2 text-white hover:text-primary-200 transition-colors group"
      >
        <div className="bg-white p-2 rounded-lg group-hover:bg-primary-50 transition-colors">
          <Ship className="w-6 h-6 text-primary-600" />
        </div>
        <span className="text-xl font-bold">ShipTrack</span>
      </Link>

      {/* Step 1: Email Input */}
      {!isEmailSent && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="bg-primary-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-600 mt-2">
              Enter your registered email address
            </p>
          </div>

          <form onSubmit={onSubmitEmail} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading && <div className="loading-spinner"></div>}
              <span>{loading ? 'Sending...' : 'Send Reset Code'}</span>
            </button>
          </form>

          <div className="text-center mt-6">
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {!isOtpSubmitted && isEmailSent && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="bg-primary-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Enter Verification Code</h2>
            <p className="text-gray-600 mt-2">
              Enter the 6-digit code sent to your email
            </p>
            <p className="text-sm text-primary-600 mt-1 font-medium">{email}</p>
          </div>

          <div className="flex justify-center space-x-3 mb-8">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                maxLength={1}
                ref={(el) => inputRef.current[i] = el}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeydown(e, i)}
                onPaste={handlePaste}
                disabled={loading}
              />
            ))}
          </div>

          <button
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={loading}
            onClick={handleVerify}
          >
            {loading && <div className="loading-spinner"></div>}
            <span>{loading ? 'Verifying...' : 'Verify Code'}</span>
          </button>
        </div>
      )}

      {/* Step 3: New Password */}
      {isOtpSubmitted && isEmailSent && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="bg-primary-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Set New Password</h2>
            <p className="text-gray-600 mt-2">
              Enter your new password
            </p>
          </div>

          <form onSubmit={onSubmitNewPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter new password"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
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
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading && <div className="loading-spinner"></div>}
              <span>{loading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ResetPassword