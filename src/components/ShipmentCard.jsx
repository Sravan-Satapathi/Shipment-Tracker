import React from 'react';
import { Edit, Trash2, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { SHIPMENT_TYPE_COLORS, SHIPMENT_TYPE_ICONS } from '../util/constants';

const ShipmentCard = ({ shipment, onEdit, onDelete }) => {
    const getTypeColor = (type) => {
        const colors = {
            'AIR': 'bg-blue-100 text-blue-800',
            'SEA': 'bg-cyan-100 text-cyan-800',
            'ROAD': 'bg-green-100 text-green-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                            {shipment.shipmentTitle}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(shipment.shipmentType)}`}>
                                {SHIPMENT_TYPE_ICONS[shipment.shipmentType]} {shipment.shipmentType}
                            </span>
                            <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                shipment.isDelivered
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-orange-100 text-orange-800'
                            }`}>
                                {shipment.isDelivered ? (
                                    <>
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Delivered</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-3 h-3" />
                                        <span>In Transit</span>
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(shipment)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(shipment.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {shipment.shipmentDescription || 'No description provided'}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(shipment.shipmentDate)}
                    </div>
                    <div className="flex items-center text-lg font-semibold text-gray-800">
                        <DollarSign className="w-5 h-5 mr-1" />
                        {formatCurrency(shipment.cost)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentCard;