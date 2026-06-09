import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const BACKEND_URL = "https://backend-smart-crop-360.onrender.com";

const indianStates = [
  "All States","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
  "Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

const allCrops = [
  "Rice","Wheat","Maize","Jowar","Bajra","Ragi","Chickpea","Pigeon Pea",
  "Black Gram","Green Gram","Groundnut","Mustard","Sunflower","Soybean",
  "Sugarcane","Cotton","Tomato","Onion","Potato","Chilli","Brinjal",
  "Cabbage","Cauliflower","Okra","Cucumber","Pumpkin","Bitter Gourd",
  "Spinach","Carrot","Garlic","Ginger","Banana","Mango","Papaya",
  "Watermelon","Pomegranate","Guava","Orange","Lemon","Turmeric",
  "Coriander","Cumin","Cardamom","Pepper","Marigold","Rose",
];

interface Listing {
  id: number;
  farmerName: string;
  crop: string;
  quantity: number;
  price: number;
  unit: string;
  state: string;
  district: string;
  quality: string;
  harvestDate: string;
  phone: string;
  description: string;
  createdAt: string;
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [searchCrop, setSearchCrop] = useState("");
  const [searchState, setSearchState] = useState("All States");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    farmerName: "",
    crop: "",
    quantity: "",
    price: "",
    unit: "Quintal",
    state: "",
    district: "",
    quality: "A Grade",
    harvestDate: "",
    phone: "",
    description: "",
  });

  const updateForm = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    fetchListings();
    // Pre-fill farmer name from logged in user
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (user.name) updateForm("farmerName", user.name);
    if (user.state) updateForm("state", user.state);
    if (user.district) updateForm("district", user.district);
    if (user.phone) updateForm("phone", user.phone);
  }, []);

  useEffect(() => {
    fetchListings();
  }, [searchCrop, searchState]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = `${BACKEND_URL}/api/listings?`;
      if (searchCrop) url += `crop=${encodeURIComponent(searchCrop)}&`;
      if (searchState !== "All States") url += `state=${encodeURIComponent(searchState)}`;

      const response = await fetch(url);
      const data = await response.json();
      setListings(data.listings || []);
    } catch (err) {
      setError("Could not load listings. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    setError("");
    if (!form.farmerName || !form.crop || !form.quantity ||
        !form.price || !form.state || !form.phone) {
      setError("Please fill all required fields!");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to post listing!");
        return;
      }

      setShowSuccess(true);
      setForm({
        farmerName: "",
        crop: "",
        quantity: "",
        price: "",
        unit: "Quintal",
        state: "",
        district: "",
        quality: "A Grade",
        harvestDate: "",
        phone: "",
        description: "",
      });

      setTimeout(() => {
        setShowSuccess(false);
        setTab("buy");
        fetchListings();
      }, 2000);

    } catch (err) {
      setError("Cannot connect to server. Please try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🛒 Farmer Marketplace</h2>
          <p className="text-sm text-gray-500 mt-1">
            Buy directly from farmers or sell your produce — no middlemen!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm p-1 mb-6">
          <button onClick={() => setTab("buy")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
              tab === "buy"
                ? "bg-green-600 text-white shadow"
                : "text-gray-500 hover:text-green-600"}`}>
            🛒 Browse & Buy Crops
          </button>
          <button onClick={() => setTab("sell")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
              tab === "sell"
                ? "bg-green-600 text-white shadow"
                : "text-gray-500 hover:text-green-600"}`}>
            🌾 List My Crop for Sale
          </button>
        </div>

        {/* BUY TAB */}
        {tab === "buy" && (
          <div>
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    🔍 Search Crop
                  </label>
                  <input type="text" placeholder="e.g. Tomato, Rice..."
                    value={searchCrop}
                    onChange={(e) => setSearchCrop(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    📍 Filter by State
                  </label>
                  <select value={searchState}
                    onChange={(e) => setSearchState(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                    {indianStates.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">
                  {loading ? "Loading..." : `${listings.length} listings found`}
                </p>
                <button onClick={fetchListings}
                  className="text-xs text-green-600 hover:underline">
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Listings */}
            {loading ? (
              <div className="bg-white rounded-2xl p-10 text-center">
                <div className="text-4xl animate-bounce mb-3">🌾</div>
                <p className="text-gray-500">Loading listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                <div className="text-4xl mb-3">😕</div>
                <p className="text-gray-600 font-medium">No listings found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try a different crop or state
                </p>
                <button onClick={() => setTab("sell")}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                  + List Your Crop
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id}
                    className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800 text-lg">
                            {listing.crop}
                          </h3>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {listing.quality}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          👨‍🌾 {listing.farmerName} • 📍 {listing.district}, {listing.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          ₹{listing.price.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-gray-400">
                          per {listing.unit}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Quantity</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {listing.quantity} {listing.unit}s
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Quality</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {listing.quality}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Available</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {listing.harvestDate || "Now"}
                        </p>
                      </div>
                    </div>

                    {listing.description && (
                      <p className="text-sm text-gray-500 mb-3">
                        {listing.description}
                      </p>
                    )}

                    {showContact === listing.id ? (
                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-2">
                          📞 Contact {listing.farmerName}
                        </p>
                        <div className="flex gap-2">
                          <a href={`tel:${listing.phone}`}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-medium text-center">
                            📞 Call Now
                          </a>
                          <a href={`https://wa.me/91${listing.phone}?text=Hi ${listing.farmerName}, I am interested in buying your ${listing.crop} (${listing.quantity} ${listing.unit}s at ₹${listing.price}/${listing.unit}) listed on Smart Crop 360. Are you available?`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 bg-[#25D366] text-white py-2 rounded-lg text-xs font-medium text-center">
                            💬 WhatsApp
                          </a>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                          📍 {listing.district}, {listing.state}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowContact(listing.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
                        📞 Contact Farmer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SELL TAB */}
        {tab === "sell" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-1">
              📝 List Your Crop for Sale
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Fill in the details to connect with buyers directly
            </p>

            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
                <p className="text-green-700 font-semibold">
                  ✅ Your listing is live! Buyers can now contact you.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-600 text-sm">❌ {error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  👨‍🌾 Your Name *
                </label>
                <input type="text" placeholder="Enter your full name"
                  value={form.farmerName}
                  onChange={(e) => updateForm("farmerName", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  🌾 Crop Name *
                </label>
                <select value={form.crop}
                  onChange={(e) => updateForm("crop", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="">Select your crop</option>
                  {allCrops.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    ⚖️ Quantity *
                  </label>
                  <input type="number" placeholder="e.g. 500"
                    value={form.quantity}
                    onChange={(e) => updateForm("quantity", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    📦 Unit
                  </label>
                  <select value={form.unit}
                    onChange={(e) => updateForm("unit", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                    <option>Quintal</option>
                    <option>Kg</option>
                    <option>Tonne</option>
                    <option>Dozen</option>
                    <option>Box</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  💰 Your Price (₹ per unit) *
                </label>
                <input type="number" placeholder="e.g. 2200"
                  value={form.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    📍 State *
                  </label>
                  <select value={form.state}
                    onChange={(e) => updateForm("state", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                    <option value="">Select State</option>
                    {indianStates.filter(s => s !== "All States").map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    🏘️ District
                  </label>
                  <input type="text" placeholder="Enter district"
                    value={form.district}
                    onChange={(e) => updateForm("district", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  ⭐ Quality Grade
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["A Grade", "B Grade", "C Grade"].map((q) => (
                    <button key={q} onClick={() => updateForm("quality", q)}
                      className={`py-2 rounded-lg text-sm border transition ${
                        form.quality === q
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-300 text-gray-600"}`}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  📅 Available Date
                </label>
                <input type="date" value={form.harvestDate}
                  onChange={(e) => updateForm("harvestDate", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  📞 Your Phone Number *
                </label>
                <input type="tel" placeholder="10 digit mobile number"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  📝 Description (Optional)
                </label>
                <textarea placeholder="Describe your produce..."
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>

              <button onClick={handleSell}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
                🌾 Post My Listing
              </button>

              <p className="text-xs text-gray-400 text-center">
                * Required fields. Your listing will be visible to all buyers immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}