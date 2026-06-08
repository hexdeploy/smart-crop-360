from flask import Flask, jsonify, request
from flask_cors import CORS
import requests 
import os
from dotenv import load_dotenv

load_dotenv()

AGMARKNET_API_KEY = os.getenv("AGMARKNET_API_KEY")
RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Smart Crop 360 Backend is running!"})

@app.route('/api/market-prices')
def market_prices():
    commodity = request.args.get('commodity', '')
    state = request.args.get('state', '')
    resource_ids = [
        "9ef84268-d588-465a-a308-a864a43d0070",
        "35985678-0d79-46b4-9ed6-6f13308a1d24",
    ]
    for resource_id in resource_ids:
        try:
            url = f"https://api.data.gov.in/resource/{resource_id}"
            params = {
                "api-key": AGMARKNET_API_KEY,
                "format": "json",
                "filters[commodity]": commodity,
                "filters[state]": state,
                "limit": 20,
            }
            response = requests.get(url, params=params, timeout=30)
            data = response.json()
            if data.get("records") and len(data["records"]) > 0:
                return jsonify(data)
        except Exception:
            continue
    mock_data = generate_mock_data(commodity, state)
    return jsonify({"records": mock_data, "mock": True})


def generate_mock_data(commodity, state):
    import random
    base_prices = {
        "Tomato": 2200, "Onion": 1800, "Potato": 1200, "Rice": 2100,
        "Wheat": 2050, "Maize": 1900, "Cotton": 6500, "Groundnut": 5400,
        "Soybean": 4200, "Mustard": 5100, "Sugarcane": 3200, "Chilli": 8500,
        "Brinjal": 1500, "Cabbage": 900, "Cauliflower": 1200, "Banana": 1800,
        "Mango": 3500, "Garlic": 4500, "Ginger": 6000, "Turmeric": 7500,
    }
    base = base_prices.get(commodity, 2000)
    mandis = [
        f"{state} APMC", f"Central {state} Market",
        f"District Mandi {state}", f"Local Market {state}",
        f"Main APMC {state}", f"Farmers Market {state}",
    ]
    records = []
    for i, mandi in enumerate(mandis):
        variation = random.randint(-200, 300)
        modal = base + variation - (i * 50)
        records.append({
            "state": state,
            "district": f"District {i+1}",
            "market": mandi,
            "commodity": commodity,
            "variety": "Local",
            "min_price": str(modal - 100),
            "max_price": str(modal + 150),
            "modal_price": str(modal),
            "arrival_date": "08/06/2026",
        })
    return records


@app.route('/api/ai-assistant', methods=['POST'])
def ai_assistant():
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        system_prompt = data.get('system', '')

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={GEMINI_API_KEY}"

        contents = []
        for msg in messages:
            role = "model" if msg["role"] == "assistant" else "user"
            contents.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })

        payload = {
            "system_instruction": {
                "parts": [{"text": system_prompt}]
            },
            "contents": contents
        }

        response = requests.post(url, json=payload, timeout=30)
        result = response.json()

        if "candidates" in result:
            reply = result["candidates"][0]["content"]["parts"][0]["text"]
            return jsonify({"reply": reply})
        else:
            return jsonify({"reply": "Sorry, could not get a response. Please try again."})

    except Exception as e:
        return jsonify({"reply": "Sorry, something went wrong. Please try again.", "error": str(e)})


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)