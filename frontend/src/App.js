import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import URLShortener from './components/URLShortener';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [currentView, setCurrentView] = useState('shortener');

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'
    }`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {currentView === 'shortener' ? (
          <URLShortener darkMode={darkMode} />
        ) : (
          <Dashboard darkMode={darkMode} />
        )}
      </main>
      
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
          },
        }}
      />
    </div>
  );
}

export default App;