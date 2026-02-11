import { Button } from './ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Coins, Youtube, CheckCircle2 } from 'lucide-react';

export default function LandingScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src="/assets/generated/logo-youtube-rewards.dim_512x512.png"
              alt="SOJIB YT2.0 Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex-shrink-0"
            />
            <span className="text-base sm:text-xl font-semibold text-foreground truncate">SOJIB YT2.0</span>
          </div>
          <Button onClick={login} disabled={isLoggingIn} className="min-h-[44px]">
            {isLoggingIn ? 'Logging in...' : 'Get Started'}
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 sm:py-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Earn Points by Engaging with YouTube Content
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Complete simple tasks like subscribing to channels and earn in-app points. Track your progress and request withdrawals.
            </p>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <strong>Important:</strong> Points are in-app rewards only. Withdrawal requests do not guarantee real money payments. This is a demonstration platform.
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">All tasks allowed</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Subscribe to channels and complete engagement tasks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Earn Points</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Build your points balance with each approved task</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Track Progress</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Monitor your submissions and withdrawal requests</p>
                </div>
              </div>
            </div>
            <Button onClick={login} disabled={isLoggingIn} size="lg" className="w-full sm:w-auto min-h-[48px]">
              {isLoggingIn ? 'Logging in...' : 'All tasks allowed'}
            </Button>
          </div>
          <div className="relative order-first lg:order-last">
            <img
              src="/assets/generated/hero-rewards.dim_1600x900.png"
              alt="Earn rewards illustration"
              className="w-full rounded-xl sm:rounded-2xl shadow-2xl"
            />
          </div>
        </div>
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
