import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Ship, User, LogOut, Mail } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const [otpSending, setOtpSending] = useState(false)
  const { userData, backendURL, setUserData, setIsLoggedIn, dropdown, setDropdown } = useContext(AppContext)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setDropdown])

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendURL}/logout`)
      if (response.status === 200) {
        setIsLoggedIn(false)
        setUserData(null)
        setDropdown(false)
        navigate('/')
        toast.success('Logged out successfully')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Logout failed'
      toast.error(msg)
    }
  }

  const sendVerificationOtp = async () => {
    if (otpSending) return
    setOtpSending(true)
    try {
      const response = await axios.post(`${backendURL}/send-otp`)
      if (response.status === 200) {
        setDropdown(false)
        navigate('/email-verify')
        toast.success('Verification OTP sent successfully')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send verification OTP'
      toast.error(msg)
    } finally {
      setOtpSending(false)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Ship className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
              ShipTrack
            </span>
          </div>

          {/* User Menu */}
          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                onClick={() => setDropdown(prev => !prev)}
              >
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
              </button>

              {dropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-slide-up">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                    {userData.isAccountVerified ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                        ⚠ Unverified
                      </span>
                    )}
                  </div>

                  {!userData.isAccountVerified && (
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-primary-600 hover:bg-primary-50 flex items-center space-x-2 transition-colors"
                      onClick={sendVerificationOtp}
                      disabled={otpSending}
                    >
                      <Mail className="w-4 h-4" />
                      <span>{otpSending ? 'Sending...' : 'Verify Email'}</span>
                    </button>
                  )}

                  <button
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar