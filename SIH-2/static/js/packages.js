// Sample package data
const samplePackages = [
  {
    id: 1,
    title: "Hidden Shores of North Goa Beaches",
    duration: "4N/5D",
    location: "Goa",
    theme: "beach",
    city: "goa",
    price: 18500,
    originalPrice: 22000,
    rating: 4.8,
    hotelCategory: 4,
    withFlight: true,
    customizable: true,
    premium: true,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["4 Star Hotel", "All Meals", "Airport Pickup", "Beach Activities"],
    description: "Experience the pristine beaches of North Goa with luxury accommodation and exclusive beach access."
  },
  {
    id: 2,
    title: "Kerala Backwaters & Spice Plantations",
    duration: "5N/6D",
    location: "Kerala",
    theme: "cultural",
    city: "kerala",
    price: 22500,
    originalPrice: 28000,
    rating: 4.9,
    hotelCategory: 5,
    withFlight: true,
    customizable: false,
    premium: true,
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["5 Star Resort", "All Meals", "Houseboat Stay", "Spice Tour"],
    description: "Cruise through the serene backwaters and explore aromatic spice plantations in God's Own Country."
  },
  {
    id: 3,
    title: "Royal Rajasthan Heritage Tour",
    duration: "7N/8D",
    location: "Rajasthan",
    theme: "cultural",
    city: "rajasthan",
    price: 32000,
    originalPrice: 38000,
    rating: 4.7,
    hotelCategory: 4,
    withFlight: true,
    customizable: true,
    premium: false,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["4 Star Palace Hotels", "All Meals", "Camel Safari", "Cultural Shows"],
    description: "Discover the royal heritage of Rajasthan with palace stays and desert adventures."
  },
  {
    id: 4,
    title: "Himachal Hill Station Retreat",
    duration: "3N/4D",
    location: "Himachal Pradesh",
    theme: "mountain",
    city: "himachal",
    price: 12500,
    originalPrice: 15000,
    rating: 4.6,
    hotelCategory: 3,
    withFlight: false,
    customizable: true,
    premium: false,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["3 Star Resort", "Breakfast", "Mountain Views", "Trekking"],
    description: "Escape to the cool mountains of Himachal Pradesh for a refreshing retreat."
  },
  {
    id: 5,
    title: "Kashmir Paradise Valley",
    duration: "6N/7D",
    location: "Kashmir",
    theme: "mountain",
    city: "kashmir",
    price: 28000,
    originalPrice: 32000,
    rating: 4.9,
    hotelCategory: 5,
    withFlight: true,
    customizable: false,
    premium: true,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["5 Star Hotel", "All Meals", "Shikara Ride", "Gondola Ride"],
    description: "Experience the breathtaking beauty of Kashmir with luxury accommodation and exclusive experiences."
  },
  {
    id: 6,
    title: "Adventure Sports in Rishikesh",
    duration: "2N/3D",
    location: "Uttarakhand",
    theme: "adventure",
    city: "himachal",
    price: 8500,
    originalPrice: 10000,
    rating: 4.5,
    hotelCategory: 3,
    withFlight: false,
    customizable: true,
    premium: false,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["3 Star Hotel", "Breakfast", "River Rafting", "Bungee Jumping"],
    description: "Get your adrenaline pumping with thrilling adventure sports in the adventure capital of India."
  },
  {
    id: 7,
    title: "Delhi Heritage & Culture Tour",
    duration: "3N/4D",
    location: "Delhi",
    theme: "cultural",
    city: "delhi",
    price: 15000,
    originalPrice: 18000,
    rating: 4.4,
    hotelCategory: 4,
    withFlight: false,
    customizable: true,
    premium: false,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["4 Star Hotel", "All Meals", "Heritage Walks", "Museum Tours"],
    description: "Explore the rich heritage and culture of Delhi with guided tours of historical monuments."
  },
  {
    id: 8,
    title: "Mumbai Bollywood Experience",
    duration: "2N/3D",
    location: "Mumbai",
    theme: "cultural",
    city: "mumbai",
    price: 12000,
    originalPrice: 15000,
    rating: 4.3,
    hotelCategory: 3,
    withFlight: false,
    customizable: true,
    premium: false,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["3 Star Hotel", "Breakfast", "Bollywood Studio Tour", "City Sightseeing"],
    description: "Experience the glitz and glamour of Bollywood with studio tours and city exploration."
  }
];

let filteredPackages = [...samplePackages];
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
let searchParams = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Get search parameters from URL or localStorage
  getSearchParameters();
  
  // Filter cities based on search
  filterCitiesBasedOnSearch();
  
  initializeFilters();
  displayPackages();
  updatePackageCount();
});

// Get search parameters from URL or localStorage
function getSearchParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const storedSearch = localStorage.getItem('packageSearch');
  
  if (urlParams.get('from') || storedSearch) {
    if (urlParams.get('from')) {
      searchParams = {
        from: urlParams.get('from'),
        to: urlParams.get('to'),
        departure: urlParams.get('departure'),
        passengers: urlParams.get('passengers')
      };
    } else if (storedSearch) {
      searchParams = JSON.parse(storedSearch);
    }
    
    // Display search info
    displaySearchInfo();
  }
}

// Display search information
function displaySearchInfo() {
  if (searchParams.from && searchParams.to) {
    const header = document.querySelector('h1');
    if (header) {
      header.innerHTML = `Travel Packages from <span class="text-gradient">${searchParams.from}</span> to <span class="text-gradient">${searchParams.to}</span>`;
    }
  }
}

// Filter cities based on search parameters
function filterCitiesBasedOnSearch() {
  if (searchParams.from) {
    const fromCity = searchParams.from.toLowerCase();
    const cityFilters = document.querySelectorAll('.city-filter');
    
    cityFilters.forEach(filter => {
      const cityValue = filter.value.toLowerCase();
      const cityLabel = filter.nextElementSibling.textContent.toLowerCase();
      
      // Hide the city if it matches the "from" city
      if (cityValue === fromCity || cityLabel.includes(fromCity) || fromCity.includes(cityValue)) {
        filter.closest('label').style.display = 'none';
      }
    });
  }
}

// Filter functionality
function initializeFilters() {
  // Duration slider
  const durationSlider = document.getElementById('durationSlider');
  const durationValue = document.getElementById('durationValue');
  
  durationSlider.addEventListener('input', function() {
    durationValue.textContent = this.value + ' Nights';
    applyFilters();
  });

  // Duration buttons
  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('bg-blue-500', 'text-white'));
      this.classList.add('bg-blue-500', 'text-white');
      durationSlider.value = this.dataset.duration;
      durationValue.textContent = this.dataset.duration + ' Nights';
      applyFilters();
    });
  });

  // Flight buttons
  document.querySelectorAll('.flight-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.flight-btn').forEach(b => b.classList.remove('bg-blue-500', 'text-white'));
      this.classList.add('bg-blue-500', 'text-white');
      applyFilters();
    });
  });

  // Budget slider
  const budgetSlider = document.getElementById('budgetSlider');
  const budgetValue = document.getElementById('budgetValue');
  
  budgetSlider.addEventListener('input', function() {
    budgetValue.textContent = '₹' + (this.value / 1000) + 'K';
    applyFilters();
  });

  // Budget buttons
  document.querySelectorAll('.budget-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.budget-btn').forEach(b => b.classList.remove('bg-blue-500', 'text-white'));
      this.classList.add('bg-blue-500', 'text-white');
      budgetSlider.value = this.dataset.budget;
      budgetValue.textContent = '₹' + (this.dataset.budget / 1000) + 'K';
      applyFilters();
    });
  });

  // Other filters
  document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  // Sort dropdown
  document.getElementById('sortBy').addEventListener('change', applyFilters);

  // Clear filters
  document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
}

function applyFilters() {
  const duration = parseInt(document.getElementById('durationSlider').value);
  const budget = parseInt(document.getElementById('budgetSlider').value);
  const selectedFlight = document.querySelector('.flight-btn.bg-blue-500')?.dataset.flight;
  const selectedHotelCategories = Array.from(document.querySelectorAll('.hotel-category:checked')).map(cb => parseInt(cb.value));
  const selectedCities = Array.from(document.querySelectorAll('.city-filter:checked')).map(cb => cb.value);
  const selectedThemes = Array.from(document.querySelectorAll('.theme-filter:checked')).map(cb => cb.value);
  const selectedPackageType = document.querySelector('input[name="package-type"]:checked')?.value;
  const premiumOnly = document.getElementById('premium-packages').checked;
  const sortBy = document.getElementById('sortBy').value;

  filteredPackages = samplePackages.filter(package => {
    // Duration filter
    const packageDuration = parseInt(package.duration.split('N')[0]);
    if (packageDuration > duration + 1) return false;

    // Budget filter
    if (package.price > budget) return false;

    // Flight filter
    if (selectedFlight && package.withFlight !== (selectedFlight === 'with')) return false;

    // Hotel category filter
    if (selectedHotelCategories.length > 0 && !selectedHotelCategories.includes(package.hotelCategory)) return false;

    // City filter
    if (selectedCities.length > 0 && !selectedCities.includes(package.city)) return false;

    // Theme filter
    if (selectedThemes.length > 0 && !selectedThemes.includes(package.theme)) return false;

    // Package type filter
    if (selectedPackageType && package.customizable !== (selectedPackageType === 'customizable')) return false;

    // Premium filter
    if (premiumOnly && !package.premium) return false;

    return true;
  });

  // Sort packages
  switch (sortBy) {
    case 'price-low':
      filteredPackages.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredPackages.sort((a, b) => b.price - a.price);
      break;
    case 'duration':
      filteredPackages.sort((a, b) => parseInt(a.duration.split('N')[0]) - parseInt(b.duration.split('N')[0]));
      break;
    case 'rating':
      filteredPackages.sort((a, b) => b.rating - a.rating);
      break;
    default: // popularity
      filteredPackages.sort((a, b) => b.rating - a.rating);
  }

  displayPackages();
  updatePackageCount();
}

function clearAllFilters() {
  // Reset sliders
  document.getElementById('durationSlider').value = 5;
  document.getElementById('durationValue').textContent = '5 Nights';
  document.getElementById('budgetSlider').value = 25000;
  document.getElementById('budgetValue').textContent = '₹25K';

  // Reset buttons
  document.querySelectorAll('.duration-btn, .flight-btn, .budget-btn').forEach(btn => {
    btn.classList.remove('bg-blue-500', 'text-white');
  });

  // Reset checkboxes and radio buttons
  document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
    input.checked = false;
  });

  // Reset sort
  document.getElementById('sortBy').value = 'popularity';

  // Reset filters
  filteredPackages = [...samplePackages];
  displayPackages();
  updatePackageCount();
}

function displayPackages() {
  const grid = document.getElementById('packagesGrid');
  grid.innerHTML = '';

  filteredPackages.forEach(package => {
    const packageCard = createPackageCard(package);
    grid.appendChild(packageCard);
  });
}

function createPackageCard(package) {
  const card = document.createElement('div');
  card.className = 'package-card glass-effect rounded-2xl overflow-hidden hover-lift animate-fadeInUp';
  
  const isWishlisted = wishlist.includes(package.id);
  const discount = Math.round(((package.originalPrice - package.price) / package.originalPrice) * 100);
  
  card.innerHTML = `
    <div class="relative">
      <img src="${package.image}" alt="${package.title}" class="w-full h-48 object-cover">
      <div class="absolute top-4 left-4">
        <span class="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${package.premium ? 'MMT Premium' : 'Best Deal'}
        </span>
      </div>
      <div class="absolute top-4 right-4">
        <button class="wishlist-btn w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors ${isWishlisted ? 'active' : ''}" 
                onclick="toggleWishlist(${package.id})">
          <svg class="w-5 h-5" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
      <div class="absolute bottom-4 left-4">
        <span class="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          📍 ${package.location}
        </span>
      </div>
    </div>
    
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h3 class="text-xl font-semibold mb-2 text-slate-800">${package.title}</h3>
          <div class="flex items-center mb-2">
            <span class="text-sm text-slate-600 mr-4">${package.duration}</span>
            <div class="flex items-center">
              <div class="flex text-yellow-400 mr-1">
                ${generateStars(package.rating)}
              </div>
              <span class="text-sm text-slate-600">${package.rating}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <div class="flex flex-wrap gap-2 mb-3">
          ${package.features.map(feature => `<span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">${feature}</span>`).join('')}
        </div>
        <p class="text-sm text-slate-600">${package.description}</p>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-orange-600">₹${package.price.toLocaleString()}</span>
            <span class="text-lg text-slate-500 line-through">₹${package.originalPrice.toLocaleString()}</span>
            <span class="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">${discount}% OFF</span>
          </div>
          <div class="text-sm text-slate-600">per person</div>
          ${package.originalPrice > package.price ? '<div class="text-xs text-green-600 mt-1">This price is lower than average</div>' : ''}
        </div>
        <button class="btn-primary px-6 py-2 rounded-lg text-white font-semibold" onclick="bookPackage(${package.id})">
          Book Now
        </button>
      </div>
    </div>
  `;
  
  return card;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let stars = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '⭐';
  }
  
  // Half star
  if (hasHalfStar) {
    stars += '⭐';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆';
  }
  
  return stars;
}

function toggleWishlist(packageId) {
  const index = wishlist.indexOf(packageId);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(packageId);
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  displayPackages(); // Refresh to update heart icons
}

function bookPackage(packageId) {
  const package = samplePackages.find(p => p.id === packageId);
  if (package) {
    alert(`Booking ${package.title}\n\nDuration: ${package.duration}\nPrice: ₹${package.price.toLocaleString()} per person\n\nThis would redirect to the booking page.`);
  }
}

function updatePackageCount() {
  document.getElementById('packageCount').textContent = filteredPackages.length;
}

// Load more functionality
document.addEventListener('DOMContentLoaded', function() {
  const loadMoreBtn = document.getElementById('loadMore');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      // In a real app, this would load more packages from the server
      alert('Loading more packages...\n\nIn a real application, this would fetch additional packages from the server.');
    });
  }
});
