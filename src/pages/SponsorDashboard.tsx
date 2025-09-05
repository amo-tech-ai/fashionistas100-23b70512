import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Building2, TrendingUp, DollarSign, Target,
  FileText, Users, Award, BarChart3,
  Plus, Eye, Send, Phone, Mail,
  Calendar, Clock, CheckCircle
} from 'lucide-react';

export const SponsorDashboard = () => {
  const sponsors = [
    { name: 'Luxury Brand Co.', package: 'Platinum', value: '$50K', status: 'active' },
    { name: 'Fashion Tech Inc.', package: 'Gold', value: '$25K', status: 'pending' },
    { name: 'Beauty Partners', package: 'Silver', value: '$15K', status: 'active' },
  ];

  const prospects = [
    { company: 'Elite Fashion House', potential: '$75K', stage: 'Negotiation', probability: '80%' },
    { company: 'Tech Innovators', potential: '$35K', stage: 'Proposal', probability: '60%' },
    { company: 'Lifestyle Brand', potential: '$20K', stage: 'Discovery', probability: '40%' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gray-50 p-8">
        <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sponsor Dashboard</h1>
          <p className="text-gray-600">Manage sponsors, proposals, and prospecting</p>
        </div>

        {/* Sponsor Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Active Sponsors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-gray-600">$420K total value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Prospects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">28</div>
              <p className="text-xs text-gray-600">8 hot leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">7</div>
              <p className="text-xs text-gray-600">$280K potential</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">42%</div>
              <p className="text-xs text-gray-600">Lead to sponsor</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sponsors" className="bg-white rounded-lg shadow">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="outreach">Outreach</TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="sponsors" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Current Sponsors</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sponsor
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {sponsors.map((sponsor, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{sponsor.name}</h4>
                            <p className="text-sm text-gray-600">
                              {sponsor.package} Package • {sponsor.value}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={sponsor.status === 'active' ? 'default' : 'secondary'}>
                              {sponsor.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prospects" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Sponsor Pipeline</h3>
                  <Button>
                    <Target className="h-4 w-4 mr-2" />
                    Add Prospect
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {prospects.map((prospect, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="font-semibold">{prospect.company}</h4>
                            <p className="text-sm text-gray-600">
                              Potential: {prospect.potential} • Stage: {prospect.stage}
                            </p>
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Probability:</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{width: prospect.probability}}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium">{prospect.probability}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="proposals" className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Active Proposals</h3>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Proposal
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Pending Proposals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm">Elite Fashion House</span>
                            <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
                          </div>
                          <p className="text-xs text-gray-600">Platinum Package • $75K</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm">Tech Innovators</span>
                            <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                          </div>
                          <p className="text-xs text-gray-600">Gold Package • $35K</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Proposal Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sent This Month</span>
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Acceptance Rate</span>
                          <span className="font-semibold text-green-600">68%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Avg. Response Time</span>
                          <span className="font-semibold">3.2 days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Value</span>
                          <span className="font-semibold">$280K</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="packages" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Sponsorship Packages</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Platinum</span>
                        <Award className="h-5 w-5 text-purple-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">$50K+</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Prime booth location
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Speaking opportunity
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          VIP event access
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Full branding rights
                        </li>
                      </ul>
                      <Button className="w-full mt-4">Edit Package</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Gold</span>
                        <Award className="h-5 w-5 text-yellow-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">$25K</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Standard booth
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Logo placement
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Social media mentions
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Event tickets (10)
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full mt-4">Edit Package</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Silver</span>
                        <Award className="h-5 w-5 text-gray-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">$15K</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Basic booth
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Website listing
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Event tickets (5)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Program mention
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full mt-4">Edit Package</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="outreach" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Outreach Campaigns</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Active Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Fashion Week 2025</span>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <span>Emails Sent</span>
                              <span>145</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Open Rate</span>
                              <span>42%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Responses</span>
                              <span>18</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Send className="h-4 w-4 mr-2" />
                        Send Follow-up
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Template
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SponsorDashboard;