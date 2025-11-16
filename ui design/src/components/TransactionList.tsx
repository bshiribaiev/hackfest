import { Coffee, BookOpen, Utensils, Train, Users, ArrowDownLeft } from 'lucide-react';
import { Card } from './ui/card';

export function TransactionList() {
  const transactions = [
    {
      id: 1,
      name: 'Student Cafe',
      location: 'West Campus',
      date: 'Today, 2:30 PM',
      amount: -8.50,
      icon: Coffee,
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      type: 'campus'
    },
    {
      id: 2,
      name: 'MTA Subway',
      location: 'Times Square',
      date: 'Today, 9:00 AM',
      amount: -2.90,
      icon: Train,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      type: 'transit'
    },
    {
      id: 3,
      name: 'Dining Hall',
      location: 'East Campus',
      date: 'Yesterday, 7:45 PM',
      amount: -12.50,
      icon: Utensils,
      color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      type: 'campus'
    },
    {
      id: 4,
      name: 'Campus Bookstore',
      location: 'Main Building',
      date: 'Nov 13, 2025',
      amount: -45.99,
      icon: BookOpen,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      type: 'campus'
    },
    {
      id: 5,
      name: 'Split from Sarah',
      location: 'Lunch payment',
      date: 'Nov 13, 2025',
      amount: 7.50,
      icon: ArrowDownLeft,
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      type: 'transfer'
    },
  ];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg dark:text-white">Recent Transactions</h3>
        <button className="text-sm text-indigo-600 dark:text-indigo-400">See All</button>
      </div>
      
      <Card className="divide-y dark:bg-slate-800 dark:border-slate-700 dark:divide-slate-700">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-3 p-4">
            <div className={`p-2 rounded-lg ${transaction.color}`}>
              <transaction.icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm dark:text-white">{transaction.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{transaction.location} · {transaction.date}</p>
            </div>
            
            <p className={`${transaction.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
}
