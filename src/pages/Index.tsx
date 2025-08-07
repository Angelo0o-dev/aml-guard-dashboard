import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Rule } from "@/types/rule";
import { apiService } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/StatusBadge";
import { 
  Shield, 
  AlertTriangle, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap, 
  Clock,
  ArrowRight,
  Plus,
  Users,
  Target,
  Gauge
} from "lucide-react";

const Index = () => {
  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: apiService.getRules,
  });

  const stats = {
    totalRules: rules.length,
    activeRules: rules.filter(rule => rule.ruleState === 'ACTIVE').length,
    pausedRules: rules.filter(rule => rule.ruleState === 'PAUSE').length,
    avgWindow: rules.length > 0 ? Math.round(rules.reduce((acc, rule) => acc + rule.windowMinutes, 0) / rules.length) : 0,
  };

  const StatCard = ({ title, value, description, icon: Icon, variant = "default", progress }: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    variant?: "default" | "success" | "warning" | "destructive";
    progress?: number;
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "success":
          return "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50";
        case "warning":
          return "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50";
        case "destructive":
          return "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50";
        default:
          return "";
      }
    };

    return (
      <Card className={`transition-all duration-200 hover:shadow-md ${getVariantStyles()}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          {progress !== undefined && (
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const ActionCard = ({ title, description, icon: Icon, href, buttonText, variant = "default" }: {
    title: string;
    description: string;
    icon: any;
    href: string;
    buttonText: string;
    variant?: "default" | "outline" | "secondary";
  }) => (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {title}
        </CardTitle>
        <CardDescription className="mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={href}>
          <Button className="w-full" variant={variant}>
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your Anti-Money Laundering rules system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rules"
          value={stats.totalRules}
          description="Rules configured"
          icon={Shield}
          progress={75}
        />
        <StatCard
          title="Active Rules"
          value={stats.activeRules}
          description="Currently monitoring"
          icon={Activity}
          variant="success"
          progress={85}
        />
        <StatCard
          title="Paused Rules"
          value={stats.pausedRules}
          description="Temporarily disabled"
          icon={AlertTriangle}
          variant="warning"
          progress={20}
        />
        <StatCard
          title="Avg Window"
          value={`${stats.avgWindow}m`}
          description="Monitoring window"
          icon={Clock}
          progress={60}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard
          title="Rules Management"
          description="Create, edit, and configure AML detection rules with advanced thresholds and monitoring capabilities."
          icon={Shield}
          href="/rules"
          buttonText="Manage Rules"
        />
        <ActionCard
          title="Alert Center"
          description="Monitor and investigate triggered alerts in real-time. Review high-risk transactions and patterns."
          icon={AlertTriangle}
          href="/alerts"
          buttonText="View Alerts"
          variant="secondary"
        />
        <ActionCard
          title="Control Panel"
          description="Execute system-wide commands, export configurations, and perform administrative operations."
          icon={Settings}
          href="/control"
          buttonText="Access Controls"
          variant="outline"
        />
      </div>

      {/* Recent Rules Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Rules</CardTitle>
              <CardDescription>
                Latest configured rules and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-muted animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : rules.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No rules configured</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get started by creating your first AML rule
                  </p>
                  <div className="mt-6">
                    <Link to="/rules">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Rule
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.slice(0, 5).map((rule) => (
                    <div key={rule.ruleId} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{rule.ruleId}</p>
                          <p className="text-sm text-muted-foreground">
                            {rule.aggregateFunctionType} • {rule.windowMinutes}min • {rule.limitOperatorType} {rule.limit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={rule.ruleState} />
                        <Badge variant="outline">{rule.groupingKeyNames.length} keys</Badge>
                      </div>
                    </div>
                  ))}
                  
                  {rules.length > 5 && (
                    <Separator />
                  )}
                  {rules.length > 5 && (
                    <div className="text-center">
                      <Link to="/rules">
                        <Button variant="outline">
                          View All {rules.length} Rules
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Engine Status</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monitoring</span>
                <Badge variant="secondary">24/7 Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm text-muted-foreground">99.9%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Processing Rate</span>
                <span className="text-sm font-medium">1.2k/min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Alert Rate</span>
                <span className="text-sm font-medium">0.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Response</span>
                <span className="text-sm font-medium">45ms</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Index;
