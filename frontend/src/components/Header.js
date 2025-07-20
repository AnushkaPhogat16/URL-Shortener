import React from 'react';

const Header = ({ darkMode, toggleDarkMode, currentView, setCurrentView }) => {
  return (
    <header className={`shadow-lg transition-all duration-300 ${
      darkMode ? 'bg-gray-800 shadow-gray-700/50' : 'bg-white shadow-blue-200/50'
    }`}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-500'
              }`}>
                <span className="text-white font-bold text-xl">↗</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TinyURL Pro
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="flex space-x-1">
              <button
                onClick={() => setCurrentView('shortener')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'shortener'
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Shortener
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
            </nav>

            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                darkMode 
                  ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                  : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;