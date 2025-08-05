import { useState } from "react";
import { Rule } from "@/types/rule";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, Filter } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface RulesTableProps {
  rules: Rule[];
  onEdit: (rule: Rule) => void;
  onDelete: (ruleId: string) => void;
  isLoading?: boolean;
}

const RulesTable = ({ rules, onEdit, onDelete, isLoading }: RulesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredRules = rules.filter((rule) => {
    const matchesSearch = rule.ruleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.aggregateFieldName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || rule.ruleState === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rules Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading rules...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Rules Management
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rules by ID or field name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSE">Paused</option>
            <option value="DELETE">Delete</option>
            <option value="CONTROL">Control</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredRules.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== "all" ? "No rules match your filters" : "No rules found"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aggregate Field</TableHead>
                  <TableHead>Function</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Window (min)</TableHead>
                  <TableHead>Grouping Keys</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.ruleId}>
                    <TableCell className="font-medium">{rule.ruleId}</TableCell>
                    <TableCell>
                      <StatusBadge status={rule.ruleState} />
                    </TableCell>
                    <TableCell>{rule.aggregateFieldName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.aggregateFunctionType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.limitOperatorType}</Badge>
                    </TableCell>
                    <TableCell>{rule.limit.toLocaleString()}</TableCell>
                    <TableCell>{rule.windowMinutes}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.groupingKeyNames.slice(0, 2).map((key) => (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}
                          </Badge>
                        ))}
                        {rule.groupingKeyNames.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{rule.groupingKeyNames.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(rule.ruleId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RulesTable;