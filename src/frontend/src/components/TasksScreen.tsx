import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useGetAllTasks, useGetTaskSubmissions, useSubmitTask } from '../hooks/useRewardsQueries';
import PointsBalanceCard from './PointsBalanceCard';
import { ExternalLink, Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { TaskStatus } from '../backend';

export default function TasksScreen() {
  const { data: tasks, isLoading: tasksLoading } = useGetAllTasks();
  const { data: submissions } = useGetTaskSubmissions();
  const submitTask = useSubmitTask();

  const getTaskSubmissionStatus = (taskId: bigint) => {
    return submissions?.find((sub) => sub.taskId === taskId);
  };

  const handleSubmit = (taskId: bigint) => {
    submitTask.mutate(taskId);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Available Tasks</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Complete tasks to earn points. Each submission will be reviewed by an admin.</p>
      </div>

      <PointsBalanceCard />

      {tasksLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {tasks.map((task) => {
            const submission = getTaskSubmissionStatus(task.id);
            const isSubmitted = !!submission;
            const isPending = submission?.status === TaskStatus.pending;
            const isApproved = submission?.status === TaskStatus.approved;
            const isRejected = submission?.status === TaskStatus.rejected;

            return (
              <Card key={task.id.toString()}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg break-words">{task.title}</CardTitle>
                      <CardDescription className="mt-1 text-xs sm:text-sm break-words">{task.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0 text-xs">
                      {task.points.toString()} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <Button
                    variant="outline"
                    className="w-full gap-2 min-h-[44px] text-sm"
                    asChild
                  >
                    <a href={task.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Open YouTube Channel</span>
                    </a>
                  </Button>
                  {isSubmitted ? (
                    <div className="flex items-center gap-2 p-3 rounded-md bg-muted min-h-[44px]">
                      {isPending && (
                        <>
                          <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium">Pending Review</span>
                        </>
                      )}
                      {isApproved && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-primary">Approved</span>
                        </>
                      )}
                      {isRejected && (
                        <>
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-destructive">Rejected</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSubmit(task.id)}
                      disabled={submitTask.isPending}
                      className="w-full min-h-[44px] text-sm"
                    >
                      {submitTask.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Completion'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">No tasks available at the moment. Check back later!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
