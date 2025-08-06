import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Rule } from "@/types/rule";
import { apiService } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Plus
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

  const StatCard = ({ title, value, description, icon: Icon, gradient, trend }: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    gradient: string;
    trend?: string;
  }) => (
    <Card className="group hover:scale-105 transition-all duration-300 cursor-default interactive">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-xl ${gradient} group-hover:shadow-lg transition-all duration-300`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold gradient-text mb-1">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && <Badge variant="outline" className="text-xs mt-2">{trend}</Badge>}
      </CardContent>
    </Card>
  );

  const ActionCard = ({ title, description, icon: Icon, href, buttonText, variant = "default" }: {
    title: string;
    description: string;
    icon: any;
    href: string;
    buttonText: string;
    variant?: "default" | "outline";
  }) => (
    <Card className="group hover:scale-105 transition-all duration-300 interactive">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary/20 to-primary-glow/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <Link to={href}>
          <Button className="w-full group" variant={variant}>
            {buttonText}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-12 space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary-glow/20 mb-6">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-5xl font-bold gradient-text animate-scale-in">
          AML Rules Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Monitor and manage your Anti-Money Laundering rules with real-time insights, 
          advanced analytics, and intelligent controls
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rules"
          value={stats.totalRules}
          description="Rules configured in system"
          icon={Shield}
          gradient="bg-gradient-to-r from-primary to-primary-glow"
          trend="+12% this month"
        />
        <StatCard
          title="Active Rules"
          value={stats.activeRules}
          description="Currently monitoring transactions"
          icon={Activity}
          gradient="bg-gradient-to-r from-success to-success-glow"
          trend="Real-time"
        />
        <StatCard
          title="Paused Rules"
          value={stats.pausedRules}
          description="Temporarily disabled rules"
          icon={AlertTriangle}
          gradient="bg-gradient-to-r from-warning to-warning-glow"
          trend="Review pending"
        />
        <StatCard
          title="Avg Window"
          value={`${stats.avgWindow}m`}
          description="Average monitoring window"
          icon={TrendingUp}
          gradient="bg-gradient-to-r from-accent to-accent-glow"
          trend="Optimized"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          title="Rules Management"
          description="Create, edit, and configure AML detection rules. Set up thresholds, grouping keys, and monitoring windows for comprehensive transaction analysis."
          icon={Shield}
          href="/rules"
          buttonText="Manage Rules"
        />
        <ActionCard
          title="Alert Center"
          description="Monitor and investigate triggered alerts in real-time. Review high-risk transactions, analyze patterns, and take appropriate compliance actions."
          icon={AlertTriangle}
          href="/alerts"
          buttonText="View Alerts"
        />
        <ActionCard
          title="Control Panel"
          description="Execute system-wide commands, export configurations, and perform administrative operations with enterprise-grade security and audit trails."
          icon={Settings}
          href="/control"
          buttonText="Access Controls"
          variant="outline"
        />
      </div>

      {/* Recent Rules Activity */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-accent/20 to-accent-glow/20">
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
            Recent Rules Activity
          </CardTitle>
          <CardDescription>
            Latest configured rules and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-glass-primary/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-muted/20 to-muted/10 mb-4">
                <Zap className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No rules configured yet</h3>
              <p className="text-muted-foreground mb-6">Get started by creating your first AML rule</p>
              <Link to="/rules">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Rule
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.slice(0, 5).map((rule, index) => (
                <div 
                  key={rule.ruleId} 
                  className="flex items-center justify-between p-6 rounded-xl bg-glass-primary/40 hover:bg-glass-secondary/60 transition-all duration-300 group border border-border/30 hover:border-border/60"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary/20 to-primary-glow/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg group-hover:text-foreground transition-colors">{rule.ruleId}</p>
                      <p className="text-sm text-muted-foreground">
                        {rule.aggregateFunctionType} aggregation • {rule.windowMinutes}min window • {rule.limitOperatorType} {rule.limit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={rule.ruleState} />
                    <div className="text-right">
                      <p className="text-sm font-medium">{rule.groupingKeyNames.length} keys</p>
                      <p className="text-xs text-muted-foreground">Grouping fields</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {rules.length > 5 && (
                <div className="text-center pt-4">
                  <Link to="/rules">
                    <Button variant="outline">
                      View All {rules.length} Rules
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-glass-primary/40 to-glass-secondary/40 border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-success/20 to-success-glow/20">
              <Clock className="h-5 w-5 text-success" />
            </div>
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">Online</div>
              <p className="text-sm text-muted-foreground">AML Engine Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">24/7</div>
              <p className="text-sm text-muted-foreground">Monitoring Active</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">99.9%</div>
              <p className="text-sm text-muted-foreground">Uptime SLA</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
