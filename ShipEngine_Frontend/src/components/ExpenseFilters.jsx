import React, { useState } from 'react';
import { Filter, X, Search } from 'lucide-react';

const ExpenseFilters = ({ onFilterChange, onClearFilters }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        keyword: '',
        shipmentType: '',
        startDate: '',
        endDate: '',
        minCost: '',
        maxCost: '',
    });

    const categories = [
        'Air', 'Sea', 'Road'
    ];

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
            maxCost: ''
        };
        setFilters(clearedFilters);
        onClearFilters();
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Filters</h6>
                <div className="d-flex gap-2">
                    {hasActiveFilters && (
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleClearFilters}
                        >
                            <X size={16} className="me-1" />
                            Clear
                        </button>
                    )}
                    <button
                        className="btn btn-outline-primary btn-sm d-md-none"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={16} className="me-1" />
                        {showFilters ? 'Hide' : 'Show'} Filters
                    </button>
                </div>
            </div>

            <div className={`${showFilters ? 'd-block' : 'd-none'} d-md-block`}>
                <div className="card border-0 bg-light">
                    <div className="card-body">
                        <div className="row g-3">
                            {/* Search */}
                            <div className="col-md-6 col-lg-4">
                                <label className="form-label small fw-semibold text-muted">
                                    Search
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <Search size={16} className="text-muted" />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search title or description..."
                                        value={filters.keyword}
                                        onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="col-md-6 col-lg-4">
                                <label className="form-label small fw-semibold text-muted">
                                    Category
                                </label>
                                <select
                                    className="form-control"
                                    value={filters.shipmentType}
                                    onChange={(e) => handleFilterChange('shipmentType', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Range */}
                            <div className="col-md-6 col-lg-4">
                                <label className="form-label small fw-semibold text-muted">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                />
                            </div>

                            <div className="col-md-6 col-lg-4">
                                <label className="form-label small fw-semibold text-muted">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                />
                            </div>

                            {/* Amount Range */}
                            <div className="col-md-6 col-lg-4">
                                <label className="form-label small fw-semibold text-muted">
                                    Min Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    value={filters.minCost}
                                    onChange={(e) => handleFilterChange('minCost', e.target.value)}
                                />
                            </div>

                            <div className="col-md-6 col-lg-4">
                                <label className="form-label small fw-semibold text-muted">
                                    Max Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
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

export default ExpenseFilters;