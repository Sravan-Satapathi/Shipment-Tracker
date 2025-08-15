import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppConstants } from '../utils/constants'

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true

  const backendURL = AppConstants.BACKEND_URL
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dropdown, setDropdown] = useState(false)

  const getUserData = async () => {
    try {
      const res = await axios.get(`${backendURL}/profile`)
      if (res.status === 200) {
        setUserData(res.data)
        return res.data
      }
    } catch (err) {
      console.error('Failed to get user data:', err)
      return null
    }
  }

  const getAuthState = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${backendURL}/is-authenticated`)
      if (res.status === 200 && res.data === true) {
        setIsLoggedIn(true)
        await getUserData()
      } else {
        setIsLoggedIn(false)
        setUserData(null)
      }
    } catch (err) {
      setIsLoggedIn(false)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAuthState()
  }, [])

  const value = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    loading,
    dropdown,
    setDropdown
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}