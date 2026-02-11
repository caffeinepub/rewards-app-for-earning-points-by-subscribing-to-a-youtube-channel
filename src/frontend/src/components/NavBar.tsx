import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../hooks/useRewardsQueries';
import LoginButton from './LoginButton';
import { UserRole } from '../backend';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

type View = 'tasks' | 'wallet' | 'admin';

interface NavBarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function NavBar({ currentView, onViewChange }: NavBarProps) {
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;

  const handleViewChange = (view: View) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src="/assets/generated/logo-youtube-rewards.dim_512x512.png"
            alt="SOJIB YT2.0 Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex-shrink-0"
          />
          <span className="text-base sm:text-xl font-semibold text-foreground truncate">SOJIB YT2.0</span>
        </div>

        {isAuthenticated && (
          <>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:bg-accent rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onViewChange('tasks')}
                className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                  currentView === 'tasks'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => onViewChange('wallet')}
                className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                  currentView === 'wallet'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                Wallet
              </button>
              {isAdmin && (
                <button
                  onClick={() => onViewChange('admin')}
                  className={`px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    currentView === 'admin'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  Admin
                </button>
              )}
            </nav>
          </>
        )}

        <div className="hidden md:block">
          <LoginButton />
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container mx-auto px-3 py-3 flex flex-col gap-2">
            <button
              onClick={() => handleViewChange('tasks')}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-colors text-left min-h-[44px] ${
                currentView === 'tasks'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => handleViewChange('wallet')}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-colors text-left min-h-[44px] ${
                currentView === 'wallet'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Wallet
            </button>
            {isAdmin && (
              <button
                onClick={() => handleViewChange('admin')}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors text-left min-h-[44px] ${
                  currentView === 'admin'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                Admin
              </button>
            )}
            <div className="pt-2 border-t border-border mt-2">
              <LoginButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
