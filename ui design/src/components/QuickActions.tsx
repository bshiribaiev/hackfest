import { Send, Plus, Users, Scan } from 'lucide-react';

interface QuickActionsProps {
  onSend: () => void;
  onTopUp: () => void;
}

export function QuickActions({ onSend, onTopUp }: QuickActionsProps) {
  const actions = [
    { icon: Send, label: 'Send', color: 'bg-blue-500 dark:bg-blue-600', onClick: onSend },
    { icon: Plus, label: 'Top Up', color: 'bg-emerald-500 dark:bg-emerald-600', onClick: onTopUp },
    { icon: Scan, label: 'Scan QR', color: 'bg-purple-500 dark:bg-purple-600', onClick: () => {} },
    { icon: Users, label: 'Split Bill', color: 'bg-orange-500 dark:bg-orange-600', onClick: () => {} },
  ];
  
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className={`${action.color} p-3 rounded-full text-white`}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-300">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
