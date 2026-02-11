import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useGetPointsBalance, useGetWithdrawalRequests, useCreateWithdrawalRequest } from '../hooks/useRewardsQueries';
import { Loader2, AlertCircle } from 'lucide-react';
import PointsBalanceCard from './PointsBalanceCard';

export default function WalletScreen() {
  const [amount, setAmount] = useState('');
  const { data: balance } = useGetPointsBalance();
  const { data: requests, isLoading: requestsLoading } = useGetWithdrawalRequests();
  const createRequest = useCreateWithdrawalRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount);
    if (amountNum > 0) {
      createRequest.mutate(BigInt(amountNum), {
        onSuccess: () => setAmount(''),
      });
    }
  };

  const currentBalance = balance ? Number(balance) : 0;
  const requestAmount = parseInt(amount) || 0;
  const isInsufficientBalance = requestAmount > currentBalance;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Wallet</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your points and withdrawal requests.</p>
      </div>

      <PointsBalanceCard />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Request Withdrawal</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Submit a request to withdraw your points. This is an in-app request feature only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <strong>Important Notice:</strong> Withdrawal requests are for demonstration purposes only and do not guarantee real money payments. No payment processing is implemented.
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm">Amount (Points)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="min-h-[44px] text-base"
              />
              {isInsufficientBalance && amount && (
                <p className="text-xs sm:text-sm text-destructive">Insufficient balance. You have {currentBalance} points available.</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={!amount || isInsufficientBalance || createRequest.isPending}
              className="w-full min-h-[48px]"
            >
              {createRequest.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Withdrawal History</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Track the status of your withdrawal requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : requests && requests.length > 0 ? (
            <ScrollArea className="w-full">
              <div className="min-w-[500px]">
                <div className="grid grid-cols-4 gap-4 pb-3 border-b border-border font-medium text-xs sm:text-sm">
                  <div>Request ID</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Date</div>
                </div>
                <div className="space-y-3 pt-3">
                  {requests.map((req) => (
                    <div key={req.id.toString()} className="grid grid-cols-4 gap-4 items-center text-xs sm:text-sm">
                      <div className="font-mono">#{req.id.toString()}</div>
                      <div>{req.amount.toString()} pts</div>
                      <div>
                        <Badge
                          variant={
                            req.status === 'approved'
                              ? 'default'
                              : req.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {req.status}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">-</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">No withdrawal requests yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
