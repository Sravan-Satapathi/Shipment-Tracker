import React, { useState, useEffect, useContext } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import Menubar from '../components/Menubar';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseModal from '../components/ExpenseModal';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseStats from '../components/ExpenseStats';



const Expenses = () => {
    const { backendURL, userData } = useContext(AppContext);
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);



    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        setFilteredExpenses(expenses);
    }, [expenses]);

    const fetchExpenses = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get(`${backendURL}/shipments`);
            if (response.status === 200) {
                setExpenses(response.data.content);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = () => {
        setEditingExpense(null);
        setShowModal(true);
    };

    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setShowModal(true);
    };

    const handleSaveExpense = async (expenseData) => {
        console.log('Saving expense data:', expenseData);
        setModalLoading(true);
        try {
            axios.defaults.withCredentials = true;

            if (editingExpense) {
                // Update existing expense
                const response = await axios.put(`${backendURL}/shipments/${editingExpense.id}`, expenseData);
                if (response.status === 200) {
                    setExpenses(prev => prev.map(exp =>
                        exp.id === editingExpense.id ? response.data : exp
                    ));
                    toast.success('Expense updated successfully');
                }
            } else {
                // Add new expense
                const response = await axios.post(`${backendURL}/shipments`, expenseData);
                if (response.status === 200) {
                    setExpenses(prev => [response.data, ...prev]);
                    toast.success('Expense added successfully');
                }
            }
            setShowModal(false);
        }
        catch (error) {
            console.error('Error saving expense:', error);
            toast.error(error.response?.data?.message || 'Failed to save expense');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {
            axios.defaults.withCredentials = true;
            const response = await axios.delete(`${backendURL}/shipments/${expenseId}`);
            if (response.status === 200) {
                setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
                toast.success('Expense deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            toast.error('Failed to delete expense');
        }
    };

    const handleFilterChange = async (filters) => {
        try {
            // Remove empty filters
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );

            if (Object.keys(cleanFilters).length === 0) {
                setFilteredExpenses(expenses);
                return;
            }

            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendURL}/shipments/filter`, cleanFilters);
            if (response.status === 200) {
                setFilteredExpenses(response.data.content);
            }
        } catch (error) {
            console.error('Error filtering expenses:', error);
            toast.error('Failed to filter expenses');
        }
    };

    const handleClearFilters = () => {
        setFilteredExpenses(expenses);
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex flex-column">

            <Menubar />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>

            </div>

    );
    }

    return (
        <div className="min-vh-100 bg-light">

        <Menubar />

            <div className="container-fluid px-4 py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">My Shipments</h2>
                        <p className="text-muted mb-0">
                            Welcome back, {userData?.name}! Track and manage your Shipments.
                        </p>
                    </div>
                    <button
                        className="btn btn-outline-custom d-flex align-items-center gap-2"
                        onClick={handleAddExpense}
                    >
                        <Plus size={18} />
                        Add Shipment
                    </button>
                </div>

                {/* Stats */}
                <ExpenseStats expenses={expenses} />

                {/* Filters */}
                <ExpenseFilters
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                {/* Expenses Grid */}
                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <AlertCircle size={64} className="text-muted" />
                        </div>
                        <h4 className="fw-bold mb-2">No Shipments found</h4>
                        <p className="text-muted mb-4">
                            {expenses.length === 0
                                ? "You haven't added any shipments yet. Start by clicking the 'Add Shipment' button."
                                : "No expenses match your current filters. Try adjusting your search criteria."
                            }
                        </p>
                        {expenses.length === 0 && (
                            <button
                                className="btn btn-outline-custom"
                                onClick={handleAddExpense}
                            >
                                <Plus size={18} className="me-2" />
                                Add Your First Shipment
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredExpenses.map(expense => (
                            <div key={expense.id} className="col-md-6 col-lg-4 col-xl-3">
                                <ExpenseCard
                                    expense={expense}
                                    onEdit={handleEditExpense}
                                    onDelete={handleDeleteExpense}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <ExpenseModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSaveExpense}
                expense={editingExpense}
                loading={modalLoading}
            />
        </div>
    );
};

export default Expenses;