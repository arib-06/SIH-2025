/** @format */

// Booking functionality for all transportation types
const API_BASE = 'http://localhost:5000';

// Show booking form for specific type
function showBookingForm(type) {
	const bookingForm = document.getElementById('bookingForm');
	const hotelBookingForm = document.getElementById('hotelBookingForm');
	const packagesBookingForm = document.getElementById('packagesBookingForm');
	const touristGuideBookingForm = document.getElementById('touristGuideBookingForm');
	const bookingTitle = document.getElementById('bookingTitle');
	const classSelect = document.getElementById('classSelect');

	// Hide all forms first
	if (hotelBookingForm) hotelBookingForm.classList.add('hidden');
	if (packagesBookingForm) packagesBookingForm.classList.add('hidden');
	if (touristGuideBookingForm) touristGuideBookingForm.classList.add('hidden');

	if (bookingForm) {
		bookingForm.classList.remove('hidden');

		switch (type) {
			case 'flight':
				bookingTitle.textContent = '✈️ Book Your Flight';
				classSelect.innerHTML = `
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First Class</option>
                `;
				break;
			case 'train':
				bookingTitle.textContent = '🚂 Book Your Train';
				classSelect.innerHTML = `
                    <option>General</option>
                    <option>Sleeper</option>
                    <option>AC 3 Tier</option>
                    <option>AC 2 Tier</option>
                    <option>AC 1 Tier</option>
                `;
				break;
			case 'bus':
				bookingTitle.textContent = '🚌 Book Your Bus';
				classSelect.innerHTML = `
                    <option>Standard</option>
                    <option>AC Seater</option>
                    <option>AC Sleeper</option>
                    <option>Volvo</option>
                `;
				break;
		}

		// Store booking type for form submission
		bookingForm.setAttribute('data-type', type);
	}
}

// Show hotel booking form
function showHotelBookingForm() {
	const bookingForm = document.getElementById('bookingForm');
	const hotelBookingForm = document.getElementById('hotelBookingForm');
	const packagesBookingForm = document.getElementById('packagesBookingForm');
	const touristGuideBookingForm = document.getElementById('touristGuideBookingForm');

	if (bookingForm) bookingForm.classList.add('hidden');
	if (packagesBookingForm) packagesBookingForm.classList.add('hidden');
	if (touristGuideBookingForm) touristGuideBookingForm.classList.add('hidden');
	if (hotelBookingForm) hotelBookingForm.classList.remove('hidden');
}

// Show packages booking form
function showPackagesBookingForm() {
	const bookingForm = document.getElementById('bookingForm');
	const hotelBookingForm = document.getElementById('hotelBookingForm');
	const packagesBookingForm = document.getElementById('packagesBookingForm');
	const touristGuideBookingForm = document.getElementById('touristGuideBookingForm');

	if (bookingForm) bookingForm.classList.add('hidden');
	if (hotelBookingForm) hotelBookingForm.classList.add('hidden');
	if (touristGuideBookingForm) touristGuideBookingForm.classList.add('hidden');
	if (packagesBookingForm) packagesBookingForm.classList.remove('hidden');
}

// Show tourist guide booking form
function showTouristGuideBookingForm() {
	const bookingForm = document.getElementById('bookingForm');
	const hotelBookingForm = document.getElementById('hotelBookingForm');
	const packagesBookingForm = document.getElementById('packagesBookingForm');
	const touristGuideBookingForm = document.getElementById('touristGuideBookingForm');

	if (bookingForm) bookingForm.classList.add('hidden');
	if (hotelBookingForm) hotelBookingForm.classList.add('hidden');
	if (packagesBookingForm) packagesBookingForm.classList.add('hidden');
	if (touristGuideBookingForm) touristGuideBookingForm.classList.remove('hidden');
}

// Submit transportation booking
async function submitBooking(event) {
	event.preventDefault();

	const form = event.target.closest('#bookingForm');
	const type = form.getAttribute('data-type');

	const formData = {
		type: type,
		from_location: form.querySelector('input[placeholder="Departure city"]').value,
		to_location: form.querySelector('input[placeholder="Destination city"]').value,
		departure_date: form.querySelector('#departureDate').value,
		return_date: form.querySelector('input[type="date"]:nth-of-type(2)').value,
		passengers: parseInt(form.querySelector('select').value.split(' ')[0]),
		class_type: form.querySelector('#classSelect').value,
		user_email: 'user@example.com', // This would come from auth
	};

	try {
		const response = await fetch(`${API_BASE}/api/book`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (result.success) {
			alert(`Booking confirmed! Booking ID: ${result.booking_id}, Price: ₹${result.price}`);
			form.reset();
			form.classList.add('hidden');
		} else {
			alert('Booking failed: ' + result.error);
		}
	} catch (error) {
		alert('Error: ' + error.message);
	}
}

// Search hotels
async function searchHotels() {
	const destination = document.getElementById('hotelDestination').value;

	if (!destination) {
		alert('Please enter a destination');
		return;
	}

	try {
		const response = await fetch(`${API_BASE}/api/hotels/search`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({destination}),
		});

		const result = await response.json();

		if (result.success) {
			displayHotels(result.hotels);
		} else {
			alert('Search failed: ' + result.error);
		}
	} catch (error) {
		alert('Error: ' + error.message);
	}
}

// Display hotel results
function displayHotels(hotels) {
	// Redirect to hotel results page with data
	sessionStorage.setItem('hotelResults', JSON.stringify(hotels));
	window.location.href = 'hotel-results';
}

// Book hotel (for hotel results page)
async function bookHotel(hotelId) {
	const checkinDate = document.getElementById('checkin-date')?.value || '2024-12-25';
	const checkoutDate = document.getElementById('checkout-date')?.value || '2024-12-27';
	const rooms = parseInt(document.getElementById('rooms')?.value || '1');
	const guests = parseInt(document.getElementById('guests')?.value || '2');

	const bookingData = {
		hotel_id: hotelId,
		checkin_date: checkinDate,
		checkout_date: checkoutDate,
		rooms: rooms,
		guests: guests,
		user_email: 'user@example.com',
	};

	try {
		const response = await fetch(`${API_BASE}/api/hotels/book`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(bookingData),
		});

		const result = await response.json();

		if (result.success) {
			alert(`Hotel booking confirmed! Booking ID: ${result.booking_id}, Total: ₹${result.total_price} for ${result.nights} nights`);
		} else {
			alert('Booking failed: ' + result.error);
		}
	} catch (error) {
		alert('Error: ' + error.message);
	}
}

// Toggle booking options
function toggleBookingOptions() {
	const bookingOptions = document.getElementById('bookingOptions');
	const bookingForm = document.getElementById('bookingForm');
	const hotelBookingForm = document.getElementById('hotelBookingForm');
	const packagesBookingForm = document.getElementById('packagesBookingForm');
	const touristGuideBookingForm = document.getElementById('touristGuideBookingForm');

	if (bookingOptions.classList.contains('hidden')) {
		bookingOptions.classList.remove('hidden');
		if (bookingForm) bookingForm.classList.add('hidden');
		if (hotelBookingForm) hotelBookingForm.classList.add('hidden');
		if (packagesBookingForm) packagesBookingForm.classList.add('hidden');
		if (touristGuideBookingForm) touristGuideBookingForm.classList.add('hidden');
	} else {
		bookingOptions.classList.add('hidden');
		if (bookingForm) bookingForm.classList.add('hidden');
		if (hotelBookingForm) hotelBookingForm.classList.add('hidden');
		if (packagesBookingForm) packagesBookingForm.classList.add('hidden');
		if (touristGuideBookingForm) touristGuideBookingForm.classList.add('hidden');
	}
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	// Add submit handler to booking form
	const bookingForm = document.getElementById('bookingForm');
	if (bookingForm) {
		const submitBtn = bookingForm.querySelector('button');
		if (submitBtn) {
			submitBtn.addEventListener('click', submitBooking);
		}
	}

	// Set minimum date to today
	const dateInputs = document.querySelectorAll('input[type="date"]');
	const today = new Date().toISOString().split('T')[0];
	dateInputs.forEach(input => {
		input.min = today;
	});
});

// Make functions globally available
window.showBookingForm = showBookingForm;
window.showHotelBookingForm = showHotelBookingForm;
window.showPackagesBookingForm = showPackagesBookingForm;
window.showTouristGuideBookingForm = showTouristGuideBookingForm;
window.searchHotels = searchHotels;
window.bookHotel = bookHotel;
window.toggleBookingOptions = toggleBookingOptions;
