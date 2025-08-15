import React from "react";
import { TrendingUp, IndianRupee, Calendar, CreditCard } from 'lucide-react';

const Stats = ({ expenses }) => {

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // === Calculations ===
    const thisMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.shipmentDate);
        return (
            expenseDate.getFullYear() === currentYear &&
            expenseDate.getMonth() + 1 === currentMonth
        );
    });

    const thisMonthTotal = thisMonthExpenses.reduce(
        (sum, expense) => sum + Number(expense.cost),
        0
    );

    const thisYearExpenses = expenses.filter(
        (expense) => new Date(expense.shipmentDate).getFullYear() === currentYear
    );

    const totalThisYear = thisYearExpenses.reduce(
        (sum, expense) => sum + Number(expense.cost),
        0
    );

    const avgPerMonth =
        currentMonth > 0 ? totalThisYear / currentMonth : 0;

    const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.cost),
        0
    );

    const count = expenses.length;

    const formatCurrency = (cost) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(cost);
    };

    const statCards = [
        {
            title: 'Shipment Transactions',
            value: formatCurrency(total),
            icon: IndianRupee,
            color: 'primary',
            bgColor: 'bg-primary'
        },
        {
            title: 'This Month',
            value: formatCurrency(thisMonthTotal),
            icon: Calendar,
            color: 'success',
            bgColor: 'bg-success'
        },
        {
            title: 'Monthly Avg (This Year)',
            value: formatCurrency(avgPerMonth),
            icon: TrendingUp,
            color: 'info',
            bgColor: 'bg-info'
        },
        {
            title: 'Total Shipments',
            value: count.toString(),
            icon: CreditCard,
            color: 'warning',
            bgColor: 'bg-warning'
        }
    ];

    return (
        <div className="mb-4">

            {/* === Stat Cards === */}
            <div className="row g-3">
                {statCards.map((stat, index) => (
                    <div key={index} className="col-md-6 col-lg-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className={`rounded-circle ${stat.bgColor} bg-opacity-10 p-3 me-3`}>
                                        <stat.icon size={24} className={`text-${stat.color}`} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="card-title small text-muted mb-1 fw-semibold">
                                            {stat.title}
                                        </p>
                                        <h5 className="mb-0 fw-bold">
                                            {stat.value}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stats;