import { useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useRewardsQueries';
import LandingScreen from './components/LandingScreen';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import AppLayout from './components/AppLayout';
import TasksScreen from './components/TasksScreen';
import WalletScreen from './components/WalletScreen';
import AdminScreen from './components/AdminScreen';
import { useState } from 'react';

type View = 'tasks' | 'wallet' | 'admin';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentView, setCurrentView] = useState<View>('tasks');

  const isAuthenticated = !!identity;

  // Set document title
  useEffect(() => {
    document.title = 'SOJIB YT2.0';
  }, []);

  // Show landing page when not authenticated
  if (!isAuthenticated) {
    return <LandingScreen />;
  }

  // Show profile setup dialog if user is authenticated but has no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <AppLayout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'tasks' && <TasksScreen />}
        {currentView === 'wallet' && <WalletScreen />}
        {currentView === 'admin' && <AdminScreen />}
      </AppLayout>
      {showProfileSetup && <ProfileSetupDialog />}
    </>
  );
}
