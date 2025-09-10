/**
 * Agent Status Component
 * Displays real-time status and activity of MeTTa agents
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp,
  Brain,
  Shield,
  DollarSign,
  Eye
} from 'lucide-react';

interface AgentMetrics {
  agentId: string;
  name: string;
  status: 'active' | 'idle' | 'error' | 'offline';
  totalDecisions: number;
  averageConfidence: number;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  lastActive: number;
}

interface AgentActivity {
  agentId: string;
  timestamp: number;
  decision: string;
  confidence: number;
  context: any;
}

const AgentStatus: React.FC = () => {
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics[]>([]);
  const [recentActivity, setRecentActivity] = useState<AgentActivity[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production, this would come from the AgentManager
    const mockMetrics: AgentMetrics[] = [
      {
        agentId: 'verification-agent',
        name: 'Verification Agent',
        status: 'active',
        totalDecisions: 1247,
        averageConfidence: 0.87,
        averageResponseTime: 2.3,
        successRate: 0.94,
        errorRate: 0.02,
        lastActive: Date.now() - 45000
      },
      {
        agentId: 'transfer-agent',
        name: 'Transfer Agent',
        status: 'active',
        totalDecisions: 892,
        averageConfidence: 0.91,
        averageResponseTime: 1.8,
        successRate: 0.96,
        errorRate: 0.01,
        lastActive: Date.now() - 12000
      },
      {
        agentId: 'fraud-agent',
        name: 'Fraud Detection Agent',
        status: 'active',
        totalDecisions: 2156,
        averageConfidence: 0.83,
        averageResponseTime: 3.1,
        successRate: 0.89,
        errorRate: 0.03,
        lastActive: Date.now() - 8000
      },
      {
        agentId: 'value-agent',
        name: 'Value Distribution Agent',
        status: 'idle',
        totalDecisions: 634,
        averageConfidence: 0.95,
        averageResponseTime: 1.2,
        successRate: 0.98,
        errorRate: 0.005,
        lastActive: Date.now() - 120000
      }
    ];

    const mockActivity: AgentActivity[] = [
      {
        agentId: 'fraud-agent',
        timestamp: Date.now() - 30000,
        decision: 'risk_assessment_low',
        confidence: 0.89,
        context: { userId: '0x1234...', activityType: 'purchase' }
      },
      {
        agentId: 'verification-agent',
        timestamp: Date.now() - 45000,
        decision: 'approve',
        confidence: 0.92,
        context: { assetId: 1234, category: 'phigital' }
      },
      {
        agentId: 'transfer-agent',
        timestamp: Date.now() - 60000,
        decision: 'authorize',
        confidence: 0.94,
        context: { tokenId: 5678, riskScore: 0.15 }
      }
    ];

    setAgentMetrics(mockMetrics);
    setRecentActivity(mockActivity);
    setIsLoading(false);
  }, []);

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'verification-agent': return <Eye className="h-5 w-5" />;
      case 'transfer-agent': return <Activity className="h-5 w-5" />;
      case 'fraud-agent': return <Shield className="h-5 w-5" />;
      case 'value-agent': return <DollarSign className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
      idle: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      error: { variant: 'destructive', icon: <AlertCircle className="h-3 w-3" /> },
      offline: { variant: 'outline', icon: <AlertCircle className="h-3 w-3" /> }
    };

    const config = variants[status] || variants.offline;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  const filteredActivity = selectedAgent === 'all' 
    ? recentActivity 
    : recentActivity.filter(activity => activity.agentId === selectedAgent);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            MeTTa Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentMetrics.map((agent) => (
              <Card key={agent.agentId} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getAgentIcon(agent.agentId)}
                    <span className="font-medium text-sm">{agent.name}</span>
                  </div>
                  {getStatusBadge(agent.status)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Decisions:</span>
                    <span className="font-medium">{agent.totalDecisions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-medium">{(agent.averageConfidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time:</span>
                    <span className="font-medium">{agent.averageResponseTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Success Rate:</span>
                    <span className="font-medium">{(agent.successRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Active:</span>
                    <span className="font-medium text-xs">{formatTimeAgo(agent.lastActive)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Agent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedAgent} onValueChange={setSelectedAgent}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Agents</TabsTrigger>
              <TabsTrigger value="verification-agent">Verification</TabsTrigger>
              <TabsTrigger value="transfer-agent">Transfer</TabsTrigger>
              <TabsTrigger value="fraud-agent">Fraud</TabsTrigger>
              <TabsTrigger value="value-agent">Value</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedAgent} className="mt-4">
              <div className="space-y-3">
                {filteredActivity.length > 0 ? (
                  filteredActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getAgentIcon(activity.agentId)}
                        <div>
                          <div className="font-medium">
                            {agentMetrics.find(a => a.agentId === activity.agentId)?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Decision: <span className="font-medium">{activity.decision}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {(activity.confidence * 100).toFixed(1)}% confidence
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity for selected agent(s)
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentStatus;
