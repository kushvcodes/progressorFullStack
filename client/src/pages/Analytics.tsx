
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Navbar from '@/components/layout/Navbar';
import Particles from '@/components/animations/Particles';
import Footer from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, Calendar, ChevronLeft, ChevronRight, Trophy, Zap, Brain, Target, Clock, CheckCircle2, LineChart as LineChartIcon2 } from 'lucide-react';
import { MetricType } from '@/types/task';
import { cn } from '@/lib/utils';

// Sample data
const productivityData = [
  { day: 'Mon', score: 65, focusHours: 3.5, tasksCompleted: 8 },
  { day: 'Tue', score: 59, focusHours: 2.8, tasksCompleted: 6 },
  { day: 'Wed', score: 80, focusHours: 5.2, tasksCompleted: 12 },
  { day: 'Thu', score: 81, focusHours: 5.0, tasksCompleted: 10 },
  { day: 'Fri', score: 56, focusHours: 3.0, tasksCompleted: 5 },
  { day: 'Sat', score: 55, focusHours: 2.5, tasksCompleted: 4 },
  { day: 'Sun', score: 40, focusHours: 1.8, tasksCompleted: 3 },
];

const taskCompletionData = [
  { name: 'Completed', value: 12, color: '#4ade80' },
  { name: 'In Progress', value: 8, color: '#60a5fa' },
  { name: 'Pending', value: 5, color: '#f87171' },
];

const timeSpentData = [
  { category: 'Development', hours: 12 },
  { category: 'Meetings', hours: 8 },
  { category: 'Research', hours: 5 },
  { category: 'Planning', hours: 4 },
  { category: 'Documentation', hours: 3 },
];

const productivityFactors = [
  { subject: 'Focus', A: 85, fullMark: 100 },
  { subject: 'Consistency', A: 72, fullMark: 100 },
  { subject: 'Task Completion', A: 90, fullMark: 100 },
  { subject: 'Depth of Work', A: 78, fullMark: 100 },
  { subject: 'Efficiency', A: 65, fullMark: 100 },
  { subject: 'Time Management', A: 70, fullMark: 100 },
];

const Analytics = () => {
  const [currentPeriod, setCurrentPeriod] = useState('This Week');

  const handlePrevPeriod = () => {
    setCurrentPeriod('Last Week');
  };

  const handleNextPeriod = () => {
    setCurrentPeriod('This Week');
  };
  
  // Calculate productivity score
  const calculateAverageScore = () => {
    const totalScore = productivityData.reduce((acc, day) => acc + day.score, 0);
    return Math.round(totalScore / productivityData.length);
  };
  
  const averageScore = calculateAverageScore();
  
  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };
  
  // Calculate score change
  const scoreChange = 7; // Example value, could be calculated based on previous period

  return (
    <div className="min-h-screen overflow-hidden animated-gradient-bg flex flex-col">
      <Particles quantity={40} staticity={30} ease={60} colorIntensity={1.0} particleSize={0.6} moveSpeed={0.8} />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 md:pt-28 pb-16 md:px-6 relative z-10 page-transition flex-grow">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">Analytics Dashboard</h1>
          <p className="text-muted-foreground drop-shadow-md">Track your productivity metrics and get insights into your workflow.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Tasks Completed</h3>
            <div className="text-3xl font-bold">12</div>
            <div className="text-xs text-green-400 mt-1">↑ 25% from last week</div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Productivity Score</h3>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <div className="text-xs text-green-400 mt-1">↑ {scoreChange}% from last week</div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Focus Time</h3>
            <div className="text-3xl font-bold">17h 24m</div>
            <div className="text-xs text-red-400 mt-1">↓ 5% from last week</div>
          </GlassCard>
        </div>
        
        {/* Detailed Productivity Score Card */}
        <GlassCard className="p-6 mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">Productivity Score Breakdown</h2>
              <p className="text-sm text-muted-foreground">Understanding your performance metrics</p>
            </div>
            <div className={cn("flex items-center gap-2", getScoreColor(averageScore))}>
              <Trophy size={20} />
              <span className="text-xl font-bold">{averageScore}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b border-border pb-2">Score Components</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-green-400/20 text-green-400">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-xs">Task Completion</span>
                  </div>
                  <span className="text-xs font-medium">90%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-blue-400/20 text-blue-400">
                      <Clock size={14} />
                    </div>
                    <span className="text-xs">Focus Time</span>
                  </div>
                  <span className="text-xs font-medium">78%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-purple-400/20 text-purple-400">
                      <Brain size={14} />
                    </div>
                    <span className="text-xs">Deep Work</span>
                  </div>
                  <span className="text-xs font-medium">65%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-amber-400/20 text-amber-400">
                      <Target size={14} />
                    </div>
                    <span className="text-xs">Goal Achievement</span>
                  </div>
                  <span className="text-xs font-medium">72%</span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 h-64">
              <h3 className="text-sm font-medium border-b border-border pb-2 mb-2">Productivity Factors</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={productivityFactors}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" stroke="#888" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Productivity" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#333' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-sm font-medium mb-2">Productivity Insights</h3>
            <div className="glass-panel text-sm p-3 text-muted-foreground">
              <p className="mb-2">
                Your productivity score is most influenced by your high task completion rate (90%) and focus time (78%).
              </p>
              <p>
                Consider improving your efficiency (65%) by grouping similar tasks together and limiting context switching.
              </p>
            </div>
          </div>
        </GlassCard>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <GlassCard className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Productivity Trends</h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={handlePrevPeriod}>
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm">{currentPeriod}</span>
                <Button variant="ghost" size="icon" onClick={handleNextPeriod} disabled={currentPeriod === 'This Week'}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="line">
              <TabsList className="mb-4">
                <TabsTrigger value="line" className="text-xs">
                  <LineChartIcon size={14} className="mr-1" />
                  Line
                </TabsTrigger>
                <TabsTrigger value="bar" className="text-xs">
                  <BarChart2 size={14} className="mr-1" />
                  Bar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="line" className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#222', borderColor: '#333' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="focusHours" stroke="#4ade80" strokeWidth={1.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="tasksCompleted" stroke="#f472b6" strokeWidth={1.5} activeDot={{ r: 6 }} />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="bar" className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivityData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#222', borderColor: '#333' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="score" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </GlassCard>
          
          <GlassCard className="p-6">
            <h2 className="text-lg font-medium mb-6">Task Distribution</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskCompletionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {taskCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#222', borderColor: '#333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
        
        <GlassCard className="p-6 mb-8">
          <h2 className="text-lg font-medium mb-6">Time Spent by Category</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeSpentData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="category" type="category" stroke="#888" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', borderColor: '#333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="hours" fill="#9333ea" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analytics;
