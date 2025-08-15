import React from 'react'
import { TrendingUp, DollarSign, Package, CheckCircle, Truck, Ship, Plane } from 'lucide-react'

const ShipmentStats = ({ shipments }) => {
  const calculateStats = () => {
    if (!shipments || shipments.length === 0) {
      return {
        totalCost: 0,
        totalShipments: 0,
        deliveredCount: 0,
        avgCost: 0,
        typeBreakdown: { AIR: 0, SEA: 0, ROAD: 0 }
      }
    }

    const totalCost = shipments.reduce((sum, shipment) => sum + shipment.cost, 0)
    const totalShipments = shipments.length
    const deliveredCount = shipments.filter(s => s.isDelivered).length
    const avgCost = totalShipments > 0 ? totalCost / totalShipments : 0

    const typeBreakdown = shipments.reduce((acc, shipment) => {
      acc[shipment.shipmentType] = (acc[shipment.shipmentType] || 0) + 1
      return acc
    }, { AIR: 0, SEA: 0, ROAD: 0 })

    return { totalCost, totalShipments, deliveredCount, avgCost, typeBreakdown }
  }

  const stats = calculateStats()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const deliveryRate = stats.totalShipments > 0 ? (stats.deliveredCount / stats.totalShipments * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Cost */}
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Cost</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCost)}</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Total Shipments */}
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Shipments</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalShipments}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Package className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Delivered */}
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-gray-900">{stats.deliveredCount}</p>
            <p className="text-xs text-gray-500">{deliveryRate.toFixed(1)}% delivery rate</p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Average Cost */}
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Average Cost</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgCost)}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Shipment Type Breakdown */}
      <div className="card md:col-span-2 lg:col-span-4 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipment Types</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-2">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Air</p>
            <p className="text-xl font-bold text-gray-900">{stats.typeBreakdown.AIR}</p>
          </div>
          <div className="text-center">
            <div className="bg-cyan-100 p-3 rounded-lg w-fit mx-auto mb-2">
              <Ship className="w-6 h-6 text-cyan-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Sea</p>
            <p className="text-xl font-bold text-gray-900">{stats.typeBreakdown.SEA}</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-2">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Road</p>
            <p className="text-xl font-bold text-gray-900">{stats.typeBreakdown.ROAD}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShipmentStats