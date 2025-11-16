import { Train, Plus, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

export function MTACard() {
  const ridesRemaining = 8;
  const totalRides = 20;
  const progress = (ridesRemaining / totalRides) * 100;
  
  return (
    <Card className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white border-0">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Train className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm">MTA MetroCard</p>
            <p className="text-xs text-blue-100">Unlimited Weekly Pass</p>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-white hover:bg-white/20 h-8"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Rides Remaining</span>
          <span>{ridesRemaining}/{totalRides}</span>
        </div>
        <Progress value={progress} className="h-2 bg-white/30" />
        <div className="flex items-center justify-between text-xs text-blue-100">
          <span>Expires: Nov 22, 2025</span>
          <button className="flex items-center gap-1 hover:text-white">
            Details <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </Card>
  );
}
