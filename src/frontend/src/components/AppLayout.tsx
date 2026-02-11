import { ReactNode } from 'react';
import NavBar from './NavBar';

type View = 'tasks' | 'wallet' | 'admin';

interface AppLayoutProps {
  children: ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function AppLayout({ children, currentView, onViewChange }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar currentView={currentView} onViewChange={onViewChange} />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {children}
      </main>
      <footer className="border-t border-border py-4 sm:py-6 mt-8 sm:mt-12">
        <div className="container mx-auto px-3 sm:px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
