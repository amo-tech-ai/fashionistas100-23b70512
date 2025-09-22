import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Palette, CheckCircle, Clock, ExternalLink } from 'lucide-react';

const DesignerManagerSimple = () => {
  // Mock data for now
  const designers = [
    {
      id: '1',
      brand_name: 'Elegancia Moderna',
      name: 'Sofia Martinez',
      bio: 'Sustainable fashion designer specializing in contemporary Colombian designs.',
      is_verified: true,
      created_at: '2024-01-10T10:00:00Z',
      portfolio_urls: ['https://portfolio1.com'],
      website_url: 'https://eleganciamoderna.com'
    },
    {
      id: '2',
      brand_name: 'Urban Threads',
      name: 'Diego Hernandez',
      bio: 'Street wear and urban fashion with Latin American influences.',
      is_verified: false,
      created_at: '2024-01-12T15:30:00Z',
      portfolio_urls: ['https://portfolio2.com'],
      website_url: null
    }
  ];

  const handleVerifyDesigner = async (designerId: string) => {
    // Mock function for now
    console.log('Verifying designer:', designerId);
  };

  const handleRejectDesigner = async (designerId: string) => {
    // Mock function for now
    console.log('Rejecting designer:', designerId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Designer Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {designers.map((designer) => (
            <div key={designer.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {designer.brand_name?.[0] || designer.name?.[0] || 'D'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{designer.brand_name || designer.name}</h3>
                    <p className="text-sm text-muted-foreground">{designer.name}</p>
                  </div>
                </div>
                
                <Badge 
                  variant={designer.is_verified ? "default" : "secondary"}
                  className={designer.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                >
                  {designer.is_verified ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </>
                  )}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {designer.bio}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {designer.website_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={designer.website_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Website
                      </a>
                    </Button>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Joined {new Date(designer.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {!designer.is_verified && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleVerifyDesigner(designer.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRejectDesigner(designer.id)}
                      className="text-destructive"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {designers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No designers yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignerManagerSimple;