import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Dashboard = ({ darkMode }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/links`);
      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      toast.error('Failed to load links');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const filteredLinks = links.filter(link =>
    link.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Your{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h2>
        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
          Manage and track all your shortened URLs in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl shadow-lg ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700/30' 
            : 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'
        }`}>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xl">🔗</span>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Links
              </p>
              <p className="text-3xl font-bold text-blue-600">{links.length}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg ${
          darkMode 
            ? 'bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700/30' 
            : 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200'
        }`}>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
              <span className="text-white text-xl">👆</span>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Clicks
              </p>
              <p className="text-3xl font-bold text-green-600">{totalClicks}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg ${
          darkMode 
            ? 'bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-700/30' 
            : 'bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200'
        }`}>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg. Clicks
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`rounded-2xl p-6 shadow-lg ${
        darkMode 
          ? 'bg-gray-800/50' 
          : 'bg-white/70'
      }`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by alias or target URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <span className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>🔍</span>
          </div>
        </div>
      </div>

      {/* Links Table */}
      {filteredLinks.length === 0 ? (
        <div className={`text-center py-12 rounded-2xl ${
          darkMode ? 'bg-gray-800/30' : 'bg-white/50'
        }`}>
          <div className="text-6xl mb-4">🔗</div>
          <h3 className="text-xl font-semibold mb-2">
            {links.length === 0 ? 'No links yet' : 'No matching links found'}
          </h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {links.length === 0 
              ? 'Create your first shortened URL to get started!' 
              : 'Try adjusting your search terms.'
            }
          </p>
        </div>
      ) : (
        <div className={`rounded-2xl shadow-lg overflow-hidden ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/70'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Short URL
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Target URL
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Clicks
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Created
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLinks.map((link, index) => (
                  <tr key={link._id} className={`transition-colors hover:${
                    darkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                  }`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <code className={`px-2 py-1 rounded text-sm font-mono ${
                          darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {link.alias}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                        title={link.target}
                      >
                        {truncateUrl(link.target)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        link.clicks > 0 
                          ? darkMode 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-green-100 text-green-800'
                          : darkMode 
                            ? 'bg-gray-700 text-gray-400' 
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {link.clicks}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(link.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(link.shortUrl)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                          title="Copy short URL"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => openUrl(link.shortUrl)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }`}
                          title="Open short URL"
                        >
                          ↗
                        </button>
                        <button
                          onClick={() => openUrl(link.target)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                              : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                          }`}
                          title="Open target URL"
                        >
                          🎯
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Show results count */}
      {filteredLinks.length > 0 && searchTerm && (
        <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {filteredLinks.length} of {links.length} links
        </div>
      )}
    </div>
  );
};

export default Dashboard;