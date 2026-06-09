import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windspeed: number;
  rainfall: number;
  weathercode: number;
  city: string;
  state: string;
}

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  rainfall: number;
  weathercode: number;
}

const getWeatherDescription = (code: number) => {
  if (code === 0) return { desc: "Clear Sky", icon: "☀️" };
  if (code <= 3) return { desc: "Partly Cloudy", icon: "⛅" };
  if (code <= 49) return { desc: "Foggy", icon: "🌫️" };
  if (code <= 59) return { desc: "Drizzle", icon: "🌦️" };
  if (code <= 69) return { desc: "Rainy", icon: "🌧️" };
  if (code <= 79) return { desc: "Snowy", icon: "❄️" };
  if (code <= 84) return { desc: "Rain Showers", icon: "🌨️" };
  if (code <= 99) return { desc: "Thunderstorm", icon: "⛈️" };
  return { desc: "Unknown", icon: "🌡️" };
};

const getFarmingAdvice = (weather: WeatherData): string[] => {
  const advice = [];
  if (weather.rainfall > 5) {
    advice.push("🌧️ Heavy rain expected — avoid spraying pesticides today");
    advice.push("💧 Check field drainage to prevent waterlogging");
  } else if (weather.rainfall > 0) {
    advice.push("🌦️ Light rain expected — good day for transplanting seedlings");
  } else {
    advice.push("☀️ No rain today — good day for harvesting and spraying");
  }
  if (weather.humidity > 80) {
    advice.push("⚠️ High humidity — watch out for fungal diseases");
  }
  if (weather.windspeed > 20) {
    advice.push("💨 Strong winds — avoid spraying chemicals today");
  }
  if (weather.temperature > 35) {
    advice.push("🌡️ Very hot — water your crops early morning or evening");
  } else if (weather.temperature < 15) {
    advice.push("🥶 Cold weather — protect sensitive crops from frost");
  } else {
    advice.push("✅ Good weather conditions for farming today");
  }
  return advice;
};

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await getWeatherData(latitude, longitude);
        },
        async () => {
          // Default to Bangalore if location denied
          await getWeatherData(12.9716, 77.5946);
        }
      );
    } else {
      getWeatherData(12.9716, 77.5946);
    }
  };

  const getWeatherData = async (lat: number, lon: number) => {
    try {
      // Get weather data
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode,precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata&forecast_days=5`;

      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      // Get city name using reverse geocoding
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      const city = geoData.address?.city ||
        geoData.address?.town ||
        geoData.address?.village ||
        geoData.address?.county || "Your Location";
      const state = geoData.address?.state || "India";

      setWeather({
        temperature: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        windspeed: Math.round(weatherData.current.windspeed_10m),
        rainfall: weatherData.current.precipitation || 0,
        weathercode: weatherData.current.weathercode,
        city,
        state,
      });

      // Set 5-day forecast
      const forecastDays: ForecastDay[] = weatherData.daily.time.map(
        (date: string, i: number) => ({
          date,
          maxTemp: Math.round(weatherData.daily.temperature_2m_max[i]),
          minTemp: Math.round(weatherData.daily.temperature_2m_min[i]),
          rainfall: weatherData.daily.precipitation_sum[i] || 0,
          weathercode: weatherData.daily.weathercode[i],
        })
      );
      setForecast(forecastDays);
      setLoading(false);

    } catch (err) {
      setError("Could not fetch weather data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white mb-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">🌤️</span>
          <p className="text-sm">Fetching weather for your location...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white mb-5">
        <p className="text-sm">🌤️ Weather data unavailable</p>
      </div>
    );
  }

  const { desc, icon } = getWeatherDescription(weather.weathercode);
  const advice = getFarmingAdvice(weather);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-4 text-white mb-5 cursor-pointer"
      onClick={() => setExpanded(!expanded)}>

      {/* Main Weather Row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs opacity-80 mb-0.5">
            📍 {weather.city}, {weather.state}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-4xl">{icon}</span>
            <div>
              <p className="text-3xl font-bold">{weather.temperature}°C</p>
              <p className="text-xs opacity-80">{desc}</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <span>💧 {weather.humidity}%</span>
            <span>💨 {weather.windspeed} km/h</span>
            <span>🌧️ {weather.rainfall}mm</span>
            <span className="opacity-70">{expanded ? "▲ Less" : "▼ More"}</span>
          </div>
        </div>
      </div>

      {/* Farming Advice */}
      <div className="mt-3 pt-3 border-t border-white border-opacity-20">
        <p className="text-xs font-semibold opacity-90 mb-1">🌾 Today's Farming Advice:</p>
        {advice.slice(0, expanded ? advice.length : 1).map((a, i) => (
          <p key={i} className="text-xs opacity-80 mb-0.5">{a}</p>
        ))}
      </div>

      {/* 5 Day Forecast */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-white border-opacity-20">
          <p className="text-xs font-semibold opacity-90 mb-2">📅 5-Day Forecast:</p>
          <div className="grid grid-cols-5 gap-1">
            {forecast.map((day, i) => {
              const dayWeather = getWeatherDescription(day.weathercode);
              return (
                <div key={i} className="text-center">
                  <p className="text-xs opacity-70">{getDayName(day.date)}</p>
                  <span className="text-lg">{dayWeather.icon}</span>
                  <p className="text-xs font-semibold">{day.maxTemp}°</p>
                  <p className="text-xs opacity-60">{day.minTemp}°</p>
                  {day.rainfall > 0 && (
                    <p className="text-xs opacity-70">🌧️{day.rainfall}mm</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}