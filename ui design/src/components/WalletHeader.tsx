import { Bell, Moon, Sun, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useTheme } from './ThemeProvider';

export function WalletHeader() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="dark:text-white">Alex Smith</p>
            <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">ID: STU-2024-1847</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="dark:text-slate-300"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="relative dark:text-slate-300">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    </div>
  );
}
