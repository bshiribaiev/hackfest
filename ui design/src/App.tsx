import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { WalletHeader } from './components/WalletHeader';
import { BalanceCard } from './components/BalanceCard';
import { QuickActions } from './components/QuickActions';
import { MTACard } from './components/MTACard';
import { CampusLocations } from './components/CampusLocations';
import { TransactionList } from './components/TransactionList';
import { BottomNav } from './components/BottomNav';
import { AIAssistant } from './components/AIAssistant';
import { Leaderboard } from './components/Leaderboard';
import { Events } from './components/Events';
import { SendMoneyModal } from './components/SendMoneyModal';
import { TopUpModal } from './components/TopUpModal';
import { WeeklyBudget } from './components/WeeklyBudget';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        {/* Mobile container */}
        <div className="mx-auto max-w-md bg-white dark:bg-slate-900 min-h-screen shadow-xl transition-colors">
          <WalletHeader />
          
          <div className="px-4 pb-24 space-y-6">
            {activeTab === 'home' && (
              <>
                <BalanceCard />
                <QuickActions 
                  onSend={() => setShowSendModal(true)}
                  onTopUp={() => setShowTopUpModal(true)}
                />
                <WeeklyBudget />
                <CampusLocations />
                <MTACard />
                <TransactionList />
              </>
            )}
            
            {activeTab === 'events' && <Events />}
            {activeTab === 'ai' && <AIAssistant />}
            {activeTab === 'leaderboard' && <Leaderboard />}
          </div>

          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <SendMoneyModal open={showSendModal} onClose={() => setShowSendModal(false)} />
        <TopUpModal open={showTopUpModal} onClose={() => setShowTopUpModal(false)} />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}