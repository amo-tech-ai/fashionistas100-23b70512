import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Building2, Target, FileText, Package, Send, TrendingUp,
  DollarSign, Users, Calendar, ChevronRight, Plus, Eye,
  Mail, Phone, Star, ArrowUp, ArrowDown, MoreVertical,
  Briefcase, Award, BarChart3, PieChart, CheckCircle,
  Clock, AlertCircle, Megaphone, Handshake, Sparkles,
  Filter, Search, Download, Upload, ExternalLink, Settings,
  X, Check, Edit, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SponsorDashboardNew = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  // Mock data
  const metrics = {
    activeSponsors: 12,
    totalValue: 420000,
    prospects: 28,
    hotLeads: 8,
    proposals: 7,
    pendingValue: 280000,
    conversion: 42
  };

  // Mock sponsors data
  const sponsors = [
    {
      id: 1,
      name: 'Luxury Brand Co.',
      package: 'Platinum Package',
      value: 50000,
      status: 'active',
      events: 5,
      roi: 285,
      logo: '/api/placeholder/60/60'
    },
    {
      id: 2,
      name: 'Fashion Tech Inc.',
      package: 'Gold Package',
      value: 25000,
      status: 'pending',
      events: 3,
      roi: 0,
      logo: '/api/placeholder/60/60'
    },
    {
      id: 3,
      name: 'Beauty Partners',
      package: 'Silver Package',
      value: 15000,
      status: 'active',
      events: 2,
      roi: 156,
      logo: '/api/placeholder/60/60'
    }
  ];

  // Mock prospects data
  const prospects = [
    {
      id: 1,
      company: 'Tech Fashion Co.',
      contact: 'John Smith',
      potential: 75000,
      stage: 'Negotiation',
      probability: 85,
      nextAction: 'Send final proposal'
    },
    {
      id: 2,
      company: 'Eco Style Brand',
      contact: 'Emma Davis',
      potential: 35000,
      stage: 'Qualification',
      probability: 60,
      nextAction: 'Schedule meeting'
    },
    {
      id: 3,
      company: 'Urban Wear Ltd.',
      contact: 'Mike Johnson',
      potential: 45000,
      stage: 'Proposal',
      probability: 70,
      nextAction: 'Follow up call'
    }
  ];

  // Mock proposals data
  const proposals = [
    {
      id: 1,
      company: 'Global Fashion House',
      package: 'Custom Package',
      value: 95000,
      status: 'under_review',
      submitted: '2 days ago',
      deadline: '5 days'
    },
    {
      id: 2,
      company: 'Digital Style Co.',
      package: 'Platinum Package',
      value: 50000,
      status: 'negotiating',
      submitted: '1 week ago',
      deadline: '3 days'
    }
  ];

  // Mock packages data
  const packages = [
    {
      id: 1,
      name: 'Platinum',
      price: 50000,
      features: ['Logo on all materials', 'VIP booth', 'Speaking opportunity', '50 VIP tickets'],
      popularity: 90,
      available: 2
    },
    {
      id: 2,
      name: 'Gold',
      price: 25000,
      features: ['Logo placement', 'Standard booth', '20 VIP tickets', 'Social media'],
      popularity: 75,
      available: 5
    },
    {
      id: 3,
      name: 'Silver',
      price: 15000,
      features: ['Logo on website', '10 tickets', 'Newsletter mention'],
      popularity: 60,
      available: 8
    }
  ];

  const getStageColor = (stage: string) => {
    switch(stage.toLowerCase()) {
      case 'negotiation': return 'text-purple-600 bg-purple-50';
      case 'qualification': return 'text-blue-600 bg-blue-50';
      case 'proposal': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'under_review': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'negotiating': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          
          {/* Header Section */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Sponsor Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage sponsors, proposals, and prospecting</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => setShowAddSponsor(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Sponsor
              </Button>
              <Button size="icon" variant="outline" className="bg-white shadow-md hover:shadow-lg">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Key Metrics Row - Using Organizer color scheme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {/* Active Sponsors */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  Active Sponsors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">{metrics.activeSponsors}</div>
                <p className="text-sm text-white/80">
                  ${(metrics.totalValue/1000).toFixed(0)}K total value
                </p>
              </CardContent>
            </Card>

            {/* Prospects */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  Prospects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">{metrics.prospects}</div>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {metrics.hotLeads} hot leads
                </p>
              </CardContent>
            </Card>

            {/* Proposals */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Proposals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">{metrics.proposals}</div>
                <p className="text-sm text-white/80">
                  ${(metrics.pendingValue/1000).toFixed(0)}K potential
                </p>
              </CardContent>
            </Card>

            {/* Conversion */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-amber-600">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-1">{metrics.conversion}%</div>
                <p className="text-sm text-white/80">
                  Lead to sponsor
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation - Minimal style */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['Sponsors', 'Prospects', 'Proposals', 'Packages', 'Outreach'].map((tab) => (
              <Button
                key={tab}
                variant={activeFilter === tab.toLowerCase() ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  "whitespace-nowrap",
                  activeFilter === tab.toLowerCase() 
                    ? "bg-gray-900 text-white" 
                    : "bg-white hover:bg-gray-50"
                )}
                onClick={() => setActiveFilter(tab.toLowerCase())}
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column - Current Sponsors & Prospects */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Current Sponsors Section */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-blue-900">
                      <Building2 className="h-5 w-5" />
                      <span className="font-semibold">Current Sponsors</span>
                    </span>
                    <Button size="sm" variant="ghost">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {sponsors.map((sponsor) => (
                      <div 
                        key={sponsor.id}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name}
                          className="w-14 h-14 rounded-lg object-cover border border-gray-100"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{sponsor.name}</h4>
                            <Badge className={cn("text-xs", getStatusBadge(sponsor.status))}>
                              {sponsor.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{sponsor.package} • ${(sponsor.value/1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{sponsor.events} events</div>
                          {sponsor.roi > 0 && (
                            <div className="text-sm font-semibold text-green-600 flex items-center gap-1 justify-end mt-1">
                              <TrendingUp className="h-3 w-3" />
                              {sponsor.roi}% ROI
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => alert(`Viewing sponsor: ${sponsor.name}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed border-2 hover:border-blue-400 hover:bg-blue-50" size="sm" onClick={() => alert('Loading all sponsors...')}>
                      View All Sponsors
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Prospects Pipeline */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200/30">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-green-900">
                      <Target className="h-5 w-5" />
                      <span className="font-semibold">Prospects Pipeline</span>
                    </span>
                    <Badge className="bg-green-100 text-green-700">
                      {metrics.hotLeads} hot
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {prospects.map((prospect) => (
                        <div 
                          key={prospect.id}
                          className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-green-50 hover:to-green-100/30 transition-all duration-200 cursor-pointer border border-gray-200/50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{prospect.company}</h4>
                              <p className="text-sm text-gray-600">{prospect.contact}</p>
                            </div>
                            <Badge className={cn("text-xs", getStageColor(prospect.stage))}>
                              {prospect.stage}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-green-600">
                              ${(prospect.potential/1000).toFixed(0)}K potential
                            </span>
                            <div className="flex items-center gap-2">
                              <Progress value={prospect.probability} className="h-2 w-20" />
                              <span className="text-xs text-gray-600">{prospect.probability}%</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Next: {prospect.nextAction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Proposals & Packages */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Active Proposals */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200/30">
                  <CardTitle className="flex items-center gap-3 text-purple-900">
                    <FileText className="h-5 w-5" />
                    <span className="font-semibold">Active Proposals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {proposals.map((proposal) => (
                      <div 
                        key={proposal.id}
                        className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm text-gray-900">{proposal.company}</h4>
                          <Badge className={cn("text-xs", getStatusBadge(proposal.status))}>
                            {proposal.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{proposal.package}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-purple-600">
                            ${(proposal.value/1000).toFixed(0)}K
                          </span>
                          <span className="text-xs text-gray-500">
                            {proposal.deadline} left
                          </span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" size="sm" onClick={() => setShowCreateProposal(true)}>
                      Create Proposal
                      <Plus className="h-3 w-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sponsorship Packages */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/30">
                  <CardTitle className="flex items-center gap-3 text-orange-900">
                    <Package className="h-5 w-5" />
                    <span className="font-semibold">Sponsorship Packages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {packages.map((pkg) => (
                      <div 
                        key={pkg.id}
                        onClick={() => alert(`Selected ${pkg.name} Package - $${(pkg.price/1000).toFixed(0)}K`)}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md",
                          pkg.name === 'Platinum' 
                            ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 hover:border-purple-400" 
                            : "bg-white border-gray-200 hover:border-orange-300"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-sm">{pkg.name} Package</h4>
                            <p className="text-lg font-bold text-orange-600">
                              ${(pkg.price/1000).toFixed(0)}K
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {pkg.available} left
                          </Badge>
                        </div>
                        <Progress value={pkg.popularity} className="h-1.5 mb-2" />
                        <p className="text-xs text-gray-600">
                          {pkg.features.length} premium benefits
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Outreach Actions */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <Send className="h-5 w-5" />
                    <span className="font-semibold">Quick Outreach</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Button className="w-full justify-start" variant="outline" size="sm" onClick={() => alert('Launching email campaign...')}>
                    <Mail className="h-4 w-4 mr-3" />
                    Send Campaign
                  </Button>
                  <Button className="w-full justify-start" variant="outline" size="sm" onClick={() => alert('Opening call scheduler...')}>
                    <Phone className="h-4 w-4 mr-3" />
                    Schedule Calls
                  </Button>
                  <Button className="w-full justify-start" variant="outline" size="sm" onClick={() => alert('Starting outreach campaign...')}>
                    <Megaphone className="h-4 w-4 mr-3" />
                    Launch Outreach
                  </Button>
                  <Button className="w-full justify-start" variant="outline" size="sm" onClick={() => alert('Exporting contacts to CSV...')}>
                    <Download className="h-4 w-4 mr-3" />
                    Export Contacts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Add Sponsor Modal */}
          <Dialog open={showAddSponsor} onOpenChange={setShowAddSponsor}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Sponsor</DialogTitle>
                <DialogDescription>
                  Add a new sponsor to your event. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="company"
                    placeholder="Enter company name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    Contact
                  </Label>
                  <Input
                    id="contact"
                    placeholder="Contact person name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="sponsor@company.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="package" className="text-right">
                    Package
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum - $50K</SelectItem>
                      <SelectItem value="gold">Gold - $25K</SelectItem>
                      <SelectItem value="silver">Silver - $15K</SelectItem>
                      <SelectItem value="custom">Custom Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddSponsor(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => {
                    alert('Sponsor added successfully!');
                    setShowAddSponsor(false);
                  }}
                >
                  Add Sponsor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create Proposal Modal */}
          <Dialog open={showCreateProposal} onOpenChange={setShowCreateProposal}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create Sponsorship Proposal</DialogTitle>
                <DialogDescription>
                  Create a customized sponsorship proposal for your prospect.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prospect" className="text-right">
                    Prospect
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a prospect" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech-fashion">Tech Fashion Co.</SelectItem>
                      <SelectItem value="eco-style">Eco Style Brand</SelectItem>
                      <SelectItem value="urban-wear">Urban Wear Ltd.</SelectItem>
                      <SelectItem value="new">+ New Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event" className="text-right">
                    Event
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion-week">Fashion Week 2025</SelectItem>
                      <SelectItem value="designer-showcase">Designer Showcase</SelectItem>
                      <SelectItem value="summer-launch">Summer Launch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="package-type" className="text-right">
                    Package
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum - $50K</SelectItem>
                      <SelectItem value="gold">Gold - $25K</SelectItem>
                      <SelectItem value="silver">Silver - $15K</SelectItem>
                      <SelectItem value="custom">Custom Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value ($)
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="50000"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="benefits" className="text-right">
                    Benefits
                  </Label>
                  <Textarea
                    id="benefits"
                    placeholder="List key benefits and deliverables..."
                    className="col-span-3"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deadline" className="text-right">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateProposal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => alert('Saving as draft...')}
                >
                  Save Draft
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => {
                    alert('Proposal sent successfully!');
                    setShowCreateProposal(false);
                  }}
                >
                  Send Proposal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SponsorDashboardNew;