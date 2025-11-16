import { useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
}

export function TopUpModal({ open, onClose }: TopUpModalProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');
  
  const quickAmounts = [20, 50, 100, 200];
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Top Up Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm dark:text-slate-300">Quick Amount</label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`p-3 rounded-lg border transition-colors ${
                    amount === quickAmount.toString()
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-500 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white'
                  }`}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm dark:text-slate-300">Custom Amount ($)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm dark:text-slate-300">Payment Method</label>
            <RadioGroup value={method} onValueChange={setMethod} className="space-y-2">
              <div className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${
                method === 'card' 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:border-indigo-500' 
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}>
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 flex-1 cursor-pointer dark:text-white">
                  <CreditCard className="h-4 w-4" />
                  <div>
                    <p className="text-sm">Debit/Credit Card</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Visa •••• 4532</p>
                  </div>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${
                method === 'bank' 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:border-indigo-500' 
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}>
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex items-center gap-2 flex-1 cursor-pointer dark:text-white">
                  <Wallet className="h-4 w-4" />
                  <div>
                    <p className="text-sm">Bank Account</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Chase ••7890</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
            disabled={!amount}
          >
            Add ${amount || '0.00'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
