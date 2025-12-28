import React, { useState, useEffect } from 'react';
import { productApi, stockApi, supplierApi } from '../services/api';
import { toast } from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  AlertTriangle,
  Users,
  RefreshCw,
  Download,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Activity
} from 'lucide-react';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState({
    categoryDistribution: [],
    lowStockSummary: [],
    valueByCategory: [],
    stockMovement: {},
    totalProducts: 0,
    supplierCount: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all data in parallel
      const [
        categoryRes,
        lowStockSummaryRes,
        valueRes,
        stockRes,
        supplierRes,
        productsRes
      ] = await Promise.allSettled([
        productApi.getCategoryDistribution(),
        productApi.getLowStockSummary(),
        productApi.getValueByCategory(),
        stockApi.getStockReport(),
        supplierApi.getCount(),
        productApi.getAll()
      ]);

      // Process category distribution
      let categoryDistribution = [];
      if (categoryRes.status === 'fulfilled') {
        const data = categoryRes.value.data;
        categoryDistribution = Object.entries(data).map(([name, value]) => ({
          name,
          value
        }));
      } else {
        // Fallback: calculate from products
        if (productsRes.status === 'fulfilled') {
          const products = productsRes.value.data;
          const categoryCount = {};
          products.forEach(product => {
            const category = product.category || 'Uncategorized';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
          });
          categoryDistribution = Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value
          }));
        }
      }

      // Process low stock summary
      let lowStockSummary = [];
      if (lowStockSummaryRes.status === 'fulfilled') {
        lowStockSummary = lowStockSummaryRes.value.data;
      } else {
        // Fallback: use low-stock endpoint
        try {
          const lowStockRes = await productApi.getLowStock();
          lowStockSummary = lowStockRes.data.map(product => ({
            id: product.id,
            productId: product.productId,
            name: product.name,
            currentStock: product.currentStock,
            minStockLevel: product.minStockLevel,
            difference: product.minStockLevel - product.currentStock,
            category: product.category
          }));
        } catch (error) {
          console.error('Failed to fetch low stock:', error);
        }
      }

      // Process value by category
      let valueByCategory = [];
      if (valueRes.status === 'fulfilled') {
        const data = valueRes.value.data;
        valueByCategory = Object.entries(data).map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2))
        }));
      } else {
        // Fallback: calculate from products
        if (productsRes.status === 'fulfilled') {
          const products = productsRes.value.data;
          const valueMap = {};
          products.forEach(product => {
            const value = product.price * product.currentStock;
            const category = product.category || 'Uncategorized';
            valueMap[category] = (valueMap[category] || 0) + value;
          });
          valueByCategory = Object.entries(valueMap).map(([name, value]) => ({
            name,
            value: parseFloat(value.toFixed(2))
          }));
        }
      }

      // Process other data
      const stockMovement = stockRes.status === 'fulfilled' ? stockRes.value.data : {};
      const supplierCount = supplierRes.status === 'fulfilled' ? supplierRes.value.data.totalSuppliers || 0 : 0;
      const totalProducts = productsRes.status === 'fulfilled' ? productsRes.value.data.length : 0;

      setReports({
        categoryDistribution,
        lowStockSummary,
        valueByCategory,
        stockMovement,
        totalProducts,
        supplierCount
      });

    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading reports...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Inventory Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into your inventory performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchReports}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{reports.totalProducts}</h3>
          <p className="text-gray-600 font-medium">Products</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Across all categories</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Alerts</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{reports.lowStockSummary.length}</h3>
          <p className="text-gray-600 font-medium">Low Stock Items</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-amber-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>Requires attention</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Suppliers</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{reports.supplierCount}</h3>
          <p className="text-gray-600 font-medium">Active Suppliers</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-emerald-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Partnerships</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Transactions</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {reports.stockMovement.totalTransactions || 0}
          </h3>
          <p className="text-gray-600 font-medium">Total Transactions</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-purple-600">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span>Stock movements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 mr-3">
                <PieChartIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Products by Category</h2>
            </div>
          </div>
          <div className="h-[400px] w-full">
            {reports.categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reports.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reports.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Count']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 mb-4">
                    <PieChartIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No category data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Value by Category */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 mr-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Inventory Value by Category</h2>
            </div>
          </div>
          <div className="h-[400px] w-full">
            {reports.valueByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reports.valueByCategory}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Value']}
                    labelFormatter={(label) => `Category: ${label}`}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Inventory Value" 
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 mb-4">
                    <BarChart3 className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No value data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert Table */}
      {reports.lowStockSummary.length > 0 ? (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
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
              {reports.lowStockSummary.length} Items
            </span>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-amber-100 bg-white">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Min Required</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Shortfall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.lowStockSummary.map((product) => (
                  <tr key={product.id} className="hover:bg-amber-50/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mr-3"></div>
                        <span className="font-medium text-gray-900">{product.productId || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                        {product.currentStock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.minStockLevel} units</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1.5" />
                        {product.difference} needed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-8 text-center">
          <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All products are well-stocked!</h3>
          <p className="text-gray-600">No low stock alerts at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Reports;