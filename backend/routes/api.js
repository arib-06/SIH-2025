const express = require('express');
const router = express.Router();

// Translation endpoint
router.post('/translate', async (req, res) => {
    try {
        const { text, from, to } = req.body;
        
        if (!text || !from || !to) {
            return res.status(400).json({ 
                error: 'Missing required fields: text, from, to' 
            });
        }

        // For now, we'll simulate translation
        // You can integrate with Google Translate API, Azure Translator, etc.
        const translatedText = await simulateTranslation(text, from, to);
        
        res.json({
            originalText: text,
            translatedText,
            from,
            to,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Chat/Assistant endpoint
router.post('/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        // Simulate AI response - you can integrate with OpenAI, Claude, etc.
        const reply = await generateTravelResponse(message, context);
        
        res.json({
            reply,
            context,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Chat service unavailable' });
    }
});

// Travel recommendations endpoint
router.get('/destinations', async (req, res) => {
    try {
        const { location, budget, interests } = req.query;
        
        // Simulate travel recommendations
        const recommendations = await getDestinationRecommendations(location, budget, interests);
        
        res.json({
            recommendations,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Destinations error:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

// Emergency contacts endpoint
router.get('/emergency/:country', async (req, res) => {
    try {
        const { country } = req.params;
        
        // Get emergency contacts for specific country
        const contacts = await getEmergencyContacts(country);
        
        res.json({
            country,
            contacts,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Emergency contacts error:', error);
        res.status(500).json({ error: 'Failed to get emergency contacts' });
    }
});

// Helper functions (you'll replace these with real implementations)

async function simulateTranslation(text, from, to) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple simulation - in reality, you'd call a translation API
    const translations = {
        'hello': { 'spanish': 'hola', 'french': 'bonjour', 'german': 'hallo' },
        'thank you': { 'spanish': 'gracias', 'french': 'merci', 'german': 'danke' },
        'where is': { 'spanish': 'dónde está', 'french': 'où est', 'german': 'wo ist' }
    };
    
    const lowerText = text.toLowerCase();
    if (translations[lowerText] && translations[lowerText][to]) {
        return translations[lowerText][to];
    }
    
    return `[${to.toUpperCase()}] ${text}`;
}

async function generateTravelResponse(message, context) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation')) {
        return "I'd be happy to help you find accommodations! What's your destination and budget range? I can recommend hotels, hostels, or vacation rentals based on your preferences.";
    }
    
    if (lowerMessage.includes('flight') || lowerMessage.includes('airline')) {
        return "For flights, I recommend checking multiple airlines and booking platforms. What's your departure city and destination? I can help you find the best deals and suggest optimal travel times.";
    }
    
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food')) {
        return "Great question about dining! I can suggest local restaurants, street food spots, and must-try dishes based on your location. What type of cuisine are you interested in?";
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
        return "Weather is crucial for travel planning! What destination and time of year are you considering? I can provide climate information and packing suggestions.";
    }
    
    return "I'm here to help with all your travel needs! Whether you need information about destinations, accommodations, transportation, or local attractions, just let me know what you're looking for.";
}

async function getDestinationRecommendations(location, budget, interests) {
    // Simulate database query
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
        {
            name: "Paris, France",
            description: "City of Light with world-class museums and cuisine",
            budget: "$$",
            highlights: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise"]
        },
        {
            name: "Tokyo, Japan",
            description: "Modern metropolis blending tradition and innovation",
            budget: "$$$",
            highlights: ["Shibuya Crossing", "Senso-ji Temple", "Tsukiji Market"]
        },
        {
            name: "Bali, Indonesia",
            description: "Tropical paradise with beaches and cultural sites",
            budget: "$",
            highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach"]
        }
    ];
}

async function getEmergencyContacts(country) {
    // Simulate database lookup
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const emergencyData = {
        'usa': {
            police: '911',
            medical: '911',
            fire: '911',
            tourist_helpline: '1-800-HELP-USA'
        },
        'uk': {
            police: '999',
            medical: '999',
            fire: '999',
            tourist_helpline: '+44-20-7008-1500'
        },
        'france': {
            police: '17',
            medical: '15',
            fire: '18',
            tourist_helpline: '+33-1-42-96-12-02'
        }
    };
    
    return emergencyData[country.toLowerCase()] || {
        police: '112',
        medical: '112',
        fire: '112',
        tourist_helpline: 'Contact local embassy'
    };
}

module.exports = router;