// Hotel Results Page Functionality
const API_BASE = 'http://localhost:5000';

class HotelResults {
    constructor() {
        this.hotels = [];
        this.filteredHotels = [];
        this.init();
    }

    async init() {
        await this.loadHotels();
        this.setupEventListeners();
        this.displayHotels();
    }

    async loadHotels() {
        // Check if hotels are passed from search
        const hotelData = sessionStorage.getItem('hotelResults');
        if (hotelData) {
            this.hotels = JSON.parse(hotelData);
            this.filteredHotels = [...this.hotels];
            return;
        }

        // Get destination from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const destination = urlParams.get('destination') || 'Mumbai';

        try {
            const response = await fetch(`${API_BASE}/api/hotels/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ destination })
            });

            const result = await response.json();

            if (result.success) {
                this.hotels = result.hotels;
                this.filteredHotels = [...this.hotels];
                
                // Update destination name
                const destinationElement = document.getElementById('destinationName');
                if (destinationElement) {
                    destinationElement.textContent = destination;
                }
            } else {
                console.error('Failed to load hotels:', result.error);
                this.showError('Failed to load hotels. Please try again.');
            }
        } catch (error) {
            console.error('Error loading hotels:', error);
            this.showError('Error connecting to server. Please check your connection.');
        }
    }

    setupEventListeners() {
        // Filter event listeners
        const ratingFilter = document.getElementById('ratingFilter');
        const priceFilter = document.getElementById('priceFilter');
        const amenityFilter = document.getElementById('amenityFilter');

        if (ratingFilter) ratingFilter.addEventListener('change', () => this.applyFilters());
        if (priceFilter) priceFilter.addEventListener('change', () => this.applyFilters());
        if (amenityFilter) amenityFilter.addEventListener('change', () => this.applyFilters());
    }

    applyFilters() {
        const ratingFilter = document.getElementById('ratingFilter')?.value;
        const priceFilter = document.getElementById('priceFilter')?.value;
        const amenityFilter = document.getElementById('amenityFilter')?.value;

        this.filteredHotels = this.hotels.filter(hotel => {
            // Rating filter
            if (ratingFilter && hotel.rating < parseFloat(ratingFilter)) {
                return false;
            }

            // Price filter
            if (priceFilter) {
                const [min, max] = priceFilter.split('-').map(Number);
                if (max && (hotel.price_per_night < min || hotel.price_per_night > max)) {
                    return false;
                }
                if (!max && hotel.price_per_night < min) {
                    return false;
                }
            }

            // Amenity filter
            if (amenityFilter && !hotel.amenities.includes(amenityFilter)) {
                return false;
            }

            return true;
        });

        this.displayHotels();
    }

    displayHotels() {
        const container = document.getElementById('hotelsContainer');
        if (!container) return;

        if (this.filteredHotels.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-6xl mb-4">🏨</div>
                    <h3 class="text-2xl font-semibold text-gray-800 mb-2">No hotels found</h3>
                    <p class="text-gray-600">Try adjusting your filters or search for a different destination.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredHotels.map(hotel => this.createHotelCard(hotel)).join('');
    }

    createHotelCard(hotel) {
        const amenitiesDisplay = hotel.amenities.slice(0, 3).join(', ');
        const moreAmenities = hotel.amenities.length > 3 ? ` +${hotel.amenities.length - 3} more` : '';

        return `
            <div class="hotel-card glass-effect rounded-3xl overflow-hidden hover-lift animate-fadeInUp">
                <div class="relative">
                    <img src="${hotel.image_url}" alt="${hotel.name}" 
                         class="w-full h-64 object-cover" loading="lazy">
                    <div class="absolute top-4 right-4">
                        <span class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                            ⭐ ${hotel.rating}
                        </span>
                    </div>
                    <div class="absolute bottom-4 left-4">
                        <span class="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            📍 ${hotel.location}
                        </span>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-2">${hotel.name}</h3>
                            <p class="text-gray-600 text-sm">${amenitiesDisplay}${moreAmenities}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-orange-600">₹${hotel.price_per_night.toLocaleString()}</div>
                            <div class="text-sm text-gray-500">per night</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-4">
                            <span class="text-sm text-gray-600">
                                🛏️ ${hotel.available_rooms} rooms available
                            </span>
                        </div>
                        <div class="flex space-x-1">
                            ${this.generateStars(hotel.rating)}
                        </div>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button onclick="viewHotelDetails(${hotel.id})" 
                                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold transition-colors">
                            View Details
                        </button>
                        <button onclick="bookHotel(${hotel.id})" 
                                class="flex-1 btn-primary py-3 px-4 rounded-xl text-white font-semibold">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="text-yellow-400">⭐</span>';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '<span class="text-yellow-400">⭐</span>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="text-gray-300">⭐</span>';
        }
        
        return stars;
    }

    showError(message) {
        const container = document.getElementById('hotelsContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-6xl mb-4">❌</div>
                    <h3 class="text-2xl font-semibold text-red-600 mb-2">Error</h3>
                    <p class="text-gray-600">${message}</p>
                    <button onclick="location.reload()" class="mt-4 btn-primary px-6 py-2 rounded-lg text-white">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

// Hotel booking function
async function bookHotel(hotelId) {
    // Get booking details from URL or default values
    const urlParams = new URLSearchParams(window.location.search);
    const checkinDate = urlParams.get('checkin') || '2024-12-25';
    const checkoutDate = urlParams.get('checkout') || '2024-12-27';
    
    // Show booking modal or redirect to booking page
    const modal = createBookingModal(hotelId, checkinDate, checkoutDate);
    document.body.appendChild(modal);
}

function createBookingModal(hotelId, checkinDate, checkoutDate) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Confirm Booking</h3>
            
            <div class="space-y-4 mb-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <input type="date" id="modal-checkin" value="${checkinDate}" 
                           class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <input type="date" id="modal-checkout" value="${checkoutDate}" 
                           class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                    <select id="modal-rooms" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500">
                        <option value="1">1 Room</option>
                        <option value="2">2 Rooms</option>
                        <option value="3">3 Rooms</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select id="modal-guests" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500">
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                    </select>
                </div>
            </div>
            
            <div class="flex space-x-4">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        class="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600">
                    Cancel
                </button>
                <button onclick="confirmHotelBooking(${hotelId})" 
                        class="flex-1 btn-primary py-3 rounded-lg text-white">
                    Confirm Booking
                </button>
            </div>
        </div>
    `;
    return modal;
}

async function confirmHotelBooking(hotelId) {
    const checkinDate = document.getElementById('modal-checkin').value;
    const checkoutDate = document.getElementById('modal-checkout').value;
    const rooms = parseInt(document.getElementById('modal-rooms').value);
    const guests = parseInt(document.getElementById('modal-guests').value);

    const bookingData = {
        hotel_id: hotelId,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        rooms: rooms,
        guests: guests,
        user_email: 'user@example.com'
    };

    try {
        const response = await fetch(`${API_BASE}/api/hotels/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (result.success) {
            alert(`🎉 Hotel booking confirmed!\n\nBooking ID: ${result.booking_id}\nTotal: ₹${result.total_price.toLocaleString()}\nNights: ${result.nights}`);
            
            // Close modal
            document.querySelector('.fixed.inset-0').remove();
        } else {
            alert('Booking failed: ' + result.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function viewHotelDetails(hotelId) {
    // In a real app, this would show detailed hotel information
    alert(`Hotel details for ID: ${hotelId}\n\nThis would show:\n• Detailed photos\n• Full amenities list\n• Guest reviews\n• Room types\n• Policies\n• Location map`);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.hotelResults = new HotelResults();
});

// Make functions globally available
window.bookHotel = bookHotel;
window.viewHotelDetails = viewHotelDetails;
window.confirmHotelBooking = confirmHotelBooking;
