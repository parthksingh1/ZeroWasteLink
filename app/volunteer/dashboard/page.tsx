'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle, 
  Star,
  Trophy,
  Target,
  Truck,
  Phone,
  MessageSquare,
  Route,
  Calendar,
  Award,
  Zap,
  Heart,
  Users,
  TrendingUp,
  Camera,
  Package,
  Timer,
  AlertCircle,
  RefreshCw,
  Home,
  Building
} from 'lucide-react';
import Link from 'next/link';

// Mock data for volunteer dashboard
const mockVolunteerStats = {
  totalPickups: 127,
  completedToday: 3,
  totalKmTraveled: 1456,
  totalFoodDelivered: 2340, // kg
  currentLevel: 8,
  experiencePoints: 2840,
  nextLevelXP: 3200,
  rating: 4.8,
  totalRatings: 89,
  badges: ['Speed Demon', 'Night Owl', 'Community Hero', 'Eco Warrior'],
  monthlyRank: 12,
  streak: 15 // consecutive days
};

const mockAssignedPickups = [
  {
    id: 'PU001',
    donorName: 'Taj Hotel Mumbai',
    donorAddress: 'Apollo Bunder, Colaba, Mumbai - 400001',
    ngoName: 'Mumbai Food Bank',
    ngoAddress: 'Dharavi, Mumbai - 400017',
    foodType: 'Cooked Food',
    quantity: '25 kg',
    urgency: 'high',
    estimatedTime: '45 min',
    distance: '12.5 km',
    pickupTime: '2:30 PM',
    status: 'assigned',
    paymentEstimate: '₹180',
    coordinates: { pickup: [19.0330, 72.8397], dropoff: [19.0463, 72.8570] }
  },
  {
    id: 'PU002',
    donorName: 'Big Bazaar Andheri',
    donorAddress: 'Andheri West, Mumbai - 400058',
    ngoName: 'Annamrita Foundation',
    ngoAddress: 'Juhu, Mumbai - 400049',
    foodType: 'Packaged Food',
    quantity: '40 kg',
    urgency: 'medium',
    estimatedTime: '35 min',
    distance: '8.2 km',
    pickupTime: '4:00 PM',
    status: 'in_progress',
    paymentEstimate: '₹140',
    coordinates: { pickup: [19.1197, 72.8464], dropoff: [19.1075, 72.8263] }
  },
  {
    id: 'PU003',
    donorName: 'Local Restaurant',
    donorAddress: 'Bandra West, Mumbai - 400050',
    ngoName: 'Robin Hood Army',
    ngoAddress: 'Kurla, Mumbai - 400070',
    foodType: 'Fresh Produce',
    quantity: '15 kg',
    urgency: 'low',
    estimatedTime: '28 min',
    distance: '6.8 km',
    pickupTime: '6:30 PM',
    status: 'pending',
    paymentEstimate: '₹120',
    coordinates: { pickup: [19.0596, 72.8295], dropoff: [19.0728, 72.8826] }
  }
];

const mockRecentDeliveries = [
  {
    id: 'DEL001',
    date: '2024-01-15',
    donor: 'Oberoi Hotel',
    ngo: 'Feeding India',
    quantity: '30 kg',
    rating: 5,
    earnings: '₹200',
    distance: '15.2 km'
  },
  {
    id: 'DEL002',
    date: '2024-01-15',
    donor: 'McDonald\'s Powai',
    ngo: 'Mission Roti',
    quantity: '18 kg',
    rating: 4,
    earnings: '₹130',
    distance: '9.5 km'
  },
  {
    id: 'DEL003',
    date: '2024-01-14',
    donor: 'Reliance Fresh',
    ngo: 'Goonj NGO',
    quantity: '45 kg',
    rating: 5,
    earnings: '₹250',
    distance: '22.1 km'
  }
];

const mockAchievements = [
  { name: 'First Delivery', icon: '🚚', completed: true, date: '2023-11-15' },
  { name: '50 Deliveries', icon: '📦', completed: true, date: '2024-01-10' },
  { name: '100 Deliveries', icon: '🎯', completed: true, date: '2024-01-14' },
  { name: 'Speed Demon', icon: '⚡', completed: true, date: '2024-01-12' },
  { name: '500 Deliveries', icon: '🏆', completed: false, progress: 74 },
  { name: 'Distance Master', icon: '🗺️', completed: false, progress: 45 },
];

export default function VolunteerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPickup, setSelectedPickup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'volunteer') {
      router.push('/auth/login');
    }
  }, [router]);

  const handleAcceptPickup = (pickupId: string) => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      // Update pickup status to accepted
    }, 1000);
  };

  const handleStartNavigation = (pickup: any) => {
    // Use OpenStreetMap-based navigation instead of Google Maps
    const osmUrl = `https://www.openstreetmap.org/directions?to=${encodeURIComponent(pickup.donorAddress)}`;
    window.open(osmUrl, '_blank');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'default';
      case 'in_progress': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your deliveries and make an impact! 🚛</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Badge variant="secondary" className="px-3 py-1">
              <Star className="w-4 h-4 mr-1" />
              Level {mockVolunteerStats.currentLevel}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
              <CheckCircle className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVolunteerStats.completedToday}</div>
              <p className="text-xs text-blue-100">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pickups</CardTitle>
              <Package className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVolunteerStats.totalPickups}</div>
              <p className="text-xs text-green-100">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Experience Points</CardTitle>
              <Zap className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVolunteerStats.experiencePoints}</div>
              <p className="text-xs text-purple-100">{mockVolunteerStats.nextLevelXP - mockVolunteerStats.experiencePoints} to next level</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVolunteerStats.rating}</div>
              <p className="text-xs text-orange-100">From {mockVolunteerStats.totalRatings} reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pickups">Active Pickups</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress & Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Progress & Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Level {mockVolunteerStats.currentLevel}</span>
                      <span className="text-sm text-gray-500">
                        {mockVolunteerStats.experiencePoints}/{mockVolunteerStats.nextLevelXP} XP
                      </span>
                    </div>
                    <Progress 
                      value={(mockVolunteerStats.experiencePoints / mockVolunteerStats.nextLevelXP) * 100} 
                      className="h-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{mockVolunteerStats.streak}</div>
                      <div className="text-sm text-gray-500">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">#{mockVolunteerStats.monthlyRank}</div>
                      <div className="text-sm text-gray-500">Monthly Rank</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Earned Badges</h4>
                    <div className="flex flex-wrap gap-2">
                      {mockVolunteerStats.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAssignedPickups.slice(0, 3).map((pickup) => (
                      <div key={pickup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{pickup.donorName}</div>
                          <div className="text-sm text-gray-500">{pickup.pickupTime}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(pickup.status)} className="text-xs">
                            {pickup.status.replace('_', ' ')}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">{pickup.paymentEstimate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button className="h-20 flex-col" variant="outline">
                    <MapPin className="w-6 h-6 mb-2" />
                    Find Nearby Pickups
                  </Button>
                  <Button className="h-20 flex-col" variant="outline">
                    <Clock className="w-6 h-6 mb-2" />
                    Emergency Pickup
                  </Button>
                  <Button className="h-20 flex-col" variant="outline">
                    <MessageSquare className="w-6 h-6 mb-2" />
                    Contact Support
                  </Button>
                  <Button className="h-20 flex-col" variant="outline">
                    <Camera className="w-6 h-6 mb-2" />
                    Report Issue
                  </Button>
                </CardContent>
              </Card>

              {/* Impact Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Your Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Food Delivered</span>
                      <span className="font-semibold">{mockVolunteerStats.totalFoodDelivered} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Distance Traveled</span>
                      <span className="font-semibold">{mockVolunteerStats.totalKmTraveled} km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Estimated Meals</span>
                      <span className="font-semibold">{Math.round(mockVolunteerStats.totalFoodDelivered * 2.5)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CO₂ Saved</span>
                      <span className="font-semibold">{Math.round(mockVolunteerStats.totalFoodDelivered * 2.4)} kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Pickups Tab */}
          <TabsContent value="pickups" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Active Pickups</h3>
              <Button size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="grid gap-4">
              {mockAssignedPickups.map((pickup) => (
                <Card key={pickup.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{pickup.donorName}</CardTitle>
                        <CardDescription>{pickup.donorAddress}</CardDescription>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={getUrgencyColor(pickup.urgency)}>
                          {pickup.urgency} priority
                        </Badge>
                        <div className="text-lg font-semibold text-green-600">{pickup.paymentEstimate}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Pickup Time:</span>
                        <div className="font-medium">{pickup.pickupTime}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                        <div className="font-medium">{pickup.quantity}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Distance:</span>
                        <div className="font-medium">{pickup.distance}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Est. Time:</span>
                        <div className="font-medium">{pickup.estimatedTime}</div>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="text-sm text-gray-600 mb-2">
                        <Building className="w-4 h-4 inline mr-1" />
                        Deliver to: <span className="font-medium">{pickup.ngoName}</span>
                      </div>
                      <div className="text-sm text-gray-500">{pickup.ngoAddress}</div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {pickup.status === 'assigned' && (
                        <>
                          <Button onClick={() => handleAcceptPickup(pickup.id)} disabled={loading}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Pickup
                          </Button>
                          <Button variant="outline" onClick={() => handleStartNavigation(pickup)}>
                            <Navigation className="w-4 h-4 mr-2" />
                            Navigate
                          </Button>
                        </>
                      )}
                      {pickup.status === 'in_progress' && (
                        <>
                          <Button variant="outline" onClick={() => handleStartNavigation(pickup)}>
                            <Route className="w-4 h-4 mr-2" />
                            Continue Route
                          </Button>
                          <Button>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Donor
                          </Button>
                        </>
                      )}
                      {pickup.status === 'pending' && (
                        <Button variant="outline" disabled>
                          <Timer className="w-4 h-4 mr-2" />
                          Waiting for Assignment
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Navigation & Route Planning
                </CardTitle>
                <CardDescription>
                  View your current routes and navigate to pickup/delivery locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Interactive map integration with Leaflet.js will be implemented here. 
                      This will show real-time navigation, traffic updates, and optimized routes.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-16 flex-col">
                      <Navigation className="w-6 h-6 mb-2" />
                      Start Navigation to Next Pickup
                    </Button>
                    <Button variant="outline" className="h-16 flex-col">
                      <Route className="w-6 h-6 mb-2" />
                      Optimize My Route
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Today's Route Summary</h4>
                    <div className="text-sm space-y-1">
                      <div>🏁 Starting Point: Your Location</div>
                      <div>📍 Pickup 1: Taj Hotel Mumbai (2:30 PM)</div>
                      <div>🏢 Delivery 1: Mumbai Food Bank</div>
                      <div>📍 Pickup 2: Big Bazaar Andheri (4:00 PM)</div>
                      <div>🏢 Delivery 2: Annamrita Foundation</div>
                      <div className="pt-2 font-medium">Total Distance: ~35 km | Est. Time: 2.5 hours</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.name}</div>
                          {achievement.completed ? (
                            <div className="text-sm text-green-600">
                              Completed on {achievement.date}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">
                                Progress: {achievement.progress}%
                              </div>
                              <Progress value={achievement.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                        {achievement.completed && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                      <div className="text-2xl mb-2">🏆</div>
                      <div className="font-bold text-lg">You're Rank #{mockVolunteerStats.monthlyRank}</div>
                      <div className="text-sm text-gray-600">This month</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium mb-2">Top Volunteers This Month</div>
                      {[
                        { rank: 1, name: 'Rajesh Kumar', points: 3450 },
                        { rank: 2, name: 'Priya Sharma', points: 3200 },
                        { rank: 3, name: 'Amit Singh', points: 3100 },
                        { rank: 12, name: 'You', points: mockVolunteerStats.experiencePoints, isUser: true }
                      ].map((user) => (
                        <div key={user.rank} className={`flex justify-between items-center p-2 rounded ${user.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                            <span className="w-6 text-center text-sm">#{user.rank}</span>
                            <span className={`font-medium ${user.isUser ? 'text-blue-700' : ''}`}>
                              {user.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">{user.points} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  Delivery History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentDeliveries.map((delivery) => (
                    <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{delivery.donor}</div>
                        <div className="text-sm text-gray-500">to {delivery.ngo}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {delivery.date} • {delivery.distance} • {delivery.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{delivery.earnings}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < delivery.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
