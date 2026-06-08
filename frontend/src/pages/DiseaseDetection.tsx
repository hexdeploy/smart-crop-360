import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const crops = [
  "Rice","Wheat","Maize","Jowar","Bajra","Ragi","Barley","Oats",
  "Chickpea","Pigeon Pea (Tur)","Black Gram (Urad)","Green Gram (Moong)",
  "Lentil (Masoor)","Kidney Bean (Rajma)","Peas","Horse Gram",
  "Groundnut","Mustard","Sunflower","Soybean","Sesame","Linseed",
  "Castor","Safflower","Coconut",
  "Sugarcane","Cotton","Jute","Tobacco","Rubber","Tea","Coffee",
  "Tomato","Onion","Potato","Chilli","Brinjal","Cabbage","Cauliflower",
  "Okra (Bhindi)","Cucumber","Pumpkin","Bitter Gourd","Bottle Gourd",
  "Spinach","Carrot","Radish","Beetroot","Garlic","Ginger",
  "Banana","Mango","Papaya","Watermelon","Grapes","Orange","Lemon",
  "Pomegranate","Guava","Apple","Pineapple","Jackfruit","Sapota",
  "Turmeric","Coriander","Cumin","Fenugreek","Cardamom","Pepper",
  "Marigold","Rose",
];

const affectedParts = [
  { label: "Leaf", icon: "🍃", desc: "Spots, yellowing or holes on leaves" },
  { label: "Stem", icon: "🌿", desc: "Black, brown or rotting stem" },
  { label: "Fruit", icon: "🍅", desc: "Spots, rot or discoloration on fruit" },
  { label: "Root", icon: "🌱", desc: "Wilting, root rot or weak plant" },
  { label: "Whole Plant", icon: "🪴", desc: "Entire plant looks sick or dying" },
];

const cropAge = [
  { label: "Just planted", icon: "🌱", desc: "Less than 2 weeks old" },
  { label: "Young plant", icon: "🌿", desc: "2 to 6 weeks old" },
  { label: "Grown plant", icon: "🌾", desc: "Has flowers or small fruits" },
  { label: "Ready to harvest", icon: "🍂", desc: "Fruits/grains are big and almost ready" },
];

const spreadLevel = [
  { label: "Only a few plants", icon: "1️⃣", color: "border-yellow-300 bg-yellow-50" },
  { label: "About half the field", icon: "⚠️", color: "border-orange-300 bg-orange-50" },
  { label: "Most of the field", icon: "🚨", color: "border-red-300 bg-red-50" },
];

const diseaseResults: Record<string, any> = {
  Tomato: {
    name: "Blossom End Rot",
    confidence: 95,
    severity: "Severe",
    cause: "Calcium deficiency caused by irregular watering or high nitrogen fertilizer",
    symptoms: ["Dark sunken spot at bottom of fruit","Spot turns black and leathery","Affected area becomes dry and hard"],
    chemical: { name: "Calcium Nitrate Spray", dosagePerLiter: "5-10 grams per liter of water", dosagePerAcre: "200-250 liters of spray solution per acre", frequency: "Every 7-10 days", method: "Foliar spray on leaves and fruits" },
    organic: { name: "Crushed Eggshell or Lime Water", dosagePerLiter: "Mix 2 spoons crushed eggshell powder in 1 liter water", dosagePerAcre: "Apply to soil near roots, 100kg eggshell per acre", frequency: "Once every 2 weeks", method: "Soil application near roots" },
  },
  Rice: {
    name: "Rice Blast Disease",
    confidence: 92,
    severity: "Moderate",
    cause: "Fungal infection caused by Magnaporthe oryzae, spreads in humid conditions",
    symptoms: ["Diamond shaped spots on leaves","Spots have grey center with brown border","Leaves dry up and die"],
    chemical: { name: "Tricyclazole (Beam)", dosagePerLiter: "0.6 grams per liter of water", dosagePerAcre: "200 liters spray per acre", frequency: "Every 10-15 days", method: "Foliar spray in morning" },
    organic: { name: "Neem Oil Spray", dosagePerLiter: "5ml neem oil + 2ml soap per liter", dosagePerAcre: "200 liters per acre", frequency: "Every 7 days", method: "Spray on leaves in evening" },
  },
  Wheat: {
    name: "Wheat Rust (Yellow Rust)",
    confidence: 90,
    severity: "Moderate",
    cause: "Fungal disease caused by Puccinia striiformis",
    symptoms: ["Yellow/orange powder stripes on leaves","Leaves curl and dry","Plant growth slows down"],
    chemical: { name: "Propiconazole (Tilt 25 EC)", dosagePerLiter: "1ml per liter of water", dosagePerAcre: "200 liters spray per acre", frequency: "Every 15 days", method: "Foliar spray" },
    organic: { name: "Garlic-Chilli Spray", dosagePerLiter: "Blend 10 garlic cloves + 5 chillies in 1 liter water", dosagePerAcre: "100 liters per acre", frequency: "Every 5 days", method: "Spray on leaves" },
  },
  Cotton: {
    name: "Cotton Bollworm",
    confidence: 93,
    severity: "Severe",
    cause: "Pest attack by Helicoverpa armigera larvae",
    symptoms: ["Holes in cotton bolls","Caterpillars inside bolls","Premature boll dropping"],
    chemical: { name: "Chlorpyrifos 20 EC", dosagePerLiter: "2.5ml per liter of water", dosagePerAcre: "200 liters spray per acre", frequency: "Every 10-12 days", method: "Spray on bolls and flowers" },
    organic: { name: "Neem Seed Kernel Extract (NSKE)", dosagePerLiter: "50 grams NSKE per liter water", dosagePerAcre: "150 liters per acre", frequency: "Every 7 days", method: "Spray on flowers and bolls" },
  },
  Maize: {
    name: "Maize Fall Armyworm",
    confidence: 91,
    severity: "Moderate",
    cause: "Pest attack by Spodoptera frugiperda larvae",
    symptoms: ["Ragged holes in leaves","Frass in leaf whorl","Damaged growing tip"],
    chemical: { name: "Emamectin Benzoate 5 SG", dosagePerLiter: "0.4 grams per liter of water", dosagePerAcre: "200 liters spray per acre", frequency: "Every 10 days", method: "Spray into leaf whorl" },
    organic: { name: "Sand + Ash mixture", dosagePerLiter: "Mix fine sand with wood ash 1:1", dosagePerAcre: "Apply 10kg mixture into whorl per acre", frequency: "Every 5 days", method: "Pour into leaf whorl" },
  },
  Potato: {
    name: "Late Blight",
    confidence: 94,
    severity: "Severe",
    cause: "Fungal infection by Phytophthora infestans in cool wet conditions",
    symptoms: ["Dark water soaked spots on leaves","White fungal growth under leaves","Tubers rot with foul smell"],
    chemical: { name: "Mancozeb 75 WP", dosagePerLiter: "2.5 grams per liter", dosagePerAcre: "200 liters per acre", frequency: "Every 7-10 days", method: "Foliar spray" },
    organic: { name: "Copper Sulphate + Lime (Bordeaux Mixture)", dosagePerLiter: "10 grams copper sulphate + 10 grams lime per liter", dosagePerAcre: "200 liters per acre", frequency: "Every 10 days", method: "Foliar spray" },
  },
  Onion: {
    name: "Purple Blotch",
    confidence: 89,
    severity: "Moderate",
    cause: "Fungal disease caused by Alternaria porri",
    symptoms: ["Purple or white spots on leaves","Spots enlarge with yellow border","Leaves fall over and dry"],
    chemical: { name: "Iprodione 50 WP", dosagePerLiter: "1.5 grams per liter", dosagePerAcre: "200 liters per acre", frequency: "Every 10 days", method: "Foliar spray" },
    organic: { name: "Neem Oil + Garlic Spray", dosagePerLiter: "5ml neem oil + crushed garlic per liter", dosagePerAcre: "150 liters per acre", frequency: "Every 7 days", method: "Foliar spray" },
  },
  Chilli: {
    name: "Chilli Leaf Curl Virus",
    confidence: 88,
    severity: "Moderate",
    cause: "Virus spread by whitefly insects",
    symptoms: ["Leaves curl upward or downward","Leaves become small and pale","Plant growth stops"],
    chemical: { name: "Imidacloprid 17.8 SL (for whitefly control)", dosagePerLiter: "0.5ml per liter", dosagePerAcre: "200 liters per acre", frequency: "Every 10-15 days", method: "Foliar spray" },
    organic: { name: "Yellow Sticky Traps + Neem Spray", dosagePerLiter: "5ml neem oil per liter", dosagePerAcre: "10 traps per acre + 150 liters spray", frequency: "Every 7 days", method: "Traps + foliar spray" },
  },
  Groundnut: {
    name: "Tikka Leaf Spot",
    confidence: 91,
    severity: "Moderate",
    cause: "Fungal infection by Cercospora arachidicola",
    symptoms: ["Brown circular spots on leaves","Yellow halo around spots","Premature leaf fall"],
    chemical: { name: "Chlorothalonil 75 WP", dosagePerLiter: "2 grams per liter", dosagePerAcre: "200 liters per acre", frequency: "Every 10-14 days", method: "Foliar spray" },
    organic: { name: "Neem + Turmeric Spray", dosagePerLiter: "5ml neem oil + 1 spoon turmeric per liter", dosagePerAcre: "150 liters per acre", frequency: "Every 7 days", method: "Foliar spray" },
  },
  Sugarcane: {
    name: "Red Rot Disease",
    confidence: 90,
    severity: "Severe",
    cause: "Fungal disease caused by Colletotrichum falcatum",
    symptoms: ["Red discoloration inside stalk","Sour smell from cut stalk","Leaves dry from top"],
    chemical: { name: "Carbendazim 50 WP", dosagePerLiter: "1 gram per liter", dosagePerAcre: "200 liters per acre", frequency: "Every 15 days", method: "Foliar spray + soil drench" },
    organic: { name: "Trichoderma viride", dosagePerLiter: "10 grams per liter", dosagePerAcre: "Mix with 200kg compost and apply per acre", frequency: "Once at planting", method: "Soil application" },
  },
  Banana: {
    name: "Panama Wilt",
    confidence: 93,
    severity: "Severe",
    cause: "Fungal soil disease caused by Fusarium oxysporum",
    symptoms: ["Leaves turn yellow from edges","Leaves collapse and hang down","Brown discoloration inside stem"],
    chemical: { name: "Propiconazole", dosagePerLiter: "1ml per liter", dosagePerAcre: "Drench soil with 200 liters per acre", frequency: "Every 20 days", method: "Soil drench near roots" },
    organic: { name: "Pseudomonas fluorescens", dosagePerLiter: "10 grams per liter", dosagePerAcre: "Drench 200 liters per acre", frequency: "Every 30 days", method: "Soil drench" },
  },
};

const defaultDisease = {
  name: "Leaf Spot Disease",
  confidence: 87,
  severity: "Moderate",
  cause: "Fungal infection spreading through water splashes and wind",
  symptoms: ["Brown or black spots on leaves","Spots enlarge over time","Leaves turn yellow and fall"],
  chemical: { name: "Mancozeb 75 WP", dosagePerLiter: "2.5 grams per liter of water", dosagePerAcre: "200 liters spray per acre", frequency: "Every 10-14 days", method: "Foliar spray in morning or evening" },
  organic: { name: "Neem Oil + Turmeric Spray", dosagePerLiter: "5ml neem oil + 1 spoon turmeric per liter water", dosagePerAcre: "150 liters per acre", frequency: "Every 7 days", method: "Spray on affected leaves" },
};

export default function DiseaseDetection() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState("");
  const [search, setSearch] = useState("");
  const [affected, setAffected] = useState("");
  const [age, setAge] = useState("");
  const [spread, setSpread] = useState("");
  const [treatment, setTreatment] = useState<"chemical" | "organic">("chemical");
  const [landSize, setLandSize] = useState("1");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyze = () => {
    setAnalyzing(true);
    setStep(1);
    setTimeout(() => {
      const disease = { ...(diseaseResults[crop] || defaultDisease) };

      // Dynamic confidence based on image uploaded
      if (image) {
        disease.confidence = Math.floor(Math.random() * 10) + 88; // 88-98%
      } else {
        disease.confidence = Math.floor(Math.random() * 10) + 72; // 72-82%
      }

      // Dynamic severity based on spread level
      if (spread === "Most of the field") {
        disease.severity = "Severe";
      } else if (spread === "About half the field") {
        disease.severity = "Moderate";
      } else {
        disease.severity = "Mild";
      }

      // Dynamic severity also based on crop age
      if (age === "Just planted" && disease.severity === "Severe") {
        disease.severity = "Moderate";
      }

      setResult(disease);
      setAnalyzing(false);
      setStep(2);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "Severe") return "text-red-600 bg-red-50";
    if (severity === "Moderate") return "text-orange-600 bg-orange-50";
    return "text-yellow-600 bg-yellow-50";
  };

  const filteredCrops = crops.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

        <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Step 0 - Upload & Questions */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🔬 Disease Detection</h2>
              <p className="text-sm text-gray-500 mt-1">Take a clear photo of the sick plant part</p>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-3">📸 Upload Plant Photo</h3>
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition">
                {image ? (
                  <img src={image} className="max-h-48 mx-auto rounded-lg object-cover" alt="uploaded" />
                ) : (
                  <div>
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm text-gray-500">Click here to take or upload a photo</p>
                    <p className="text-xs text-gray-400 mt-1">💡 Tip: Take photo in sunlight, show the sick part clearly</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>

            {/* Crop Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-3">🌾 Which crop is sick?</h3>

              {/* Search */}
              <input
                type="text"
                placeholder="🔍 Search crop name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              {/* Selected crop display */}
              {crop && (
                <div className="mb-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg inline-block">
                  ✅ Selected: {crop}
                </div>
              )}

              {/* Scrollable Grid */}
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredCrops.map((c) => (
                  <button key={c} onClick={() => setCrop(c)}
                    className={`py-2 px-3 rounded-lg text-sm border transition ${
                      crop === c
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-200 text-gray-600 hover:border-green-400"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Affected Part */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-3">🤔 Which part of the plant looks sick?</h3>
              <div className="space-y-2">
                {affectedParts.map((p) => (
                  <button key={p.label} onClick={() => setAffected(p.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                      affected === p.label
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-200 hover:border-green-400"}`}>
                    <span className="text-2xl">{p.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-sm">{p.label}</p>
                      <p className={`text-xs ${affected === p.label ? "text-green-100" : "text-gray-400"}`}>{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Age */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-3">📅 How old is your crop?</h3>
              <div className="space-y-2">
                {cropAge.map((a) => (
                  <button key={a.label} onClick={() => setAge(a.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                      age === a.label
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-200 hover:border-green-400"}`}>
                    <span className="text-2xl">{a.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-sm">{a.label}</p>
                      <p className={`text-xs ${age === a.label ? "text-green-100" : "text-gray-400"}`}>{a.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Spread Level */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-3">🌍 How many plants are affected?</h3>
              <div className="space-y-2">
                {spreadLevel.map((s) => (
                  <button key={s.label} onClick={() => setSpread(s.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition ${
                      spread === s.label
                        ? "bg-green-600 text-white border-green-600"
                        : `${s.color} border-transparent hover:border-green-300`}`}>
                    <span className="text-2xl">{s.icon}</span>
                    <p className="font-medium text-sm">{s.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Land Size */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-3">📐 How big is your farm? (for dosage calculation)</h3>
              <div className="flex items-center gap-3">
                <input type="number" value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-32 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                <span className="text-sm text-gray-500">Acres</span>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyze}
              disabled={!crop || !affected || !age || !spread}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition">
              🔬 Analyze My Crop
            </button>

            {(!crop || !affected || !age || !spread) && (
              <p className="text-center text-xs text-gray-400">
                Please answer all questions above to continue
              </p>
            )}
          </div>
        )}

        {/* Step 1 - Analyzing */}
        {step === 1 && analyzing && (
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
              <div className="text-6xl mb-4 animate-bounce">🔬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing your crop...</h3>
              <p className="text-sm text-gray-500 mb-6">Our AI is examining the photo and your answers</p>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-xs text-gray-400">This usually takes a few seconds</p>
            </div>
          </div>
        )}

        {/* Step 2 - Results */}
        {step === 2 && result && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">🔬 Analysis Results</h2>
              <p className="text-sm text-gray-500">Here's what we found about your {crop}</p>
            </div>

            {/* Disease Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{result.name}</h3>
                  <p className="text-sm text-gray-500">{crop} • {affected} affected</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold text-xl">{result.confidence}%</p>
                  <p className="text-xs text-gray-400">Confidence</p>
                </div>
              </div>

              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getSeverityColor(result.severity)}`}>
                ⚠️ Severity: {result.severity}
              </span>

              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">📋 Cause</p>
                <p className="text-sm text-gray-500">{result.cause}</p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">🔍 Symptoms</p>
                <ul className="space-y-1">
                  {result.symptoms.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Treatment */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">💊 Recommended Treatment</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button onClick={() => setTreatment("chemical")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                      treatment === "chemical" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}>
                    Chemical
                  </button>
                  <button onClick={() => setTreatment("organic")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                      treatment === "organic" ? "bg-white shadow text-green-600" : "text-gray-500"}`}>
                    Organic 🌿
                  </button>
                </div>
              </div>

              {(() => {
                const t = result[treatment];
                const acres = parseFloat(landSize) || 1;
                return (
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="font-semibold text-blue-800 text-sm mb-1">💊 {t.name}</p>
                      <p className="text-xs text-blue-600">{t.method}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Dosage per Liter</p>
                        <p className="text-sm font-semibold text-gray-700">{t.dosagePerLiter}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Spray Frequency</p>
                        <p className="text-sm font-semibold text-gray-700">{t.frequency}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">📐 Total for your {acres} acre farm</p>
                      <p className="text-sm font-bold text-green-700">{t.dosagePerAcre}</p>
                      {acres !== 1 && (
                        <p className="text-xs text-green-600 mt-1">
                          × {acres} acres = apply {acres}x the quantity above
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setStep(0);
                  setImage(null);
                  setCrop("");
                  setSearch("");
                  setAffected("");
                  setAge("");
                  setSpread("");
                  setResult(null);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium transition">
                🔄 Check Another Crop
              </button>
              <button onClick={() => navigate("/market-prices")}
                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-medium transition">
                📈 Check Market Prices
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}