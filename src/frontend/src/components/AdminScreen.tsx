import AdminGuard from './AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { useCreateTask, useGetAllPendingSubmissions, useVerifyTaskSubmission, useGetAllWithdrawalRequests, useReviewWithdrawalRequest } from '../hooks/useAdminQueries';
import { Loader2, Plus, CheckCircle2, XCircle } from 'lucide-react';

function AdminContent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [url, setUrl] = useState('');

  const createTask = useCreateTask();
  const { data: pendingSubmissions, isLoading: submissionsLoading } = useGetAllPendingSubmissions();
  const verifySubmission = useVerifyTaskSubmission();
  const { data: withdrawalRequests, isLoading: withdrawalsLoading } = useGetAllWithdrawalRequests();
  const reviewWithdrawal = useReviewWithdrawalRequest();

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && points && url) {
      createTask.mutate(
        {
          title,
          description,
          points: BigInt(points),
          url,
        },
        {
          onSuccess: () => {
            setTitle('');
            setDescription('');
            setPoints('');
            setUrl('');
          },
        }
      );
    }
  };

  const handleVerify = (submitter: string, taskId: bigint, approved: boolean) => {
    verifySubmission.mutate({ submitter, taskId, approved });
  };

  const handleReviewWithdrawal = (user: string, requestId: bigint, approved: boolean) => {
    reviewWithdrawal.mutate({ user, requestId, approved });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage tasks, review submissions, and handle withdrawal requests.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Create New Task</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Add a new task for users to complete and earn points.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm">Task Title</Label>
              <Input
                id="title"
                placeholder="e.g., Subscribe to TechChannel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="min-h-[44px] text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what users need to do..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-base"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points" className="text-sm">Points Reward</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  placeholder="100"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="min-h-[44px] text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm">YouTube Channel URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://youtube.com/@channel"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="min-h-[44px] text-base"
                />
              </div>
            </div>
            <Button type="submit" disabled={createTask.isPending} className="w-full gap-2 min-h-[48px]">
              {createTask.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Task
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Pending Task Submissions</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Review and approve or reject user task submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : pendingSubmissions && pendingSubmissions.length > 0 ? (
            <ScrollArea className="w-full">
              <div className="min-w-[600px] space-y-3">
                {pendingSubmissions.map((sub, idx) => (
                  <div key={`${sub.user}-${sub.taskId}-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-border rounded-lg">
                    <div className="space-y-1 min-w-0">
                      <div className="font-mono text-xs break-all">{sub.user.slice(0, 20)}...</div>
                      <div className="text-sm">Task #{sub.taskId.toString()}</div>
                      <Badge variant="secondary" className="text-xs">{sub.status}</Badge>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleVerify(sub.user, sub.taskId, true)}
                        disabled={verifySubmission.isPending}
                        className="gap-1 min-h-[40px]"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleVerify(sub.user, sub.taskId, false)}
                        disabled={verifySubmission.isPending}
                        className="gap-1 min-h-[40px]"
                      >
                        <XCircle className="h-3 w-3" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">No pending submissions.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Withdrawal Requests</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Review and process user withdrawal requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawalsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : withdrawalRequests && withdrawalRequests.length > 0 ? (
            <ScrollArea className="w-full">
              <div className="min-w-[600px] space-y-3">
                {withdrawalRequests.map((req) => (
                  <div key={`${req.user}-${req.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-border rounded-lg">
                    <div className="space-y-1 min-w-0">
                      <div className="font-mono text-xs break-all">{req.user.slice(0, 20)}...</div>
                      <div className="text-sm">Request #{req.id.toString()} • {req.amount.toString()} pts</div>
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
                    {req.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleReviewWithdrawal(req.user, req.id, true)}
                          disabled={reviewWithdrawal.isPending}
                          className="gap-1 min-h-[40px]"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReviewWithdrawal(req.user, req.id, false)}
                          disabled={reviewWithdrawal.isPending}
                          className="gap-1 min-h-[40px]"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">No withdrawal requests.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminScreen() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}
