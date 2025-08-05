import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Rule, RuleFormData, ControlCommand } from "@/types/rule";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import RulesTable from "@/components/RulesTable";
import RuleForm from "@/components/RuleForm";
import ControlPanel from "@/components/ControlPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("rules");

  // Fetch rules
  const { data: rules = [], isLoading: rulesLoading, error } = useQuery({
    queryKey: ['rules'],
    queryFn: apiService.getRules,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Create/Update rule mutation
  const createRuleMutation = useMutation({
    mutationFn: (data: RuleFormData) => {
      if (data.ruleId && selectedRule) {
        return apiService.updateRule({ ...data, ruleId: data.ruleId } as Rule);
      }
      return apiService.createOrUpdateRule(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast({
        title: "Success",
        description: selectedRule ? "Rule updated successfully" : "Rule created successfully",
      });
      setShowForm(false);
      setSelectedRule(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save rule",
        variant: "destructive",
      });
    },
  });

  // Delete rule mutation
  const deleteRuleMutation = useMutation({
    mutationFn: apiService.deleteRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast({
        title: "Success",
        description: "Rule deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete rule",
        variant: "destructive",
      });
    },
  });

  // Control command mutation
  const controlCommandMutation = useMutation({
    mutationFn: apiService.sendControlCommand,
    onSuccess: () => {
      toast({
        title: "Control Command Sent",
        description: "Command has been processed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Command Failed",
        description: error.message || "Failed to send control command",
        variant: "destructive",
      });
    },
  });

  const handleEditRule = (rule: Rule) => {
    setSelectedRule(rule);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleDeleteRule = (ruleId: string) => {
    if (window.confirm(`Are you sure you want to delete rule "${ruleId}"?`)) {
      deleteRuleMutation.mutate(ruleId);
    }
  };

  const handleCreateNew = () => {
    setSelectedRule(null);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleFormSubmit = (data: RuleFormData) => {
    createRuleMutation.mutate(data);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedRule(null);
    setActiveTab("rules");
  };

  const handleControlCommand = (command: ControlCommand) => {
    controlCommandMutation.mutate(command);
  };

  const handleExportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `aml-rules-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Complete",
      description: "Rules exported to JSON file",
    });
  };

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to the API. Using mock data for demo.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Rules Dashboard</h2>
            <p className="text-muted-foreground">Manage AML rules and system controls</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportRules}>
              <Download className="h-4 w-4 mr-2" />
              Export Rules
            </Button>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">Rules Management</TabsTrigger>
            <TabsTrigger value="form">
              {showForm ? (selectedRule ? 'Edit Rule' : 'Create Rule') : 'Rule Form'}
            </TabsTrigger>
            <TabsTrigger value="control">Control Panel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rules" className="space-y-6">
            <RulesTable
              rules={rules}
              onEdit={handleEditRule}
              onDelete={handleDeleteRule}
              isLoading={rulesLoading}
            />
          </TabsContent>
          
          <TabsContent value="form" className="space-y-6">
            {showForm ? (
              <RuleForm
                rule={selectedRule}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={createRuleMutation.isPending}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No rule selected for editing</p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Rule
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="control" className="space-y-6">
            <ControlPanel
              onSendCommand={handleControlCommand}
              isLoading={controlCommandMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;