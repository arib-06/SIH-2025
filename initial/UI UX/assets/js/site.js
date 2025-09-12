// Site-wide JavaScript functionality
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation toggle
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      
      // Update aria-expanded for accessibility
      const isExpanded = navLinks.classList.contains("active");
      toggle.setAttribute("aria-expanded", isExpanded);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    
    // Close mobile menu when pressing Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }
  
  // Profile picture click navigation
  const profilePic = document.getElementById("profile-pic");
  if (profilePic) {
    profilePic.addEventListener("click", () => {
      window.location.href = "setting.html";
    });
    
    profilePic.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.href = "setting.html";
      }
    });
    
    // Add tabindex for keyboard accessibility
    profilePic.setAttribute("tabindex", "0");
    profilePic.setAttribute("role", "button");
    profilePic.setAttribute("aria-label", "Open settings");
  }
  
  // Initialize AOS (Animate On Scroll) if available
  if (window.AOS) {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      offset: 100,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });
  }
  
  // Theme management
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Theme toggle functionality (if theme toggle button exists)
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Form validation helpers
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          
          // Remove error class on input
          field.addEventListener('input', () => {
            field.classList.remove('error');
          }, { once: true });
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  });
  
  // Auto-resize textareas
  document.querySelectorAll('textarea[data-auto-resize]').forEach(textarea => {
    const autoResize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    };
    
    textarea.addEventListener('input', autoResize);
    autoResize(); // Initial resize
  });
  
  // Loading states for buttons
  document.querySelectorAll('[data-loading]').forEach(button => {
    button.addEventListener('click', function() {
      if (!this.disabled) {
        this.classList.add('loading');
        this.disabled = true;
        
        // Re-enable after 3 seconds (adjust as needed)
        setTimeout(() => {
          this.classList.remove('loading');
          this.disabled = false;
        }, 3000);
      }
    });
  });
  
  // Notification system
  window.showNotification = (message, type = 'info', duration = 5000) => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after duration
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  };
  
  // Emergency button functionality
  const emergencyButtons = document.querySelectorAll('.btn-emergency');
  emergencyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Confirm emergency action
      if (confirm('Are you sure you want to access emergency services?')) {
        window.location.href = 'sos.html';
      }
    });
  });
  
  // Search functionality (if search input exists)
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query.length > 2) {
        searchTimeout = setTimeout(() => {
          // Implement search functionality here
          console.log('Searching for:', query);
        }, 300);
      }
    });
  }
  
  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Utility functions
window.utils = {
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Format date
  formatDate: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  },
  
  // Copy to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      window.showNotification('Copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy: ', err);
      window.showNotification('Failed to copy to clipboard', 'error');
    }
  }
};