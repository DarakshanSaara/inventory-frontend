// src/services/stockApi.js
import api from './api';

export const stockApi = {
  stockIn: (data) => api.post('/stock/in', data),
  stockOut: (data) => api.post('/stock/out', data),
  getAllTransactions: () => api.get('/stock/transactions'),
  getProductTransactions: (productId) => api.get(`/stock/transactions/product/${productId}`),
  getStockReport: () => api.get('/stock/report')
};