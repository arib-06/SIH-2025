/** @format */
import {db} from './firebase.js';
import {collection, getDocs} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const guidesContainer = document.getElementById('guides-container');

// Function to render a single guide card
function renderGuideCard(guide) {
	return `
    <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img src="${guide.image}" alt="${guide.name}" class="w-full h-48 object-cover" loading="lazy" />
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-800">${guide.name}</h3>
        <p class="text-gray-600">${guide.specialties.join(', ')}</p>
        <p class="text-sm text-gray-500 mt-1">${guide.languages.join(', ')}</p>
        <p class="mt-3 text-green-600 font-semibold">${guide.price}</p>
        <p class="text-sm ${guide.availability === 'online' ? 'text-green-500' : 'text-red-500'}">
          ${guide.availability}
        </p>
        <div class="flex items-center mt-2 text-yellow-500">
          ⭐ ${guide.rating} <span class="ml-2 text-gray-500">(${guide.reviews} reviews)</span>
        </div>
        <p class="text-sm text-gray-500 mt-2">${guide.distance}</p>
        <button onclick="showGuideProfile('${guide.id}')" 
          class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  `;
}

// Fetch guides from Firestore
async function loadGuides() {
	guidesContainer.innerHTML = '<p class="text-gray-500">Loading guides...</p>';
	try {
		const querySnapshot = await getDocs(collection(db, 'guides'));
		let html = '';
		querySnapshot.forEach(doc => {
			html += renderGuideCard(doc.data());
		});
		guidesContainer.innerHTML = html;
	} catch (error) {
		console.error('Error fetching guides:', error);
		guidesContainer.innerHTML = '<p class="text-red-500">Failed to load guides.</p>';
	}
}

// Auto-run on page load
loadGuides();

// Expose if needed globally
window.loadGuides = loadGuides;
