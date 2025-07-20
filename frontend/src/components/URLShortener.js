import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const URLShortener = ({ darkMode }) => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Result changed:', result);
  }, [result]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: url,
          customAlias: customAlias.trim() || undefined,
        }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Add this line

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      console.log('Setting result:', data); // Add this line
      setResult(data);
      console.log('Result set, current result:', data); // Add this line
      toast.success('URL shortened successfully!');

      
  
    } catch (error) {
      toast.error(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const openUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Shorten Your{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Long URLs
          </span>
        </h2>
        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
          Create clean, memorable links that are easy to share. Track clicks and manage all your shortened URLs in one place.
        </p>
      </div>

      {/* URL Shortener Form */}
      <div className={`rounded-2xl p-8 shadow-xl backdrop-blur-sm transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800/50 shadow-gray-900/50' 
          : 'bg-white/70 shadow-blue-200/50'
      }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Long URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Custom Alias (optional)
            </label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="my-custom-link"
              minLength="3"
              maxLength="20"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              3-20 characters, letters and numbers only
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98] ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Shortening...
              </div>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>
      </div>

      {/* Result Card */}
      {result && result.shortUrl && (
        <div className={`rounded-2xl p-8 shadow-xl transition-all duration-500 transform slide-in-from-bottom ${
          darkMode 
            ? 'bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700/30' 
            : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
        }`}>
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <span className="text-white font-bold">✓</span>
            </div>
            <h3 className="text-xl font-bold text-green-600">URL Shortened Successfully!</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Short URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={result.shortUrl}
                  readOnly
                  className={`flex-1 px-4 py-3 rounded-l-xl border-2 border-r-0 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  onClick={() => copyToClipboard(result.shortUrl)}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-xl border-2 border-blue-600 transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Actions
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => openUrl(result.shortUrl)}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
                >
                  Open Link
                </button>
                <button
                  onClick={() => copyToClipboard(result.shortUrl)}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          <div className={`mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${
            darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
          }`}>
            <div>
              <span className="font-semibold">Alias:</span>
              <p className="mt-1 font-mono">{result.alias}</p>
            </div>
            <div>
              <span className="font-semibold">Clicks:</span>
              <p className="mt-1">{result.clicks}</p>
            </div>
            <div>
              <span className="font-semibold">Created:</span>
              <p className="mt-1">{new Date(result.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="font-semibold">Target:</span>
              <p className="mt-1 truncate" title={result.target}>{result.target}</p>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {[
          {
            icon: '⚡',
            title: 'Lightning Fast',
            description: 'Create shortened URLs in milliseconds with our optimized backend.'
          },
          {
            icon: '📊',
            title: 'Track Clicks',
            description: 'Monitor how many times your shortened URLs have been clicked.'
          },
          {
            icon: '🎨',
            title: 'Custom Aliases',
            description: 'Create memorable custom aliases for your shortened URLs.'
          }
        ].map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              darkMode 
                ? 'bg-gray-800/30 hover:bg-gray-800/50' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default URLShortener;