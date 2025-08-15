import React, { useState } from 'react';
import { Filter, X, Search, Calendar, DollarSign } from 'lucide-react';
import { SHIPMENT_TYPES } from '../util/constants';

const ShipmentFilters = ({ onFilterChange, onClearFilters }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        keyword: '',
        shipmentType: '',
        startDate: '',
        endDate: '',
        minCost: '',
        maxCost: '',
        isDelivered: ''
    });

    const handleFilterChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            keyword: '',
            shipmentType: '',
            startDate: '',
            endDate: '',
            minCost: '',
            maxCost: '',
            isDelivered: ''
        };
        setFilters(clearedFilters);
        onClearFilters();
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Filter className="w-5 h-5 mr-2" />
                        Filters
                    </h3>
                    <div className="flex space-x-2">
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                                <span>Clear All</span>
                            </button>
                        )}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                        </button>
                    </div>
                </div>

                <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search title or description..."
                                    value={filters.keyword}
                                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Shipment Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shipment Type
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.shipmentType}
                                onChange={(e) => handleFilterChange('shipmentType', e.target.value)}
                            >
                                <option value="">All Types</option>
                                {Object.values(SHIPMENT_TYPES).map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Delivery Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Delivery Status
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.isDelivered}
                                onChange={(e) => handleFilterChange('isDelivered', e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="true">Delivered</option>
                                <option value="false">In Transit</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Min Cost */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Cost ($)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    value={filters.minCost}
                                    onChange={(e) => handleFilterChange('minCost', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Max Cost */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Cost ($)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    value={filters.maxCost}
                                    onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentFilters;