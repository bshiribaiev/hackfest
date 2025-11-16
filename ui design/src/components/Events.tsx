import { Calendar, MapPin, Users, Clock, Star, Ticket, TrendingUp, Gift } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Events() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Career Fair 2025',
      date: 'Nov 18, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Main Auditorium',
      attendees: 245,
      points: 50,
      category: 'Career',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
      isFeatured: true
    },
    {
      id: 2,
      title: 'Student Mixer Night',
      date: 'Nov 16, 2025',
      time: '7:00 PM - 10:00 PM',
      location: 'Student Center',
      attendees: 156,
      points: 25,
      category: 'Social',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Sustainability Workshop',
      date: 'Nov 17, 2025',
      time: '2:00 PM - 4:00 PM',
      location: 'Science Building',
      attendees: 89,
      points: 75,
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=200&fit=crop',
      isEcoFriendly: true
    },
    {
      id: 4,
      title: 'Basketball Game: Finals',
      date: 'Nov 20, 2025',
      time: '6:00 PM - 9:00 PM',
      location: 'Sports Arena',
      attendees: 512,
      points: 30,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop'
    },
  ];

  const attendedEvents = [
    {
      id: 5,
      title: 'Hackathon Kickoff',
      date: 'Nov 10, 2025',
      points: 100,
      verified: true
    },
    {
      id: 6,
      title: 'Financial Literacy Workshop',
      date: 'Nov 8, 2025',
      points: 50,
      verified: true
    },
    {
      id: 7,
      title: 'Welcome Week Concert',
      date: 'Nov 1, 2025',
      points: 25,
      verified: true
    },
  ];

  const eventsProgress = {
    current: 3,
    nextMilestone: 5,
    totalPoints: 175,
    nextReward: 50
  };

  const progress = (eventsProgress.current / eventsProgress.nextMilestone) * 100;

  return (
    <div className="space-y-6">
      {/* Events Header */}
      <Card className="p-6 bg-gradient-to-br from-pink-600 to-purple-600 dark:from-pink-700 dark:to-purple-700 text-white border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl">Campus Events</h2>
            <p className="text-sm text-pink-100">Earn points by attending events</p>
          </div>
        </div>
      </Card>

      {/* Events Progress */}
      <Card className="p-5 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white border-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-5 w-5 text-yellow-300" />
              <p className="text-sm">Event Streak</p>
            </div>
            <p className="text-2xl">{eventsProgress.current} Events Attended</p>
            <p className="text-xs text-indigo-100 mt-1">
              {eventsProgress.totalPoints} total points earned
            </p>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <p className="text-xs">🔥 3 week streak</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next reward</span>
            <span>{eventsProgress.current}/{eventsProgress.nextMilestone}</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/30" />
          <div className="flex items-center gap-2 text-xs text-indigo-100">
            <Gift className="h-3 w-3" />
            <span>Unlock +{eventsProgress.nextReward} bonus points at {eventsProgress.nextMilestone} events!</span>
          </div>
        </div>
      </Card>

      {/* Events Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 dark:bg-slate-800">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="attended">Attended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden dark:bg-slate-800 dark:border-slate-700">
              <div className="relative h-32">
                <ImageWithFallback 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {event.isFeatured && (
                    <Badge className="bg-yellow-500 hover:bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {event.isEcoFriendly && (
                    <Badge className="bg-emerald-500 hover:bg-emerald-500">
                      🌱 Eco
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-black/50 hover:bg-black/50 backdrop-blur-sm">
                    {event.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="mb-1 dark:text-white">{event.title}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} students attending</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Earn Points</p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400">+{event.points} pts</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                    <Ticket className="h-4 w-4 mr-1" />
                    RSVP
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="attended" className="space-y-3 mt-4">
          {attendedEvents.map((event) => (
            <Card key={event.id} className="p-4 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg h-fit">
                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm dark:text-white">{event.title}</h4>
                      {event.verified && (
                        <Badge variant="secondary" className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{event.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">+{event.points}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">points</p>
                </div>
              </div>
            </Card>
          ))}
          
          <Card className="p-4 bg-slate-50 dark:bg-slate-800/50 border-dashed dark:border-slate-700">
            <div className="text-center py-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Keep attending events to earn more points!
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Next milestone: 5 events for +50 bonus points
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Points Breakdown */}
      <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
        <h3 className="mb-4 dark:text-white">How Points Work</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Social Events</span>
            </div>
            <span className="dark:text-white">+25 pts</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Workshops</span>
            </div>
            <span className="dark:text-white">+50-75 pts</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Special Events</span>
            </div>
            <span className="dark:text-white">+100 pts</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t dark:border-slate-700 pt-3">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-slate-600 dark:text-slate-400">Milestone Bonus (every 5 events)</span>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400">+50 pts</span>
          </div>
        </div>
      </Card>
    </div>
  );
}