import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Download, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ControlCommand } from "@/types/rule";

interface ControlPanelProps {
  onSendCommand: (command: ControlCommand) => void;
  isLoading?: boolean;
}

const ControlPanel = ({ onSendCommand, isLoading }: ControlPanelProps) => {
  const { toast } = useToast();
  const [controlType, setControlType] = useState<'DELETE_RULES_ALL' | 'EXPORT_RULES_CURRENT' | 'DELETE_RULE_BY_ID'>('EXPORT_RULES_CURRENT');
  const [targetRuleId, setTargetRuleId] = useState('');

  const handleSendCommand = () => {
    if (controlType === 'DELETE_RULE_BY_ID' && !targetRuleId.trim()) {
      toast({
        title: "Validation Error",
        description: "Rule ID is required for DELETE_RULE_BY_ID command",
        variant: "destructive",
      });
      return;
    }

    const command: ControlCommand = {
      ruleId: `control_${Date.now()}`,
      ruleState: 'CONTROL',
      controlType,
      // Required fields with dummy data for control commands
      groupingKeyNames: ['control'],
      unique: ['control'],
      aggregateFieldName: 'control',
      aggregateFunctionType: 'SUM',
      limitOperatorType: '>',
      limit: 0,
      windowMinutes: 1,
    };

    onSendCommand(command);
    
    // Clear target rule ID after sending
    if (controlType === 'DELETE_RULE_BY_ID') {
      setTargetRuleId('');
    }
  };

  const getCommandIcon = (type: string) => {
    switch (type) {
      case 'DELETE_RULES_ALL':
        return Trash2;
      case 'EXPORT_RULES_CURRENT':
        return Download;
      case 'DELETE_RULE_BY_ID':
        return Trash2;
      default:
        return Settings;
    }
  };

  const getCommandDescription = (type: string) => {
    switch (type) {
      case 'DELETE_RULES_ALL':
        return 'This will permanently delete all rules in the system';
      case 'EXPORT_RULES_CURRENT':
        return 'Export all current rules to JSON format';
      case 'DELETE_RULE_BY_ID':
        return 'Delete a specific rule by its ID';
      default:
        return '';
    }
  };

  const CommandIcon = getCommandIcon(controlType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="controlType">Control Command</Label>
          <Select
            value={controlType}
            onValueChange={(value: any) => setControlType(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPORT_RULES_CURRENT">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Current Rules
                </div>
              </SelectItem>
              <SelectItem value="DELETE_RULE_BY_ID">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Rule by ID
                </div>
              </SelectItem>
              <SelectItem value="DELETE_RULES_ALL">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete All Rules
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {controlType === 'DELETE_RULE_BY_ID' && (
          <div className="space-y-2">
            <Label htmlFor="targetRuleId">Target Rule ID</Label>
            <Input
              id="targetRuleId"
              value={targetRuleId}
              onChange={(e) => setTargetRuleId(e.target.value)}
              placeholder="Enter rule ID to delete"
              required
            />
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-primary">
          <div className="flex items-start gap-3">
            <CommandIcon className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Command Description</h4>
              <p className="text-sm text-muted-foreground">
                {getCommandDescription(controlType)}
              </p>
            </div>
          </div>
        </div>

        {controlType === 'DELETE_RULES_ALL' && (
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 text-destructive" />
              <div>
                <h4 className="font-medium text-destructive mb-1">Danger Zone</h4>
                <p className="text-sm text-destructive/80">
                  This action cannot be undone. All rules will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSendCommand}
            disabled={isLoading}
            variant={controlType === 'DELETE_RULES_ALL' ? 'destructive' : 'default'}
            className="min-w-[140px]"
          >
            {isLoading ? (
              'Sending...'
            ) : (
              <>
                <CommandIcon className="h-4 w-4 mr-2" />
                Send Command
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;