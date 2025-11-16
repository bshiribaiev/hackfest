import { Sparkles, TrendingDown, AlertCircle, Target, Lightbulb, MessageSquare } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

export function AIAssistant() {
  const insights = [
    {
      id: 1,
      title: 'Weekly Budget Alert',
      description: "You've spent $127.50 this week. That's 15% more than last week.",
      icon: AlertCircle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      id: 2,
      title: 'Smart Saving Tip',
      description: 'Making coffee at home 3x/week could save you $45/month.',
      icon: Lightbulb,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      id: 3,
      title: 'Spending Pattern',
      description: 'You spend most on weekdays between 12-2pm. Consider meal prep!',
      icon: TrendingDown,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
  ];

  const monthlyGoal = {
    target: 500,
    current: 387.50,
    progress: (387.50 / 500) * 100
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl">AI Financial Assistant</h2>
            <p className="text-sm text-purple-100">Your personal money coach</p>
          </div>
        </div>
        <p className="text-purple-100">
          I analyze your spending habits and provide personalized recommendations to help you save more.
        </p>
      </Card>

      {/* Monthly Goal */}
      <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="dark:text-white">Monthly Budget Goal</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Current Balance</span>
            <span className="dark:text-white">${monthlyGoal.current.toFixed(2)} / ${monthlyGoal.target}</span>
          </div>
          <Progress value={monthlyGoal.progress} className="h-3" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You're {monthlyGoal.progress > 75 ? 'on track' : 'slightly behind'} to meet your goal. 
            {monthlyGoal.progress > 75 ? ' Keep it up! 🎉' : ' Try saving $5 more per day. 💪'}
          </p>
        </div>
      </Card>

      {/* AI Insights */}
      <div>
        <h3 className="text-lg mb-4 dark:text-white">Personalized Insights</h3>
        <div className="space-y-3">
          {insights.map((insight) => (
            <Card key={insight.id} className="p-4 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex gap-3">
                <div className={`${insight.bgColor} p-2 rounded-lg h-fit`}>
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm mb-1 dark:text-white">{insight.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{insight.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Spending Breakdown */}
      <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
        <h3 className="mb-4 dark:text-white">This Week's Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400">Food & Dining</span>
              <span className="dark:text-white">$56.50 (44%)</span>
            </div>
            <Progress value={44} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400">Transportation</span>
              <span className="dark:text-white">$35.00 (27%)</span>
            </div>
            <Progress value={27} className="h-2 bg-slate-200 dark:bg-slate-700" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400">Books & Supplies</span>
              <span className="dark:text-white">$36.00 (29%)</span>
            </div>
            <Progress value={29} className="h-2 bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </Card>

      {/* Ask AI Button */}
      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 gap-2">
        <MessageSquare className="h-4 w-4" />
        Ask AI Assistant
      </Button>
    </div>
  );
}
