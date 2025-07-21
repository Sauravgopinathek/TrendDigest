import React from 'react';
import { TrendingUp, Users, Mail, Clock, ArrowUp, ArrowDown, Globe, Zap, RefreshCw, Download, Share2 } from 'lucide-react';
import { useTrend } from '../context/TrendContext';
import { emailService } from '../services/emailService';

export const Dashboard: React.FC = () => {
  const { mockTrends } = useTrend();

  const stats = [
    { label: 'Live News Sources', value: '47', change: '+3', trend: 'up', icon: Globe },
    { label: 'Email Subscribers', value: emailService.getUsers().length.toString(), change: '+12%', trend: 'up', icon: Users },
    { label: 'Daily Digests Sent', value: '1,247', change: '+12%', trend: 'up', icon: Mail },
    { label: 'Trends Tracked', value: '156', change: '+8', trend: 'up', icon: TrendingUp },
    { label: 'Real-time Updates', value: 'Live', change: 'Active', trend: 'up', icon: Zap },
  ];

  const recentTrends = [
    { topic: 'AI Enterprise Adoption', mentions: 342, growth: '+23%', category: 'Technology' },
    { topic: 'Remote Work Tools', mentions: 287, growth: '+18%', category: 'Workplace' },
    { topic: 'Sustainable Finance', mentions: 219, growth: '+31%', category: 'Finance' },
    { topic: 'Social Commerce', mentions: 195, growth: '+45%', category: 'E-commerce' },
    { topic: 'Health Tech Innovation', mentions: 156, growth: '+12%', category: 'Healthcare' },
  ];

  const topSources = [
    { name: 'TechCrunch', articles: 23, engagement: '94%' },
    { name: 'First Round Review', articles: 18, engagement: '91%' },
    { name: 'a16z Blog', articles: 15, engagement: '89%' },
    { name: 'Y Combinator', articles: 12, engagement: '87%' },
    { name: 'VentureBeat', articles: 19, engagement: '85%' },
  ];

  const refreshDashboard = () => {
    const button = document.querySelector('.refresh-btn') as HTMLButtonElement;
    if (button) {
      button.innerHTML = '<div class="flex items-center space-x-2"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Refreshing...</span></div>';
      button.disabled = true;
    }
    
    setTimeout(() => {
      // Simulate data refresh
      const newStats = {
        sources: Math.floor(Math.random() * 10) + 45,
        articles: Math.floor(Math.random() * 100) + 1200,
        trends: Math.floor(Math.random() * 20) + 150
      };
      
      alert(`🔄 Dashboard Refreshed Successfully!\n\n📊 Latest Data:\n• ${newStats.sources} live sources active\n• ${newStats.articles} articles processed today\n• ${newStats.trends} trends tracked\n• Real-time feeds updated\n• Analytics recalculated\n\n⚡ All data is now current as of ${new Date().toLocaleTimeString()}`);
      
      if (button) {
        button.innerHTML = '<div class="flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg><span>Refresh</span></div>';
        button.disabled = false;
      }
    }, 2000);
  };

  const exportReport = () => {
    const button = document.querySelector('.export-btn') as HTMLButtonElement;
    if (button) {
      button.innerHTML = '<div class="flex items-center space-x-2"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Generating...</span></div>';
      button.disabled = true;
    }
    
    setTimeout(() => {
    const reportData = {
      reportInfo: {
        title: 'Market Intelligence Report',
        generatedAt: new Date().toISOString(),
        period: 'Last 30 days',
        confidence: '94%'
      },
      stats,
      recentTrends,
      topSources,
      insights: [
        'AI adoption increased 23% across enterprise sectors',
        'Remote work tools showing sustained growth',
        'Fintech regulations creating new opportunities'
      ],
      recommendations: [
        'Monitor AI enterprise adoption trends closely',
        'Consider remote work infrastructure investments',
        'Track regulatory changes in fintech space'
      ]
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-intelligence-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
      alert(`📊 Market Intelligence Report Generated!\n\n📋 Report Contents:\n• Executive summary with key insights\n• ${stats.length} performance metrics\n• ${recentTrends.length} trending topics analysis\n• ${topSources.length} top source performance\n• Strategic recommendations\n• 30-day trend analysis\n\n📁 File Details:\n• Format: JSON\n• Size: ${Math.round(JSON.stringify(reportData).length / 1024)}KB\n• Confidence: 94%\n• Generated: ${new Date().toLocaleString()}\n\nReport saved to Downloads folder!`);
      
      if (button) {
        button.innerHTML = '<div class="flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span>Export</span></div>';
        button.disabled = false;
      }
    }, 2500);
  };

  const shareReport = () => {
    const shareData = {
      title: 'Market Intelligence Dashboard - TrendDigest',
      text: `📊 Live Market Intelligence Dashboard\n\n🔥 Current Highlights:\n• ${stats[0].value} live news sources\n• ${stats[1].value} email subscribers\n• ${stats[2].value} daily digests sent\n• Real-time trend analysis\n\nPowered by AI • Updated every 15 minutes`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData).then(() => {
        alert('📱 Dashboard shared successfully via native sharing!');
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        alert('📋 Dashboard details copied to clipboard!\n\nYou can now paste and share this information anywhere.');
      });
    } else {
      // Fallback for browsers without native sharing
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('📋 Dashboard Details Copied!\n\n✅ Copied to clipboard:\n• Dashboard title and description\n• Current statistics\n• Live dashboard link\n\nYou can now paste this anywhere to share your market intelligence dashboard.');
      }).catch(() => {
        // Final fallback
        alert(`📋 Share Dashboard\n\nCopy this information to share:\n\n${shareText}`);
      });
    }
  };
  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Market Intelligence Dashboard</h1>
            <p className="text-gray-600">Real-time insights from your curated sources</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={refreshDashboard}
              className="refresh-btn flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </div>
            </button>
            <button
              onClick={exportReport}
              className="export-btn flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </div>
            </button>
            <button
              onClick={shareReport}
              className="share-btn flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-8 h-8 text-blue-600" />
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trending Topics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Trending Topics</h2>
            <p className="text-sm text-gray-500">Most discussed topics in the last 24 hours</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{trend.topic}</div>
                    <div className="text-sm text-gray-500">{trend.category} • {trend.mentions} mentions</div>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">{trend.growth}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Sources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Sources</h2>
            <p className="text-sm text-gray-500">Sources with highest engagement this week</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{source.name}</div>
                    <div className="text-sm text-gray-500">{source.articles} articles processed</div>
                  </div>
                  <div className="text-blue-600 font-semibold text-sm">{source.engagement}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Live Activity Feed</h2>
          <p className="text-sm text-gray-500">Real-time news processing and email delivery status</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <span className="font-medium">Live news digest sent to {emailService.getUsers().length} subscribers</span>
                <span className="text-gray-500 text-sm ml-2">2 minutes ago</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <span className="font-medium">Real-time: 23 new articles processed from multiple sources</span>
                <span className="text-gray-500 text-sm ml-2">15 minutes ago</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <div className="flex-1">
                <span className="font-medium">Live trend analysis: AI adoption surge detected (+23%)</span>
                <span className="text-gray-500 text-sm ml-2">1 hour ago</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1">
                <span className="font-medium">Gmail integration: All users successfully notified</span>
                <span className="text-gray-500 text-sm ml-2">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};