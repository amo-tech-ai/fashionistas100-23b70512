/**
 * Admin dashboard to view wizard analytics
 * 
 * Displays completion rates, drop-off points, and performance metrics
 */

import { useState, useEffect } from 'react';
import { wizardMonitoring, WizardMetrics } from '@/lib/event-wizard/monitoring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function WizardAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<WizardMetrics | null>(null);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(wizardMonitoring.getMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return <div>Loading metrics...</div>;
  }

  const exportData = () => {
    const events = wizardMonitoring.exportEvents();
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wizard-events-${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Event Wizard Analytics</h2>
          <p className="text-muted-foreground">Monitor wizard performance and user behavior</p>
        </div>
        <Button onClick={exportData} variant="outline">
          Export Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_sessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completion_rate.toFixed(1)}%</div>
            <Progress value={metrics.completion_rate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.average_completion_time_minutes} min</div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: &lt;10 minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.ai_interactions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.errors} errors
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Summary</CardTitle>
            <CardDescription>Overview of wizard sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <Badge variant="default">{metrics.completed_sessions}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Abandoned</span>
              <Badge variant="destructive">{metrics.abandoned_sessions}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">In Progress</span>
              <Badge variant="secondary">
                {metrics.total_sessions - metrics.completed_sessions - metrics.abandoned_sessions}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stage Drop-off Analysis</CardTitle>
            <CardDescription>Where users abandon the wizard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(metrics.stage_drop_off).length === 0 ? (
              <p className="text-sm text-muted-foreground">No drop-offs recorded yet</p>
            ) : (
              Object.entries(metrics.stage_drop_off)
                .sort((a, b) => b[1] - a[1])
                .map(([stage, count]) => (
                  <div key={stage} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{stage.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(count / metrics.abandoned_sessions) * 100} 
                        className="w-24"
                      />
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>

      {metrics.errors > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Alert</CardTitle>
            <CardDescription>
              {metrics.errors} error(s) detected. Check console or export data for details.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
