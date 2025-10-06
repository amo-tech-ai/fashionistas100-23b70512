import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, CheckCircle2, Clock, TrendingUp, Database, Zap } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
}

interface AgentHealth {
  available: boolean;
  last_success: string | null;
  error_rate_24h: number;
  avg_latency_ms: number;
  total_calls_24h: number;
}

interface AgentLog {
  id: string;
  agent_type: string;
  operation: string;
  model: string;
  success: boolean;
  error_message: string | null;
  latency_ms: number;
  tokens_used: number;
  created_at: string;
}

export function ObservabilityDashboard() {
  // Fetch health metrics
  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["health-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("health");
      if (error) throw error;
      return data as HealthMetrics;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch recent logs
  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ["ai-agent-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_agent_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as AgentLog[];
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-500";
      case "degraded": return "bg-yellow-500";
      case "unhealthy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle2 className="h-5 w-5" />;
      case "degraded": return <AlertCircle className="h-5 w-5" />;
      case "unhealthy": return <AlertCircle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  if (healthLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Observabilidad AI</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoreo en tiempo real de agentes AI
          </p>
        </div>
        {health && (
          <Badge
            variant="outline"
            className={`${getStatusColor(health.status)} text-white border-0 px-4 py-2`}
          >
            {getStatusIcon(health.status)}
            <span className="ml-2 font-semibold uppercase">{health.status}</span>
          </Badge>
        )}
      </div>

      {/* Overall Metrics */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {health.overall_error_rate.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Database className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DB Latency</p>
                <p className="text-2xl font-bold text-foreground">
                  {health.database.latency_ms}ms
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Calls 24h</p>
                <p className="text-2xl font-bold text-foreground">
                  {health.agents.model_casting.total_calls_24h + health.agents.runway_timing.total_calls_24h}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Latency</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((health.agents.model_casting.avg_latency_ms + health.agents.runway_timing.avg_latency_ms) / 2)}ms
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Agent Health Cards */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AgentHealthCard
            name="Model Casting"
            agent="model_casting"
            health={health.agents.model_casting}
          />
          <AgentHealthCard
            name="Runway Timing"
            agent="runway_timing"
            health={health.agents.runway_timing}
          />
        </div>
      )}

      {/* Recent Logs */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Logs Recientes
        </h2>
        {logsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Activity className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border ${
                    log.success ? "bg-card border-border" : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={log.success ? "default" : "destructive"}>
                          {log.agent_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {log.operation}
                        </span>
                        {log.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {!log.success && log.error_message && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {log.error_message}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Latency: {log.latency_ms}ms</span>
                        <span>Tokens: {log.tokens_used || 0}</span>
                        <span>Model: {log.model}</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {format(new Date(log.created_at), "PPp", { locale: es })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay logs disponibles
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function AgentHealthCard({ name, agent, health }: { name: string; agent: string; health: AgentHealth }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <Badge variant={health.available ? "default" : "destructive"}>
          {health.available ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Error Rate (24h)</span>
          <span className={`text-sm font-medium ${
            health.error_rate_24h > 10 ? "text-red-500" :
            health.error_rate_24h > 5 ? "text-yellow-500" :
            "text-green-500"
          }`}>
            {health.error_rate_24h.toFixed(1)}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Avg Latency</span>
          <span className="text-sm font-medium text-foreground">
            {health.avg_latency_ms}ms
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Calls (24h)</span>
          <span className="text-sm font-medium text-foreground">
            {health.total_calls_24h}
          </span>
        </div>

        {health.last_success && (
          <div className="pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Último éxito:</span>
            <p className="text-xs text-foreground mt-1">
              {format(new Date(health.last_success), "PPp", { locale: es })}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
