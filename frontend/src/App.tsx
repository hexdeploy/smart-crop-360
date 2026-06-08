import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CropRecommendation from "./pages/CropRecommendation";
import CropResults from "./pages/CropResults";
import DiseaseDetection from "./pages/DiseaseDetection";
import MarketPrices from "./pages/MarketPrices";
import Marketplace from "./pages/Marketplace";
import AIAssistant from "./pages/AIAssistant";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/crop-results" element={<CropResults />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/market-prices" element={<MarketPrices />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
      </Routes>
    </BrowserRouter>
  );
}