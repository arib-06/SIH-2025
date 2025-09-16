import React from 'react';

const Navbar = () => {
  const handleSignIn = () => {
    // Navigate to sign in page
    console.log('Navigate to sign in');
  };

  const handleSettings = () => {
    // Navigate to settings page
    console.log('Navigate to settings');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect animate-slideInLeft">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 100 100">
                  <path 
                    d="M50 10 C35 10, 25 20, 25 35 C25 55, 50 85, 50 85 C50 85, 75 55, 75 35 C75 20, 65 10, 50 10 Z"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                  />
                  <circle cx="50" cy="35" r="3" fill="currentColor" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-gradient">Traverz</h1>
          </div>
            
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/translate" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
              Translate
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/ai-assistance" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
              AI Assistance
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/emergency" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium relative group">
              Emergency
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSignIn}
              className="px-4 py-2 bg-[#0ea5e9] text-white font-semibold hover:bg-[#0284c7] transition-colors rounded-lg"
            >
              Sign In
            </button>
            <button 
              onClick={handleSettings}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
