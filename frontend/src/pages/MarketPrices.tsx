import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

const popularCrops = [
  "Tomato","Onion","Potato","Rice","Wheat","Maize","Cotton","Groundnut",
  "Soybean","Mustard","Sugarcane","Chilli","Brinjal","Cabbage","Cauliflower",
  "Okra","Cucumber","Banana","Mango","Papaya","Turmeric","Garlic","Ginger",
  "Jowar","Bajra","Ragi","Chickpea","Pigeon Pea","Green Gram","Black Gram",
];

interface MandiData {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  arrival_date: string;
}

export default function MarketPrices() {
  const navigate = useNavigate();
  const [crop, setCrop] = useState("Tomato");
  const [cropSearch, setCropSearch] = useState("");
  const [state, setState] = useState("Karnataka");
  const [quantity, setQuantity] = useState("100");
  const [results, setResults] = useState<MandiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const filteredCrops = popularCrops.filter((c) =>
    c.toLowerCase().includes(cropSearch.toLowerCase())
  );

  const fetchPrices = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    setSearched(true);

    try {
      const url = `https://backend-smart-crop-360.onrender.com/api/market-prices?commodity=${encodeURIComponent(crop)}&state=${encodeURIComponent(state)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.records && data.records.length > 0) {
        setResults(data.records);
      } else {
        setError(`No live data available right now for ${crop} in ${state}. Government API is temporarily unavailable.`);
      }
    } catch (err) {
      setError("Failed to connect to backend. Make sure Flask server is running!");
    } finally {
      setLoading(false);
    }
  };

  const getBestMandi = () => {
    if (results.length === 0) return null;
    return results.reduce((best, current) =>
      parseInt(current.modal_price) > parseInt(best.modal_price) ? current : best
    );
  };

  const getEstimatedEarnings = (modalPrice: string) => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(modalPrice) || 0;
    return Math.round((price * qty) / 100).toLocaleString("en-IN");
  };

  const best = getBestMandi();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

        <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📈 Live Market Prices</h2>
          <p className="text-sm text-gray-500 mt-1">
            Real prices from government Agmarknet database
          </p>
        </div>

        {/* Search Panel */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

          {/* Crop Search */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              🌾 Select Crop
            </label>
            <input
              type="text"
              placeholder="🔍 Search crop..."
              value={cropSearch}
              onChange={(e) => setCropSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {crop && (
              <p className="text-xs text-green-600 mb-2">✅ Selected: <strong>{crop}</strong></p>
            )}
            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto">
              {filteredCrops.map((c) => (
                <button key={c} onClick={() => setCrop(c)}
                  className={`py-1.5 px-2 rounded-lg text-xs border transition ${
                    crop === c
                      ? "bg-green-600 text-white border-green-600"
                      : "border-gray-200 text-gray-600 hover:border-green-400"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* State Selection */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              📍 Select State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
              {indianStates.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              ⚖️ Your Quantity (Quintals)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-40 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={fetchPrices}
            disabled={!crop || !state || loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition">
            {loading ? "⏳ Fetching Real Prices..." : "🔍 Get Live Market Prices"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center mb-6">
            <div className="text-5xl mb-4 animate-bounce">📊</div>
            <h3 className="font-bold text-gray-700 mb-2">Fetching live prices...</h3>
            <p className="text-sm text-gray-500">Getting real data from Agmarknet government database</p>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
              <div className="bg-green-500 h-2 rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl mb-2">😕</div>
            <p className="text-red-600 font-medium">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Try: Tomato in Karnataka, Onion in Maharashtra, Wheat in Punjab
            </p>
          </div>
        )}

        {/* Best Mandi Highlight */}
        {best && !loading && (
          <div className="bg-green-600 rounded-2xl p-5 mb-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-200 text-xs mb-1">⭐ BEST PRICE TODAY</p>
                <h3 className="font-bold text-xl mb-1">{best.market}</h3>
                <p className="text-green-200 text-sm">{best.district}, {best.state}</p>
                <p className="text-green-200 text-xs mt-1">
                  Last updated: {best.arrival_date}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">₹{best.modal_price}</p>
                <p className="text-green-200 text-xs">per Quintal</p>
                <p className="text-white font-semibold mt-1">
                  Est: ₹{getEstimatedEarnings(best.modal_price)}
                </p>
                <p className="text-green-200 text-xs">for {quantity} quintals</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {results.length > 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="font-bold text-gray-700 mb-4">
              🏪 All Mandis for {crop} in {state}
              <span className="text-xs text-gray-400 font-normal ml-2">
                ({results.length} markets found)
              </span>
            </h3>

            <div className="space-y-3">
              {results
                .sort((a, b) => parseInt(b.modal_price) - parseInt(a.modal_price))
                .map((item, i) => (
                  <div key={i}
                    className={`rounded-xl p-4 border transition ${
                      i === 0
                        ? "border-green-300 bg-green-50"
                        : "border-gray-100 bg-gray-50"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {i === 0 && (
                            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                              ⭐ Best Price
                            </span>
                          )}
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {item.market}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          📍 {item.district} • Variety: {item.variety}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Updated: {item.arrival_date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-700 text-lg">
                          ₹{item.modal_price}
                        </p>
                        <p className="text-xs text-gray-400">Modal Price</p>
                        <p className="text-xs text-gray-500 mt-1">
                          ₹{item.min_price} – ₹{item.max_price}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Est. earnings for {quantity} quintals:
                        <span className="font-bold text-green-700 ml-1">
                          ₹{getEstimatedEarnings(item.modal_price)}
                        </span>
                      </p>
                      <button className="text-xs text-green-600 border border-green-300 px-3 py-1 rounded-lg hover:bg-green-50">
                        Get Directions →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* No results yet */}
        {!searched && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="font-bold text-gray-700 mb-2">Search for Live Mandi Prices</h3>
            <p className="text-sm text-gray-500">
              Select a crop and state above to see real government mandi prices
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 max-w-sm mx-auto">
              {["Tomato → Karnataka", "Wheat → Punjab", "Onion → Maharashtra"].map((s) => (
                <span key={s} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={() => navigate("/marketplace")}
            className="bg-yellow-50 hover:bg-yellow-100 rounded-xl p-4 text-center transition">
            <div className="text-2xl mb-1">🛒</div>
            <p className="text-sm font-medium text-gray-700">Sell Directly to Buyers</p>
          </button>
          <button onClick={() => navigate("/ai-assistant")}
            className="bg-purple-50 hover:bg-purple-100 rounded-xl p-4 text-center transition">
            <div className="text-2xl mb-1">🤖</div>
            <p className="text-sm font-medium text-gray-700">Ask AI Assistant</p>
          </button>
        </div>

      </div>
    </div>
  );
}