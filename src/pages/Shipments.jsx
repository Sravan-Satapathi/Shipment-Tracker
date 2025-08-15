import React, { useState, useEffect, useContext } from 'react'
import { Plus, AlertCircle, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Navbar from '../components/Navbar'
import ShipmentCard from '../components/ShipmentCard'
import ShipmentModal from '../components/ShipmentModal'
import ShipmentStats from '../components/ShipmentStats'

const Shipments = () => {
  const { backendURL, userData } = useContext(AppContext)
  const [shipments, setShipments] = useState([])
  const [allShipments, setAllShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingShipment, setEditingShipment] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(6)

  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [filters, setFilters] = useState({
    keyword: '',
    shipmentType: '',
    startDate: '',
    endDate: '',
    minCost: '',
    maxCost: '',
    isDelivered: ''
  })

  useEffect(() => {
    fetchShipments()
  }, [currentPage])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendURL}/shipments`, {
        params: {
          page: currentPage,
          size: pageSize,
          sortBy: 'shipmentDate',
          sortDir: 'desc'
        }
      })

      if (response.status === 200) {
        setShipments(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)

        // Fetch all shipments for stats
        const allResponse = await axios.get(`${backendURL}/shipments`, {
          params: {
            page: 0,
            size: 1000,
            sortBy: 'shipmentDate',
            sortDir: 'desc'
          }
        })
        setAllShipments(allResponse.data.content)
      }
    } catch (error) {
      console.error('Error fetching shipments:', error)
      toast.error('Failed to load shipments')
    } finally {
      setLoading(false)
    }
  }

  const handleAddShipment = () => {
    setEditingShipment(null)
    setShowModal(true)
  }

  const handleEditShipment = (shipment) => {
    setEditingShipment(shipment)
    setShowModal(true)
  }

  const handleSaveShipment = async (shipmentData) => {
    setModalLoading(true)
    try {
      if (editingShipment) {
        const response = await axios.put(`${backendURL}/shipments/${editingShipment.id}`, shipmentData)
        if (response.status === 200) {
          toast.success('Shipment updated successfully')
          fetchShipments()
        }
      } else {
        const response = await axios.post(`${backendURL}/shipments`, shipmentData)
        if (response.status === 200) {
          toast.success('Shipment added successfully')
          setCurrentPage(0)
          fetchShipments()
        }
      }
      setShowModal(false)
    } catch (error) {
      console.error('Error saving shipment:', error)
      toast.error(error.response?.data?.message || 'Failed to save shipment')
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteShipment = async (shipmentId) => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) {
      return
    }

    try {
      const response = await axios.delete(`${backendURL}/shipments/${shipmentId}`)
      if (response.status === 200) {
        toast.success('Shipment deleted successfully')
        fetchShipments()
      }
    } catch (error) {
      console.error('Error deleting shipment:', error)
      toast.error('Failed to delete shipment')
    }
  }

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = async (filterData) => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filterData).filter(([_, value]) => value !== '')
      )

      if (Object.keys(cleanFilters).length === 0) {
        setIsFiltering(false)
        setCurrentPage(0)
        fetchShipments()
        return
      }

      setIsFiltering(true)
      setCurrentPage(0)

      if (cleanFilters.isDelivered !== undefined) {
        cleanFilters.isDelivered = cleanFilters.isDelivered === 'true'
      }

      const response = await axios.post(`${backendURL}/shipments/filter`, cleanFilters, {
        params: {
          page: 0,
          size: pageSize,
          sortBy: 'shipmentDate',
          sortDir: 'desc'
        }
      })

      if (response.status === 200) {
        setShipments(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      }
    } catch (error) {
      console.error('Error filtering shipments:', error)
      toast.error('Failed to filter shipments')
    }
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      keyword: '',
      shipmentType: '',
      startDate: '',
      endDate: '',
      minCost: '',
      maxCost: '',
      isDelivered: ''
    }
    setFilters(clearedFilters)
    setIsFiltering(false)
    setCurrentPage(0)
    fetchShipments()
  }

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return
    setCurrentPage(newPage)
  }

  if (loading && currentPage === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="loading-spinner w-8 h-8 border-primary-600"></div>
            <span className="text-gray-600">Loading shipments...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipment Management</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {userData?.name}! Manage your shipments efficiently.
            </p>
          </div>
          <button
            className="btn-primary flex items-center space-x-2 shadow-lg"
            onClick={handleAddShipment}
          >
            <Plus className="w-5 h-5" />
            <span>Add Shipment</span>
          </button>
        </div>

        {/* Stats */}
        <ShipmentStats shipments={allShipments} />

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>
            <div className="flex space-x-2">
              {(isFiltering || Object.values(filters).some(v => v !== '')) && (
                <button
                  onClick={handleClearFilters}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="input-field pl-10 text-sm"
                    placeholder="Search title or description..."
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  />
                </div>
              </div>

              {/* Shipment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  className="input-field text-sm"
                  value={filters.shipmentType}
                  onChange={(e) => handleFilterChange('shipmentType', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="AIR">Air</option>
                  <option value="SEA">Sea</option>
                  <option value="ROAD">Road</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="input-field text-sm"
                  value={filters.isDelivered}
                  onChange={(e) => handleFilterChange('isDelivered', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="true">Delivered</option>
                  <option value="false">In Transit</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <input
                  type="date"
                  className="input-field text-sm"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipments Grid */}
        {shipments.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No shipments found</h3>
            <p className="text-gray-600 mb-6">
              {allShipments.length === 0
                ? "You haven't added any shipments yet. Start by clicking the 'Add Shipment' button."
                : "No shipments match your current filters. Try adjusting your search criteria."
              }
            </p>
            {allShipments.length === 0 && (
              <button
                className="btn-primary flex items-center space-x-2 mx-auto"
                onClick={handleAddShipment}
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Shipment</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {shipments.map(shipment => (
                <ShipmentCard
                  key={shipment.id}
                  shipment={shipment}
                  onEdit={handleEditShipment}
                  onDelete={handleDeleteShipment}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between card">
                <div className="text-sm text-gray-600">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} shipments
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          currentPage === index
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <ShipmentModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveShipment}
        shipment={editingShipment}
        loading={modalLoading}
      />
    </div>
  )
}

export default Shipments