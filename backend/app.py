from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import requests
import os
import jwt
import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smartcrop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'smartcrop360secretkey'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

AGMARKNET_API_KEY = os.getenv("AGMARKNET_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    state = db.Column(db.String(50), nullable=True)
    district = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'state': self.state,
            'district': self.district,
        }
    
class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    farmer_name = db.Column(db.String(100), nullable=False)
    crop = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    district = db.Column(db.String(50), nullable=True)
    quality = db.Column(db.String(20), nullable=True)
    harvest_date = db.Column(db.String(30), nullable=True)
    phone = db.Column(db.String(15), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'farmerName': self.farmer_name,
            'crop': self.crop,
            'quantity': self.quantity,
            'price': self.price,
            'unit': self.unit,
            'state': self.state,
            'district': self.district,
            'quality': self.quality,
            'harvestDate': self.harvest_date,
            'phone': self.phone,
            'description': self.description,
            'createdAt': str(self.created_at),
        }
    
# Create tables
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return jsonify({"message": "Smart Crop 360 Backend is running!"})

# Register
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        phone = data.get('phone', '')
        state = data.get('state', '')
        district = data.get('district', '')

        if not name or not email or not password:
            return jsonify({'error': 'Name, email and password are required'}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Account already exists with this email'}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        user = User(
            name=name,
            email=email,
            password=hashed_password,
            phone=phone,
            state=state,
            district=district
        )
        db.session.add(user)
        db.session.commit()

        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'message': 'Account created successfully!',
            'token': token,
            'user': user.to_dict()
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Login
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({'error': 'No account found with this email. Please sign up first!'}), 404

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({'error': 'Incorrect password. Please try again!'}), 401

        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'message': f'Welcome back, {user.name}!',
            'token': token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get current user
@app.route('/api/me', methods=['GET'])
def get_me():
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'No token provided'}), 401

        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user = User.query.get(data['user_id'])

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Session expired. Please login again!'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 401

# Market prices route
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
            "arrival_date": "09/06/2026",
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
        return jsonify({"reply": "Sorry, something went wrong.", "error": str(e)})

# Get all listings
@app.route('/api/listings', methods=['GET'])
def get_listings():
    try:
        crop = request.args.get('crop', '')
        state = request.args.get('state', '')

        query = Listing.query

        if crop:
            query = query.filter(
                Listing.crop.ilike(f'%{crop}%')
            )
        if state and state != 'All States':
            query = query.filter_by(state=state)

        listings = query.order_by(
            Listing.created_at.desc()
        ).all()

        return jsonify({
            'listings': [l.to_dict() for l in listings]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Create new listing
@app.route('/api/listings', methods=['POST'])
def create_listing():
    try:
        data = request.get_json()

        if not data.get('farmerName') or not data.get('crop') or \
           not data.get('quantity') or not data.get('price') or \
           not data.get('phone') or not data.get('state'):
            return jsonify({
                'error': 'Please fill all required fields!'
            }), 400

        listing = Listing(
            farmer_name=data['farmerName'],
            crop=data['crop'],
            quantity=int(data['quantity']),
            price=int(data['price']),
            unit=data.get('unit', 'Quintal'),
            state=data['state'],
            district=data.get('district', ''),
            quality=data.get('quality', 'A Grade'),
            harvest_date=data.get('harvestDate', ''),
            phone=data['phone'],
            description=data.get('description', ''),
        )

        db.session.add(listing)
        db.session.commit()

        return jsonify({
            'message': 'Listing posted successfully!',
            'listing': listing.to_dict()
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Delete listing
@app.route('/api/listings/<int:listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    try:
        listing = Listing.query.get(listing_id)
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        db.session.delete(listing)
        db.session.commit()
        return jsonify({'message': 'Listing deleted!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)