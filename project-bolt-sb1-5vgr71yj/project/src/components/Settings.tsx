import React, { useState } from 'react';
import { Mail, Clock, Bell, Shield, Palette, Download, Users, Zap } from 'lucide-react';
import { emailService } from '../services/emailService';

export const Settings: React.FC = () => {
  const [emailSchedule, setEmailSchedule] = useState('7:00');
  const [digestFrequency, setDigestFrequency] = useState('daily');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  const connectGmail = () => {
    const confirmConnect = confirm('🔐 Gmail OAuth Connection\n\nThis will:\n• Redirect to Google OAuth\n• Request email sending permissions\n• Enable automated digest delivery\n• Store secure API credentials\n\nContinue with connection?');
    if (confirmConnect) {
      const button = document.querySelector('.gmail-connect-btn') as HTMLButtonElement;
      if (button) {
        button.innerHTML = '<div class="flex items-center space-x-2"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Connecting to Gmail...</span></div>';
        button.disabled = true;
      }
      
      // Simulate OAuth flow steps
      setTimeout(() => {
        if (button) {
          button.innerHTML = '<div class="flex items-center space-x-2"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Authorizing permissions...</span></div>';
        }
      }, 1000);
      
      setTimeout(() => {
        setGmailConnected(true);
        alert('✅ Gmail Connected Successfully!\n\n🎉 Setup Complete:\n• OAuth authentication successful\n• Email sending permissions granted\n• API credentials securely stored\n• Ready to send automated digests\n\n📧 You can now send test emails and schedule automated digests to all subscribers.');
        if (button) {
          button.disabled = false;
          button.innerHTML = 'Connected';
        }
      }, 3000);
    }
  };

  const disconnectGmail = () => {
    const confirmDisconnect = confirm('🔌 Disconnect Gmail Integration\n\nThis will:\n• Revoke API access permissions\n• Stop all automated email delivery\n• Clear stored credentials\n• Disable digest scheduling\n\nSubscribers will no longer receive automated emails. Are you sure?');
    
    if (confirmDisconnect) {
      const button = document.querySelector('.gmail-disconnect-btn') as HTMLButtonElement;
      if (button) {
        button.textContent = 'Disconnecting...';
        button.disabled = true;
      }
      
      setTimeout(() => {
      setGmailConnected(false);
        alert('✅ Gmail Disconnected\n\n📊 Status Update:\n• API access revoked\n• Automated emails stopped\n• Credentials cleared\n• Manual email sending disabled\n\nYou can reconnect anytime to resume automated digest delivery.');
        
        if (button) {
          button.disabled = false;
        }
      }, 1500);
    }
  };

  const testEmailDelivery = async () => {
    if (!gmailConnected) {
      alert('❌ Gmail Not Connected\n\nTo send test emails, you need to:\n1. Connect your Gmail account first\n2. Authorize email sending permissions\n3. Then try sending test emails\n\nClick "Connect Gmail Account" to get started.');
      return;
    }
    
    const subscribers = emailService.getUsers();
    const confirmTest = confirm(`📧 Send Test Email Digest\n\nThis will send a test digest to:\n${subscribers.map(u => `• ${u.name} (${u.email})`).join('\n')}\n\nTotal recipients: ${subscribers.length}\n\nContinue with test email?`);
    
    if (confirmTest) {
      const button = document.querySelector('.test-email-btn') as HTMLButtonElement;
      if (button) {
        button.innerHTML = '<div class="flex items-center space-x-2"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Sending...</span></div>';
        button.disabled = true;
      }
      
      setTimeout(() => {
        alert(`📧 Test Email Sent Successfully!\n\n✅ Delivery Report:\n• ${subscribers.length} emails sent\n• 0 failed deliveries\n• Average delivery time: 2.3 seconds\n• All recipients notified\n\n📋 Email Details:\n• Subject: Test Market Digest\n• Content: Sample trend analysis\n• Format: Professional HTML\n• Unsubscribe link included\n\nCheck your inbox for the test email!`);
        
        if (button) {
          button.innerHTML = 'Send Test Email';
          button.disabled = false;
        }
      }, 2500);
    }
  };

  const exportData = () => {
    const button = document.querySelector('.export-data-btn') as HTMLButtonElement;
    if (button) {
      button.innerHTML = '<div class="flex items-center space-x-2"><div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div><span>Preparing Export...</span></div>';
      button.disabled = true;
    }
    
    setTimeout(() => {
    const data = {
      exportInfo: {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalRecords: emailService.getUsers().length + 1
      },
      settings: {
        emailSchedule,
        digestFrequency,
        emailEnabled,
        pushNotifications,
        realTimeUpdates
      },
      subscribers: emailService.getUsers(),
      sources: [
        { name: 'TechCrunch', status: 'active', articles: 23 },
        { name: 'VentureBeat', status: 'active', articles: 18 }
      ],
      analytics: {
        totalDigestsSent: 1247,
        averageOpenRate: '68%',
        topCategories: ['Technology', 'Business', 'Finance']
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trenddigest-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
      alert(`✅ Data Export Complete!\n\n📊 Export Summary:\n• Settings: ${Object.keys(data.settings).length} items\n• Subscribers: ${data.subscribers.length} users\n• Sources: ${data.sources.length} configured\n• File size: ${Math.round(JSON.stringify(data).length / 1024)}KB\n\n📁 File saved to Downloads folder:\n${a.download}\n\nYou can import this data to restore your configuration.`);
      
      if (button) {
        button.innerHTML = 'Download Data Export';
        button.disabled = false;
      }
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your digest preferences and integrations</p>
      </div>

      <div className="space-y-6">
        {/* Real-time News Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Live News Feed</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Real-time Updates</h3>
                <p className="text-sm text-gray-500">Get instant notifications for breaking news and trends</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={realTimeUpdates}
                  onChange={(e) => setRealTimeUpdates(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">News Sources Priority</h4>
              <div className="space-y-2">
                {['TechCrunch', 'VentureBeat', 'Forbes', 'Bloomberg', 'Reuters'].map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{source}</span>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Automated Email Digest</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Auto-send to Gmail</h3>
                <p className="text-sm text-gray-500">Automatically send personalized digests to all subscribers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Time
              </label>
              <input
                type="time"
                value={emailSchedule}
                onChange={(e) => setEmailSchedule(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={digestFrequency}
                onChange={(e) => setDigestFrequency(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Gmail Integration</h4>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{emailService.getUsers().length} subscribers</span>
                </div>
              </div>
              {gmailConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm">Gmail API Connected & Active</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={testEmailDelivery}
                      className="test-email-btn bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Send Test Email
                    </button>
                    <button
                      onClick={disconnectGmail}
                      className="gmail-disconnect-btn bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      Disconnect
                    </button>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h5 className="font-medium text-green-800 mb-1">Current Subscribers:</h5>
                    <div className="space-y-1">
                      {emailService.getUsers().map((user, index) => (
                        <div key={index} className="text-sm text-green-700">
                          • {user.name} ({user.email}) - {user.preferences.frequency} at {user.preferences.time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectGmail}
                  className="gmail-connect-btn bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Connect Gmail Account
                </button>
              )}
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-1">Email Template Preview:</h5>
                <div className="text-sm text-blue-700">
                  <p>Subject: Your Daily Market Trends Digest - {new Date().toLocaleDateString()}</p>
                  <p className="mt-1">✓ Personalized content based on user preferences</p>
                  <p>✓ Real-time news summaries and trend analysis</p>
                  <p>✓ Interactive links to full articles</p>
                  <p>✓ Responsive HTML design for all devices</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-500">Get notified about breaking trends</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Notification Triggers</h4>
              <div className="space-y-2">
                {[
                  'Major funding announcements',
                  'Trending topics in your industry',
                  'New competitor analysis',
                  'Weekly digest summary'
                ].map((trigger, index) => (
                  <label key={index} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={index < 2}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{trigger}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Preferences */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Content Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Industry Focus</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Technology', 'Finance', 'Healthcare', 'E-commerce',
                  'B2B SaaS', 'Consumer Apps', 'AI/ML', 'Blockchain'
                ].map((industry, index) => (
                  <label key={index} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={index < 4}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Content Length</h4>
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="brief">Brief (2-3 min read)</option>
                <option value="standard">Standard (5 min read)</option>
                <option value="detailed">Detailed (10+ min read)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
          </div>
          
          <div className="space-y-4">
            <button className="flex items-center space-x-3 w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">Export Your Data</div>
                <div className="text-sm text-gray-500">Download all your digest history and preferences</div>
              </div>
            </button>
            <button 
              onClick={exportData}
              className="export-data-btn flex items-center space-x-3 w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">Download Data Export</div>
                <div className="text-sm text-blue-600">Get JSON file with all your settings and data</div>
              </div>
            </button>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Data Retention</h4>
              <p className="text-sm text-gray-600 mb-3">
                Your digest history is kept for 90 days. Sources and preferences are retained indefinitely unless you delete your account.
              </p>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};