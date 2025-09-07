import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Save, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const CollectionManager = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState({
    name: '',
    season: '',
    year: new Date().getFullYear().toString(),
    description: '',
    pieces: 0,
    category: '',
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));      toast({
        title: "Collection Created",
        description: "Your new collection has been added successfully.",
      });
      navigate('/admin/designer');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Collection Name</Label>
                <Input
                  id="name"                  value={collection.name}
                  onChange={(e) => setCollection({...collection, name: e.target.value})}
                  placeholder="Spring Elegance"
                />
              </div>
              
              <div>
                <Label htmlFor="season">Season</Label>
                <Select value={collection.season} onValueChange={(value) => setCollection({...collection, season: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="fall">Fall</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={collection.year}
                  onChange={(e) => setCollection({...collection, year: e.target.value})}                />
              </div>

              <div>
                <Label htmlFor="pieces">Number of Pieces</Label>
                <Input
                  id="pieces"
                  type="number"
                  value={collection.pieces}
                  onChange={(e) => setCollection({...collection, pieces: parseInt(e.target.value)})}
                  placeholder="25"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={collection.category} onValueChange={(value) => setCollection({...collection, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="haute-couture">Haute Couture</SelectItem>
                  <SelectItem value="ready-to-wear">Ready-to-Wear</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="bridal">Bridal</SelectItem>
                  <SelectItem value="menswear">Menswear</SelectItem>
                  <SelectItem value="womenswear">Womenswear</SelectItem>
                </SelectContent>              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={collection.description}
                onChange={(e) => setCollection({...collection, description: e.target.value})}
                placeholder="Describe your collection..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate('/admin/designer')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : "Create Collection"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CollectionManager;