import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/dashboard", icon: "🏠" },
  { label: "Crop Guide", path: "/crop-recommendation", icon: "🌾" },
  { label: "Disease Check", path: "/disease-detection", icon: "🔬" },
  { label: "Market Prices", path: "/market-prices", icon: "📈" },
  { label: "Sell Crop", path: "/marketplace", icon: "🛒" },
  { label: "AI Assistant", path: "/ai-assistant", icon: "🤖" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}>
          <span className="text-2xl">🌾</span>
          <span className="font-bold text-green-700 text-lg">Smart-Crop 360</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm font-medium transition px-2 py-1 rounded-lg ${
                location.pathname === item.path
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:text-green-600"}`}>
              {item.label}
            </button>
          ))}
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 px-4 py-3 space-y-1 sticky top-14 z-40">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-green-50 text-green-600"
                  : "text-gray-600 hover:bg-gray-50"}`}>
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-6 gap-0">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-1 transition ${
                location.pathname === item.path
                  ? "text-green-600"
                  : "text-gray-400"}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-0.5 truncate w-full text-center">
                {item.label.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}