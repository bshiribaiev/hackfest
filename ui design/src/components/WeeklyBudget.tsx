interface BudgetCategory {
  name: string;
  icon: string;
  color: string;
  limit: number;
  spent: number;
}

export function WeeklyBudget() {
  const budgetCategories: BudgetCategory[] = [
    {
      name: 'Food',
      icon: '🍕',
      color: 'rgb(239, 68, 68)', // red
      limit: 100,
      spent: 72.50,
    },
    {
      name: 'Shopping',
      icon: '🛍️',
      color: 'rgb(139, 92, 246)', // purple
      limit: 80,
      spent: 45.00,
    },
    {
      name: 'Entertainment',
      icon: '🎮',
      color: 'rgb(34, 197, 94)', // green
      limit: 60,
      spent: 38.00,
    },
  ];

  const CircularProgress = ({ 
    spent, 
    limit, 
    color, 
    icon 
  }: { 
    spent: number; 
    limit: number; 
    color: string; 
    icon: string;
  }) => {
    const percentage = (spent / limit) * 100;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl mb-1">{icon}</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    );
  };

  const totalLimit = budgetCategories.reduce((sum, cat) => sum + cat.limit, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalLeft = totalLimit - totalSpent;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Weekly Budget</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your spending this week
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
          <p className="font-bold text-green-600 dark:text-green-400">
            ${totalLeft.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {budgetCategories.map((category) => {
          const left = category.limit - category.spent;
          const percentage = (category.spent / category.limit) * 100;
          
          return (
            <div key={category.name} className="flex flex-col items-center">
              <CircularProgress
                spent={category.spent}
                limit={category.limit}
                color={category.color}
                icon={category.icon}
              />
              <div className="mt-3 text-center">
                <p className="font-semibold text-sm text-slate-900 dark:text-white">
                  {category.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ${category.spent.toFixed(2)} / ${category.limit}
                </p>
                <p 
                  className={`text-xs font-medium mt-1 ${
                    percentage > 90 
                      ? 'text-red-600 dark:text-red-400' 
                      : percentage > 75 
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  ${left.toFixed(2)} left
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Total Progress</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            ${totalSpent.toFixed(2)} / ${totalLimit}
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${(totalSpent / totalLimit) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
