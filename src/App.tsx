import React, { useState, useEffect } from 'react';
import { User, BridgeRecord } from './types';
import { getCurrentUser } from './lib/auth/webauthn';
import { offlineQueue } from './lib/storage/offlineQueue';

// Layout & UI
import { Header } from './components/layout/Header';
import { NavigationBar, NavTabId } from './components/layout/NavigationBar';
import { ViewportContainer } from './components/layout/ViewportContainer';

// Feature Views
import { RecordList } from './components/features/data/RecordList';
import { RecordFormModal } from './components/features/data/RecordFormModal';
import { ShareCardModal } from './components/features/data/ShareCardModal';
import { PasskeyAuthModal } from './components/features/auth/PasskeyAuthModal';
import { MetricCanvas } from './components/features/metrics/MetricCanvas';
import { BridgeBuilderFSM } from './components/features/workflow/BridgeBuilderFSM';
import { PropagandaLens } from './components/features/hardware/PropagandaLens';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('feed');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bridges, setBridges] = useState<BridgeRecord[]>([]);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Modal visibility states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shareTargetBridge, setShareTargetBridge] = useState<BridgeRecord | null>(null);

  // Initialize session and storage subscribers
  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setBridges(offlineQueue.getBridges());

    const unsubscribe = offlineQueue.subscribe((pending, online) => {
      setPendingSyncCount(pending);
      setIsOnline(online);
      setBridges(offlineQueue.getBridges());
    });

    return () => unsubscribe();
  }, []);

  const handleCreateBridge = (newBridge: BridgeRecord) => {
    offlineQueue.saveBridgeOptimistic(newBridge);
    setBridges(offlineQueue.getBridges());
  };

  const handleDeleteBridge = (id: string) => {
    offlineQueue.deleteBridgeOptimistic(id);
    setBridges(offlineQueue.getBridges());
  };

  const handleShareCompleted = () => {
    if (shareTargetBridge) {
      offlineQueue.incrementShareCount(shareTargetBridge.id);
      setBridges(offlineQueue.getBridges());
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 font-sans selection:bg-cyan-500 selection:text-zinc-950 flex flex-col">
      {/* Top Header */}
      <Header
        user={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenShareApp={() => {
          if (bridges.length > 0) {
            setShareTargetBridge(bridges[0]);
          }
        }}
        pendingSyncCount={pendingSyncCount}
        isOnline={isOnline}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full flex flex-col">
        <ViewportContainer>
          {activeTab === 'feed' && (
            <RecordList
              bridges={bridges}
              onOpenCreate={() => setIsCreateModalOpen(true)}
              onOpenShare={(b) => setShareTargetBridge(b)}
              onDeleteBridge={handleDeleteBridge}
            />
          )}

          {activeTab === 'resolve' && (
            <BridgeBuilderFSM
              userId={currentUser?.user_id || 'usr_guest_citizen'}
              onAccordCreated={(b) => {
                handleCreateBridge(b);
              }}
              onOpenShareModal={(b) => setShareTargetBridge(b)}
            />
          )}

          {activeTab === 'radar' && <MetricCanvas />}

          {activeTab === 'lens' && <PropagandaLens />}
        </ViewportContainer>
      </main>

      {/* Bottom Accessible Navigation Bar */}
      <NavigationBar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Modals */}
      <PasskeyAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      <RecordFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitBridge={handleCreateBridge}
        userId={currentUser?.user_id || 'usr_guest_citizen'}
      />

      <ShareCardModal
        isOpen={Boolean(shareTargetBridge)}
        onClose={() => setShareTargetBridge(null)}
        bridge={shareTargetBridge}
        onShareCompleted={handleShareCompleted}
      />
    </div>
  );
}
