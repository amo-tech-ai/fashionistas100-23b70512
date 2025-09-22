import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp,
  Plus,
  FileText,
  Calendar,
  Mail,
  Phone,
  Globe,
  MapPin,
  BarChart3,
  Target,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Package,
  Sparkles,
  Briefcase,
  Send,
  MessageSquare,
  Activity,
  Filter,
  Download,
  Upload,
  ChevronRight,
  Star,
  Zap,
  Shield,
  UserCheck,
  Megaphone,
  MoreVertical
} from 'lucide-react';
import { useSponsorDashboard } from '@/hooks/useSponsorDashboard';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const SponsorDashboardNew = () => {
  const { 
    sponsors, 
    sponsorships,
    isLoading
  } = useSponsorDashboard();
  
  // Mock additional data
  const packages = [];
  const activations = [];
  const metrics = { 
    totalSponsors: sponsors.length, 
    totalRevenue: 125000,
    activeSponsors: sponsors.length,
    totalInvestment: 500000,
    averageROI: 250,
    totalReach: 50000,
    upcomingActivations: 5,
    pendingProposals: 3,
    expiringContracts: 2
  };
  const recentActivity = [];
  const error = null;
  const addSponsor = (sponsor: any) => {};
  const createProposal = (proposal: any) => {};

  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'negotiating': return 'bg-yellow-500';
      case 'lead': return 'bg-blue-500';
      case 'expired': return 'bg-gray-500';
      case 'churned': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'negotiating': return <Clock className="h-4 w-4" />;
      case 'lead': return <AlertCircle className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Quick action items
  const quickActions = [
    { icon: Plus, label: 'Add Sponsor', onClick: () => setShowAddSponsor(true) },
    { icon: FileText, label: 'Create Proposal', onClick: () => setShowCreateProposal(true) },
    { icon: Send, label: 'Send Campaign', onClick: () => {} },
    { icon: Download, label: 'Export Report', onClick: () => {} },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Sponsor Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage sponsorships, track ROI, and discover opportunities
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateProposal(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Proposal
          </Button>
        </div>

        {/* Metrics Grid - matching organizer colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Active Sponsors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeSponsors}</div>
              <p className="text-purple-100 text-xs mt-1">
                {metrics.totalSponsors} total sponsors
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalInvestment)}</div>
              <p className="text-green-100 text-xs mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{metrics.averageROI.toFixed(0)}% ROI
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                Brand Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.totalReach)}</div>
              <p className="text-orange-100 text-xs mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +23% growth
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.upcomingActivations}</div>
              <p className="text-pink-100 text-xs mt-1">Upcoming events</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sponsors List - Takes 2 columns on large screens */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Current Sponsors ({sponsors.length})</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowAddSponsor(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {sponsors.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No sponsors yet</p>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAddSponsor(true)}
                  >
                    Add Your First Sponsor
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sponsors.slice(0, 5).map((sponsor) => (
                    <div 
                      key={sponsor.id} 
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {sponsor.logo_url ? (
                            <AvatarImage src={sponsor.logo_url} alt={sponsor.company_name} />
                          ) : (
                            <AvatarFallback>
                              {sponsor.company_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                         <div>
                           <p className="font-medium">{sponsor.company_name}</p>
                           {sponsor.industry && (
                             <p className="text-sm text-muted-foreground">{sponsor.industry}</p>
                           )}
                         </div>
                      </div>
                      <Badge 
                        variant={sponsor.status === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          sponsor.status === 'active' && "bg-green-500",
                          sponsor.status === 'negotiating' && "bg-yellow-500",
                          sponsor.status === 'lead' && "bg-blue-500"
                        )}
                      >
                        {sponsor.status}
                      </Badge>
                    </div>
                  ))}
                  {sponsors.length > 5 && (
                    <Button variant="ghost" className="w-full">
                      View all sponsors
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pending Proposals</span>
                  </div>
                  <span className="text-2xl font-bold">{metrics.pendingProposals}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Expiring Soon</span>
                  </div>
                  <span className="text-2xl font-bold">{metrics.expiringContracts}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Active Campaigns</span>
                  </div>
                  <span className="text-2xl font-bold">{metrics.upcomingActivations}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                          activity.type === 'sponsor_added' && "bg-blue-100",
                          activity.type === 'contract_signed' && "bg-green-100",
                          activity.type === 'proposal_sent' && "bg-yellow-100"
                        )}>
                          {activity.type === 'sponsor_added' && <Plus className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'contract_signed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {activity.type === 'proposal_sent' && <FileText className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sponsor Packages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                Sponsorship Packages
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.slice(0, 4).map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                >
                  {pkg.visibility_level === 'premium' && (
                    <Badge className="mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600">
                      <Star className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <h4 className="font-semibold mb-1">{pkg.package_name}</h4>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {formatCurrency(pkg.price)}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>Max {pkg.max_sponsors} sponsors</span>
                    </div>
                    {pkg.benefits && pkg.benefits.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{pkg.benefits.length} benefits</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                ROI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Average ROI</span>
                  <span className="text-sm font-medium">{metrics.averageROI.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.averageROI} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Retention Rate</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Reach</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics.totalReach)}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +23% vs last month
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  <p className="text-2xl font-bold">4.8%</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +0.5% vs last month
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Brand Mentions</p>
                  <p className="text-2xl font-bold">1.2K</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +15% vs last month
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Media Value</p>
                  <p className="text-2xl font-bold">$2.3M</p>
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <ArrowDownRight className="h-3 w-3" />
                    -5% vs last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4"
                  onClick={action.onClick}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Sponsor Dialog */}
        <Dialog open={showAddSponsor} onOpenChange={setShowAddSponsor}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Sponsor</DialogTitle>
              <DialogDescription>
                Add a new sponsor to your database
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input placeholder="Enter company name" />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury_fashion">Luxury Fashion</SelectItem>
                      <SelectItem value="sportswear">Sportswear</SelectItem>
                      <SelectItem value="fast_fashion">Fast Fashion</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Name</Label>
                  <Input placeholder="Contact person name" />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input type="email" placeholder="email@company.com" />
                </div>
              </div>
              <div>
                <Label>Website</Label>
                <Input placeholder="https://www.company.com" />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea placeholder="Additional notes about this sponsor..." />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAddSponsor(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  addSponsor({
                    company_name: 'New Sponsor',
                    status: 'lead'
                  });
                  setShowAddSponsor(false);
                }}>
                  Add Sponsor
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Proposal Dialog */}
        <Dialog open={showCreateProposal} onOpenChange={setShowCreateProposal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Sponsorship Proposal</DialogTitle>
              <DialogDescription>
                Generate a professional sponsorship proposal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Select Sponsor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a sponsor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sponsors.map(sponsor => (
                      <SelectItem key={sponsor.id} value={sponsor.id}>
                        {sponsor.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Package</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map(pkg => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.package_name} - {formatCurrency(pkg.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Event</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion-week">Fashion Week 2025</SelectItem>
                    <SelectItem value="summer-show">Summer Collection Show</SelectItem>
                    <SelectItem value="gala">Annual Gala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Custom Message</Label>
                <Textarea placeholder="Add a personalized message..." rows={4} />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateProposal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  createProposal({});
                  setShowCreateProposal(false);
                }}>
                  Generate Proposal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SponsorDashboardNew;
