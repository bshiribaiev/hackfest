import { Coffee, BookOpen, Utensils, ShoppingBag, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';

export function CampusLocations() {
  const locations = [
    { 
      name: 'Student Cafe', 
      icon: Coffee, 
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      distance: '50m away',
      popular: true
    },
    { 
      name: 'Campus Bookstore', 
      icon: BookOpen, 
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      distance: '120m away'
    },
    { 
      name: 'Dining Hall', 
      icon: Utensils, 
      color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      distance: '200m away'
    },
    { 
      name: 'Campus Store', 
      icon: ShoppingBag, 
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      distance: '85m away'
    },
  ];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg dark:text-white">Nearby Campus Locations</h3>
        <button className="text-sm text-indigo-600 dark:text-indigo-400">View All</button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {locations.map((location) => (
          <Card 
            key={location.name}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-slate-800 dark:border-slate-700 relative"
          >
            {location.popular && (
              <div className="absolute top-2 right-2">
                <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">Popular</span>
              </div>
            )}
            <div className={`${location.color} p-3 rounded-lg w-fit mb-3`}>
              <location.icon className="h-5 w-5" />
            </div>
            <p className="text-sm mb-1 dark:text-white">{location.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{location.distance}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
