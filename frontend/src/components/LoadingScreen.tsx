export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🌾</div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Smart-Crop 360
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Your AI-powered farming companion
        </p>
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }} />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }} />
        </div>
      </div>
    </div>
  );
}