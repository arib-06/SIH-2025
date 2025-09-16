// Navbar Loader Script
// This script dynamically loads the navbar into all pages

document.addEventListener('DOMContentLoaded', function() {
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
        <nav class="fixed top-0 w-full z-50 bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <h1 class="text-2xl font-bold text-blue-600">Traverz</h1>
                    <div class="flex space-x-6">
                        <a href="modern_traverz_website.html" class="text-gray-700 hover:text-blue-600">Home</a>
                        <a href="tourist_guide.html" class="text-gray-700 hover:text-blue-600">Tourist Guide</a>
                        <a href="modern_traverz_translate.html" class="text-gray-700 hover:text-blue-600">Translate</a>
                        <a href="perplexitypart2.html" class="text-gray-700 hover:text-blue-600">AI Assistance</a>
                        <a href="sos.html" class="text-gray-700 hover:text-blue-600">Emergency</a>
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
