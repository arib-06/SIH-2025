// SOS Emergency functionality
const API_BASE = 'http://localhost:5000';

class SOSManager {
    constructor() {
        this.emergencyContacts = [];
        this.userLocation = null;
        this.init();
    }

    async init() {
        await this.loadEmergencyContacts();
        this.setupEventListeners();
        this.getCurrentLocation();
    }

    async loadEmergencyContacts() {
        try {
            const response = await fetch(`${API_BASE}/api/emergency`);
            const result = await response.json();
            
            if (result.success) {
                this.emergencyContacts = result.contacts;
                this.displayEmergencyContacts();
            }
        } catch (error) {
            console.error('Error loading emergency contacts:', error);
        }
    }

    displayEmergencyContacts() {
        const container = document.getElementById('emergency-contacts');
        if (!container) return;

        container.innerHTML = this.emergencyContacts.map(contact => `
            <div class="emergency-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800">${contact.service_type}</h3>
                    <span class="emergency-icon text-2xl">${this.getServiceIcon(contact.service_type)}</span>
                </div>
                <p class="text-gray-600 mb-4">${contact.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold text-red-600">${contact.phone_number}</span>
                    <button onclick="sosManager.callEmergency('${contact.phone_number}')" 
                            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Call Now
                    </button>
                </div>
            </div>
        `).join('');
    }

    getServiceIcon(serviceType) {
        const icons = {
            'Police': '👮‍♂️',
            'Fire': '🚒',
            'Ambulance': '🚑',
            'Tourist Helpline': '🗺️',
            'Women Helpline': '👩‍⚕️',
            'Disaster Management': '⚠️'
        };
        return icons[serviceType] || '📞';
    }

    setupEventListeners() {
        // Emergency SOS button
        const sosButton = document.getElementById('emergency-sos');
        if (sosButton) {
            sosButton.addEventListener('click', () => this.triggerSOS());
        }

        // Share location button
        const shareLocationBtn = document.getElementById('share-location');
        if (shareLocationBtn) {
            shareLocationBtn.addEventListener('click', () => this.shareLocation());
        }

        // Quick call buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-call-btn')) {
                const number = e.target.getAttribute('data-number');
                this.callEmergency(number);
            }
        });
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    this.updateLocationDisplay();
                },
                (error) => {
                    console.error('Error getting location:', error);
                    this.showLocationError();
                }
            );
        } else {
            this.showLocationError();
        }
    }

    updateLocationDisplay() {
        const locationDiv = document.getElementById('current-location');
        if (locationDiv && this.userLocation) {
            locationDiv.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 class="font-semibold text-green-800 mb-2">📍 Current Location</h4>
                    <p class="text-green-700">Lat: ${this.userLocation.latitude.toFixed(6)}</p>
                    <p class="text-green-700">Lng: ${this.userLocation.longitude.toFixed(6)}</p>
                    <button onclick="sosManager.shareLocation()" class="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        Share Location
                    </button>
                </div>
            `;
        }
    }

    showLocationError() {
        const locationDiv = document.getElementById('current-location');
        if (locationDiv) {
            locationDiv.innerHTML = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p class="text-yellow-700">Location access not available. Please enable location services for emergency features.</p>
                </div>
            `;
        }
    }

    triggerSOS() {
        // Show SOS confirmation dialog
        const confirmed = confirm('🚨 EMERGENCY SOS\n\nThis will:\n- Call emergency services\n- Send your location\n- Notify emergency contacts\n\nProceed?');
        
        if (confirmed) {
            this.executeSOS();
        }
    }

    executeSOS() {
        // In a real app, this would:
        // 1. Call emergency services
        // 2. Send SMS with location
        // 3. Notify emergency contacts
        // 4. Log the emergency
        
        alert('🚨 SOS ACTIVATED\n\nEmergency services have been notified.\nYour location has been shared.\nHelp is on the way!');
        
        // Call police (example)
        this.callEmergency('100');
        
        // Share location
        this.shareLocation();
        
        // Log SOS event
        this.logSOSEvent();
    }

    callEmergency(number) {
        // In a real mobile app, this would initiate a phone call
        // For web demo, we'll show instructions
        const modal = this.createCallModal(number);
        document.body.appendChild(modal);
    }

    createCallModal(number) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                <div class="text-center">
                    <div class="text-6xl mb-4">📞</div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Calling Emergency Services</h3>
                    <div class="text-4xl font-bold text-red-600 mb-6">${number}</div>
                    <p class="text-gray-600 mb-6">On a mobile device, this would automatically dial the number.</p>
                    <div class="flex gap-4">
                        <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" 
                                class="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600">
                            Close
                        </button>
                        <a href="tel:${number}" class="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 text-center">
                            Call Now
                        </a>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    shareLocation() {
        if (!this.userLocation) {
            alert('Location not available. Please enable location services.');
            return;
        }

        const locationText = `🚨 EMERGENCY LOCATION 🚨\nLat: ${this.userLocation.latitude}\nLng: ${this.userLocation.longitude}\nGoogle Maps: https://maps.google.com/?q=${this.userLocation.latitude},${this.userLocation.longitude}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Emergency Location',
                text: locationText
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(locationText).then(() => {
                alert('📍 Location copied to clipboard!\n\nYou can now paste and send this to emergency contacts.');
            });
        }
    }

    logSOSEvent() {
        const event = {
            timestamp: new Date().toISOString(),
            location: this.userLocation,
            type: 'SOS_TRIGGERED'
        };
        
        // Store in localStorage for demo
        const sosHistory = JSON.parse(localStorage.getItem('sosHistory') || '[]');
        sosHistory.push(event);
        localStorage.setItem('sosHistory', JSON.stringify(sosHistory));
    }

    // Quick emergency actions
    quickCall(service) {
        const serviceNumbers = {
            'police': '100',
            'fire': '101',
            'ambulance': '108',
            'tourist': '1363'
        };
        
        const number = serviceNumbers[service];
        if (number) {
            this.callEmergency(number);
        }
    }
}

// Initialize SOS Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.sosManager = new SOSManager();
});

// Quick action functions
function quickEmergencyCall(service) {
    if (window.sosManager) {
        window.sosManager.quickCall(service);
    }
}

function triggerSOS() {
    if (window.sosManager) {
        window.sosManager.triggerSOS();
    }
}

// Make functions globally available
window.quickEmergencyCall = quickEmergencyCall;
window.triggerSOS = triggerSOS;
