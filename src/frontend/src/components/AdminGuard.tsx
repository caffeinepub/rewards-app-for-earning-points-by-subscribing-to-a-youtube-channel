import { ReactNode } from 'react';
import { useGetCallerUserRole } from '../hooks/useRewardsQueries';
import { UserRole } from '../backend';
import AccessDeniedScreen from './AccessDeniedScreen';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { data: userRole, isLoading } = useGetCallerUserRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userRole !== UserRole.admin) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}

