import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Navbar from '../components/Navbar'
import { Ship, Plane, BarChart3, Clock, ArrowRight, CheckCircle } from 'lucide-react'

const Home = () => {
  const { userData, isLoggedIn, loading } = useContext(AppContext)
  const navigate = useNavigate()

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

  const shouldShowGetStarted = isLoggedIn && userData && !userData.isAccountVerified

  const handleGetStarted = () => {
    if (shouldShowGetStarted) {
      navigate('/email-verify')
    } else if (isLoggedIn && userData?.isAccountVerified) {
      navigate('/shipments')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 rounded-2xl shadow-2xl animate-pulse">
                  <Ship className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                ShipTrack
              </span>
              {userData && (
                <div className="text-3xl md:text-4xl text-primary-600 mt-4 font-medium">
                  Hello, {userData.name}! 👋
                </div>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Streamline your logistics operations with our comprehensive shipment management system.
              Track, manage, and optimize your shipping processes with ease.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="group bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <span>
                  {shouldShowGetStarted
                    ? 'Verify Email to Get Started'
                    : isLoggedIn && userData?.isAccountVerified
                    ? 'Go to Dashboard'
                    : 'Get Started'}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {!isLoggedIn && (
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2"
                >
                  <span>Already have an account?</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ShipTrack?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make your shipping operations more efficient and transparent.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Plane className="w-8 h-8 text-primary-600" />,
                title: 'Multi-Modal Shipping',
                description: 'Support for Air, Sea, and Road transportation with specialized tracking for each mode.',
                color: 'bg-primary-50 border-primary-200'
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-green-600" />,
                title: 'Advanced Analytics',
                description: 'Get insights into your shipping costs, delivery times, and performance metrics.',
                color: 'bg-green-50 border-green-200'
              },
              {
                icon: <Clock className="w-8 h-8 text-purple-600" />,
                title: 'Real-time Tracking',
                description: 'Monitor your shipments in real-time with instant status updates and notifications.',
                color: 'bg-purple-50 border-purple-200'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`${feature.color} border-2 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group`}
              >
                <div className="mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Logistics Professionals
            </h2>
            <p className="text-xl text-primary-100">
              Join thousands of companies streamlining their shipping operations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Shipments Tracked', icon: '📦' },
              { value: '99.9%', label: 'Uptime', icon: '⚡' },
              { value: '50+', label: 'Countries', icon: '🌍' },
              { value: '24/7', label: 'Support', icon: '🛟' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm hover:bg-opacity-20 transition-all"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ShipTrack</span>
            </div>
            <p className="text-center md:text-right">
              &copy; 2025 ShipTrack. Built with{' '}
              <span className="text-red-500">❤️</span>{' '}
              for logistics professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home