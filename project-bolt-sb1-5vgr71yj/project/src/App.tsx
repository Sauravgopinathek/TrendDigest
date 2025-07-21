import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { Sources } from './components/Sources';
import { Settings } from './components/Settings';
import { TrendProvider } from './context/TrendContext';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'dashboard':
        return <Dashboard />;
      case 'sources':
        return <Sources />;
      case 'settings':
        return <Settings />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <TrendProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </TrendProvider>
  );
}

export default App;