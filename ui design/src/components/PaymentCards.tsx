import { CreditCard, Plus } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export function PaymentCards() {
  const cards = [
    {
      id: 1,
      name: 'Visa Platinum',
      last4: '4532',
      type: 'visa',
      color: 'from-slate-700 to-slate-900',
    },
    {
      id: 2,
      name: 'Mastercard Gold',
      last4: '8765',
      type: 'mastercard',
      color: 'from-amber-500 to-orange-600',
    },
  ];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">My Cards</h3>
        <Button variant="ghost" size="sm" className="text-indigo-600">
          <Plus className="h-4 w-4 mr-1" />
          Add Card
        </Button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`min-w-[280px] bg-gradient-to-br ${card.color} text-white p-5 border-0`}
          >
            <div className="flex justify-between items-start mb-8">
              <CreditCard className="h-8 w-8" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded">{card.type.toUpperCase()}</span>
            </div>
            
            <div className="space-y-1 mb-4">
              <div className="flex gap-2">
                <span>••••</span>
                <span>••••</span>
                <span>••••</span>
                <span>{card.last4}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/70">Card Holder</p>
                <p className="text-sm">John Doe</p>
              </div>
              <div>
                <p className="text-xs text-white/70">Expires</p>
                <p className="text-sm">12/26</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
