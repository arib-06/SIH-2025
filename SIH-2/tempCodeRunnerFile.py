import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Step 1: Load the service account key and initialize Firebase Admin SDK
cred = credentials.Certificate("./serviceAccountKey.json")  # Replace with your service account key path
firebase_admin.initialize_app(cred)

# Step 2: Get a reference to Firestore
db = firestore.client()

# Step 3: Define the guide data as an array of objects
guides = [
    {
        "id": "rajesh",
        "name": "Rajesh Kumar",
        "image": "images/premium_photo-1722682239201-21c8173e776b.avif",
        "availability": "available",
        "price": "₹800/day",
        "specialties": ["Heritage", "History"],
        "languages": ["Hindi", "English", "French"],
        "description": "Expert in Mughal architecture and local heritage sites. 15+ years of experience guiding tourists through historical landmarks.",
        "rating": 4.9,
        "reviews": 127,
        "distance": "2.3 km away",
    },
    {
        "id": "arjun",
        "name": "Arjun Singh",
        "image": "images/premium_photo-1691030254390-aa56b22e6a45.avif",
        "availability": "busy",
        "price": "₹1200/day",
        "specialties": ["Trekking", "Adventure", "Climbing"],
        "languages": ["Hindi", "English"],
        "description": "Certified adventure guide specializing in mountain trekking, rock climbing, and water sports. Safety-first approach with 10+ years experience.",
        "rating": 4.8,
        "reviews": 89,
        "distance": "1.8 km away",
    },
    {
        "id": "priya",
        "name": "Priya Sharma",
        "image": "images/shiraz-henry-X2Qf1715_zs-unsplash (1).jpg",
        "availability": "available",
        "price": "₹1000/day",
        "specialties": ["Food Tours", "Cooking"],
        "languages": ["Hindi", "English", "Japanese"],
        "description": "Culinary expert and food blogger. Take you on authentic street food tours and cooking classes. Knows all the hidden foodie gems!",
        "rating": 4.9,
        "reviews": 156,
        "distance": "0.9 km away",
    },
    {
        "id": "vikram",
        "name": "Vikram Patel",
        "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        "availability": "available",
        "price": "₹1500/day",
        "specialties": ["Photography", "Landscapes"],
        "languages": ["Hindi", "English", "German"],
        "description": "Professional photographer and photo tour guide. Knows the best spots for golden hour shots, sunrise/sunset locations, and Instagram-worthy places.",
        "rating": 4.7,
        "reviews": 73,
        "distance": "3.1 km away",
    },
    {
        "id": "suresh",
        "name": "Dr. Suresh Menon",
        "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        "availability": "offline",
        "price": "₹2000/day",
        "specialties": ["Wildlife", "Nature", "Safari"],
        "languages": ["Hindi", "English"],
        "description": "Marine biologist turned wildlife guide. Expert in national parks, bird watching, and wildlife photography. PhD in Ecology & Conservation.",
        "rating": 5.0,
        "reviews": 45,
        "distance": "25 km away",
    },
    {
        "id": "meera",
        "name": "Meera Devi",
        "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        "availability": "available",
        "price": "₹600/day",
        "specialties": ["Spiritual", "Temples", "Meditation"],
        "languages": ["Hindi", "English", "Sanskrit"],
        "description": "Spiritual guide and yoga instructor. Specializes in temple tours, meditation sessions, and spiritual healing experiences. 20+ years in spiritual tourism.",
        "rating": 4.9,
        "reviews": 201,
        "distance": "1.5 km away",
    },
]

# Step 4: Upload the guide data to Firestore
def upload_guides_to_firestore():
    try:
        # Create a batch write for efficiency
        batch = db.batch()

        for guide in guides:
            # Use the guide's ID as the document ID
            doc_ref = db.collection("guides").document(guide["id"])
            batch.set(doc_ref, guide)

        # Commit the batch write
        batch.commit()
        print("All guides have been successfully added to Firestore!")
    except Exception as e:
        print(f"Error uploading guides to Firestore: {e}")

# Step 5: Call the function to upload the data
upload_guides_to_firestore()