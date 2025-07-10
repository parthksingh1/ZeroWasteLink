'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Building, 
  Heart, 
  Truck, 
  TrendingUp, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  MessageSquare,
  Settings,
  Download,
  RefreshCw,
  Crown,
  Calendar,
  Award,
  Target,
  Zap
} from 'lucide-react';
import Link from 'next/link';

// Mock data - In real app, this would come from API
const mockStats = {
  totalUsers: 1247,
  totalDonors: 456,
  totalNGOs: 23,
  totalVolunteers: 789,
  totalDonations: 3456,
  totalFoodSaved: 12567, // kg
  totalMealsServed: 25134,
  activeDonations: 45,
  completedDonations: 3411,
  carbonFootprintSaved: 5678, // kg CO2
};

const mockRecentDonations = [
  { id: 1, donor: 'Raj Restaurant', ngo: 'Food Bank Delhi', volunteer: 'Amit Kumar', status: 'completed', food: 'Biryani (5kg)', time: '2h ago' },
  { id: 2, donor: 'Home Kitchen', ngo: 'Care Foundation', volunteer: 'Priya Sharma', status: 'in-transit', food: 'Dal Rice (2kg)', time: '1h ago' },
  { id: 3, donor: 'Pizza Corner', ngo: 'Seva Trust', volunteer: 'Pending', status: 'pending', food: 'Pizza (3kg)', time: '30m ago' },
  { id: 4, donor: 'Wedding Hall', ngo: 'Hope NGO', volunteer: 'Ravi Singh', status: 'completed', food: 'Mixed Food (15kg)', time: '4h ago' },
];

const mockTopPerformers = {
  donors: [
    { name: 'Taj Hotel', donations: 234, food: '2.3 tons' },
    { name: 'ITC Restaurant', donations: 187, food: '1.8 tons' },
    { name: 'Local Dhaba', donations: 156, food: '1.2 tons' }
  ],
  ngos: [
    { name: 'Akshaya Patra', pickups: 345, served: '15,678 meals' },
    { name: 'Food Bank India', pickups: 298, served: '12,456 meals' },
    { name: 'Care Foundation', pickups: 234, served: '9,876 meals' }
  ],
  volunteers: [
    { name: 'Amit Kumar', deliveries: 89, rating: 4.9 },
    { name: 'Priya Sharma', deliveries: 76, rating: 4.8 },
    { name: 'Ravi Singh', deliveries: 67, rating: 4.7 }
  ]
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/admin');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/auth/admin');
      return;
    }

    setUser(parsedUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/admin');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">ZeroWasteLink 2.0 Control Panel</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-purple-600" />
              </div>
              <span>Welcome, {user?.name}</span>
            </div>
            
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Food Saved</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalFoodSaved.toLocaleString()} kg</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meals Served</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalMealsServed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.carbonFootprintSaved.toLocaleString()} kg</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+10%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitor</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Donations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Recent Donations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentDonations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{donation.donor}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-sm">{donation.ngo}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {donation.food} • {donation.time}
                          </div>
                          <div className="text-xs text-gray-500">
                            Volunteer: {donation.volunteer}
                          </div>
                        </div>
                        <Badge 
                          variant={
                            donation.status === 'completed' ? 'default' : 
                            donation.status === 'in-transit' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {donation.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>User Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Donors</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{mockStats.totalDonors}</div>
                        <div className="text-xs text-gray-500">36.6%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Volunteers</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{mockStats.totalVolunteers}</div>
                        <div className="text-xs text-gray-500">63.3%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">NGOs</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{mockStats.totalNGOs}</div>
                        <div className="text-xs text-gray-500">1.8%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏆 Top Donors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTopPerformers.donors.map((donor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{donor.name}</div>
                          <div className="text-xs text-gray-500">{donor.donations} donations</div>
                        </div>
                        <Badge variant="outline">{donor.food}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏢 Top NGOs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTopPerformers.ngos.map((ngo, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{ngo.name}</div>
                          <div className="text-xs text-gray-500">{ngo.pickups} pickups</div>
                        </div>
                        <Badge variant="outline">{ngo.served}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🚚 Top Volunteers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTopPerformers.volunteers.map((volunteer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{volunteer.name}</div>
                          <div className="text-xs text-gray-500">{volunteer.deliveries} deliveries</div>
                        </div>
                        <Badge variant="outline">⭐ {volunteer.rating}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    <span>Donor Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold">{mockStats.totalDonors}</div>
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        View All Donors
                      </Button>
                      <Button className="w-full" variant="outline">
                        Pending Approvals (3)
                      </Button>
                      <Button className="w-full" variant="destructive" size="sm">
                        Suspended Accounts (1)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    <span>NGO Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold">{mockStats.totalNGOs}</div>
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        View All NGOs
                      </Button>
                      <Button className="w-full" variant="outline">
                        Pending Verification (2)
                      </Button>
                      <Button className="w-full" variant="secondary" size="sm">
                        Performance Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Volunteer Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold">{mockStats.totalVolunteers}</div>
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        View All Volunteers
                      </Button>
                      <Button className="w-full" variant="outline">
                        Active Deliveries (12)
                      </Button>
                      <Button className="w-full" variant="secondary" size="sm">
                        Rating & Reviews
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalDonations.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+5.2% this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{mockStats.activeDonations}</div>
                  <p className="text-xs text-gray-600">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockStats.completedDonations.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">98.7% success rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">234</div>
                  <p className="text-xs text-green-600">+12% vs last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Donation Activity</CardTitle>
                <CardDescription>Real-time donation tracking and status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentDonations.map((donation) => (
                    <div key={donation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">ID: #{donation.id}</Badge>
                            <Badge 
                              variant={
                                donation.status === 'completed' ? 'default' : 
                                donation.status === 'in-transit' ? 'secondary' : 
                                'destructive'
                              }
                            >
                              {donation.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Donor:</span>
                              <div className="font-medium">{donation.donor}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">NGO:</span>
                              <div className="font-medium">{donation.ngo}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Volunteer:</span>
                              <div className="font-medium">{donation.volunteer}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-500">Food:</span> {donation.food} • 
                            <span className="text-gray-500"> Time:</span> {donation.time}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="outline" size="sm">Track</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                Advanced analytics dashboard with charts and graphs would be implemented here using libraries like Recharts or Chart.js.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Food Waste Reduction Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Food waste reduction chart</p>
                      <p className="text-xs text-gray-400">Would show monthly/weekly trends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Impact distribution chart</p>
                      <p className="text-xs text-gray-400">Meals served by category</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-500">Interactive Map View</p>
                    <p className="text-sm text-gray-400">Real-time donation locations and volunteer tracking</p>
                    <p className="text-sm text-gray-400">Integration with Leaflet.js for live tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span>Live Activity Feed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div className="text-sm">
                        <span className="font-medium">Donation completed</span> by Raj Restaurant → Food Bank Delhi
                      </div>
                      <span className="text-xs text-gray-500">2m ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <div className="text-sm">
                        <span className="font-medium">Volunteer assigned</span> Amit Kumar to pickup at Pizza Corner
                      </div>
                      <span className="text-xs text-gray-500">5m ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <div className="text-sm">
                        <span className="font-medium">New donation posted</span> Wedding Hall (15kg mixed food)
                      </div>
                      <span className="text-xs text-gray-500">8m ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded">
                      <Users className="w-4 h-4 text-purple-600" />
                      <div className="text-sm">
                        <span className="font-medium">New NGO registered</span> Hope Foundation (Delhi)
                      </div>
                      <span className="text-xs text-gray-500">12m ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span>Chat Moderation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        2 conversations flagged for review
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Review Flagged Chats (2)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Active Conversations (23)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Moderation Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Health & Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-gray-600">Server Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1.2s</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">45</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    General Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat Moderation Rules
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    User Verification Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    Reward System Config
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Send Announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Send to All Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    Send to Donors Only
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="w-4 h-4 mr-2" />
                    Send to NGOs Only
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Truck className="w-4 h-4 mr-2" />
                    Send to Volunteers Only
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Export & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export User Data</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Donations</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Impact Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
