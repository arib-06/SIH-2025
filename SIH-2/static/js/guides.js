/** @format */
import {db} from './firebase.js';
import {collection, getDocs} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const guidesContainer = document.getElementById('guides-container');

// Function to render a single guide card
function renderGuideCard(guide) {
	// Provide fallback image if guide.image is not available
	const imageUrl = guide.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
	
	return `
    <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div class="relative w-full h-48 bg-gray-200">
        <img src="${imageUrl}" alt="${guide.name}" class="w-full h-48 object-cover" loading="lazy" 
             onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'; this.onerror=null;" />
      </div>
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-800">${guide.name || 'Unknown Guide'}</h3>
        <p class="text-gray-600">${guide.specialties ? guide.specialties.join(', ') : 'General Guide'}</p>
        <p class="text-sm text-gray-500 mt-1">${guide.languages ? guide.languages.join(', ') : 'English'}</p>
        <p class="mt-3 text-green-600 font-semibold">${guide.price || '₹500/day'}</p>
        <p class="text-sm ${guide.availability === 'online' ? 'text-green-500' : 'text-red-500'}">
          ${guide.availability || 'Available'}
        </p>
        <div class="flex items-center mt-2 text-yellow-500">
          ⭐ ${guide.rating || '4.5'} <span class="ml-2 text-gray-500">(${guide.reviews || '0'} reviews)</span>
        </div>
        <p class="text-sm text-gray-500 mt-2">${guide.distance || 'Location not specified'}</p>
        <button onclick="showGuideProfile('${guide.id || 'unknown'}')" 
          class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  `;
}

// Sample guide data as fallback
const sampleGuides = [
	{
		id: 'guide1',
		name: 'Rajesh Kumar',
		image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
		specialties: ['Historical Sites', 'Cultural Tours'],
		languages: ['English', 'Hindi', 'Punjabi'],
		price: '₹800/day',
		availability: 'online',
		rating: '4.8',
		reviews: '127',
		distance: '2.5 km away'
	},
	{
		id: 'guide2',
		name: 'Priya Sharma',
		image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
		specialties: ['Adventure Tours', 'Nature Walks'],
		languages: ['English', 'Hindi'],
		price: '₹600/day',
		availability: 'online',
		rating: '4.6',
		reviews: '89',
		distance: '1.8 km away'
	},
	{
		id: 'guide3',
		name: 'Mohammed Ali',
		image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
		specialties: ['Food Tours', 'Local Markets'],
		languages: ['English', 'Hindi', 'Urdu'],
		price: '₹700/day',
		availability: 'online',
		rating: '4.9',
		reviews: '156',
		distance: '3.2 km away'
	}
];

// Fetch guides from Firestore
async function loadGuides() {
	guidesContainer.innerHTML = '<p class="text-gray-500">Loading guides...</p>';
	try {
		const querySnapshot = await getDocs(collection(db, 'guides'));
		let html = '';
		
		if (querySnapshot.empty) {
			// Use sample data if no guides in database
			console.log('No guides found in database, using sample data');
			sampleGuides.forEach(guide => {
				html += renderGuideCard(guide);
			});
		} else {
			querySnapshot.forEach(doc => {
				html += renderGuideCard(doc.data());
			});
		}
		
		guidesContainer.innerHTML = html;
	} catch (error) {
		console.error('Error fetching guides:', error);
		console.log('Loading sample guides due to error');
		
		// Fallback to sample data on error
		let html = '';
		sampleGuides.forEach(guide => {
			html += renderGuideCard(guide);
		});
		guidesContainer.innerHTML = html;
	}
}

// Function to show guide profile (placeholder for now)
function showGuideProfile(guideId) {
	alert(`Guide profile for ID: ${guideId} - Feature coming soon!`);
	// TODO: Implement modal or redirect to guide profile page
}

// Function to filter guides based on search input
function filterGuides(searchTerm) {
	const guideCards = document.querySelectorAll('#guides-container > div');
	const searchLower = searchTerm.toLowerCase();
	
	guideCards.forEach(card => {
		const cardText = card.textContent.toLowerCase();
		if (cardText.includes(searchLower)) {
			card.style.display = 'block';
		} else {
			card.style.display = 'none';
		}
	});
}

// Auto-run on page load
loadGuides();

// Expose functions globally
window.loadGuides = loadGuides;
window.showGuideProfile = showGuideProfile;
window.filterGuides = filterGuides;
