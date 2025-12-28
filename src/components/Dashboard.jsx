import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  Package, 
  AlertTriangle, 
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  ChevronRight,
  PieChart
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, lowStockRes] = await Promise.all([
        productApi.getDashboardStats(),
        productApi.getLowStock()
      ]);
      
      setStats(statsRes.data);
      setLowStockProducts(lowStockRes.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Function to handle view stats (already working since we're on dashboard)
  const handleViewStats = () => {
    // We're already on dashboard, so just scroll to stats section
    const statsSection = document.querySelector('.stats-grid-section');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your inventory.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link
              to="/products"
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Manage Products
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalProducts}</h3>
            <p className="text-gray-600 font-medium">Products</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>All products tracked</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Attention</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.lowStockCount}</h3>
            <p className="text-gray-600 font-medium">Low Stock Items</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-amber-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Requires immediate action</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Total Value</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              ${stats.totalValue.toLocaleString()}
            </h3>
            <p className="text-gray-600 font-medium">Inventory Value</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Current market value</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Alerts</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{lowStockProducts.length}</h3>
            <p className="text-gray-600 font-medium">Active Alerts</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-purple-600">
                <ExternalLink className="w-4 h-4 mr-1" />
                <span>Review all alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert Section */}
        {lowStockProducts.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 mr-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Low Stock Alerts</h2>
                  <p className="text-gray-600">Items requiring immediate attention</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold">
                {lowStockProducts.length} Items
              </span>
            </div>
            
            <div className="overflow-hidden rounded-xl border border-amber-100 bg-white">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Min Required</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lowStockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-amber-50/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mr-3"></div>
                          <span className="font-medium text-gray-900">{product.productId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                          {product.currentStock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.minStockLevel} units</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1.5" />
                          Needs Restock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <Link
                to="/products"
                className="inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                View all products
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              to="/products"
              className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 cursor-pointer"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300 mb-4">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Manage Products</h3>
              <p className="text-gray-500 text-sm mb-4">Add, edit, or delete products</p>
              <div className="flex items-center text-sm font-medium text-indigo-600">
                <span>Access now</span>
                <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>

            <Link
              to="/suppliers"
              className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 transition-all duration-300 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Suppliers</h3>
              <p className="text-gray-500 text-sm mb-4">Manage supplier details</p>
              <div className="flex items-center text-sm font-medium text-blue-600">
                <span>Access now</span>
                <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>

            <button
              onClick={handleViewStats}
              className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 text-left"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 group-hover:from-emerald-100 group-hover:to-green-100 transition-all duration-300 mb-4">
                <PieChart className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">View Stats</h3>
              <p className="text-gray-500 text-sm mb-4">See detailed inventory statistics</p>
              <div className="flex items-center text-sm font-medium text-emerald-600">
                <span>View now</span>
                <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </button>

            <Link
              to="/reports"
              className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 cursor-pointer"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 group-hover:from-purple-100 group-hover:to-pink-100 transition-all duration-300 mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Reports</h3>
              <p className="text-gray-500 text-sm mb-4">View analytics & reports</p>
              <div className="flex items-center text-sm font-medium text-purple-600">
                <span>Access now</span>
                <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;