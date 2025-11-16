import { Trophy, Medal, TrendingUp, Crown, Zap, Target } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function Leaderboard() {
  const leaderboardData = {
    savings: [
      { 
        rank: 1, 
        name: 'Emma Wilson', 
        value: '$245.50', 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        badge: 'Savings Champion',
        points: 2450
      },
      { 
        rank: 2, 
        name: 'Michael Chen', 
        value: '$198.20', 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        badge: 'Smart Saver',
        points: 1982
      },
      { 
        rank: 3, 
        name: 'Sarah Johnson', 
        value: '$167.80', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        badge: 'Budget Pro',
        points: 1678
      },
      { 
        rank: 4, 
        name: 'Alex Smith', 
        value: '$89.20', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        badge: 'Rising Star',
        points: 892,
        isCurrentUser: true
      },
      { 
        rank: 5, 
        name: 'Jordan Lee', 
        value: '$76.40', 
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        badge: 'Newcomer',
        points: 764
      },
    ],
    events: [
      { 
        rank: 1, 
        name: 'Sarah Johnson', 
        value: '12 events', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        badge: 'Event Champion',
        points: 675
      },
      { 
        rank: 2, 
        name: 'Emma Wilson', 
        value: '9 events', 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        badge: 'Social Star',
        points: 525
      },
      { 
        rank: 3, 
        name: 'Alex Smith', 
        value: '3 events', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        badge: 'Active Member',
        points: 175,
        isCurrentUser: true
      },
      { 
        rank: 4, 
        name: 'Jordan Lee', 
        value: '2 events', 
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        badge: 'Getting Started',
        points: 75
      },
    ],
    sustainable: [
      { 
        rank: 1, 
        name: 'Alex Smith', 
        value: '95 pts', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        badge: 'Eco Warrior',
        points: 95,
        isCurrentUser: true
      },
      { 
        rank: 2, 
        name: 'Emma Wilson', 
        value: '87 pts', 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        badge: 'Green Leader',
        points: 87
      },
      { 
        rank: 3, 
        name: 'Jordan Lee', 
        value: '76 pts', 
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        badge: 'Planet Saver',
        points: 76
      },
    ],
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-slate-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-slate-500 dark:text-slate-400">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number, isCurrentUser?: boolean) => {
    if (isCurrentUser) return 'bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-600 dark:border-indigo-500';
    if (rank === 1) return 'bg-yellow-50 dark:bg-yellow-950/20';
    if (rank === 2) return 'bg-slate-50 dark:bg-slate-800';
    if (rank === 3) return 'bg-amber-50 dark:bg-amber-950/20';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700 text-white border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl">Leaderboard</h2>
            <p className="text-sm text-yellow-100">Compete with fellow students</p>
          </div>
        </div>
      </Card>

      {/* Your Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center dark:bg-slate-800 dark:border-slate-700">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 w-fit mx-auto p-2 rounded-full mb-2">
            <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Your Rank</p>
          <p className="text-lg dark:text-white">#4</p>
        </Card>
        <Card className="p-4 text-center dark:bg-slate-800 dark:border-slate-700">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 w-fit mx-auto p-2 rounded-full mb-2">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">This Month</p>
          <p className="text-lg dark:text-white">+12</p>
        </Card>
        <Card className="p-4 text-center dark:bg-slate-800 dark:border-slate-700">
          <div className="bg-purple-100 dark:bg-purple-900/30 w-fit mx-auto p-2 rounded-full mb-2">
            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Points</p>
          <p className="text-lg dark:text-white">892</p>
        </Card>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="savings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 dark:bg-slate-800">
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="sustainable">Eco</TabsTrigger>
        </TabsList>
        
        <TabsContent value="savings" className="space-y-3 mt-4">
          {leaderboardData.savings.map((user) => (
            <Card 
              key={user.rank} 
              className={`p-4 ${getRankBg(user.rank, user.isCurrentUser)} dark:border-slate-700`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank)}
                </div>
                
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="dark:text-white">{user.name}</p>
                    {user.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.badge}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-emerald-600 dark:text-emerald-400">{user.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.points} pts</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="events" className="space-y-3 mt-4">
          {leaderboardData.events.map((user) => (
            <Card 
              key={user.rank} 
              className={`p-4 ${getRankBg(user.rank, user.isCurrentUser)} dark:border-slate-700`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank)}
                </div>
                
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="dark:text-white">{user.name}</p>
                    {user.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.badge}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-indigo-600 dark:text-indigo-400">{user.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.points} pts</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="sustainable" className="space-y-3 mt-4">
          {leaderboardData.sustainable.map((user) => (
            <Card 
              key={user.rank} 
              className={`p-4 ${getRankBg(user.rank, user.isCurrentUser)} dark:border-slate-700`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank)}
                </div>
                
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="dark:text-white">{user.name}</p>
                    {user.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.badge}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-emerald-600 dark:text-emerald-400">{user.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Challenge */}
      <Card className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white border-0">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8" />
          <div className="flex-1">
            <p className="text-sm mb-1">Weekly Challenge</p>
            <p className="text-xs text-purple-100">Save $50 this week for +100 bonus points!</p>
          </div>
        </div>
      </Card>
    </div>
  );
}