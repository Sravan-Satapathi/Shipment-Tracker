import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Ship, Mail, RefreshCw } from 'lucide-react'

const EmailVerify = () => {
  const inputRef = useRef([])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const navigate = useNavigate()
  const { getUserData, isLoggedIn, userData, backendURL, setDropdown } = useContext(AppContext)

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate('/')
    }
  }, [isLoggedIn, userData, navigate])

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

  const handleVerify = async () => {
    const otp = inputRef.current.map(input => input.value).join('')
    if (otp.length !== 6) {
      toast.error('Please enter all 6 digits of the OTP')
      return
    }
    
    setLoading(true)
    try {
      const response = await axios.post(`${backendURL}/verify-otp`, { otp })
      if (response.status === 200) {
        setDropdown(false)
        toast.success('Email verified successfully!')
        await getUserData()
        navigate('/')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP'
      toast.error(message)
      // Clear inputs on error
      inputRef.current.forEach(input => {
        if (input) input.value = ''
      })
      inputRef.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResending(true)
    try {
      const response = await axios.post(`${backendURL}/send-otp`)
      if (response.status === 200) {
        toast.success('New verification code sent!')
        // Clear inputs
        inputRef.current.forEach(input => {
          if (input) input.value = ''
        })
        inputRef.current[0]?.focus()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP'
      toast.error(message)
    } finally {
      setResending(false)
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

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="bg-primary-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="text-gray-600 mt-2">
            Enter the 6-digit code sent to your email address
          </p>
          {userData?.email && (
            <p className="text-sm text-primary-600 mt-1 font-medium">
              {userData.email}
            </p>
          )}
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

        <div className="space-y-4">
          <button
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={loading}
            onClick={handleVerify}
          >
            {loading && <div className="loading-spinner"></div>}
            <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
          </button>

          <button
            className="w-full text-primary-600 hover:text-primary-700 py-2 font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            onClick={handleResendOtp}
            disabled={resending || loading}
          >
            <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
            <span>{resending ? 'Sending...' : 'Resend Code'}</span>
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Didn't receive the code? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmailVerify