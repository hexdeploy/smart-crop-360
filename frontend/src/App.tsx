import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CropRecommendation = lazy(() => import("./pages/CropRecommendation"));
const CropResults = lazy(() => import("./pages/CropResults"));
const DiseaseDetection = lazy(() => import("./pages/DiseaseDetection"));
const MarketPrices = lazy(() => import("./pages/MarketPrices"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Profile = lazy(() => import("./pages/Profile"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/crop-recommendation" element={
            <ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
          <Route path="/crop-results" element={
            <ProtectedRoute><CropResults /></ProtectedRoute>} />
          <Route path="/disease-detection" element={
            <ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
          <Route path="/market-prices" element={
            <ProtectedRoute><MarketPrices /></ProtectedRoute>} />
          <Route path="/marketplace" element={
            <ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={
            <ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}