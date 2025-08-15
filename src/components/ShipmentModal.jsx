import React, { useState, useEffect } from 'react';
import { X, Ship, FileText, DollarSign, Calendar, Truck } from 'lucide-react';
import { SHIPMENT_TYPES } from '../util/constants';

const ShipmentModal = ({ show, onHide, onSave, shipment = null, loading = false }) => {
    const [formData, setFormData] = useState({
        shipmentTitle: '',
        shipmentDescription: '',
        shipmentType: 'AIR',
        isDelivered: false,
        cost: '',
        shipmentDate: new Date().toISOString().split('T')[0]
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (shipment) {
            setFormData({
                shipmentTitle: shipment.shipmentTitle || '',
                shipmentDescription: shipment.shipmentDescription || '',
                shipmentType: shipment.shipmentType || 'AIR',
                isDelivered: shipment.isDelivered || false,
                cost: shipment.cost || '',
                shipmentDate: shipment.shipmentDate || new Date().toISOString().split('T')[0]
            });
        } else {
            setFormData({
                shipmentTitle: '',
                shipmentDescription: '',
                shipmentType: 'AIR',
                isDelivered: false,
                cost: '',
                shipmentDate: new Date().toISOString().split('T')[0]
            });
        }
        setErrors({});
    }, [shipment, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.shipmentTitle.trim()) {
            newErrors.shipmentTitle = 'Shipment title is required';
        }

        if (!formData.cost || parseFloat(formData.cost) <= 0) {
            newErrors.cost = 'Cost must be greater than 0';
        }

        if (!formData.shipmentDate) {
            newErrors.shipmentDate = 'Shipment date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = {
            ...formData,
            cost: parseFloat(formData.cost)
        };

        onSave(submitData);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Ship className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {shipment ? 'Edit Shipment' : 'Add New Shipment'}
                        </h2>
                    </div>
                    <button
                        onClick={onHide}
                        disabled={loading}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shipment Title *
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="shipmentTitle"
                                value={formData.shipmentTitle}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.shipmentTitle ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter shipment title"
                                disabled={loading}
                            />
                        </div>
                        {errors.shipmentTitle && (
                            <p className="text-red-500 text-sm mt-1">{errors.shipmentTitle}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="shipmentDescription"
                            value={formData.shipmentDescription}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter shipment description (optional)"
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Shipment Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shipment Type
                            </label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="shipmentType"
                                    value={formData.shipmentType}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                >
                                    {Object.values(SHIPMENT_TYPES).map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Cost */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cost *
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.cost ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    disabled={loading}
                                />
                            </div>
                            {errors.cost && (
                                <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shipment Date *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="shipmentDate"
                                    value={formData.shipmentDate}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.shipmentDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={loading}
                                />
                            </div>
                            {errors.shipmentDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.shipmentDate}</p>
                            )}
                        </div>

                        {/* Delivery Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Delivery Status
                            </label>
                            <div className="flex items-center space-x-4 pt-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isDelivered"
                                        checked={formData.isDelivered}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        disabled={loading}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Mark as delivered</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onHide}
                            disabled={loading}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                            {loading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            <span>{loading ? (shipment ? 'Updating...' : 'Adding...') : (shipment ? 'Update Shipment' : 'Add Shipment')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShipmentModal;