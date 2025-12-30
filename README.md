# Inventory Management System - Frontend (React)

https://img.shields.io/badge/React-18.2.0-blue

https://img.shields.io/badge/Tailwind%2520CSS-3.3.0-38B2AC

https://img.shields.io/badge/Deployed%2520on-Vercel-black

https://img.shields.io/badge/License-MIT-yellow

## 🌐 Live Application
Live URL: https://inventory-frontend-vert-eight.vercel.app/

## 📱 Features Overview
Feature	Status	Description
✅ Dashboard	Complete	Real-time inventory analytics
✅ Product Management	Complete	Full CRUD operations
✅ Supplier Management	Complete	Manage supplier details
✅ Stock Management	Complete	Stock in/out with history
✅ Reports & Analytics	Complete	Interactive charts & graphs
✅ Low Stock Alerts	Complete	Automated alert system
✅ Responsive Design	Complete	Mobile-first approach
✅ Authentication	Complete	Login/Logout functionality

## 🎨 Tech Stack
Technology	Version	Purpose
React	18.2.0	Frontend library
React Router DOM	6.14.2	Routing
Tailwind CSS	3.3.0	Styling framework
Axios	1.4.0	HTTP client
Recharts	2.8.0	Data visualization
React Hot Toast	2.4.1	Notifications
React Icons	4.10.1	Icon library
Vercel	-	Deployment platform

## 🚀 Getting Started
Prerequisites
Node.js 16.14.0 or higher

npm 8.19.0 or higher

Git

### Quick Installation
Step 1: Clone Repository
```
git clone https://github.com/DarakshanSaara/inventory-frontend.git
cd frontend
```
Step 2: Install Dependencies
```
npm install
# or
yarn install
```
Step 3: Configure Environment
# Copy environment example file
```
cp .env.example .env.local
```
# Edit .env.local and set your API URL
```
nano .env.local
```
# Add: REACT_APP_API_URL=https://inventory-backend-aq7l.onrender.com/api
Step 4: Start Development Server
```
npm start
# or
yarn start
```
Application will open at http://localhost:3000

## 📁 Project Structure
```
frontend/
│
├── node_modules/
│
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   │
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Products.jsx
│   │   ├── Reports.jsx
│   │   ├── StockManagement.jsx
│   │   └── Suppliers.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── stockApi.js
│   │   └── supplierApi.js
│   │
│   ├── styles/
│   │   └── App.css
│   │
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   └── setupTests.js
│
├── .env
├── .env.production
├── .gitignore
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```
## 👨‍💻 Author
Saara Darakshan

GitHub: [@yourusername](https://github.com/DarakshanSaara)

Email: saaradarakshan56@gmail.com

## 🌟 Features Implemented for Internship
### Core Requirements ✅

User Authentication - Login/Logout with role-based access

Dashboard - Real-time statistics and analytics

Product Management - Complete CRUD operations

Supplier Management - Supplier information handling

Stock Management - Stock in/out with transaction history

Reports & Analytics - Interactive charts and data visualization

Low Stock Alerts - Automated alert system

Responsive Design - Mobile-first, fully responsive UI

### Technical Excellence ✅

Modern React - Functional components with hooks

State Management - Context API for global state

API Integration - Axios with interceptors

Form Handling - React Hook Form with validation

Styling - Tailwind CSS with custom configuration

Error Handling - Comprehensive error boundaries

Performance - Code splitting, lazy loading

Deployment - CI/CD with Vercel

### User Experience ✅

Intuitive Navigation - Sidebar with active states

Real-time Updates - Immediate feedback on actions

Loading States - Skeleton loaders and spinners

Error Messages - User-friendly error notifications

Data Visualization - Charts for better insights

Mobile Optimization - Touch-friendly interfaces
