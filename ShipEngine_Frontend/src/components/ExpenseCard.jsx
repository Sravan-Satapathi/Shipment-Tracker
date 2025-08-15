import React from 'react';
import { Pencil, Trash2, Calendar, IndianRupee, CheckCircle, XCircle } from 'lucide-react';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {

    const getCategoryColor = (shipmentType) => {
        const colors = {
            'Sea': 'bg-success',         // Green
            'Air': 'bg-info',            // Light Blue
            'Land': 'bg-teal',           // Custom
        };

        return colors[shipmentType] || 'bg-secondary';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="card h-100 shadow-sm border-0 expense-card">
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                        <h6 className="card-title fw-bold text-truncate mb-1">{expense.shipmentTitle}</h6>
                        <span className={`badge ${getCategoryColor(expense.shipmentType)} text-white px-2 py-1 rounded-pill small`}>
                            {expense.shipmentType}
                        </span>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-link text-muted p-1" data-bs-toggle="dropdown">
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button className="dropdown-item d-flex align-items-center" onClick={() => onEdit(expense)}>
                                    <Pencil size={16} className="me-2" />
                                    Edit
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item text-danger d-flex align-items-center" onClick={() => onDelete(expense.id)}>
                                    <Trash2 size={16} className="me-2" />
                                    Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <p className="card-text text-muted small mb-3 flex-grow-1">
                    {expense.shipmentDescription || 'No description provided'}
                </p>

                <div className="mt-auto">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center text-muted small">
                            <Calendar size={14} className="me-1" />
                            {formatDate(expense.shipmentDate)}
                        </div>
                        <div className="d-flex align-items-center fw-bold text-dark">
                            <IndianRupee size={14} className="me-1" />
                            {expense.cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    {/* isDelivered field */}
                    <div className="d-flex align-items-center text-muted small">
                        {expense.isDelivered ? (
                            <>
                                <CheckCircle size={14} className="me-1 text-success" />
                                Delivered
                            </>
                        ) : (
                            <>
                                <XCircle size={14} className="me-1 text-danger" />
                                Not Delivered
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseCard;
