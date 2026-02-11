import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useGetPointsBalance } from '../hooks/useRewardsQueries';
import { Coins, Loader2 } from 'lucide-react';

export default function PointsBalanceCard() {
  const { data: balance, isLoading, error } = useGetPointsBalance();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
        <Coins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">Failed to load balance</p>
        ) : (
          <div className="text-2xl font-bold text-primary">{balance?.toString() || '0'}</div>
        )}
      </CardContent>
    </Card>
  );
}

