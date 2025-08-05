import { Rule, CreateRuleRequest, ControlCommand } from '@/types/rule';

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = '/api';

// Mock data for demonstration
const mockRules: Rule[] = [
  {
    ruleId: "rule_001",
    ruleState: "ACTIVE",
    groupingKeyNames: ["customer_id", "account_type"],
    unique: ["transaction_id"],
    aggregateFieldName: "transaction_amount",
    aggregateFunctionType: "SUM",
    limitOperatorType: ">",
    limit: 10000,
    windowMinutes: 60
  },
  {
    ruleId: "rule_002", 
    ruleState: "PAUSE",
    groupingKeyNames: ["customer_id"],
    unique: ["transaction_id", "merchant_id"],
    aggregateFieldName: "transaction_count",
    aggregateFunctionType: "SUM",
    limitOperatorType: ">=",
    limit: 5,
    windowMinutes: 30
  },
  {
    ruleId: "rule_003",
    ruleState: "ACTIVE",
    groupingKeyNames: ["account_id", "country_code"],
    unique: ["transaction_id"],
    aggregateFieldName: "withdrawal_amount",
    aggregateFunctionType: "MAX",
    limitOperatorType: ">",
    limit: 50000,
    windowMinutes: 1440
  }
];

class ApiService {
  private useMockData = true; // Set to false when connecting to real backend

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // If using mock data, simulate API calls
    if (this.useMockData) {
      return this.handleMockRequest<T>(endpoint, options);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async handleMockRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    switch (endpoint) {
      case '/get-rules/':
        return mockRules as T;
      
      case '/create-rule-or-update/':
        if (options?.method === 'POST') {
          const newRule = JSON.parse(options.body as string);
          const ruleWithId = {
            ...newRule,
            ruleId: newRule.ruleId || `rule_${Date.now()}`
          };
          mockRules.push(ruleWithId);
          return ruleWithId as T;
        }
        if (options?.method === 'PUT') {
          const updatedRule = JSON.parse(options.body as string);
          const index = mockRules.findIndex(r => r.ruleId === updatedRule.ruleId);
          if (index >= 0) {
            mockRules[index] = updatedRule;
            return updatedRule as T;
          }
        }
        break;
      
      case '/delete-rule/':
        const { ruleId } = JSON.parse(options?.body as string);
        const index = mockRules.findIndex(r => r.ruleId === ruleId);
        if (index >= 0) {
          mockRules.splice(index, 1);
        }
        return {} as T;
      
      default:
        throw new Error(`Mock endpoint not implemented: ${endpoint}`);
    }
    
    return {} as T;
  }

  async getRules(): Promise<Rule[]> {
    return this.request<Rule[]>('/get-rules/');
  }

  async createOrUpdateRule(rule: CreateRuleRequest): Promise<Rule> {
    return this.request<Rule>('/create-rule-or-update/', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  }

  async updateRule(rule: Rule): Promise<Rule> {
    return this.request<Rule>('/create-rule-or-update/', {
      method: 'PUT',
      body: JSON.stringify(rule),
    });
  }

  async deleteRule(ruleId: string): Promise<void> {
    return this.request<void>(`/delete-rule/`, {
      method: 'DELETE',
      body: JSON.stringify({ ruleId }),
    });
  }

  async sendControlCommand(command: ControlCommand): Promise<void> {
    return this.request<void>('/create-rule-or-update/', {
      method: 'POST',
      body: JSON.stringify(command),
    });
  }
}

export const apiService = new ApiService();