import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

const URLShortener = ({ darkMode = false }) => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Generate QR code using QR Server API
  const generateQRCode = (text, size = 200) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;

  const handleSubmit = async () => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: url, customAlias: customAlias.trim() || undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to shorten URL');

      setResult({
        shortUrl: `${API_URL}/${data.alias}`,
        alias:    data.alias,
        target:   data.target,
        clicks: data.clicks,
        createdAt: data.createdAt,
      });
      setShowQR(true);
      toast.success('URL shortened successfully!');
    } catch (error) {
      toast.error(error.message || 'Error shortening URL');
      console.error('Shorten Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success('Copied to clipboard!'),
      () => toast.error('Failed to copy to clipboard')
    );
  };

  const openUrl = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const downloadQR = () => {
    if (!result) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `qr-${result.alias}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = generateQRCode(result.shortUrl, 300);
  };

  const isDark = darkMode;
  
  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100'
    }`}>
      {/* Modern Grid Pattern Background */}
      <div className="absolute inset-0 opacity-30">
        <div className={`w-full h-full ${
          isDark 
            ? 'bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)]'
        } bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]`}></div>
      </div>

      {/* Animated floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              isDark ? 'bg-blue-400/20' : 'bg-indigo-400/20'
            } animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
          25% { transform: translateY(-20px) translateX(10px) scale(1.1); opacity: 1; }
          50% { transform: translateY(-40px) translateX(-5px) scale(0.9); opacity: 0.8; }
          75% { transform: translateY(-20px) translateX(-10px) scale(1.05); opacity: 0.9; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-12">
        {/* Hero Section - Full Width */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 mb-8">
            <span className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
              ✨ The Ultimate URL Shortening Experience
            </span>
          </div>
          
          <h1 className={`text-6xl md:text-8xl font-black mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Shorten.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent animate-pulse">
              Share.
            </span>
            <br />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              Succeed.
            </span>
          </h1>
          
          <p className={`text-2xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Transform lengthy URLs into powerful, trackable links with stunning QR codes. 
            Built for the modern digital world.
          </p>
        </div>

        {/* Main Shortener Card - Centered but Wide */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className={`backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border transition-all duration-500 hover:scale-[1.01] ${
            isDark 
              ? 'bg-white/5 border-white/10 shadow-blue-500/10' 
              : 'bg-white/80 border-white/40 shadow-blue-500/20'
          }`}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div>
                  <label className={`block text-lg font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    🔗 Your Long URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very/long/url/that/needs/shortening"
                    className={`w-full px-6 py-4 rounded-2xl text-lg transition-all duration-300 border-2 focus:scale-[1.02] ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/20' 
                        : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:bg-white'
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-lg font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    ✨ Custom Alias (Optional)
                  </label>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-awesome-link"
                    minLength={3}
                    maxLength={20}
                    className={`w-full px-6 py-4 rounded-2xl text-lg transition-all duration-300 border-2 focus:scale-[1.02] ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/20' 
                        : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:bg-white'
                    } focus:outline-none`}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-6 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl ${
                    loading
                      ? 'bg-gray-500 cursor-not-allowed'
                      : isDark 
                        ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-blue-500/50'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-blue-500/50'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                      Creating Magic...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-3">🚀</span>
                      Shorten & Generate QR
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section - Full Width */}
        {result && (
          <div className="max-w-7xl mx-auto mb-16">
            {/* Success Banner */}
            <div className={`backdrop-blur-xl rounded-3xl p-8 mb-8 border transition-all duration-500 ${
              isDark 
                ? 'bg-emerald-500/20 border-emerald-400/30 shadow-emerald-500/20' 
                : 'bg-green-50/80 border-green-200 shadow-green-500/20'
            }`}>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mr-6 animate-bounce">
                  <span className="text-white text-2xl">✓</span>
                </div>
                <div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-emerald-400' : 'text-green-600'}`}>
                    🎉 URL Successfully Shortened!
                  </h2>
                  <p className={`text-lg ${isDark ? 'text-emerald-300' : 'text-green-700'}`}>
                    Your shortened URL and QR code are ready to use
                  </p>
                </div>
              </div>
            </div>

            {/* URL Results */}
            <div className={`backdrop-blur-xl rounded-3xl p-8 mb-8 border transition-all duration-500 ${
              isDark 
                ? 'bg-white/5 border-white/10 shadow-blue-500/10' 
                : 'bg-white/80 border-white/40 shadow-blue-500/20'
            }`}>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={`block text-lg font-bold mb-3 ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                      🔗 Your Shortened URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={result.shortUrl}
                        readOnly
                        className={`flex-1 px-6 py-4 rounded-l-2xl text-lg border-2 border-r-0 ${
                          isDark 
                            ? 'bg-white/5 border-white/20 text-white' 
                            : 'bg-gray-50 border-gray-300 text-gray-900'
                        }`}
                      />
                      <button
                        onClick={() => copyToClipboard(result.shortUrl)}
                        className={`px-6 py-4 text-white rounded-r-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          isDark 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-blue-600'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-blue-600'
                        }`}
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => openUrl(result.shortUrl)}
                      className={`px-6 py-4 text-white rounded-2xl transition-all duration-300 font-bold hover:scale-105 ${
                        isDark 
                          ? 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      }`}
                    >
                      🔗 Open Link
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.shortUrl)}
                      className={`px-6 py-4 rounded-2xl transition-all duration-300 font-bold hover:scale-105 ${
                        isDark 
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      📋 Copy Link
                    </button>
                  </div>
                </div>

                <div className={`grid grid-cols-2 gap-6 p-6 rounded-2xl ${
                  isDark ? 'bg-white/5' : 'bg-gray-50/50'
                }`}>
                  <div>
                    <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Alias:
                    </span>
                    <p className={`mt-2 font-mono text-lg ${isDark ? 'text-cyan-300' : 'text-purple-600'}`}>
                      {result.alias}
                    </p>
                  </div>
                  <div>
                    <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Clicks:
                    </span>
                    <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                      {result.clicks}
                    </p>
                  </div>
                  <div>
                    <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Created:
                    </span>
                    <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Target:
                    </span>
                    <p className={`mt-2 text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`} title={result.target}>
                      {result.target}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section - Below URL results */}
            {showQR && (
              <div className={`backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 ${
                isDark 
                  ? 'bg-white/5 border-white/10 shadow-cyan-500/10' 
                  : 'bg-white/80 border-white/40 shadow-purple-500/20'
              }`}>
                <div className="text-center mb-8">
                  <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    📱 Your QR Code
                  </h3>
                  <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Scan with any camera app or QR reader
                  </p>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                  <div className={`p-8 rounded-3xl shadow-xl ${isDark ? 'bg-white' : 'bg-white'}`}>
                    <img
                      ref={qrRef}
                      src={generateQRCode(result.shortUrl, 300)}
                      alt="QR Code"
                      className="w-72 h-72 mx-auto"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIExvYWRpbmcgUVI8L3RleHQ+Cjwvc3ZnPg==";
                      }}
                    />
                  </div>
                  
                  <div className="space-y-4 max-w-md">
                    <button
                      onClick={downloadQR}
                      className={`w-full px-8 py-4 text-white rounded-2xl transition-all duration-300 font-bold text-lg hover:scale-105 ${
                        isDark 
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                      }`}
                    >
                      💾 Download QR Code
                    </button>
                    
                    <button
                      onClick={() => copyToClipboard(generateQRCode(result.shortUrl, 300))}
                      className={`w-full px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-lg hover:scale-105 ${
                        isDark 
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      🔗 Copy QR URL
                    </button>
                    
                    <div className={`p-6 rounded-2xl ${
                      isDark ? 'bg-white/10' : 'bg-gray-50'
                    }`}>
                      <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Perfect for:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Print materials', 'Business cards', 'Presentations', 'Posters', 'Flyers', 'Social media'].map((item, index) => (
                          <span key={index} className={`px-3 py-2 rounded-xl text-sm font-medium text-center ${
                            isDark 
                              ? 'bg-cyan-500/20 text-cyan-300' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Grid - Full Width */}
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Why Choose Our Platform?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Create shortened URLs in milliseconds with our optimized backend infrastructure.'
              },
              {
                icon: '📱',
                title: 'Smart QR Codes',
                description: 'Generate high-quality QR codes instantly for seamless cross-platform sharing.'
              },
              {
                icon: '📊',
                title: 'Analytics Ready',
                description: 'Track clicks, analyze performance, and understand your audience better.'
              },
              {
                icon: '🎨',
                title: 'Custom Branding',
                description: 'Create memorable custom aliases that reflect your brand and message.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:rotate-1 ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                    : 'bg-white/60 hover:bg-white/80 border border-white/40'
                } backdrop-blur-sm shadow-xl`}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {feature.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLShortener;