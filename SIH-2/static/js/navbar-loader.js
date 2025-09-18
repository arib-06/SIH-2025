/** @format */

// Navbar Loader Script
// This script dynamically loads the navbar into all pages

document.addEventListener('DOMContentLoaded', function () {
	loadNavbar();
});

async function loadNavbar() {
	try {
		const response = await fetch('navbar.html');
		const navbarHTML = await response.text();

		// Find the navbar placeholder or create one if it doesn't exist
		let navbarContainer = document.getElementById('navbar-container');

		if (!navbarContainer) {
			// If no container exists, insert navbar at the beginning of body
			navbarContainer = document.createElement('div');
			navbarContainer.id = 'navbar-container';
			document.body.insertBefore(navbarContainer, document.body.firstChild);
		}

		navbarContainer.innerHTML = navbarHTML;

		// Highlight current page in navigation
		highlightCurrentPage();
	} catch (error) {
		console.error('Error loading navbar:', error);
		// Fallback: create a basic navbar if loading fails
		createFallbackNavbar();
	}
}

function highlightCurrentPage() {
	const currentPage = window.location.pathname.split('/').pop();
	const navLinks = document.querySelectorAll('nav a');

	navLinks.forEach(link => {
		const linkPage = link.getAttribute('href');
		if (linkPage === currentPage) {
			link.classList.add('text-blue-600');
			const underline = link.querySelector('span');
			if (underline) {
				underline.classList.add('w-full');
			}
		}
	});
}

function createFallbackNavbar() {
	const fallbackNavbar = `
        <nav class="fixed top-0 w-full z-50 glass-effect">
            <div class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <!-- Logo -->
                    <div class="flex items-center space-x-3">
                        <div class="relative">
                            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 100 100">
                                    <path d="M50 10 C35 10, 25 20, 25 35 C25 55, 50 85, 50 85 C50 85, 75 55, 75 35 C75 20, 65 10, 50 10 Z" fill="none" stroke="currentColor" stroke-width="3" />
                                    <circle cx="50" cy="35" r="3" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                        <h1 class="text-2xl font-display font-bold text-gradient">Traverz</h1>
                    </div>

                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="/" class="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
                            Home
                            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <a href="/translate.html" class="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
                            Translate
                            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <a href="assistant.html" class="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
                            AI Assistance
                            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <a href="sos.html" class="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
                            Emergency
                            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </div>

                    <!-- CTA Buttons (always visible) -->
                    <div class="flex items-center space-x-4">
                        <button onclick="window.location.href='signin.html';" class="px-4 py-2 bg-[#0ea5e9] text-white font-semibold hover:bg-[#0284c7] transition-colors rounded-lg">
                            Sign In
                        </button>
                        <button onclick="window.location.href='settings.html';" class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;

	let navbarContainer = document.getElementById('navbar-container');
	if (!navbarContainer) {
		navbarContainer = document.createElement('div');
		navbarContainer.id = 'navbar-container';
		document.body.insertBefore(navbarContainer, document.body.firstChild);
	}
	navbarContainer.innerHTML = fallbackNavbar;
}
