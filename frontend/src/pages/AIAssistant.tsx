import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇮🇳" },
  { code: "or", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  { code: "as", name: "অসমীয়া", flag: "🇮🇳" },
];

const suggestedQuestions = [
  "Which crops grow best in Karnataka?",
  "How to treat tomato leaf curl disease?",
  "Best time to sell onion in Maharashtra?",
  "How much water does rice need per acre?",
  "What is organic farming?",
  "How to increase crop yield?",
  "Which fertilizer is best for wheat?",
  "How to control pests in cotton?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

export default function AIAssistant() {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "🌾 Welcome to Smart-Crop 360 AI Assistant!\n\nI can help you with:\n• Crop selection and planning\n• Disease identification and treatment\n• Market prices and best selling time\n• Fertilizer and pesticide guidance\n• Organic farming tips\n• Weather based farming advice\n\nAsk me anything in your language! 🇮🇳",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSystemPrompt = () => {
    return `You are a STRICT agricultural assistant for Indian farmers in the Smart-Crop 360 app.

YOUR ONLY JOB is to help farmers with these topics:
1. Crop selection (which crop to grow, when, where)
2. Crop diseases (identification, symptoms, treatment)
3. Fertilizers and pesticides (type, dosage, timing)
4. Market prices and best time/place to sell
5. Irrigation and water management
6. Soil health and crop rotation
7. Seeds and sowing methods
8. Weather based farming advice
9. Organic and sustainable farming
10. Government schemes and subsidies for farmers
11. Post harvest storage and management
12. Pest control methods

STRICT RULES:
1. ONLY answer farming and agriculture related questions
2. If someone asks ANYTHING not related to farming say: "Sorry, I can only help with farming and agriculture questions."
3. Always respond in the SAME language the user writes in
4. If user writes in Hindi → respond fully in Hindi
5. If user writes in Kannada → respond fully in Kannada
6. If user writes in Tamil → respond fully in Tamil
7. If user writes in Telugu → respond fully in Telugu
8. If user writes in Marathi → respond fully in Marathi
9. If user writes in Punjabi → respond fully in Punjabi
10. Use SIMPLE words that uneducated farmers can understand
11. Give SPECIFIC amounts, dosages and timeframes
12. Always think about Indian farming conditions
13. Be encouraging and supportive
14. Keep answers short and practical`;
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: getSystemPrompt(),
          messages: [
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: messageText },
          ],
        }),
      });

      const data = await response.json();
      const reply = data.reply || "Sorry, I could not get a response. Please try again.";

      const assistantMessage: Message = {
        role: "assistant",
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "❌ Cannot connect to server. Make sure Flask backend is running on port 5000!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

        <Navbar />

      <div className="max-w-3xl mx-auto w-full px-4 py-6 flex flex-col flex-1">

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🤖 AI Farming Assistant</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ask anything about farming in your language
          </p>
        </div>

        {/* Language Selector */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">
            🌐 Select your language:
          </p>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  selectedLang.code === lang.code
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-200 text-gray-600 hover:border-green-400"}`}>
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">
            💡 Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs transition">
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 overflow-y-auto max-h-96">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-xs md:max-w-md lg:max-w-lg`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-lg">🤖</span>
                      <span className="text-xs text-gray-400">AI Assistant</span>
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-tr-sm"
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
                    {msg.content}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="text-xs text-gray-400 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-sm p-3 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={`Type your farming question in ${selectedLang.name}...`}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition">
            {loading ? "⏳" : "Send 📤"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-2">
          🔒 Your conversations are private and secure
        </p>

      </div>
    </div>
  );
}