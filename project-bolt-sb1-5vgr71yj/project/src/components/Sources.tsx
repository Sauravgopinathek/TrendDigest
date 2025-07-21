import React, { useState } from 'react';
import { Plus, Globe, Youtube, Twitter, Search, MoreVertical, CheckCircle, AlertCircle } from 'lucide-react';

export const Sources: React.FC = () => {
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState('newsletter');

  const sources = [
    {
      id: 1,
      name: 'TechCrunch',
      url: 'techcrunch.com',
      type: 'Blog',
      status: 'active',
      articles: 23,
      lastUpdated: '2 min ago',
      category: 'Technology'
    },
    {
      id: 2,
      name: 'First Round Review',
      url: 'review.firstround.com',
      type: 'Newsletter',
      status: 'active',
      articles: 18,
      lastUpdated: '15 min ago',
      category: 'Venture Capital'
    },
    {
      id: 3,
      name: 'r/entrepreneur',
      url: 'reddit.com/r/entrepreneur',
      type: 'Reddit',
      status: 'active',
      articles: 45,
      lastUpdated: '5 min ago',
      category: 'Entrepreneurship'
    },
    {
      id: 4,
      name: 'a16z Podcast',
      url: 'a16z.com/podcasts',
      type: 'Podcast',
      status: 'active',
      articles: 12,
      lastUpdated: '1 hour ago',
      category: 'Investing'
    },
    {
      id: 5,
      name: 'Morning Brew',
      url: 'morningbrew.com',
      type: 'Newsletter',
      status: 'error',
      articles: 0,
      lastUpdated: '2 days ago',
      category: 'Business News'
    },
    {
      id: 6,
      name: 'Product Hunt',
      url: 'producthunt.com',
      type: 'Platform',
      status: 'active',
      articles: 34,
      lastUpdated: '30 min ago',
      category: 'Product Discovery'
    }
  ];

  const handleAddSource = () => {
    if (!newSourceUrl.trim()) return;
    
    // Validate URL format
    try {
      new URL(newSourceUrl.startsWith('http') ? newSourceUrl : `https://${newSourceUrl}`);
    } catch {
      alert('❌ Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    
    // Check for duplicates
    const existingSource = sources.find(s => s.url.toLowerCase() === newSourceUrl.toLowerCase());
    if (existingSource) {
      alert('⚠️ This source is already in your list!');
      return;
    }
    
    // Add the new source to the list with animation
    const newSource = {
      id: sources.length + 1,
      name: extractDomainName(newSourceUrl),
      url: newSourceUrl,
      type: newSourceType.charAt(0).toUpperCase() + newSourceType.slice(1),
      status: 'active' as const,
      articles: Math.floor(Math.random() * 20) + 1,
      lastUpdated: 'just now',
      category: getCategoryForType(newSourceType)
    };
    
    // Simulate API call with loading state
    const addButton = document.querySelector('.add-source-btn') as HTMLButtonElement;
    if (addButton) {
      addButton.textContent = 'Adding...';
      addButton.disabled = true;
    }
    
    setTimeout(() => {
      // Add to sources list
    sources.push(newSource);
    setNewSourceUrl('');
    setShowAddSource(false);
    
      // Show success message with details
      alert(`✅ Successfully added ${newSource.name}!\n\n📊 Source Details:\n• Type: ${newSource.type}\n• Category: ${newSource.category}\n• Status: Active\n\nThe source is now being monitored for new content.`);
      
      if (addButton) {
        addButton.textContent = 'Add Source';
        addButton.disabled = false;
      }
    }, 1500);
  };

  const extractDomainName = (url: string): string => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return domain.replace('www.', '').split('.')[0];
    } catch {
      return url.split('/')[0] || 'New Source';
    }
  };

  const getCategoryForType = (type: string): string => {
    const categoryMap: { [key: string]: string } = {
      'newsletter': 'Business News',
      'blog': 'Technology',
      'reddit': 'Community',
      'substack': 'Analysis',
      'podcast': 'Audio Content',
      'rss': 'General'
    };
    return categoryMap[type] || 'General';
  };

  const handleRemoveSource = (sourceId: number) => {
    const source = sources.find(s => s.id === sourceId);
    if (!source) return;
    
    const confirmMessage = `🗑️ Remove Source: ${source.name}\n\nThis will:\n• Stop monitoring this source\n• Remove it from your digest\n• Delete historical data\n\nAre you sure you want to continue?`;
    
    if (confirm(confirmMessage)) {
      const index = sources.findIndex(s => s.id === sourceId);
      if (index > -1) {
        // Simulate API call
        const removeButton = document.querySelector(`[data-source-id="${sourceId}"] .remove-btn`) as HTMLButtonElement;
        if (removeButton) {
          removeButton.textContent = 'Removing...';
          removeButton.disabled = true;
        }
        
        setTimeout(() => {
        sources.splice(index, 1);
          alert(`✅ ${source.name} removed successfully!\n\n📊 Updated Stats:\n• Total sources: ${sources.length}\n• Active sources: ${sources.filter(s => s.status === 'active').length}`);
        // Force re-render by updating state
        setShowAddSource(false);
        }, 1000);
      }
    }
  };

  const handleToggleSource = (sourceId: number) => {
    const source = sources.find(s => s.id === sourceId);
    if (source) {
      const newStatus = source.status === 'active' ? 'error' : 'active';
      const action = newStatus === 'active' ? 'Activating' : 'Pausing';
      
      // Show loading state
      const toggleButton = document.querySelector(`[data-source-id="${sourceId}"] .toggle-btn`) as HTMLButtonElement;
      if (toggleButton) {
        toggleButton.textContent = `${action}...`;
        toggleButton.disabled = true;
      }
      
      setTimeout(() => {
      source.status = source.status === 'active' ? 'error' : 'active';
        const statusText = source.status === 'active' ? 'activated' : 'paused';
        alert(`✅ ${source.name} ${statusText} successfully!\n\n📊 Impact:\n• ${statusText === 'activated' ? 'Now monitoring for new content' : 'Stopped monitoring content'}\n• Digest will be ${statusText === 'activated' ? 'updated with' : 'updated without'} this source`);
        
        if (toggleButton) {
          toggleButton.textContent = source.status === 'active' ? 'Pause' : 'Activate';
          toggleButton.disabled = false;
        }
      }, 1200);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'blog':
      case 'newsletter':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'reddit':
        return <Search className="w-4 h-4 text-orange-500" />;
      case 'youtube':
      case 'podcast':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 text-blue-400" />;
      default:
        return <Globe className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Sources</h1>
          <p className="text-gray-600">Manage your news sources and data feeds</p>
        </div>
        <button
          onClick={() => setShowAddSource(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Source</span>
        </button>
      </div>

      {/* Add Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Source</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source URL
                </label>
                <input
                  type="url"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Type
                </label>
                <select
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newsletter">Newsletter</option>
                  <option value="blog">Blog</option>
                  <option value="reddit">Reddit</option>
                  <option value="substack">Substack</option>
                  <option value="podcast">Podcast</option>
                  <option value="rss">RSS Feed</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddSource}
                className="add-source-btn flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Add Source
              </button>
              <button
                onClick={() => setShowAddSource(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sources Grid */}
      <div className="grid gap-4">
        {sources.map((source) => (
          <div key={source.id} data-source-id={source.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(source.type)}
                  {getStatusIcon(source.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{source.name}</h3>
                  <p className="text-sm text-gray-500">{source.url}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleToggleSource(source.id)}
                  className={`toggle-btn px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    source.status === 'active' 
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {source.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleRemoveSource(source.id)}
                  className="remove-btn px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors"
                >
                  Remove
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-sm text-gray-500">Type</span>
                  <div className="font-medium">{source.type}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Category</span>
                  <div className="font-medium">{source.category}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Articles Today</span>
                  <div className="font-medium">{source.articles}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Last Updated</span>
                <div className="font-medium">{source.lastUpdated}</div>
              </div>
            </div>
            
            {source.status === 'error' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  Unable to fetch content. Please check the source URL or authentication.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Source Categories */}
      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Technology', 'Venture Capital', 'Entrepreneurship', 'Business News', 'Product Discovery', 'Investing'].map((category, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="font-medium text-gray-900">{category}</div>
              <div className="text-sm text-gray-500">
                {sources.filter(s => s.category === category).length} sources
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};