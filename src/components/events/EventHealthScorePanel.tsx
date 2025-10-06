import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface EventHealthScorePanelProps {
  eventId: string;
}

interface HealthScore {
  id: string;
  overall_score: number;
  ticket_sales_score: number;
  timeline_score: number;
  vendor_readiness_score: number;
  model_casting_score: number;
  health_status: "excellent" | "good" | "warning" | "critical";
  ai_reasoning: string;
  recommendations: string[];
  risk_factors: string[];
  confidence_score: number;
  created_at: string;
}

export function EventHealthScorePanel({ eventId }: EventHealthScorePanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch latest health score
  const { data: healthScore, isLoading } = useQuery({
    queryKey: ["event-health-score", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_health_scores")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as HealthScore | null;
    },
  });

  // Generate health score mutation
  const generateScore = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("event-health-scorer", {
        body: { eventId },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Failed to generate health score");
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-health-score", eventId] });
      toast({
        title: "Health Score Generated",
        description: "Event health analysis completed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate health score. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50";
      case "good": return "text-blue-600 bg-blue-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "critical": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!healthScore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Health Score</CardTitle>
          <CardDescription>
            Get AI-powered insights on your event's readiness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No health score available yet</p>
            <Button
              onClick={() => generateScore.mutate()}
              disabled={generateScore.isPending}
            >
              {generateScore.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Health Score
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Event Health Score</CardTitle>
              <CardDescription>
                Last updated: {new Date(healthScore.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateScore.mutate()}
              disabled={generateScore.isPending}
            >
              {generateScore.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="text-center space-y-2">
            <div className={`text-6xl font-bold ${getScoreColor(healthScore.overall_score)}`}>
              {healthScore.overall_score}
            </div>
            <Badge className={getStatusColor(healthScore.health_status)}>
              {healthScore.health_status.toUpperCase()}
            </Badge>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Ticket Sales</div>
              <div className={`text-2xl font-bold ${getScoreColor(healthScore.ticket_sales_score)}`}>
                {healthScore.ticket_sales_score}
              </div>
              <Progress value={healthScore.ticket_sales_score} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Timeline</div>
              <div className={`text-2xl font-bold ${getScoreColor(healthScore.timeline_score)}`}>
                {healthScore.timeline_score}
              </div>
              <Progress value={healthScore.timeline_score} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Vendors</div>
              <div className={`text-2xl font-bold ${getScoreColor(healthScore.vendor_readiness_score)}`}>
                {healthScore.vendor_readiness_score}
              </div>
              <Progress value={healthScore.vendor_readiness_score} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Models</div>
              <div className={`text-2xl font-bold ${getScoreColor(healthScore.model_casting_score)}`}>
                {healthScore.model_casting_score}
              </div>
              <Progress value={healthScore.model_casting_score} className="h-2" />
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{healthScore.ai_reasoning}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {healthScore.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {healthScore.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary font-semibold">{idx + 1}.</span>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      {healthScore.risk_factors.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {healthScore.risk_factors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
