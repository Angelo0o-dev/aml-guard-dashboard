import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendControlCommand } from "@/services/api";
import { ControlCommand } from "@/types/rule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Settings, Trash2, Download, Target, Shield, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ControlPanel = () => {
  const { toast } = useToast();
  const [ruleIdToDelete, setRuleIdToDelete] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
  });

  const controlMutation = useMutation({
    mutationFn: sendControlCommand,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Control command executed successfully",
      });
      setRuleIdToDelete("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to execute control command",
        variant: "destructive",
      });
    },
  });

  const executeControlCommand = (controlType: 'DELETE_RULES_ALL' | 'EXPORT_RULES_CURRENT' | 'DELETE_RULE_BY_ID', ruleId?: string) => {
    const controlData: ControlCommand = {
      ruleId: ruleId || `CONTROL-${Date.now()}`,
      ruleState: 'CONTROL' as const,
      controlType,
      groupingKeyNames: ['system'],
      unique: ['control'],
      aggregateFieldName: 'control',
      aggregateFunctionType: 'SUM' as const,
      limitOperatorType: '>' as const,
      limit: 0,
      windowMinutes: 1,
    };

    controlMutation.mutate(controlData);
  };

  const handleDeleteAllRules = () => {
    setConfirmDialog({
      open: true,
      title: "Delete All Rules",
      description: "This will permanently delete ALL rules in the system. This action cannot be undone. Are you absolutely sure?",
      action: () => executeControlCommand('DELETE_RULES_ALL'),
    });
  };

  const handleExportRules = () => {
    executeControlCommand('EXPORT_RULES_CURRENT');
  };

  const handleDeleteRuleById = () => {
    if (!ruleIdToDelete.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a rule ID to delete",
        variant: "destructive",
      });
      return;
    }

    setConfirmDialog({
      open: true,
      title: "Delete Specific Rule",
      description: `This will permanently delete rule "${ruleIdToDelete}". This action cannot be undone. Are you sure?`,
      action: () => executeControlCommand('DELETE_RULE_BY_ID', ruleIdToDelete),
    });
  };

  const controlCommands = [
    {
      id: 'export',
      title: 'Export Current Rules',
      description: 'Export all current rules to a file for backup or analysis',
      icon: Download,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: handleExportRules,
      dangerous: false,
    },
    {
      id: 'deleteById',
      title: 'Delete Rule by ID',
      description: 'Delete a specific rule by its unique identifier',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: handleDeleteRuleById,
      dangerous: true,
    },
    {
      id: 'deleteAll',
      title: 'Delete All Rules',
      description: 'Permanently remove all rules from the system',
      icon: Trash2,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      action: handleDeleteAllRules,
      dangerous: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Control Panel</h1>
        <p className="text-muted-foreground">
          Execute system-wide commands and administrative operations
        </p>
      </div>

      {/* Warning Alert */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            System Control Commands
          </CardTitle>
          <CardDescription>
            These commands affect the entire system. Ensure you have proper authorization before proceeding.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Control Commands */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {controlCommands.map((command) => (
          <Card key={command.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <command.icon className="h-5 w-5" />
                </div>
                {command.title}
              </CardTitle>
              <CardDescription>{command.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {command.id === 'deleteById' && (
                <div className="space-y-2">
                  <Label htmlFor="ruleId">Rule ID to Delete</Label>
                  <Input
                    id="ruleId"
                    value={ruleIdToDelete}
                    onChange={(e) => setRuleIdToDelete(e.target.value)}
                    placeholder="Enter rule ID (e.g., RULE-001)"
                  />
                </div>
              )}
              
              <Button
                onClick={command.action}
                disabled={controlMutation.isPending}
                variant={command.dangerous ? "destructive" : "default"}
                className="w-full"
              >
                {controlMutation.isPending ? 'Executing...' : command.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Actions</CardTitle>
            <CardDescription>Control command execution history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="mx-auto h-12 w-12 opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No recent actions</h3>
              <p className="mt-2 text-sm">
                Control action history will appear here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Control Access</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Authorized
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Status</span>
              <Badge variant="secondary">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Backup</span>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => 
        setConfirmDialog(prev => ({ ...prev, open }))
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {confirmDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmDialog.action();
                setConfirmDialog(prev => ({ ...prev, open: false }));
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ControlPanel;