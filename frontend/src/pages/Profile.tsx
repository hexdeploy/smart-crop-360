import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const BACKEND_URL = "https://backend-smart-crop-360.onrender.com";

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
}

export default function Profile() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "listings">("profile");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const form = {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    state: user.state || "",
    district: user.district || "",
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/listings?phone=${user.phone || ""}`
      );
      const data = await response.json();
      const myListings = (data.listings || []).filter(
        (l: Listing) => l.farmerName === user.name
      );
      setListings(myListings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    setDeleteLoading(id);
    try {
      const response = await fetch(`${BACKEND_URL}/api/listings/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setListings((prev) => prev.filter((l) => l.id !== id));
        setSuccessMsg("Listing deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="bg-green-600 rounded-2xl p-6 text-white text-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-2xl mx-auto mb-3">
            {user.name?.charAt(0).toUpperCase() || "F"}
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-green-200 text-sm">{user.email}</p>
          {user.state && (
            <p className="text-green-200 text-xs mt-1">
              📍 {user.district}, {user.state}
            </p>
          )}
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-center">
            <p className="text-green-600 text-sm">✅ {successMsg}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm p-1 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === "profile"
                ? "bg-green-600 text-white"
                : "text-gray-500"}`}>
            👤 My Profile
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === "listings"
                ? "bg-green-600 text-white"
                : "text-gray-500"}`}>
            🌾 My Listings ({listings.length})
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">👤 Profile Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Full Name</label>
                <div className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-gray-50">
                  {form.name}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Email</label>
                <div className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-gray-50">
                  {form.email}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Phone</label>
                <div className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-gray-50">
                  {form.phone || "Not provided"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">State</label>
                  <div className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-gray-50">
                    {form.state || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">District</label>
                  <div className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-gray-50">
                    {form.district || "Not provided"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate("/marketplace")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-medium transition">
                🌾 List a New Crop for Sale
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl text-sm font-medium transition border border-red-200">
                🚪 Logout
              </button>
            </div>
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === "listings" && (
          <div>
            {loading ? (
              <div className="bg-white rounded-2xl p-10 text-center">
                <div className="text-4xl animate-bounce mb-3">🌾</div>
                <p className="text-gray-500">Loading your listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-600 font-medium">No listings yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  List your crops for sale to connect with buyers
                </p>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium">
                  + Add Listing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id}
                    className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{listing.crop}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          📍 {listing.district}, {listing.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ₹{listing.price.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-gray-400">
                          per {listing.unit}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Quantity</p>
                        <p className="text-sm font-semibold">
                          {listing.quantity} {listing.unit}s
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Quality</p>
                        <p className="text-sm font-semibold">{listing.quality}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Available</p>
                        <p className="text-sm font-semibold">
                          {listing.harvestDate || "Now"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={deleteLoading === listing.id}
                      className="w-full bg-red-50 hover:bg-red-100 disabled:bg-gray-100 text-red-600 py-2.5 rounded-xl text-sm font-medium transition border border-red-200">
                      {deleteLoading === listing.id
                        ? "⏳ Deleting..."
                        : "🗑️ Delete This Listing"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}