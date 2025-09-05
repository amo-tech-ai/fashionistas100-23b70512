import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, DollarSign, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function EventPlans() {
  const plans = [
    {
      id: 1,
      title: "Fashion Week Milano 2025",
      status: "active",
      date: "September 15-22, 2025",
      venue: "Milano Convention Center",
      budget: "$250,000",
      progress: 75,
      tasks: {
        completed: 18,
        total: 24
      }
    },
    {
      id: 2,
      title: "Designer Showcase Paris",
      status: "planning",
      date: "October 5-7, 2025",
      venue: "Le Carrousel du Louvre",
      budget: "$180,000",
      progress: 40,
      tasks: {
        completed: 8,
        total: 20
      }
    },
    {
      id: 3,
      title: "Emerging Designers NYC",
      status: "draft",
      date: "November 10-12, 2025",
      venue: "Brooklyn Navy Yard",
      budget: "$120,000",
      progress: 15,
      tasks: {
        completed: 3,
        total: 20
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Event Plans</h1>
            <Button>Create New Plan</Button>
          </div>
          
          <div className="grid gap-6">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{plan.title}</CardTitle>
                      <CardDescription className="mt-2">
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status.toUpperCase()}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{plan.progress}%</p>
                      <p className="text-sm text-muted-foreground">Complete</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{plan.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{plan.venue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{plan.budget}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{plan.tasks.completed}/{plan.tasks.total} Tasks</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all"
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Team
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="mr-2 h-4 w-4" />
                      Timeline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Event Brief Template
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Assign Team Members
                </Button>
                <Button variant="outline" className="justify-start">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Risk Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}