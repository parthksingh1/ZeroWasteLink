'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Package,
  TrendingUp,
  Users,
  MessageSquare,
  Truck,
  Bell,
  Calendar,
  Award,
  Heart,
  AlertTriangle
} from 'lucide-react';

// Mock data for NGO dashboard
const mockNGOStats = {
  totalPickups: 156,
  totalFoodCollected: 2340, // kg
  mealsServed: 7020,
  activeVolunteers: 12,
  pendingPickups: 8,
  completedPickups: 148,
  monthlyCapacity: 500, // kg
  currentUtilization: 78 // percentage
};

const mockPendingDonations = [
  { 
    id: 1, 
    donor: 'Raj Restaurant', 
    title: 'Fresh Biryani',
    quantity: '8kg', 
    distance: '2.3km',
    expiryTime: '4 hours',
    priority: 'high',
    estimatedMeals: 24
  },
  { 
    id: 2, 
    donor: 'Pizza Corner', 
    title: 'Leftover Pizza',
    quantity: '3kg', 
    distance: '1.8km',
    expiryTime: '6 hours',
    priority: 'medium',
    estimatedMeals: 9
  },
  { 
    id: 3, 
    donor: 'Wedding Hall', 
    title: 'Wedding Food Mix',
    quantity: '15kg', 
    distance: '5.2km',
    expiryTime: '3 hours',
    priority: 'high',
    estimatedMeals: 45
  },
];

const mockActivePickups = [
  { 
    id: 1, 
    donor: 'Local Dhaba', 
    volunteer: 'Amit Kumar',
    status: 'picked-up',
    quantity: '5kg',
    eta: '25 mins',
    contact: '+91 9876543210'
  },
  { 
    id: 2, 
    donor: 'Home Kitchen', 
    volunteer: 'Priya Sharma',
    status: 'en-route',
    quantity: '2kg',
    eta: '45 mins',
    contact: '+91 9876543211'
  },
];

const mockMonthlyStats = [
  { month: 'Jan', pickups: 156, meals: 7020 },
  { month: 'Dec', pickups: 142, meals: 6390 },
  { month: 'Nov', pickups: 128, meals: 5760 },
  { month: 'Oct', pickups: 134, meals: 6030 },
];

export default function NGODashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in and is NGO
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ngo') {
      router.push('/auth/login');
      return;
    }

    setUser(parsedUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const acceptDonation = (donationId: number) => {
    // Handle donation acceptance
    console.log('Accepting donation:', donationId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NGO Dashboard</h1>
                <p className="text-sm text-gray-600">{user?.organizationName || 'Food Distribution Center'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="relative">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <Badge variant="destructive" className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5">
                {mockNGOStats.pendingPickups}
              </Badge>
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-purple-600" />
              </div>
              <span>Welcome, {user?.name}</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pickups</CardTitle>
                <Package className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockNGOStats.totalPickups}</div>
                <p className="text-xs text-purple-100">
                  +14 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Food Collected</CardTitle>
                <Heart className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockNGOStats.totalFoodCollected} kg</div>
                <p className="text-xs text-green-100">
                  {mockNGOStats.currentUtilization}% of capacity
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meals Served</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockNGOStats.mealsServed.toLocaleString()}</div>
                <p className="text-xs text-blue-100">
                  ~3 meals per kg
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
                <Truck className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockNGOStats.activeVolunteers}</div>
                <p className="text-xs text-orange-100">
                  Available for pickup
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Urgent Alerts */}
        <div className="mb-8">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>3 urgent pickups</strong> expiring within 4 hours. Please assign volunteers immediately.
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Donations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Pending Donations</span>
                </span>
                <Badge variant="destructive">{mockPendingDonations.length} New</Badge>
              </CardTitle>
              <CardDescription>Food donations waiting for pickup assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPendingDonations.map((donation) => (
                  <div key={donation.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{donation.title}</h4>
                        <Badge 
                          variant={donation.priority === 'high' ? 'destructive' : 'secondary'}
                        >
                          {donation.priority} priority
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">ID: #{donation.id}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="text-gray-500">Donor:</span>
                        <div className="font-medium">{donation.donor}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                        <div className="font-medium">{donation.quantity}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Distance:</span>
                        <div className="font-medium">{donation.distance}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Expires in:</span>
                        <div className="font-medium text-orange-600">{donation.expiryTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">
                        ~{donation.estimatedMeals} meals
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          View Location
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => acceptDonation(donation.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Accept & Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Pickups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Active Pickups</span>
              </CardTitle>
              <CardDescription>Volunteers currently on pickup/delivery missions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivePickups.map((pickup) => (
                  <div key={pickup.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{pickup.donor}</h4>
                      <Badge 
                        variant={pickup.status === 'picked-up' ? 'default' : 'secondary'}
                      >
                        {pickup.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="text-gray-500">Volunteer:</span>
                        <div className="font-medium">{pickup.volunteer}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                        <div className="font-medium">{pickup.quantity}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">ETA:</span>
                        <div className="font-medium text-blue-600">{pickup.eta}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <div className="font-medium">{pickup.contact}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        Track Live
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                ))}
                
                {mockActivePickups.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No active pickups at the moment</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Monthly Performance</span>
              </CardTitle>
              <CardDescription>Your pickup and distribution trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMonthlyStats.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                      <span className="font-medium">{month.month} 2024</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{month.pickups} pickups</div>
                      <div className="text-xs text-gray-600">{month.meals.toLocaleString()} meals</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-800">Capacity Utilization</span>
                </div>
                <div className="text-sm text-purple-700">
                  <div className="flex justify-between mb-1">
                    <span>{mockNGOStats.totalFoodCollected}kg / {mockNGOStats.monthlyCapacity}kg</span>
                    <span>{mockNGOStats.currentUtilization}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${mockNGOStats.currentUtilization}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Impact Dashboard</span>
              </CardTitle>
              <CardDescription>Your organization's community impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">98.5%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">4.9⭐</div>
                  <div className="text-sm text-gray-600">Community Rating</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">15min</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">#3</div>
                  <div className="text-sm text-gray-600">City Ranking</div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Recent Achievement</span>
                </div>
                <p className="text-sm text-yellow-700">
                  🏆 <strong>Community Champion</strong> - Served over 7,000 meals this month!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
