import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendControlCommand } from "@/services/api";
import { ControlCommand } from "@/types/rule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Settings, Trash2, Download, Target } from "lucide-react";
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
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Control Panel</h1>
          <p className="text-muted-foreground">System-wide control commands and operations</p>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-800">Warning: System Control Commands</p>
              <p className="text-sm text-orange-700">
                These commands affect the entire system. Use with caution and ensure you have proper authorization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {controlCommands.map((command) => (
          <Card key={command.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${command.bgColor}`}>
                  <command.icon className={`h-5 w-5 ${command.color}`} />
                </div>
                <span className="text-lg">{command.title}</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{command.description}</p>
              
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
                {controlMutation.isPending ? 'Executing...' : `Execute ${command.title}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Control Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Control Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Control action history will appear here</p>
            <p className="text-sm">Recent system commands and their execution status</p>
          </div>
        </CardContent>
      </Card>

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