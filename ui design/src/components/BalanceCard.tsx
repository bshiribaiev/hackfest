import { Eye, EyeOff, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true);
  
  return (
    <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-800 text-white p-6 border-0">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-5 w-5 text-indigo-200" />
            <p className="text-indigo-200 text-sm">Campus Wallet</p>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl">
              {showBalance ? '$387.50' : '••••••'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <Badge className="bg-emerald-500 hover:bg-emerald-500">
          Active
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
        <div>
          <p className="text-indigo-200 text-xs mb-1">This Week Spent</p>
          <p className="text-lg">$127.50</p>
        </div>
        <div className="text-right">
          <p className="text-indigo-200 text-xs mb-1">Savings</p>
          <div className="flex items-center justify-end gap-1 text-emerald-300">
            <TrendingUp className="h-3 w-3" />
            <span className="text-lg">$89.20</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
