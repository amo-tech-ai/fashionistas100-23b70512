import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ReadinessItem {
  category: string;
  item: string;
  status: "critical" | "warning" | "complete" | "pending";
  score: number;
  weight: number;
  description: string;
  blockers?: string[];
}

const readinessData: ReadinessItem[] = [
  // P0 Routes & IA (Weight 2x)
  {
    category: "Routes & IA",
    item: "/events listing page",
    status: "critical",
    score: 0,
    weight: 2,
    description: "Core events browsing experience",
    blockers: ["No events listing page", "No pagination/filtering"]
  },
  {
    category: "Routes & IA", 
    item: "/events/[id] detail page",
    status: "critical",
    score: 0,
    weight: 2,
    description: "Individual event details & ticket selection",
    blockers: ["No event detail pages", "No ticket selection UI"]
  },
  {
    category: "Routes & IA",
    item: "/designers directory",
    status: "critical", 
    score: 0,
    weight: 2,
    description: "Designer discovery & profiles",
    blockers: ["No designer listing", "No profile pages"]
  },
  {
    category: "Routes & IA",
    item: "/designers/[slug] profiles",
    status: "critical",
    score: 0,
    weight: 2,
    description: "Individual designer showcase pages",
    blockers: ["No designer profile pages", "No portfolio display"]
  },

  // P0 Data Wiring (Weight 2x)
  {
    category: "Data Wiring",
    item: "Events → UI integration",
    status: "warning",
    score: 30,
    weight: 2,
    description: "Event data flowing to components",
    blockers: ["EventService exists but no listing pages", "Missing error handling"]
  },
  {
    category: "Data Wiring",
    item: "Designers → UI integration", 
    status: "warning",
    score: 40,
    weight: 2,
    description: "Designer data in components",
    blockers: ["DesignerCard exists but no listing pages", "Sample data only"]
  },
  {
    category: "Data Wiring",
    item: "Tickets → UI integration",
    status: "warning",
    score: 25,
    weight: 2,
    description: "Ticket system functional",
    blockers: ["TicketService exists but no purchase flow", "Backend only"]
  },

  // P0 Error/Loading States (Weight 2x)
  {
    category: "Error Handling",
    item: "Error boundaries",
    status: "critical",
    score: 0,
    weight: 2,
    description: "App crash protection",
    blockers: ["No error boundaries", "Unhandled errors crash app"]
  },
  {
    category: "Error Handling",
    item: "Loading skeletons",
    status: "critical",
    score: 0,
    weight: 2,
    description: "Loading state UX",
    blockers: ["No loading states", "Poor UX during fetches"]
  },
  {
    category: "Error Handling",
    item: "Empty state handling", 
    status: "warning",
    score: 20,
    weight: 2,
    description: "No results scenarios",
    blockers: ["Minimal empty states", "No fallback content"]
  },

  // P0 A11y & Performance (Weight 2x) 
  {
    category: "Accessibility",
    item: "Alt text on images",
    status: "warning",
    score: 60,
    weight: 2,
    description: "Screen reader support",
    blockers: ["Some images missing alt text", "Generated images need descriptions"]
  },
  {
    category: "Accessibility",
    item: "44px touch targets",
    status: "complete",
    score: 90,
    weight: 2,
    description: "Mobile accessibility",
    blockers: []
  },
  {
    category: "Performance",
    item: "Core Web Vitals",
    status: "warning",
    score: 70,
    weight: 2,
    description: "LCP, CLS, FID metrics",
    blockers: ["No performance monitoring", "Large images not optimized"]
  },

  // P1 Auth (Weight 1x) - AFTER RLS verification
  {
    category: "Authentication",
    item: "RLS policies verified",
    status: "pending",
    score: 0,
    weight: 1,
    description: "Row Level Security audit complete",
    blockers: ["RLS status unknown", "Need verification report", "User-bound tables not confirmed"]
  },
  {
    category: "Authentication", 
    item: "Login/signup UI",
    status: "critical",
    score: 0,
    weight: 1,
    description: "User authentication flow",
    blockers: ["No auth pages", "Database ready but no UI"]
  },

  // P1 Type Safety (Weight 1x)
  {
    category: "Type Safety",
    item: "Replace 'any' types",
    status: "warning",
    score: 40,
    weight: 1,
    description: "Strong typing throughout",
    blockers: ["Multiple 'any' in services", "Missing domain interfaces"]
  },
  {
    category: "Type Safety",
    item: "API response types",
    status: "warning", 
    score: 30,
    weight: 1,
    description: "Typed API interactions",
    blockers: ["No Result<T,E> pattern", "No Zod schemas"]
  },

  // P1 Payments (Weight 1x) - AFTER order schema
  {
    category: "Payments",
    item: "Order schema & policies",
    status: "pending",
    score: 0,
    weight: 1,
    description: "Payment data foundation",
    blockers: ["No order schema", "No refund policy", "No email templates"]
  },
  {
    category: "Payments",
    item: "Stripe integration",
    status: "pending",
    score: 0,
    weight: 1,
    description: "Payment processing",
    blockers: ["Blocked by order schema", "No test cards setup"]
  }
];

export const ProductionReadiness = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "critical":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "complete":
        return "default";
      case "warning":  
        return "secondary";
      case "critical":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  // Calculate weighted score
  const totalWeightedScore = readinessData.reduce((acc, item) => {
    return acc + (item.score * item.weight);
  }, 0);
  
  const totalWeight = readinessData.reduce((acc, item) => {
    return acc + (item.weight * 100); // 100 is max score
  }, 0);
  
  const overallScore = Math.round(totalWeightedScore / totalWeight * 100);

  // Group by category for display
  const categories = readinessData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ReadinessItem[]>);

  const criticalBlockers = readinessData.filter(item => item.status === "critical").length;
  const warnings = readinessData.filter(item => item.status === "warning").length;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Production Readiness Report</h1>
        <p className="text-xl text-muted-foreground">
          Weighted assessment based on critical path analysis
        </p>
      </div>

      {/* Overall Score */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <span>Overall Production Score</span>
            <Badge variant={overallScore >= 85 ? "default" : overallScore >= 50 ? "secondary" : "destructive"} className="text-lg px-3 py-1">
              {overallScore}%
            </Badge>
          </CardTitle>
          <CardDescription>
            {criticalBlockers} critical blockers • {warnings} warnings • P0 items weighted 2x
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={overallScore} className="h-3" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{criticalBlockers}</div>
              <div className="text-sm text-muted-foreground">Critical Blockers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{warnings}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {readinessData.filter(item => item.status === "complete").length}
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment by Category */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Detailed Assessment</h2>
        {Object.entries(categories).map(([category, items]) => {
          const categoryScore = Math.round(
            items.reduce((acc, item) => acc + item.score, 0) / items.length
          );
          
          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={categoryScore >= 80 ? "default" : categoryScore >= 50 ? "secondary" : "destructive"}>
                      {categoryScore}%
                    </Badge>
                    {items.some(item => item.weight === 2) && (
                      <Badge variant="outline" className="text-xs">P0</Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.item}</h4>
                        <div className="flex items-center gap-2">
                          <Progress value={item.score} className="w-20 h-2" />
                          <span className="text-sm text-muted-foreground w-12">{item.score}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {item.blockers && item.blockers.length > 0 && (
                        <div className="space-y-1">
                          <Badge variant={getStatusVariant(item.status)} className="text-xs">
                            {item.status.toUpperCase()}
                          </Badge>
                          <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                            {item.blockers.map((blocker, idx) => (
                              <li key={idx} className="list-disc">{blocker}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Corrected Action Plan */}
      <Card className="border-l-4 border-l-warning">
        <CardHeader>
          <CardTitle>Corrected Development Plan</CardTitle>
          <CardDescription>Realistic timeline based on weighted assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-destructive mb-2">Phase 1 - Week 1 (Critical P0 Routes)</h3>
            <ul className="space-y-1 text-sm ml-4">
              <li className="list-disc">Implement /events listing with URL filters & pagination</li>
              <li className="list-disc">Create /events/[id] detail pages with ticket selection UI</li>
              <li className="list-disc">Build /designers directory with search & filtering</li>
              <li className="list-disc">Add /designers/[slug] profile pages with portfolios</li>
              <li className="list-disc">Add error boundaries, loading skeletons, empty states</li>
              <li className="list-disc">Replace all 'any' types with proper domain interfaces</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-warning mb-2">Phase 2 - Week 2 (Data Integration)</h3>
            <ul className="space-y-1 text-sm ml-4">
              <li className="list-disc">Connect EventService to listing/detail pages</li>
              <li className="list-disc">Integrate DesignerCard with real data flows</li>
              <li className="list-disc">Add /tickets (UI-only), /sponsors, /about, /contact pages</li>
              <li className="list-disc">Implement user dashboard (read-only)</li>
              <li className="list-disc">Add Result&lt;T,E&gt; helpers and Zod schemas</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-muted-foreground mb-2">Phase 3 - Week 3 (Auth & Payments)</h3>
            <ul className="space-y-1 text-sm ml-4">
              <li className="list-disc">Verify RLS policies with one-page audit report</li>
              <li className="list-disc">Add login/signup using existing design tokens</li>
              <li className="list-disc">Create order schema, refund policy, email templates</li>
              <li className="list-disc">Implement Stripe Checkout with test cards</li>
              <li className="list-disc">Add webhook handling and order records</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Updated Prompts for Implementation:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Auth:</strong> "Add login/signup/logout only after verifying RLS on user-bound tables. Provide a one-page RLS report (tables, policies, test queries). Use existing form components + design tokens. Redirect on success; show inline errors."
              </div>
              <div>
                <strong>Payments:</strong> "Implement Stripe Checkout after order schema, receipts email template, and refund policy are live. Add test keys, success/cancel routes, webhook stub, and an order record with line items. Provide a test checklist (cards, failure paths)."
              </div>
              <div>
                <strong>Type Safety:</strong> "Replace all any with domain types: Event, Ticket, Registration, Designer, Venue. Add Result&lt;T, E&gt; helpers, typed fetchers, and Zod schemas for parsing. Fail closed: boundary + toast on network/parse errors."
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};