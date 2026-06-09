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
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Farmer","email":""}');
  const firstLetter = user.name?.charAt(0).toUpperCase() || "F";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}>
          <span className="text-2xl">🌾</span>
          <span className="font-bold text-green-700 text-lg">Smart-Crop 360</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`text-sm font-medium transition px-2 py-1 rounded-lg ${
                location.pathname === item.path
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:text-green-600"}`}>
              {item.label}
            </button>
          ))}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => navigate("/profile")}
              className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {firstLetter}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-11 bg-white rounded-xl shadow-lg p-4 w-56 z-50 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {firstLetter}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                {user.state && (
                  <p className="text-xs text-gray-500 mb-3">
                    📍 {user.district}, {user.state}
                  </p>
                )}

                {/* View Profile */}
                <hr className="mb-3" />
                <button onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                  className="w-full text-left text-sm text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition flex items-center gap-2 mb-1">
                  👤 View Profile
                </button>
                <button onClick={handleLogout}
                  className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition flex items-center gap-2">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Right Side */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {firstLetter}
          </button>
          <button className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Profile Dropdown */}
      {profileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 px-4 py-3 sticky top-14 z-40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              {firstLetter}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition">
            🚪 Logout
          </button>
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 px-4 py-3 space-y-1 sticky top-14 z-40">
          {navItems.map((item) => (
            <button key={item.path}
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
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-1 transition ${
                location.pathname === item.path ? "text-green-600" : "text-gray-400"}`}>
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