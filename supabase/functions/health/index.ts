import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthMetrics {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  agents: {
    model_casting: AgentHealth;
    runway_timing: AgentHealth;
  };
  database: {
    connected: boolean;
    latency_ms: number;
  };
  overall_error_rate: number;
  uptime_seconds: number;
}

interface AgentHealth {
  available: boolean;
  last_success: string | null;
  error_rate_24h: number;
  avg_latency_ms: number;
  total_calls_24h: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check database connectivity
    const dbStart = Date.now();
    const { error: dbError } = await supabase.from("ai_agent_logs").select("id").limit(1);
    const dbLatency = Date.now() - dbStart;

    if (dbError) {
      return new Response(
        JSON.stringify({
          status: "unhealthy",
          error: "Database connection failed",
          timestamp: new Date().toISOString()
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get metrics for last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Model Casting Agent metrics
    const { data: castingLogs } = await supabase
      .from("ai_agent_logs")
      .select("success, latency_ms, created_at")
      .eq("agent_type", "model_casting")
      .gte("created_at", yesterday)
      .order("created_at", { ascending: false });

    const castingMetrics = calculateAgentMetrics(castingLogs || []);

    // Runway Timing Agent metrics
    const { data: timingLogs } = await supabase
      .from("ai_agent_logs")
      .select("success, latency_ms, created_at")
      .eq("agent_type", "runway_timing")
      .gte("created_at", yesterday)
      .order("created_at", { ascending: false });

    const timingMetrics = calculateAgentMetrics(timingLogs || []);

    // Calculate overall error rate
    const allLogs = [...(castingLogs || []), ...(timingLogs || [])];
    const totalCalls = allLogs.length;
    const failedCalls = allLogs.filter(log => !log.success).length;
    const overallErrorRate = totalCalls > 0 ? (failedCalls / totalCalls) * 100 : 0;

    // Determine overall status
    let status: "healthy" | "degraded" | "unhealthy" = "healthy";
    if (overallErrorRate > 10 || castingMetrics.error_rate_24h > 10 || timingMetrics.error_rate_24h > 10) {
      status = "unhealthy";
    } else if (overallErrorRate > 5 || castingMetrics.error_rate_24h > 5 || timingMetrics.error_rate_24h > 5) {
      status = "degraded";
    }

    const healthMetrics: HealthMetrics = {
      status,
      timestamp: new Date().toISOString(),
      agents: {
        model_casting: castingMetrics,
        runway_timing: timingMetrics
      },
      database: {
        connected: true,
        latency_ms: dbLatency
      },
      overall_error_rate: overallErrorRate,
      uptime_seconds: Math.floor(Date.now() / 1000)
    };

    const httpStatus = status === "healthy" ? 200 : status === "degraded" ? 200 : 503;

    return new Response(
      JSON.stringify(healthMetrics),
      { 
        status: httpStatus,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Health check error:", error);
    
    return new Response(
      JSON.stringify({
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 503, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

function calculateAgentMetrics(logs: any[]): AgentHealth {
  if (logs.length === 0) {
    return {
      available: true,
      last_success: null,
      error_rate_24h: 0,
      avg_latency_ms: 0,
      total_calls_24h: 0
    };
  }

  const successfulLogs = logs.filter(log => log.success);
  const failedLogs = logs.filter(log => !log.success);
  const errorRate = (failedLogs.length / logs.length) * 100;

  const avgLatency = logs.reduce((sum, log) => sum + (log.latency_ms || 0), 0) / logs.length;

  const lastSuccess = successfulLogs.length > 0 
    ? successfulLogs[0].created_at 
    : null;

  return {
    available: errorRate < 100, // Available if not 100% errors
    last_success: lastSuccess,
    error_rate_24h: errorRate,
    avg_latency_ms: Math.round(avgLatency),
    total_calls_24h: logs.length
  };
}
