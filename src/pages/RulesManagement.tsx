import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Rule, RuleFormData } from "@/types/rule";
import { getRules, createRule, updateRule, deleteRule } from "@/services/api";
import RulesTable from "@/components/RulesTable";
import RuleForm from "@/components/RuleForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Shield, Download, Search, Filter, Activity, Clock, Pause } from "lucide-react";
import { Input } from "@/components/ui/input";
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

const RulesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: rules = [] as Rule[], isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: getRules,
  });

  const createMutation = useMutation({
    mutationFn: createRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      setIsFormOpen(false);
      setEditingRule(null);
      toast({
        title: "Success",
        description: "Rule created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create rule",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ ruleId, data }: { ruleId: string; data: RuleFormData }) =>
      updateRule(ruleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      setIsFormOpen(false);
      setEditingRule(null);
      toast({
        title: "Success",
        description: "Rule updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update rule",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      setDeleteConfirmOpen(false);
      setRuleToDelete(null);
      toast({
        title: "Success",
        description: "Rule deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete rule",
        variant: "destructive",
      });
    },
  });

  const handleCreateRule = () => {
    setEditingRule(null);
    setIsFormOpen(true);
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRuleToDelete(ruleId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (ruleToDelete) {
      deleteMutation.mutate(ruleToDelete);
    }
  };

  const handleSubmit = (data: RuleFormData) => {
    if (editingRule) {
      updateMutation.mutate({ ruleId: editingRule.ruleId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleExportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aml-rules-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Rules exported successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rules Management</h1>
          <p className="text-muted-foreground">
            Create and manage AML detection rules
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportRules}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateRule}>
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rules.filter(r => r.ruleState === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently monitoring
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused Rules</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {rules.filter(r => r.ruleState === 'PAUSE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Temporarily disabled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Window</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.length > 0 ? Math.round(rules.reduce((acc, rule) => acc + rule.windowMinutes, 0) / rules.length) : 0}m
            </div>
            <p className="text-xs text-muted-foreground">
              Monitoring period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {isFormOpen && (
        <RuleForm
          rule={editingRule}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingRule(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Rules Table */}
      <RulesTable
        rules={rules}
        onEdit={handleEditRule}
        onDelete={handleDeleteRule}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RulesManagement;