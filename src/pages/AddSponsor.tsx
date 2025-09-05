import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Building2, Mail, Phone, Globe, Linkedin, Target, 
  DollarSign, Calendar, FileText, Save, ArrowLeft,
  Award, CheckCircle, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddSponsor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: {
      name: '',
      industry: '',
      website: '',
      linkedin: '',
      size: '',
      revenue: ''
    },
    contact: {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      preferredContact: ''
    },
    sponsorship: {
      package: '',
      events: [],
      budget: '',
      startDate: '',
      duration: '',
      objectives: []
    },
    notes: ''
  });

  const sponsorPackages = [
    { id: 'platinum', name: 'Platinum', price: '$50,000+', color: 'purple' },
    { id: 'gold', name: 'Gold', price: '$25,000', color: 'yellow' },
    { id: 'silver', name: 'Silver', price: '$15,000', color: 'gray' },
    { id: 'bronze', name: 'Bronze', price: '$5,000', color: 'orange' },
    { id: 'custom', name: 'Custom', price: 'Negotiable', color: 'blue' }
  ];

  const objectives = [
    'Brand Awareness',
    'Lead Generation',
    'Product Launch',
    'Networking',
    'Talent Acquisition',
    'Community Engagement',
    'Market Research',
    'Sales'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sponsor data:', formData);
    navigate('/admin/sponsor');
  };

  const handleCompanyChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value }
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleSponsorshipChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sponsorship: { ...prev.sponsorship, [field]: value }
    }));
  };

  const toggleObjective = (objective: string) => {
    setFormData(prev => ({
      ...prev,
      sponsorship: {
        ...prev.sponsorship,
        objectives: prev.sponsorship.objectives.includes(objective)
          ? prev.sponsorship.objectives.filter(o => o !== objective)
          : [...prev.sponsorship.objectives, objective]
      }
    }));
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/sponsor')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sponsors
            </Button>
            <h1 className="text-3xl font-bold">Add New Sponsor</h1>
            <p className="text-gray-600 mt-2">Create a new sponsorship opportunity</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="Fashion Brand Co."
                        value={formData.company.name}
                        onChange={(e) => handleCompanyChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="industry">Industry *</Label>
                        <Select
                          value={formData.company.industry}
                          onValueChange={(value) => handleCompanyChange('industry', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                            <SelectItem value="beauty">Beauty & Cosmetics</SelectItem>
                            <SelectItem value="luxury">Luxury Goods</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="media">Media & Entertainment</SelectItem>
                            <SelectItem value="finance">Finance & Banking</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="size">Company Size</Label>
                        <Select
                          value={formData.company.size}
                          onValueChange={(value) => handleCompanyChange('size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="startup">Startup (1-50)</SelectItem>
                            <SelectItem value="small">Small (51-200)</SelectItem>
                            <SelectItem value="medium">Medium (201-1000)</SelectItem>
                            <SelectItem value="large">Large (1000+)</SelectItem>
                            <SelectItem value="enterprise">Enterprise (10,000+)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">
                          <Globe className="h-4 w-4 inline mr-1" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://example.com"
                          value={formData.company.website}
                          onChange={(e) => handleCompanyChange('website', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="linkedin">
                          <Linkedin className="h-4 w-4 inline mr-1" />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          placeholder="company/fashion-brand"
                          value={formData.company.linkedin}
                          onChange={(e) => handleCompanyChange('linkedin', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Primary Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Primary Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          placeholder="Jane"
                          value={formData.contact.firstName}
                          onChange={(e) => handleContactChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          placeholder="Smith"
                          value={formData.contact.lastName}
                          onChange={(e) => handleContactChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        placeholder="Marketing Director"
                        value={formData.contact.title}
                        onChange={(e) => handleContactChange('title', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">
                          <Mail className="h-4 w-4 inline mr-1" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@company.com"
                          value={formData.contact.email}
                          onChange={(e) => handleContactChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">
                          <Phone className="h-4 w-4 inline mr-1" />
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 234 567 890"
                          value={formData.contact.phone}
                          onChange={(e) => handleContactChange('phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                      <Select
                        value={formData.contact.preferredContact}
                        onValueChange={(value) => handleContactChange('preferredContact', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="in-person">In Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Sponsorship Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sponsorship Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Package Selection</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {sponsorPackages.map(pkg => (
                          <div
                            key={pkg.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              formData.sponsorship.package === pkg.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'hover:border-gray-400'
                            }`}
                            onClick={() => handleSponsorshipChange('package', pkg.id)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Award className={`h-4 w-4 text-${pkg.color}-600`} />
                              {formData.sponsorship.package === pkg.id && (
                                <CheckCircle className="h-4 w-4 text-purple-600" />
                              )}
                            </div>
                            <p className="font-medium text-sm">{pkg.name}</p>
                            <p className="text-xs text-gray-600">{pkg.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget">
                          <DollarSign className="h-4 w-4 inline mr-1" />
                          Budget Range
                        </Label>
                        <Input
                          id="budget"
                          placeholder="$25,000 - $50,000"
                          value={formData.sponsorship.budget}
                          onChange={(e) => handleSponsorshipChange('budget', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Contract Duration</Label>
                        <Select
                          value={formData.sponsorship.duration}
                          onValueChange={(value) => handleSponsorshipChange('duration', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single Event</SelectItem>
                            <SelectItem value="3months">3 Months</SelectItem>
                            <SelectItem value="6months">6 Months</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="multi-year">Multi-year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Sponsorship Objectives</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {objectives.map(obj => (
                          <label
                            key={obj}
                            className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={formData.sponsorship.objectives.includes(obj)}
                              onChange={() => toggleObjective(obj)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm">{obj}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add any additional information about this sponsor..."
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select defaultValue="prospect">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prospect">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Prospect
                          </div>
                        </SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="negotiation">In Negotiation</SelectItem>
                        <SelectItem value="proposal">Proposal Sent</SelectItem>
                        <SelectItem value="closed">Closed Won</SelectItem>
                      </SelectContent>
                    </Select>

                    <div>
                      <Label>Lead Score</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">High Priority</span>
                      </div>
                    </div>

                    <div>
                      <Label>Next Action</Label>
                      <Input
                        type="date"
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Proposal
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Welcome Email
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Add Sponsor
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/admin/sponsor')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddSponsor;