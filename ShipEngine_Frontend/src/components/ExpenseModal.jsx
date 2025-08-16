import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ExpenseModal = ({ show, onHide, onSave, expense = null, loading = false }) => {
    const [formData, setFormData] = useState({
        shipmentTitle: '',
        shipmentDescription: '',
        cost: '',
        shipmentType: 'None',
        shipmentDate: new Date().toISOString().split('T')[0],
        delivered: false,
    });

    const [errors, setErrors] = useState({});

    const categories = [
        'Air', 'Sea', 'Road'
    ];

    useEffect(() => {
        if (expense) {
            console.log(expense);
            setFormData({
                shipmentTitle: expense.shipmentTitle || '',
                shipmentDescription: expense.shipmentDescription || '',
                cost: expense.cost || '',
                shipmentType: expense.shipmentType || 'None',
                shipmentDate: expense.shipmentDate || new Date().toISOString().split('T')[0],
                delivered: expense.delivered !== undefined ? expense.delivered : false
            });
        } else {
            setFormData({
                shipmentTitle: '',
                shipmentDescription: '',
                cost: '',
                shipmentType: 'None',
                shipmentDate: new Date().toISOString().split('T')[0],
                delivered: false,
            });
        }
        setErrors({});
    }, [expense, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
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
            newErrors.shipmentTitle = 'Title is required';
        }

        if (!formData.cost || parseFloat(formData.cost) <= 0) {
            newErrors.cost = 'Amount must be greater than 0';
        }

        if (!formData.shipmentDate) {
            newErrors.shipmentDate = 'Date is required';
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            {expense ? 'Edit Expense' : 'Add New Expense'}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onHide}
                            disabled={loading}
                        ></button>
                    </div>
                    <div className="modal-body pt-3">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="shipmentTitle" className="form-label fw-semibold">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.shipmentTitle ? 'is-invalid' : ''}`}
                                    id="title"
                                    name="shipmentTitle"
                                    value={formData.shipmentTitle}
                                    onChange={handleChange}
                                    placeholder="Enter expense title"
                                    disabled={loading}
                                />
                                {errors.shipmentTitle && (
                                    <div className="invalid-feedback">{errors.shipmentTitle}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label fw-semibold">
                                    Description
                                </label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="shipmentDescription"
                                    value={formData.shipmentDescription}
                                    onChange={handleChange}
                                    placeholder="Enter description (optional)"
                                    rows="3"
                                    maxLength="255"
                                    disabled={loading}
                                ></textarea>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="amount" className="form-label fw-semibold">
                                        Amount *
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">₹</span>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.cost ? 'is-invalid' : ''}`}
                                            id="amount"
                                            name="cost"
                                            value={formData.cost}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            disabled={loading}
                                        />
                                        {errors.cost && (
                                            <div className="invalid-feedback">{errors.cost}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="category" className="form-label fw-semibold">
                                        Category
                                    </label>
                                    <select
                                        className="form-control"
                                        id="category"
                                        name="shipmentType"
                                        value={formData.shipmentType}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="date" className="form-label fw-semibold">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.shipmentDate ? 'is-invalid' : ''}`}
                                    id="date"
                                    name="shipmentDate"
                                    value={formData.shipmentDate}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                {errors.date && (
                                    <div className="invalid-feedback">{errors.date}</div>
                                )}
                            </div>

                            <div className="mb-3 form-check">
                                {
                                    console.log("fd : ",formData)
                                }
                                <input
                                    type="checkbox"
                                    className={`form-check-input ${errors.delivered ? 'is-invalid' : ''}`}
                                    id="isDelivered"
                                    name="delivered"
                                    checked={formData.delivered!==undefined ? formData.delivered===true : false}
                                    onChange={(e) => setFormData({ ...formData, delivered: e.target.checked })}
                                    disabled={loading}
                                />
                                <label className="form-check-label fw-semibold" htmlFor="delivered">
                                    Mark as Delivered
                                </label>
                                {
                                    errors.delivered && <div className="invalid-feedback">{errors.delivered}</div>
                                }
                            </div>


                            <div className="d-flex gap-2 justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={onHide}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-outline-custom"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            {expense ? 'Updating...' : 'Adding...'}
                                        </>
                                    ) : (
                                        expense ? 'Update Expense' : 'Add Expense'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseModal;
