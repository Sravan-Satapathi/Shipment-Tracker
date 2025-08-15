import React, { useState, useEffect, useContext } from 'react';
import { Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ShipmentCard from '../components/ShipmentCard';
import ShipmentModal from '../components/ShipmentModal';
import ShipmentFilters from '../components/ShipmentFilters';
import ShipmentStats from '../components/ShipmentStats';

const Shipments = () => {
    const { backendURL, userData } = useContext(AppContext);
    const [shipments, setShipments] = useState([]);
    const [allShipments, setAllShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(6);

    // Filter state
    const [isFiltering, setIsFiltering] = useState(false);
    const [currentFilters, setCurrentFilters] = useState({});

    useEffect(() => {
        fetchShipments();
    }, [currentPage]);

    const fetchShipments = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const response = await axios.get(`${backendURL}/shipments`, {
                params: {
                    page: currentPage,
                    size: pageSize,
                    sortBy: 'shipmentDate',
                    sortDir: 'desc'
                }
            });

            if (response.status === 200) {
                setShipments(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);

                // Also fetch all shipments for stats (without pagination)
                const allResponse = await axios.get(`${backendURL}/shipments`, {
                    params: {
                        page: 0,
                        size: 1000, // Large number to get all
                        sortBy: 'shipmentDate',
                        sortDir: 'desc'
                    }
                });
                setAllShipments(allResponse.data.content);
            }
        } catch (error) {
            console.error('Error fetching shipments:', error);
            toast.error('Failed to load shipments');
        } finally {
            setLoading(false);
        }
    };

    const handleAddShipment = () => {
        setEditingShipment(null);
        setShowModal(true);
    };

    const handleEditShipment = (shipment) => {
        setEditingShipment(shipment);
        setShowModal(true);
    };

    const handleSaveShipment = async (shipmentData) => {
        setModalLoading(true);
        try {
            axios.defaults.withCredentials = true;

            if (editingShipment) {
                const response = await axios.put(`${backendURL}/shipments/${editingShipment.id}`, shipmentData);
                if (response.status === 200) {
                    toast.success('Shipment updated successfully');
                    fetchShipments(); // Refresh the current page
                }
            } else {
                const response = await axios.post(`${backendURL}/shipments`, shipmentData);
                if (response.status === 200) {
                    toast.success('Shipment added successfully');
                    setCurrentPage(0); // Go to first page for new shipment
                    fetchShipments();
                }
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving shipment:', error);
            toast.error(error.response?.data?.message || 'Failed to save shipment');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteShipment = async (shipmentId) => {
        if (!window.confirm('Are you sure you want to delete this shipment?')) {
            return;
        }

        try {
            axios.defaults.withCredentials = true;
            const response = await axios.delete(`${backendURL}/shipments/${shipmentId}`);
            if (response.status === 200) {
                toast.success('Shipment deleted successfully');
                fetchShipments();
            }
        } catch (error) {
            console.error('Error deleting shipment:', error);
            toast.error('Failed to delete shipment');
        }
    };

    const handleFilterChange = async (filters) => {
        try {
            setCurrentFilters(filters);
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );

            if (Object.keys(cleanFilters).length === 0) {
                setIsFiltering(false);
                setCurrentPage(0);
                fetchShipments();
                return;
            }

            setIsFiltering(true);
            setCurrentPage(0);

            // Convert string boolean to actual boolean for isDelivered
            if (cleanFilters.isDelivered !== undefined) {
                cleanFilters.isDelivered = cleanFilters.isDelivered === 'true';
            }

            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendURL}/shipments/filter`, cleanFilters, {
                params: {
                    page: 0,
                    size: pageSize,
                    sortBy: 'shipmentDate',
                    sortDir: 'desc'
                }
            });

            if (response.status === 200) {
                setShipments(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (error) {
            console.error('Error filtering shipments:', error);
            toast.error('Failed to filter shipments');
        }
    };

    const handleClearFilters = () => {
        setIsFiltering(false);
        setCurrentFilters({});
        setCurrentPage(0);
        fetchShipments();
    };

    const handlePageChange = async (newPage) => {
        if (newPage < 0 || newPage >= totalPages) return;

        setCurrentPage(newPage);

        if (isFiltering) {
            // Re-apply filters with new page
            const cleanFilters = Object.fromEntries(
                Object.entries(currentFilters).filter(([_, value]) => value !== '')
            );

            if (cleanFilters.isDelivered !== undefined) {
                cleanFilters.isDelivered = cleanFilters.isDelivered === 'true';
            }

            try {
                axios.defaults.withCredentials = true;
                const response = await axios.post(`${backendURL}/shipments/filter`, cleanFilters, {
                    params: {
                        page: newPage,
                        size: pageSize,
                        sortBy: 'shipmentDate',
                        sortDir: 'desc'
                    }
                });

                if (response.status === 200) {
                    setShipments(response.data.content);
                    setTotalPages(response.data.totalPages);
                    setTotalElements(response.data.totalElements);
                }
            } catch (error) {
                console.error('Error filtering shipments:', error);
                toast.error('Failed to filter shipments');
            }
        }
        // If not filtering, fetchShipments will be called by useEffect
    };

    if (loading && currentPage === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Loading shipments...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Shipment Management</h1>
                        <p className="text-gray-600 mt-2">
                            Welcome back, {userData?.name}! Manage your shipments efficiently.
                        </p>
                    </div>
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 shadow-lg"
                        onClick={handleAddShipment}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Shipment</span>
                    </button>
                </div>

                {/* Stats */}
                <ShipmentStats shipments={allShipments} />

                {/* Filters */}
                <ShipmentFilters
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

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
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
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
                            <div className="flex items-center justify-between bg-white rounded-lg shadow-lg border border-gray-100 px-6 py-4">
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
                                                        ? 'bg-blue-600 text-white'
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
    );
};

export default Shipments;