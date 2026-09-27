import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Onboarding } from './components/onboarding/Onboarding';
import { MobileNav } from './components/layout/MobileNav';
import { Home } from './components/screens/Home';
import { Add } from './components/screens/Add';
import { Settings } from './components/screens/Settings';
import { Money } from './components/screens/Money';
import { AI } from './components/screens/AI';
import { Search } from './components/screens/Search';

const App: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  if (!state.user.onboardingCompleted) {
    return <Onboarding />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'add': return <Add onComplete={() => setActiveTab('home')} />;
      case 'money': return <Money />;
      case 'ai': return <AI />;
      case 'search': return <Search />;
      case 'settings': return <Settings />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D4F3C]">
      <main className="max-w-md mx-auto">
        {renderScreen()}
      </main>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
