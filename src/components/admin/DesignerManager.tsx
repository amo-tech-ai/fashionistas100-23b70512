import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, User, CheckCircle, XCircle, Eye, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';

interface Designer {
  id: string;
  user_id: string;
  brand_name: string;
  brand_slug: string;
  bio: string | null;
  website_url: string | null;
  portfolio_urls: string[];
  social_links: any;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const DesignerManager = () => {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [showDesignerDialog, setShowDesignerDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const { logAdminAction } = useAdmin();

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('designer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigners(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching designers',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDesigner = async (designerId: string, verified: boolean) => {
    try {
      const designer = designers.find(d => d.id === designerId);
      
      const { data, error } = await supabase
        .from('designer_profiles')
        .update({ is_verified: verified })
        .eq('id', designerId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction(
        verified ? 'verify' : 'unverify', 
        'designer_profiles', 
        designerId, 
        designer, 
        data
      );

      toast({
        title: `Designer ${verified ? 'verified' : 'unverified'}`,
        description: `The designer has been ${verified ? 'verified' : 'unverified'} successfully.`
      });

      fetchDesigners();
    } catch (error: any) {
      toast({
        title: 'Error updating designer',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteDesigner = async (designerId: string) => {
    if (!confirm('Are you sure you want to delete this designer profile?')) return;

    try {
      const designerToDelete = designers.find(d => d.id === designerId);
      
      const { error } = await supabase
        .from('designer_profiles')
        .delete()
        .eq('id', designerId);

      if (error) throw error;

      await logAdminAction('delete', 'designer_profiles', designerId, designerToDelete, null);

      toast({
        title: 'Designer deleted',
        description: 'The designer profile has been deleted successfully.'
      });

      fetchDesigners();
    } catch (error: any) {
      toast({
        title: 'Error deleting designer',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const openDesignerDialog = (designer: Designer) => {
    setSelectedDesigner(designer);
    setShowDesignerDialog(true);
  };

  const filteredDesigners = designers.filter(designer => {
    const matchesSearch = designer.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designer.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'verified' && designer.is_verified) ||
                         (statusFilter === 'unverified' && !designer.is_verified);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Designer Management</h2>
          <p className="text-muted-foreground">Review and manage fashion designers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search designers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designers</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Designers List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading designers...</p>
          </div>
        ) : filteredDesigners.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No designers found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No designers match your current filters.'
                  : 'No designer profiles have been created yet.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDesigners.map((designer) => (
            <Card key={designer.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{designer.brand_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{designer.brand_slug}</p>
                    {designer.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{designer.bio}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={designer.is_verified ? 'default' : 'secondary'}>
                        {designer.is_verified ? 'Verified' : 'Unverified'}
                      </Badge>
                      {designer.website_url && (
                        <Badge variant="outline">Has Website</Badge>
                      )}
                      {designer.portfolio_urls?.length > 0 && (
                        <Badge variant="outline">{designer.portfolio_urls.length} Portfolio Items</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDesignerDialog(designer)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {designer.is_verified ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyDesigner(designer.id, false)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyDesigner(designer.id, true)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Designer Detail Dialog */}
      <Dialog open={showDesignerDialog} onOpenChange={setShowDesignerDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Designer Details</DialogTitle>
          </DialogHeader>
          
          {selectedDesigner && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Brand Name:</strong>
                  <p>{selectedDesigner.brand_name}</p>
                </div>
                <div>
                  <strong>Status:</strong>
                  <Badge variant={selectedDesigner.is_verified ? 'default' : 'secondary'} className="ml-2">
                    {selectedDesigner.is_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>

              {selectedDesigner.bio && (
                <div>
                  <strong>Bio:</strong>
                  <p className="mt-1">{selectedDesigner.bio}</p>
                </div>
              )}

              {selectedDesigner.website_url && (
                <div>
                  <strong>Website:</strong>
                  <a 
                    href={selectedDesigner.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-2"
                  >
                    {selectedDesigner.website_url}
                  </a>
                </div>
              )}

              {selectedDesigner.portfolio_urls?.length > 0 && (
                <div>
                  <strong>Portfolio:</strong>
                  <ul className="mt-1 space-y-1">
                    {selectedDesigner.portfolio_urls.map((url, index) => (
                      <li key={index}>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => handleVerifyDesigner(selectedDesigner.id, !selectedDesigner.is_verified)}
                  variant={selectedDesigner.is_verified ? 'outline' : 'default'}
                >
                  {selectedDesigner.is_verified ? 'Unverify' : 'Verify'} Designer
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setShowDesignerDialog(false);
                    handleDeleteDesigner(selectedDesigner.id);
                  }}
                >
                  Delete Designer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};