from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime, timedelta
import random
import os
from translate import Translator

app = Flask(__name__)
CORS(app)

# Initialize database
def init_db():
    conn = sqlite3.connect('traverz.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            user_email TEXT,
            from_location TEXT,
            to_location TEXT,
            departure_date TEXT,
            return_date TEXT,
            passengers INTEGER,
            class_type TEXT,
            price REAL,
            status TEXT DEFAULT 'confirmed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS hotels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            price_per_night REAL,
            rating REAL,
            amenities TEXT,
            image_url TEXT,
            available_rooms INTEGER DEFAULT 10
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS hotel_bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hotel_id INTEGER,
            user_email TEXT,
            checkin_date TEXT,
            checkout_date TEXT,
            rooms INTEGER,
            guests INTEGER,
            total_price REAL,
            status TEXT DEFAULT 'confirmed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (hotel_id) REFERENCES hotels (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_message TEXT,
            ai_response TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS emergency_contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service_type TEXT,
            phone_number TEXT,
            location TEXT,
            description TEXT
        )
    ''')
    
    # Insert sample hotel data
    sample_hotels = [
        ("Grand Palace Hotel", "New Delhi", 5500.0, 4.8, "WiFi,Pool,Spa,Restaurant,Gym", "https://images.unsplash.com/photo-1566073771259-6a8506099945", 15),
        ("Ocean View Resort", "Goa", 8200.0, 4.9, "Beach Access,WiFi,Pool,Restaurant,Bar", "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9", 12),
        ("Mountain Retreat", "Manali", 3800.0, 4.6, "Mountain View,WiFi,Restaurant,Fireplace", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", 8),
        ("City Center Inn", "Mumbai", 4200.0, 4.4, "WiFi,Restaurant,Business Center,Parking", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa", 20),
        ("Heritage Palace", "Jaipur", 6800.0, 4.7, "Heritage Architecture,WiFi,Pool,Spa,Restaurant", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", 10),
        ("Backwater Lodge", "Kerala", 4500.0, 4.5, "Backwater View,WiFi,Restaurant,Boat Rides", "https://images.unsplash.com/photo-1578662996442-48f60103fc96", 6)
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO hotels (name, location, price_per_night, rating, amenities, image_url, available_rooms)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', sample_hotels)
    
    # Insert emergency contacts
    emergency_data = [
        ("Police", "100", "National", "Emergency Police Services"),
        ("Fire", "101", "National", "Fire Emergency Services"),
        ("Ambulance", "108", "National", "Medical Emergency Services"),
        ("Tourist Helpline", "1363", "National", "Tourist Emergency Helpline"),
        ("Women Helpline", "1091", "National", "Women in Distress"),
        ("Disaster Management", "108", "National", "Natural Disaster Response")
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO emergency_contacts (service_type, phone_number, location, description)
        VALUES (?, ?, ?, ?)
    ''', emergency_data)
    
    conn.commit()
    conn.close()

# Translation endpoint
@app.route('/translate', methods=['POST'])
def translate_text():
    try:
        data = request.get_json()
        text = data.get('q', '')
        target_lang = data.get('target', 'en')
        
        translator = Translator(to_lang=target_lang)
        translated_text = translator.translate(text)
        
        return jsonify({
            'success': True,
            'translated_text': translated_text,
            'original_text': text,
            'target_language': target_lang
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Booking endpoints
@app.route('/api/book', methods=['POST'])
def create_booking():
    try:
        data = request.get_json()
        
        conn = sqlite3.connect('traverz.db')
        cursor = conn.cursor()
        
        # Calculate price based on type and distance
        base_prices = {'flight': 5000, 'train': 1500, 'bus': 800}
        base_price = base_prices.get(data['type'], 1000)
        price = base_price + random.randint(500, 2000)
        
        cursor.execute('''
            INSERT INTO bookings (type, user_email, from_location, to_location, 
                                departure_date, return_date, passengers, class_type, price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['type'],
            data.get('user_email', 'guest@example.com'),
            data['from_location'],
            data['to_location'],
            data['departure_date'],
            data.get('return_date'),
            data['passengers'],
            data['class_type'],
            price
        ))
        
        booking_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'booking_id': booking_id,
            'price': price,
            'message': f'{data["type"].title()} booking confirmed!'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Hotel search endpoint
@app.route('/api/hotels/search', methods=['POST'])
def search_hotels():
    try:
        data = request.get_json()
        destination = data.get('destination', '')
        
        conn = sqlite3.connect('traverz.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM hotels 
            WHERE location LIKE ? OR name LIKE ?
            ORDER BY rating DESC
        ''', (f'%{destination}%', f'%{destination}%'))
        
        hotels = []
        for row in cursor.fetchall():
            hotels.append({
                'id': row[0],
                'name': row[1],
                'location': row[2],
                'price_per_night': row[3],
                'rating': row[4],
                'amenities': row[5].split(','),
                'image_url': row[6],
                'available_rooms': row[7]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'hotels': hotels,
            'count': len(hotels)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Hotel booking endpoint
@app.route('/api/hotels/book', methods=['POST'])
def book_hotel():
    try:
        data = request.get_json()
        
        conn = sqlite3.connect('traverz.db')
        cursor = conn.cursor()
        
        # Get hotel details
        cursor.execute('SELECT price_per_night FROM hotels WHERE id = ?', (data['hotel_id'],))
        hotel = cursor.fetchone()
        
        if not hotel:
            return jsonify({'success': False, 'error': 'Hotel not found'}), 404
        
        # Calculate total price
        checkin = datetime.strptime(data['checkin_date'], '%Y-%m-%d')
        checkout = datetime.strptime(data['checkout_date'], '%Y-%m-%d')
        nights = (checkout - checkin).days
        total_price = hotel[0] * nights * data['rooms']
        
        cursor.execute('''
            INSERT INTO hotel_bookings (hotel_id, user_email, checkin_date, checkout_date, 
                                      rooms, guests, total_price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['hotel_id'],
            data.get('user_email', 'guest@example.com'),
            data['checkin_date'],
            data['checkout_date'],
            data['rooms'],
            data['guests'],
            total_price
        ))
        
        booking_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'booking_id': booking_id,
            'total_price': total_price,
            'nights': nights,
            'message': 'Hotel booking confirmed!'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# AI Assistant endpoint
@app.route('/api/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        # Simple AI responses for travel-related queries
        responses = {
            'hello': 'Hello! I\'m your Traverz AI assistant. How can I help you plan your perfect trip today?',
            'book': 'I can help you book flights, trains, buses, hotels, and tour packages. What would you like to book?',
            'hotel': 'I can help you find and book hotels. Which destination are you looking for?',
            'flight': 'I can assist with flight bookings. Where would you like to travel?',
            'weather': 'For weather information, I recommend checking the local forecast for your destination. Would you like help with anything else?',
            'emergency': 'For emergencies, please use our SOS feature or call the appropriate emergency number. Is there anything else I can help with?',
            'translate': 'I can help with translations! Use our translate feature to communicate in different languages.',
            'guide': 'Looking for a local guide? Check out our tourist guide section for expert local guides in your destination.'
        }
        
        # Simple keyword matching
        user_lower = user_message.lower()
        ai_response = "I'm here to help with your travel needs! You can ask me about bookings, hotels, flights, weather, or any travel-related questions."
        
        for keyword, response in responses.items():
            if keyword in user_lower:
                ai_response = response
                break
        
        # Store chat history
        conn = sqlite3.connect('traverz.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO chat_history (user_message, ai_response)
            VALUES (?, ?)
        ''', (user_message, ai_response))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'response': ai_response,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Emergency contacts endpoint
@app.route('/api/emergency', methods=['GET'])
def get_emergency_contacts():
    try:
        conn = sqlite3.connect('traverz.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM emergency_contacts')
        contacts = []
        for row in cursor.fetchall():
            contacts.append({
                'id': row[0],
                'service_type': row[1],
                'phone_number': row[2],
                'location': row[3],
                'description': row[4]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'contacts': contacts
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get user bookings
@app.route('/api/bookings/<email>', methods=['GET'])
def get_user_bookings(email):
    try:
        conn = sqlite3.connect('traverz.db')
        cursor = conn.cursor()
        
        # Get regular bookings
        cursor.execute('''
            SELECT * FROM bookings WHERE user_email = ? ORDER BY created_at DESC
        ''', (email,))
        
        bookings = []
        for row in cursor.fetchall():
            bookings.append({
                'id': row[0],
                'type': row[1],
                'from_location': row[3],
                'to_location': row[4],
                'departure_date': row[5],
                'return_date': row[6],
                'passengers': row[7],
                'class_type': row[8],
                'price': row[9],
                'status': row[10],
                'created_at': row[11]
            })
        
        # Get hotel bookings
        cursor.execute('''
            SELECT hb.*, h.name, h.location FROM hotel_bookings hb
            JOIN hotels h ON hb.hotel_id = h.id
            WHERE hb.user_email = ? ORDER BY hb.created_at DESC
        ''', (email,))
        
        hotel_bookings = []
        for row in cursor.fetchall():
            hotel_bookings.append({
                'id': row[0],
                'hotel_name': row[10],
                'location': row[11],
                'checkin_date': row[3],
                'checkout_date': row[4],
                'rooms': row[5],
                'guests': row[6],
                'total_price': row[7],
                'status': row[8],
                'created_at': row[9]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'bookings': bookings,
            'hotel_bookings': hotel_bookings
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
