import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Eye, Edit, Settings, Search, Filter,
  Plus, Download, FileText, Clock, MapPin,
  Users, ChevronRight, TrendingUp, AlertCircle
} from 'lucide-react';

export const EventPlans = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const eventPlans = [
    {
      id: 1,
      name: 'Fashion Week 2025',
      type: 'Annual Event',
      status: 'active',
      startDate: '2025-10-15',
      endDate: '2025-10-22',
      budget: '$250,000',
      team: 45,
      progress: 75,
      tasks: { completed: 24, total: 35 },
      milestones: 8,
      risks: 3
    },
    {
      id: 2,
      name: 'Spring Collection Launch',
      type: 'Product Launch',
      status: 'planning',
      startDate: '2025-03-01',
      endDate: '2025-03-15',
      budget: '$85,000',
      team: 22,
      progress: 30,
      tasks: { completed: 8, total: 28 },
      milestones: 5,
      risks: 1
    },
    {
      id: 3,
      name: 'Designer Showcase Series',
      type: 'Recurring Event',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      budget: '$500,000',
      team: 35,
      progress: 60,
      tasks: { completed: 120, total: 200 },
      milestones: 12,
      risks: 5
    },
    {
      id: 4,
      name: 'Sustainable Fashion Summit',
      type: 'Conference',
      status: 'completed',
      startDate: '2024-11-10',
      endDate: '2024-11-12',
      budget: '$120,000',
      team: 30,
      progress: 100,
      tasks: { completed: 42, total: 42 },
      milestones: 6,
      risks: 0
    }
  ];

  const templates = [
    { name: 'Fashion Show Template', uses: 234, rating: 4.8 },
    { name: 'Product Launch Template', uses: 156, rating: 4.6 },
    { name: 'Pop-up Event Template', uses: 89, rating: 4.7 },
    { name: 'Conference Template', uses: 67, rating: 4.5 }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPlans = eventPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Event Plans</h1>
              <p className="text-gray-600 mt-2">Manage your event planning templates and active plans</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Plans
              </Button>
              <Button onClick={() => navigate('/admin/create-event-plan')}>
                <Plus className="h-4 w-4 mr-2" />
                New Event Plan
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-600">Currently executing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$955K</div>
                <p className="text-xs text-gray-600">Across all plans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">132</div>
                <p className="text-xs text-gray-600">Assigned to plans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">66%</div>
                <p className="text-xs text-gray-600">Average progress</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="plans" className="bg-white rounded-lg shadow">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="plans">Event Plans</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="plans" className="mt-0">
                {/* Search and Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search event plans..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select 
                    className="px-4 py-2 border rounded-lg"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="planning">Planning</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>

                {/* Event Plans List */}
                <div className="space-y-4">
                  {filteredPlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{plan.name}</h3>
                              <Badge className={getStatusColor(plan.status)}>
                                {plan.status}
                              </Badge>
                              <Badge variant="outline">{plan.type}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{plan.startDate} - {plan.endDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span>{plan.team} team members</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-gray-400" />
                                <span>Budget: {plan.budget}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                                <span>{plan.risks} risks identified</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{plan.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                                  style={{ width: `${plan.progress}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-600 mt-1">
                                <span>{plan.tasks.completed}/{plan.tasks.total} tasks</span>
                                <span>{plan.milestones} milestones</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/admin/event-plan/${plan.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/admin/event-plan/${plan.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => navigate(`/admin/event-plan/${plan.id}/manage`)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="templates" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {templates.map((template, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-all cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Used {template.uses} times
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium">{template.rating}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => navigate('/admin/create-event-plan?template=' + idx)}
                          >
                            Use Template
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                  <p className="text-gray-600 mb-4">Visualize all your event plans in a timeline</p>
                  <Button>Open Calendar</Button>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Planning Guides</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                          <span className="text-sm">Event Planning Checklist</span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm">Budget Template</span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm">Vendor Agreement</span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Team Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                          <span className="text-sm">Role Assignments</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm">Communication Plan</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm">Training Materials</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                          <span className="text-sm">Fashion Event Guide</span>
                          <FileText className="h-4 w-4 text-gray-400" />
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm">Risk Management</span>
                          <FileText className="h-4 w-4 text-gray-400" />
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm">Success Metrics</span>
                          <FileText className="h-4 w-4 text-gray-400" />
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EventPlans;