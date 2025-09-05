import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, AlertCircle, Users, Database, Layout, Palette } from "lucide-react";

interface AssessmentItem {
  category: string;
  item: string;
  status: 'completed' | 'partial' | 'pending' | 'error';
  progress: number;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const assessmentData: AssessmentItem[] = [
  // DESIGN SYSTEM
  {
    category: "Design System",
    item: "Color Tokens & Theme",
    status: "completed",
    progress: 100,
    description: "Comprehensive HSL color system with light/dark mode support",
    priority: "high"
  },
  {
    category: "Design System", 
    item: "Typography System",
    status: "completed",
    progress: 100,
    description: "Playfair Display + Inter fonts configured",
    priority: "high"
  },
  {
    category: "Design System",
    item: "Component Variants",
    status: "partial",
    progress: 75,
    description: "Hero, accent, outline variants - missing some button states",
    priority: "medium"
  },
  {
    category: "Design System",
    item: "Gradients & Shadows",
    status: "completed",
    progress: 100,
    description: "Custom gradients and shadow system implemented",
    priority: "medium"
  },

  // CORE COMPONENTS
  {
    category: "Core Components",
    item: "Navigation",
    status: "completed",
    progress: 100,
    description: "Responsive nav with mobile menu, logo, CTA",
    priority: "high"
  },
  {
    category: "Core Components",
    item: "Hero Section",
    status: "completed",
    progress: 100,
    description: "Full-screen hero with background image, stats, CTAs",
    priority: "high"
  },
  {
    category: "Core Components",
    item: "Event Cards",
    status: "completed",
    progress: 95,
    description: "Complete event card with image, details, pricing",
    priority: "high"
  },
  {
    category: "Core Components",
    item: "Designer Cards",
    status: "completed",
    progress: 95,
    description: "Designer profile cards with portfolio links",
    priority: "high"
  },
  {
    category: "Core Components",
    item: "Featured Events Section",
    status: "completed",
    progress: 90,
    description: "Grid layout with filtering chips and data integration",
    priority: "high"
  },

  // PAGES & ROUTING
  {
    category: "Pages & Routing",
    item: "Homepage",
    status: "completed",
    progress: 100,
    description: "Complete landing page with all sections",
    priority: "high"
  },
  {
    category: "Pages & Routing",
    item: "404 Page",
    status: "completed",
    progress: 100,
    description: "Basic 404 error page implemented",
    priority: "low"
  },
  {
    category: "Pages & Routing",
    item: "Events Page",
    status: "pending",
    progress: 0,
    description: "Dedicated events listing page",
    priority: "high"
  },
  {
    category: "Pages & Routing",
    item: "Event Detail Page",
    status: "pending",
    progress: 0,
    description: "Individual event details with booking",
    priority: "high"
  },
  {
    category: "Pages & Routing",
    item: "Designers Page",
    status: "pending",
    progress: 0,
    description: "Designer directory and profiles",
    priority: "medium"
  },

  // DATABASE & BACKEND
  {
    category: "Database & Backend",
    item: "Database Schema",
    status: "completed",
    progress: 100,
    description: "19 tables with proper relationships and RLS",
    priority: "high"
  },
  {
    category: "Database & Backend",
    item: "Sample Data",
    status: "completed",
    progress: 100,
    description: "Medellín Fashion Week dataset loaded",
    priority: "high"
  },
  {
    category: "Database & Backend",
    item: "Event Service",
    status: "completed",
    progress: 100,
    description: "Complete event data fetching and processing",
    priority: "high"
  },
  {
    category: "Database & Backend",
    item: "Ticket Service",
    status: "partial",
    progress: 60,
    description: "Basic ticket service - needs booking integration",
    priority: "high"
  },
  {
    category: "Database & Backend",
    item: "Authentication System",
    status: "pending",
    progress: 0,
    description: "User auth, profiles, and role management",
    priority: "high"
  },

  // UI COMPONENTS
  {
    category: "UI Components",
    item: "Shadcn Components",
    status: "completed",
    progress: 100,
    description: "Full shadcn/ui component library installed",
    priority: "medium"
  },
  {
    category: "UI Components",
    item: "Custom Components",
    status: "partial",
    progress: 70,
    description: "Newsletter, TicketTiers components exist but need review",
    priority: "medium"
  },
  {
    category: "UI Components",
    item: "Loading States",
    status: "partial",
    progress: 50,
    description: "Basic loading states - needs skeletons",
    priority: "medium"
  },
  {
    category: "UI Components",
    item: "Error Handling",
    status: "partial",
    progress: 40,
    description: "Basic error display - needs comprehensive handling",
    priority: "medium"
  },

  // FUNCTIONALITY
  {
    category: "Functionality",
    item: "Data Fetching",
    status: "completed",
    progress: 100,
    description: "React Query + Supabase integration working",
    priority: "high"
  },
  {
    category: "Functionality",
    item: "Search & Filtering",
    status: "pending",
    progress: 0,
    description: "Event search and filtering system",
    priority: "high"
  },
  {
    category: "Functionality",
    item: "Event Booking",
    status: "pending",
    progress: 0,
    description: "Ticket purchase and booking flow",
    priority: "high"
  },
  {
    category: "Functionality",
    item: "User Dashboard",
    status: "pending",
    progress: 0,
    description: "User profile and saved events",
    priority: "medium"
  },
];

export const ProgressAssessment = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Circle className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'partial':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Design System':
        return <Palette className="w-5 h-5" />;
      case 'Core Components':
        return <Layout className="w-5 h-5" />;
      case 'Database & Backend':
        return <Database className="w-5 h-5" />;
      case 'UI Components':
        return <Layout className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const categoriesStats = assessmentData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { total: 0, avgProgress: 0, items: [] };
    }
    acc[item.category].total += item.progress;
    acc[item.category].items.push(item);
    return acc;
  }, {} as Record<string, { total: number; avgProgress: number; items: AssessmentItem[] }>);

  Object.keys(categoriesStats).forEach(cat => {
    categoriesStats[cat].avgProgress = Math.round(categoriesStats[cat].total / categoriesStats[cat].items.length);
  });

  const overallProgress = Math.round(
    assessmentData.reduce((sum, item) => sum + item.progress, 0) / assessmentData.length
  );

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-playfair text-4xl font-bold text-foreground">
          Fashionistas Website Progress Assessment
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">{overallProgress}%</div>
            <div className="text-sm text-muted-foreground">Overall Complete</div>
          </div>
          <Progress value={overallProgress} className="w-32" />
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(categoriesStats).map(([category, stats]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getCategoryIcon(category)}
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">{stats.avgProgress}%</span>
                  <Badge variant="outline">{stats.items.length} items</Badge>
                </div>
                <Progress value={stats.avgProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Assessment Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Detailed Progress Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(categoriesStats).map(([category, stats]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-playfair text-xl font-semibold text-foreground flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category}
                  <Badge variant="outline" className="ml-auto">
                    {stats.avgProgress}% Complete
                  </Badge>
                </h3>
                
                <div className="space-y-2">
                  {stats.items.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-card border"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getStatusIcon(item.status)}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{item.item}</span>
                            <Badge variant={getStatusVariant(item.status) as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                              {item.status}
                            </Badge>
                            <Badge 
                              variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'secondary' : 'outline'} 
                              className="text-xs"
                            >
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 min-w-fit">
                        <span className="text-sm font-medium text-accent">{item.progress}%</span>
                        <Progress value={item.progress} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary & Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Analysis & Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">✅ Strengths</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Solid design system foundation with HSL colors</li>
                <li>• Complete database schema with 19 tables</li>
                <li>• Responsive navigation and hero section</li>
                <li>• Working event data integration</li>
                <li>• Professional component architecture</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">🎯 Priority Tasks</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Implement authentication system</li>
                <li>• Create event detail pages</li>
                <li>• Build ticket booking flow</li>
                <li>• Add search & filtering</li>
                <li>• Complete designer pages</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Assessment Summary:</strong> The fashionistas website has a strong foundation with {overallProgress}% completion. 
              Core infrastructure, design system, and basic functionality are well-implemented. Priority focus should be on 
              authentication, detailed pages, and user interaction features to complete the MVP.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};