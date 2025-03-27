
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Zap, CheckCircle2, BrainCircuit, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricType } from '@/types/task';

// Sample productivity metrics
const PRODUCTIVITY_METRICS: MetricType[] = [
  {
    name: 'Focus Time',
    value: '4.2 hrs',
    change: 15,
    icon: Zap
  }, 
  {
    name: 'Tasks Completed',
    value: 12,
    change: 8,
    icon: CheckCircle2
  }, 
  {
    name: 'Efficiency Score',
    value: '86%',
    change: 4,
    icon: BrainCircuit
  }, 
  {
    name: 'Deep Work Sessions',
    value: 5,
    change: -2,
    icon: LineChart
  }
];

interface MetricCardProps {
  metric: MetricType;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const { name, value, change, icon: Icon } = metric;
  const isPositive = change >= 0;
  
  return (
    <div className="glass-panel p-4 rounded-xl">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs text-muted-foreground mb-1">{name}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <Icon size={18} />
        </div>
      </div>
      <div className={cn("text-xs mt-2 flex items-center", isPositive ? "text-green-400" : "text-red-400")}>
        <span className="mr-1">{isPositive ? '+' : ''}{change}%</span>
        <span className="text-muted-foreground">vs last week</span>
      </div>
    </div>
  );
};

export const ProductivityAnalytics: React.FC = () => {
  return (
    <GlassCard>
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">Productivity Insights</h2>
        <p className="text-sm text-muted-foreground">Last 7 days performance</p>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRODUCTIVITY_METRICS.map(metric => (
          <MetricCard key={metric.name} metric={metric} />
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-medium mb-2">AI Recommendations</h3>
        <div className="glass-panel text-sm p-3 text-muted-foreground">
          <p className="mb-2">
            Based on your activity patterns, consider scheduling deep work sessions 
            in the morning when your focus is highest.
          </p>
          <p>
            Your task completion rate has improved by 8% this week. Great progress!
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
