import { useState, useEffect } from "react";
import { Rule, RuleFormData } from "@/types/rule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RuleFormProps {
  rule?: Rule | null;
  onSubmit: (data: RuleFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RuleForm = ({ rule, onSubmit, onCancel, isLoading }: RuleFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RuleFormData>({
    ruleState: 'ACTIVE',
    groupingKeyNames: [''],
    unique: [''],
    aggregateFieldName: '',
    aggregateFunctionType: 'SUM',
    limitOperatorType: '>',
    limit: 0,
    windowMinutes: 60,
  });

  const [newGroupingKey, setNewGroupingKey] = useState('');
  const [newUniqueKey, setNewUniqueKey] = useState('');

  useEffect(() => {
    if (rule) {
      setFormData({
        ruleId: rule.ruleId,
        ruleState: rule.ruleState,
        groupingKeyNames: rule.groupingKeyNames,
        unique: rule.unique,
        aggregateFieldName: rule.aggregateFieldName,
        aggregateFunctionType: rule.aggregateFunctionType,
        limitOperatorType: rule.limitOperatorType,
        limit: rule.limit,
        windowMinutes: rule.windowMinutes,
        controlType: rule.controlType,
      });
    }
  }, [rule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.aggregateFieldName.trim()) {
      toast({
        title: "Validation Error",
        description: "Aggregate field name is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.groupingKeyNames.filter(key => key.trim()).length === 0) {
      toast({
        title: "Validation Error", 
        description: "At least one grouping key is required",
        variant: "destructive",
      });
      return;
    }

    const cleanedData = {
      ...formData,
      groupingKeyNames: formData.groupingKeyNames.filter(key => key.trim()),
      unique: formData.unique.filter(key => key.trim()),
    };

    onSubmit(cleanedData);
  };

  const addGroupingKey = () => {
    if (newGroupingKey.trim()) {
      setFormData(prev => ({
        ...prev,
        groupingKeyNames: [...prev.groupingKeyNames, newGroupingKey.trim()]
      }));
      setNewGroupingKey('');
    }
  };

  const removeGroupingKey = (index: number) => {
    setFormData(prev => ({
      ...prev,
      groupingKeyNames: prev.groupingKeyNames.filter((_, i) => i !== index)
    }));
  };

  const addUniqueKey = () => {
    if (newUniqueKey.trim()) {
      setFormData(prev => ({
        ...prev,
        unique: [...prev.unique, newUniqueKey.trim()]
      }));
      setNewUniqueKey('');
    }
  };

  const removeUniqueKey = (index: number) => {
    setFormData(prev => ({
      ...prev,
      unique: prev.unique.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{rule ? 'Edit Rule' : 'Create New Rule'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruleId">Rule ID</Label>
              <Input
                id="ruleId"
                value={formData.ruleId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ruleId: e.target.value }))}
                placeholder="Enter rule ID"
                disabled={!!rule}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruleState">Rule State</Label>
              <Select
                value={formData.ruleState}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, ruleState: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSE">Pause</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.ruleState === 'CONTROL' && (
            <div className="space-y-2">
              <Label htmlFor="controlType">Control Type</Label>
              <Select
                value={formData.controlType || ''}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, controlType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select control type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DELETE_RULES_ALL">Delete All Rules</SelectItem>
                  <SelectItem value="EXPORT_RULES_CURRENT">Export Current Rules</SelectItem>
                  <SelectItem value="DELETE_RULE_BY_ID">Delete Rule by ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="aggregateFieldName">Aggregate Field Name</Label>
            <Input
              id="aggregateFieldName"
              value={formData.aggregateFieldName}
              onChange={(e) => setFormData(prev => ({ ...prev, aggregateFieldName: e.target.value }))}
              placeholder="e.g., transaction_amount"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aggregateFunctionType">Function Type</Label>
              <Select
                value={formData.aggregateFunctionType}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, aggregateFunctionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUM">SUM</SelectItem>
                  <SelectItem value="AVG">AVG</SelectItem>
                  <SelectItem value="MIN">MIN</SelectItem>
                  <SelectItem value="MAX">MAX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limitOperatorType">Operator</Label>
              <Select
                value={formData.limitOperatorType}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, limitOperatorType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="=">=</SelectItem>
                  <SelectItem value="!=">!=</SelectItem>
                  <SelectItem value=">">{'>'}</SelectItem>
                  <SelectItem value="<">{'<'}</SelectItem>
                  <SelectItem value="<=">{'<='}</SelectItem>
                  <SelectItem value=">=">{'>='}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Limit</Label>
              <Input
                id="limit"
                type="number"
                value={formData.limit}
                onChange={(e) => setFormData(prev => ({ ...prev, limit: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="windowMinutes">Window (Minutes)</Label>
            <Input
              id="windowMinutes"
              type="number"
              value={formData.windowMinutes}
              onChange={(e) => setFormData(prev => ({ ...prev, windowMinutes: parseInt(e.target.value) || 0 }))}
              placeholder="60"
              required
            />
          </div>

          {/* Grouping Keys */}
          <div className="space-y-2">
            <Label>Grouping Key Names</Label>
            <div className="flex gap-2">
              <Input
                value={newGroupingKey}
                onChange={(e) => setNewGroupingKey(e.target.value)}
                placeholder="Add grouping key"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGroupingKey())}
              />
              <Button type="button" onClick={addGroupingKey} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.groupingKeyNames.map((key, index) => (
                key.trim() && (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {key}
                    <button
                      type="button"
                      onClick={() => removeGroupingKey(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              ))}
            </div>
          </div>

          {/* Unique Keys */}
          <div className="space-y-2">
            <Label>Unique Keys</Label>
            <div className="flex gap-2">
              <Input
                value={newUniqueKey}
                onChange={(e) => setNewUniqueKey(e.target.value)}
                placeholder="Add unique key"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUniqueKey())}
              />
              <Button type="button" onClick={addUniqueKey} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.unique.map((key, index) => (
                key.trim() && (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {key}
                    <button
                      type="button"
                      onClick={() => removeUniqueKey(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : rule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RuleForm;