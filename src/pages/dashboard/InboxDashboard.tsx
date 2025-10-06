import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inbox } from 'lucide-react';

const InboxDashboard = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Dashboard / Inbox</p>
            <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
          </div>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Inbox coming soon</p>
              <p className="text-sm mt-2">This feature is under development</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InboxDashboard;
