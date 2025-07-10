'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Package,
  TrendingUp,
  Award,
  MessageSquare,
  Calendar,
  Leaf,
  Target,
  Users
} from 'lucide-react';
import Link from 'next/link';

// Mock data for donor dashboard
const mockDonorStats = {
  totalDonations: 23,
  totalFoodDonated: 156, // kg
  mealsProvided: 468,
  carbonFootprintSaved: 89, // kg CO2
  activeDonations: 2,
  completedDonations: 21,
  impactScore: 875
};

const mockRecentDonations = [
  { 
    id: 1, 
    title: 'Fresh Biryani from Event', 
    quantity: '5kg', 
    status: 'delivered', 
    ngo: 'Food Bank Delhi', 
    volunteer: 'Amit Kumar',
    date: '2024-01-15',
    mealsServed: 15
  },
  { 
    id: 2, 
    title: 'Leftover Pizza', 
    quantity: '3kg', 
    status: 'in-transit', 
    ngo: 'Care Foundation', 
    volunteer: 'Priya Sharma',
    date: '2024-01-14',
    mealsServed: 9
  },
  { 
    id: 3, 
    title: 'Wedding Food', 
    quantity: '12kg', 
    status: 'picked-up', 
    ngo: 'Hope NGO', 
    volunteer: 'Ravi Singh',
    date: '2024-01-13',
    mealsServed: 36
  },
];

const mockMonthlyImpact = [
  { month: 'Jan', donations: 23, meals: 468 },
  { month: 'Dec', donations: 19, meals: 380 },
  { month: 'Nov', donations: 15, meals: 300 },
  { month: 'Oct', donations: 12, meals: 240 },
];

export default function DonorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in and is donor
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'donor') {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white border-b border-green-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
                <p className="text-sm text-gray-600">Track your impact and donations</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/donate">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Donation
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-green-600" />
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
        {/* Impact Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Impact This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <Package className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDonorStats.totalDonations}</div>
                <p className="text-xs text-green-100">
                  +4 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Food Donated</CardTitle>
                <Heart className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDonorStats.totalFoodDonated} kg</div>
                <p className="text-xs text-blue-100">
                  +23kg from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meals Provided</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDonorStats.mealsProvided}</div>
                <p className="text-xs text-purple-100">
                  ~3 meals per kg donated
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
                <Leaf className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDonorStats.carbonFootprintSaved} kg</div>
                <p className="text-xs text-orange-100">
                  Environmental impact
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/donate">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-green-300 hover:border-green-400">
                <CardContent className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Donate Food</h3>
                    <p className="text-sm text-gray-600">Share your excess food with those in need</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
                  <p className="text-sm text-gray-600">Chat with NGOs and volunteers</p>
                  <Badge variant="destructive" className="mt-2">2 New</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact Report</h3>
                  <p className="text-sm text-gray-600">View your detailed contribution</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Donations</span>
              </CardTitle>
              <CardDescription>Track the status of your recent food donations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentDonations.map((donation) => (
                  <div key={donation.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{donation.title}</h4>
                      <Badge 
                        variant={
                          donation.status === 'delivered' ? 'default' : 
                          donation.status === 'in-transit' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {donation.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{donation.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NGO:</span>
                        <span className="font-medium">{donation.ngo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volunteer:</span>
                        <span className="font-medium">{donation.volunteer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Meals Served:</span>
                        <span className="font-medium text-green-600">{donation.mealsServed} meals</span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        Track
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Monthly Progress</span>
              </CardTitle>
              <CardDescription>Your donation trends over the past months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMonthlyImpact.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="font-medium">{month.month} 2024</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{month.donations} donations</div>
                      <div className="text-xs text-gray-600">{month.meals} meals served</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Monthly Goal</span>
                </div>
                <div className="text-sm text-green-700">
                  <div className="flex justify-between mb-1">
                    <span>Progress: 23/25 donations</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Summary */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Your Impact Summary</span>
              </CardTitle>
              <CardDescription>See how your donations are making a difference in the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{mockDonorStats.impactScore}</div>
                  <div className="text-sm text-gray-600">Impact Score</div>
                  <div className="text-xs text-gray-500 mt-1">Based on consistency & quantity</div>
                </div>
                
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                  <div className="text-xs text-gray-500 mt-1">Donations successfully delivered</div>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.8⭐</div>
                  <div className="text-sm text-gray-600">Community Rating</div>
                  <div className="text-xs text-gray-500 mt-1">From NGOs and volunteers</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Achievement Unlocked!</span>
                </div>
                <p className="text-sm text-yellow-700">
                  🏆 <strong>Community Hero</strong> - You've helped serve over 400 meals this month!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
