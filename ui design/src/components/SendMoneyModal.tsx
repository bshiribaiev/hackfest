import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

interface SendMoneyModalProps {
  open: boolean;
  onClose: () => void;
}

export function SendMoneyModal({ open, onClose }: SendMoneyModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  
  const contacts = [
    { 
      id: '1', 
      name: 'Sarah Johnson', 
      studentId: 'STU-2024-2156',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      isOnline: true
    },
    { 
      id: '2', 
      name: 'Mike Chen', 
      studentId: 'STU-2024-3421',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      isOnline: false
    },
    { 
      id: '3', 
      name: 'Emma Wilson', 
      studentId: 'STU-2024-1089',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      isOnline: true
    },
  ];
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Send Money to Student</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by name or Student ID..." className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">Recent Contacts</p>
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  selectedContact === contact.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:border-indigo-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm dark:text-white">{contact.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{contact.studentId}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm dark:text-slate-300">Amount ($)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl text-center dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
            disabled={!selectedContact || !amount}
          >
            Send Money
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
