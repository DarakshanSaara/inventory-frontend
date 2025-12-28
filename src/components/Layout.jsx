import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  LogOut,
  Home,
  Calendar,
  ChevronRight,
  Building2
} from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600';
  };

  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard Overview',
      '/products': 'Product Management',
      '/suppliers': 'Supplier Management',
      '/reports': 'Reports & Analytics'
    };
    return titles[location.pathname] || 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 mr-3">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
              <p className="text-gray-500 text-sm">Manufacturing System</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main Menu
          </div>

          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${isActive(
              '/dashboard'
            )}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            <span className="font-medium">Dashboard</span>
            {location.pathname === '/dashboard' && (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </Link>

          <Link
            to="/products"
            className={`flex items-center px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${isActive(
              '/products'
            )}`}
          >
            <Package className="w-5 h-5 mr-3" />
            <span className="font-medium">Products</span>
            {location.pathname === '/products' && (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </Link>

          <Link
            to="/suppliers"
            className={`flex items-center px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${isActive(
              '/suppliers'
            )}`}
          >
            <Users className="w-5 h-5 mr-3" />
            <span className="font-medium">Suppliers</span>
            {location.pathname === '/suppliers' && (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </Link>

          <Link
            to="/reports"
            className={`flex items-center px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${isActive(
              '/reports'
            )}`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            <span className="font-medium">Reports</span>
            {location.pathname === '/reports' && (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </Link>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Account
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="text-sm font-medium text-gray-900">Logged in as:</div>
            <div className="text-lg font-bold text-indigo-600 mt-1">
              {localStorage.getItem('userRole') || 'Admin'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {getPageTitle()}
              </h2>
              <div className="flex items-center mt-1 text-gray-600">
                <Home className="w-4 h-4 mr-1" />
                <span className="text-sm">Inventory Management System</span>
              </div>
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <div className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;