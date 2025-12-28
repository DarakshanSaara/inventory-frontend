// src/components/StockManagement.jsx
import React, { useState, useEffect } from 'react';
import { stockApi } from '../services/stockApi';
import { productApi } from '../services/api';
import { toast } from 'react-hot-toast';

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionType, setTransactionType] = useState('IN');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, transactionsRes] = await Promise.all([
        productApi.getAll(),
        stockApi.getAllTransactions()
      ]);
      
      setProducts(productsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.quantity) {
      toast.error('Please select a product and enter quantity');
      return;
    }
    
    try {
      const apiCall = transactionType === 'IN' 
        ? stockApi.stockIn 
        : stockApi.stockOut;
      
      const response = await apiCall({
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        notes: formData.notes
      });
      
      toast.success(
        `Stock ${transactionType === 'IN' ? 'added to' : 'removed from'} inventory successfully`
      );
      
      resetForm();
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const resetForm = () => {
    setShowTransactionForm(false);
    setFormData({
      productId: '',
      quantity: '',
      notes: ''
    });
  };

  const getSelectedProduct = () => {
    return products.find(p => p.id === parseInt(formData.productId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading stock data...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stock Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setTransactionType('IN');
              setShowTransactionForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Stock In
          </button>
          <button
            onClick={() => {
              setTransactionType('OUT');
              setShowTransactionForm(true);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Stock Out
          </button>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {transactionType === 'IN' ? 'Stock In' : 'Stock Out'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Product *
                    </label>
                    <select
                      name="productId"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.productId}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} (Current: {product.currentStock} {product.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.productId && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Current Stock:</span>{' '}
                        {getSelectedProduct()?.currentStock} {getSelectedProduct()?.unit}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Minimum Required:</span>{' '}
                        {getSelectedProduct()?.minStockLevel} {getSelectedProduct()?.unit}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.quantity}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder={`Reason for stock ${transactionType.toLowerCase()}`}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-lg ${
                      transactionType === 'IN' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {transactionType === 'IN' ? 'Add Stock' : 'Remove Stock'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.transactionDate).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {transaction.product?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {transaction.product?.productId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      transaction.type === 'IN'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`font-bold ${
                      transaction.type === 'IN' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'IN' ? '+' : '-'}{transaction.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {transaction.notes || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-500">Start by adding or removing stock</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <span className="text-green-600 text-2xl">⬇️</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <span className="text-blue-600 text-2xl">📈</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <span className="text-purple-600 text-2xl">🔄</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Today's Transactions</p>
              <p className="text-2xl font-bold text-gray-800">
                {transactions.filter(t => {
                  const today = new Date().toDateString();
                  return new Date(t.transactionDate).toDateString() === today;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;