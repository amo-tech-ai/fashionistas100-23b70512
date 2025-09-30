import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Mail, Phone, Star, Users, Calendar, ExternalLink } from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  tagline?: string;
  category: string;
  bio?: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  founded_date?: string;
  team_size?: string;
  social_links?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  is_verified: boolean;
  metrics?: {
    [key: string]: any;
  };
  portfolio_urls?: string[];
  created_at: string;
}

interface ProfileTemplateProps {
  profile: ProfileData;
  role: 'designer' | 'sponsor' | 'venue';
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({ profile, role }) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                {profile.is_verified && (
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              {profile.tagline && (
                <p className="text-gray-600">{profile.tagline}</p>
              )}
              <Badge variant="secondary">{profile.category}</Badge>
            </div>
            <Button>Contact</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="space-y-2">
                {profile.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics */}
            {profile.metrics && (
              <div className="space-y-4">
                <h3 className="font-semibold">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(profile.metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold">{value}</div>
                      <div className="text-xs text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          {/* Social Links */}
          {profile.social_links && Object.keys(profile.social_links).length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Social Media</h3>
              <div className="flex gap-2">
                {Object.entries(profile.social_links).map(([platform, url]) => (
                  url && (
                    <Button
                      key={platform}
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    </Button>
                  )
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio/Images */}
      {profile.portfolio_urls && profile.portfolio_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.portfolio_urls.map((url, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileTemplate;