export interface Rule {
  ruleId: string;
  ruleState: 'ACTIVE' | 'PAUSE' | 'DELETE' | 'CONTROL';
  groupingKeyNames: string[];
  unique: string[];
  aggregateFieldName: string;
  aggregateFunctionType: 'SUM' | 'AVG' | 'MIN' | 'MAX';
  limitOperatorType: '=' | '!=' | '>' | '<' | '<=' | '>=';
  limit: number;
  windowMinutes: number;
  controlType?: 'DELETE_RULES_ALL' | 'EXPORT_RULES_CURRENT' | 'DELETE_RULE_BY_ID';
}

export interface CreateRuleRequest extends Omit<Rule, 'ruleId'> {
  ruleId?: string;
}

export interface ControlCommand {
  ruleId: string;
  ruleState: 'CONTROL';
  controlType: 'DELETE_RULES_ALL' | 'EXPORT_RULES_CURRENT' | 'DELETE_RULE_BY_ID';
  groupingKeyNames: string[];
  unique: string[];
  aggregateFieldName: string;
  aggregateFunctionType: 'SUM' | 'AVG' | 'MIN' | 'MAX';
  limitOperatorType: '=' | '!=' | '>' | '<' | '<=' | '>=';
  limit: number;
  windowMinutes: number;
}

export type RuleFormData = Omit<Rule, 'ruleId'> & {
  ruleId?: string;
};