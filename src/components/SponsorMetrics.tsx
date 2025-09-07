import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users,
  ArrowUp,
  ArrowDown,
  Eye,
  Calendar
} from 'lucide-react';

interface SponsorMetricsProps {
  sponsors: any[];
  sponsorships: any[];
  analytics: any;
  isLoading: boolean;
}

export function SponsorMetrics({ sponsors, sponsorships, analytics, isLoading }: SponsorMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="border-0 shadow-lg animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeSponsors = sponsors?.filter(s => s.status === 'active').length || 0;
  const totalInvestment = sponsorships?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;
  const totalReach = analytics?.totalReach || 0;
  const totalSponsors = sponsors?.length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            Active Sponsors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white mb-1">
            {activeSponsors}
          </div>
          <p className="text-sm text-white/80">
            {totalSponsors} total sponsors
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            Total Investment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white mb-1">
            ${Math.round(totalInvestment / 1000)}K
          </div>
          <p className="text-sm text-white/80 flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            +{analytics?.roiGrowth || 8}% ROI
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-amber-600">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Brand Reach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white mb-1">
            {Math.round(totalReach / 1000)}K
          </div>
          <p className="text-sm text-white/80 flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            +{analytics?.reachGrowth || 23}% growth
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-500 to-rose-600">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white mb-1">
            {Math.round((analytics?.totalEngagement || 0) / 1000)}K
          </div>
          <p className="text-sm text-white/80 flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            +{analytics?.engagementGrowth || 15}% growth
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface SponsorListProps {
  sponsors: any[];
  isLoading: boolean;
  onAddSponsor: () => void;
}

export function SponsorList({ sponsors, isLoading, onAddSponsor }: SponsorListProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Building2 className="h-5 w-5" />
            Loading Sponsors...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Building2 className="h-5 w-5" />
          Current Sponsors ({sponsors?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sponsors && sponsors.length > 0 ? (
          <div className="space-y-4">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg hover:from-purple-50 hover:to-purple-100/30 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {sponsor.company_name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {sponsor.company_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {sponsor.contact_name && sponsor.contact_email ? 
                        `${sponsor.contact_name} • ${sponsor.contact_email}` : 
                        sponsor.contact_email || sponsor.industry || 'No contact info'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={sponsor.status === 'active' ? 'default' : 'secondary'}
                    className={cn(
                      'capitalize',
                      sponsor.status === 'active' && 'bg-green-100 text-green-800 border-green-200',
                      sponsor.status === 'negotiating' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                      sponsor.status === 'lead' && 'bg-blue-100 text-blue-800 border-blue-200'
                    )}
                  >
                    {sponsor.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(sponsor.created_at).toLocaleDateString()}
                  </span>
                  <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No sponsors yet</p>
            <button 
              onClick={onAddSponsor}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Add Your First Sponsor
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function for className utility
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}