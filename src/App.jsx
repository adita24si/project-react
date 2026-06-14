import "./assets/tailwind.css";
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Loading from "./components/Loading";
import { CRMProvider } from "./context/CRMContext";

/* Lazy Pages & Layouts */
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Customers = lazy(() => import("./pages/Customers"));
const CustomerDetail = lazy(() => import("./pages/CustomerDetail"));
const PurchaseHistory = lazy(() => import("./pages/PurchaseHistory"));
const PurchaseDetail = lazy(() => import("./pages/PurchaseDetail"));
const Memberships = lazy(() => import("./pages/Memberships"));
const MembershipDetail = lazy(() => import("./pages/MembershipDetail"));
const CustomerService = lazy(() => import("./pages/CustomerService"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const ProductConsultation = lazy(() => import("./pages/ProductConsultation"));
const ConsultationDetail = lazy(() => import("./pages/ConsultationDetail"));
const Promotions = lazy(() => import("./pages/Promotions"));
const PromotionDetail = lazy(() => import("./pages/PromotionDetail"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotificationDetail = lazy(() => import("./pages/NotificationDetail"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const CustomProjects = lazy(() => import("./pages/CustomProjects"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));

// --- 🛡️ PROTECTED ROUTE COMPONENT ---
// Mengecek apakah data user ada di localStorage
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <CRMProvider>
      <Suspense fallback={<Loading />}>
        <Routes>

          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* 🔑 Auth Layout Group */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
          </Route>

          {/* 🍵 Main Layout Group (Protected) */}
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Customers */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />

            {/* Purchase History */}
            <Route path="/purchase-history" element={<PurchaseHistory />} />
            <Route path="/purchase-history/:id" element={<PurchaseDetail />} />

            {/* Memberships */}
            <Route path="/memberships" element={<Memberships />} />
            <Route path="/memberships/:id" element={<MembershipDetail />} />

            {/* Customer Service */}
            <Route path="/customer-service" element={<CustomerService />} />
            <Route path="/customer-service/:id" element={<ServiceDetail />} />

            {/* Product Consultation */}
            <Route path="/product-consultation" element={<ProductConsultation />} />
            <Route path="/product-consultation/:id" element={<ConsultationDetail />} />

            {/* Custom Projects */}
            <Route path="/custom-projects" element={<CustomProjects />} />

            {/* Promotions */}
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/promotions/:id" element={<PromotionDetail />} />

            {/* Notifications */}
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications/:id" element={<NotificationDetail />} />

            {/* Error Pages inside Main Layout */}
            <Route path="/400" element={<ErrorPage code="400" />} />
            <Route path="/401" element={<ErrorPage code="401" />} />
            <Route path="/403" element={<ErrorPage code="403" />} />
            
            {/* Catch-all 404 inside Main Layout */}
            <Route path="*" element={<ErrorPage code="404" />} />
          </Route>

        </Routes>
      </Suspense>
    </CRMProvider>
  );
}

export default App;