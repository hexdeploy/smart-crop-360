import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const cropDatabase = [
  {
    name: "Tomato", icon: "🍅", duration: "3-4 months", profit: "High",
    soils: ["Red Soil", "Loamy Soil", "Clay Soil"],
    water: ["Medium", "High"],
    seasons: ["Kharif (June–Oct)", "Rabi (Oct–Mar)"],
    landTypes: ["Wet Land", "Garden Land"],
    goals: ["Maximum Profit", "Short Duration"],
    desc: "High demand vegetable. Excellent for wet land and red soil.",
  },
  {
    name: "Onion", icon: "🧅", duration: "4-5 months", profit: "High",
    soils: ["Red Soil", "Loamy Soil", "Alluvial Soil"],
    water: ["Medium", "High"],
    seasons: ["Rabi (Oct–Mar)", "Kharif (June–Oct)"],
    landTypes: ["Dry Land", "Wet Land"],
    goals: ["Maximum Profit", "Low Investment"],
    desc: "High demand crop. Excellent for red soil regions.",
  },
  {
    name: "Groundnut", icon: "🥜", duration: "4-5 months", profit: "Medium",
    soils: ["Red Soil", "Sandy Soil", "Loamy Soil"],
    water: ["Low", "Medium"],
    seasons: ["Kharif (June–Oct)", "Zaid (Mar–Jun)"],
    landTypes: ["Dry Land"],
    goals: ["Low Investment", "Less Water Usage"],
    desc: "Excellent for dry land. Low water requirement.",
  },
  {
    name: "Cotton", icon: "🌿", duration: "5-6 months", profit: "High",
    soils: ["Black Soil", "Alluvial Soil"],
    water: ["Medium", "High"],
    seasons: ["Kharif (June–Oct)"],
    landTypes: ["Wet Land", "Dry Land"],
    goals: ["Maximum Profit"],
    desc: "Best for black soil. High profit cash crop.",
  },
  {
    name: "Rice", icon: "🌾", duration: "3-4 months", profit: "Medium",
    soils: ["Clay Soil", "Alluvial Soil", "Loamy Soil"],
    water: ["High"],
    seasons: ["Kharif (June–Oct)"],
    landTypes: ["Wet Land"],
    goals: ["Low Investment"],
    desc: "Staple crop. Best for clay and alluvial soil with high water.",
  },
  {
    name: "Wheat", icon: "🌾", duration: "4-5 months", profit: "Medium",
    soils: ["Loamy Soil", "Clay Soil", "Alluvial Soil"],
    water: ["Medium"],
    seasons: ["Rabi (Oct–Mar)"],
    landTypes: ["Dry Land", "Wet Land"],
    goals: ["Low Investment", "Maximum Profit"],
    desc: "Winter staple crop. Best for rabi season.",
  },
  {
    name: "Maize", icon: "🌽", duration: "3-4 months", profit: "Medium",
    soils: ["Loamy Soil", "Sandy Soil", "Red Soil"],
    water: ["Low", "Medium"],
    seasons: ["Kharif (June–Oct)", "Rabi (Oct–Mar)"],
    landTypes: ["Dry Land", "Wet Land"],
    goals: ["Short Duration", "Low Investment"],
    desc: "Versatile crop. Grows well in most conditions.",
  },
  {
    name: "Sugarcane", icon: "🎋", duration: "10-12 months", profit: "High",
    soils: ["Alluvial Soil", "Loamy Soil", "Clay Soil"],
    water: ["High"],
    seasons: ["Kharif (June–Oct)", "Zaid (Mar–Jun)"],
    landTypes: ["Wet Land"],
    goals: ["Maximum Profit"],
    desc: "Long duration but very high profit. Needs lots of water.",
  },
  {
    name: "Soybean", icon: "🫘", duration: "3-4 months", profit: "Medium",
    soils: ["Black Soil", "Loamy Soil", "Alluvial Soil"],
    water: ["Medium"],
    seasons: ["Kharif (June–Oct)"],
    landTypes: ["Dry Land", "Wet Land"],
    goals: ["Low Investment", "Organic Friendly"],
    desc: "Protein rich crop. Great for black soil regions.",
  },
  {
    name: "Mustard", icon: "🌻", duration: "3-4 months", profit: "Medium",
    soils: ["Loamy Soil", "Sandy Soil", "Alluvial Soil"],
    water: ["Low", "Medium"],
    seasons: ["Rabi (Oct–Mar)"],
    landTypes: ["Dry Land"],
    goals: ["Less Water Usage", "Low Investment"],
    desc: "Winter oilseed crop. Low water requirement.",
  },
  {
    name: "Chilli", icon: "🌶️", duration: "4-5 months", profit: "High",
    soils: ["Red Soil", "Loamy Soil", "Black Soil"],
    water: ["Medium"],
    seasons: ["Kharif (June–Oct)", "Rabi (Oct–Mar)"],
    landTypes: ["Dry Land", "Garden Land"],
    goals: ["Maximum Profit", "Short Duration"],
    desc: "High value spice crop. Great market demand.",
  },
  {
    name: "Turmeric", icon: "🟡", duration: "7-9 months", profit: "High",
    soils: ["Red Soil", "Loamy Soil", "Alluvial Soil"],
    water: ["Medium", "High"],
    seasons: ["Kharif (June–Oct)"],
    landTypes: ["Wet Land", "Garden Land"],
    goals: ["Maximum Profit", "Organic Friendly"],
    desc: "High value spice. Excellent for tropical regions.",
  },
  {
    name: "Banana", icon: "🍌", duration: "10-12 months", profit: "High",
    soils: ["Alluvial Soil", "Loamy Soil", "Clay Soil"],
    water: ["High"],
    seasons: ["Kharif (June–Oct)", "Zaid (Mar–Jun)"],
    landTypes: ["Wet Land", "Garden Land"],
    goals: ["Maximum Profit"],
    desc: "Tropical fruit with high and consistent market demand.",
  },
  {
    name: "Watermelon", icon: "🍉", duration: "2-3 months", profit: "Medium",
    soils: ["Sandy Soil", "Loamy Soil", "Red Soil"],
    water: ["Medium"],
    seasons: ["Zaid (Mar–Jun)"],
    landTypes: ["Dry Land", "Wet Land"],
    goals: ["Short Duration", "Low Investment"],
    desc: "Fast growing summer crop. Good market demand.",
  },
  {
    name: "Jowar", icon: "🌾", duration: "3-4 months", profit: "Low",
    soils: ["Black Soil", "Red Soil", "Loamy Soil"],
    water: ["Low"],
    seasons: ["Kharif (June–Oct)", "Rabi (Oct–Mar)"],
    landTypes: ["Dry Land"],
    goals: ["Less Water Usage", "Low Investment"],
    desc: "Drought resistant cereal crop. Very low water need.",
  },
  {
    name: "Bajra", icon: "🌾", duration: "2-3 months", profit: "Low",
    soils: ["Sandy Soil", "Red Soil", "Loamy Soil"],
    water: ["Low"],
    seasons: ["Kharif (June–Oct)", "Zaid (Mar–Jun)"],
    landTypes: ["Dry Land"],
    goals: ["Less Water Usage", "Short Duration"],
    desc: "Hardy millet. Best for dry and arid regions.",
  },
];

function getMatchScore(crop: typeof cropDatabase[0], form: any): number {
  let score = 0;
  if (crop.soils.includes(form.soilType)) score += 30;
  if (crop.water.includes(form.waterAvailability)) score += 25;
  if (crop.seasons.includes(form.season)) score += 25;
  if (crop.landTypes.includes(form.landType)) score += 15;
  if (crop.goals.includes(form.goal)) score += 5;
  return score;
}

function getProfitColor(profit: string) {
  if (profit === "High") return "text-green-600 bg-green-50";
  if (profit === "Medium") return "text-yellow-600 bg-yellow-50";
  return "text-gray-600 bg-gray-50";
}

export default function CropResults() {
  const { state: form } = useLocation();
  const navigate = useNavigate();

  const scored = cropDatabase
    .map((crop) => ({ ...crop, score: getMatchScore(crop, form) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Your Crop Recommendations 🌾
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Based on {form?.district}, {form?.state} • {form?.landSize} acres {form?.landType} • {form?.season}
          </p>
          {form?.lastCrop && (
            <p className="text-xs text-gray-400 mt-1">
              Previous crop: {form.lastCrop}
            </p>
          )}
        </div>

        {/* Crop Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {scored.map((crop, index) => (
            <div key={crop.name}
              className={`bg-white rounded-2xl shadow-sm p-5 border transition hover:shadow-md
                ${index === 0 ? "border-green-300 ring-2 ring-green-100" : "border-gray-100"}`}>

              {/* Best Match Badge */}
              {index === 0 && (
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full mb-2 inline-block">
                  ⭐ Best Match
                </span>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{crop.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{crop.name}</h3>
                    <p className="text-xs text-gray-400">Duration: {crop.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-600 font-bold text-lg">{crop.score}%</span>
                  <p className="text-xs text-gray-400">Match</p>
                </div>
              </div>

              {/* Match Bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${crop.score}%` }}
                />
              </div>

              <p className="text-sm text-gray-500 mb-3">{crop.desc}</p>

              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getProfitColor(crop.profit)}`}>
                  Profit: {crop.profit}
                </span>
                <button
                  onClick={() => navigate("/disease-detection")}
                  className="text-xs text-green-600 border border-green-300 px-3 py-1 rounded-lg hover:bg-green-50">
                  Check Disease →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-700 mb-4">🚀 What would you like to do next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={() => navigate("/disease-detection")}
              className="bg-red-50 hover:bg-red-100 rounded-xl p-4 text-center transition">
              <div className="text-2xl mb-1">🔬</div>
              <p className="text-sm font-medium text-gray-700">Check for Diseases</p>
            </button>
            <button onClick={() => navigate("/market-prices")}
              className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 text-center transition">
              <div className="text-2xl mb-1">📈</div>
              <p className="text-sm font-medium text-gray-700">Check Market Prices</p>
            </button>
            <button onClick={() => navigate("/crop-recommendation")}
              className="bg-green-50 hover:bg-green-100 rounded-xl p-4 text-center transition">
              <div className="text-2xl mb-1">🔄</div>
              <p className="text-sm font-medium text-gray-700">Try Again</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}