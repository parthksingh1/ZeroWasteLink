'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Upload, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Camera,
  Calendar,
  Users,
  Truck,
  ArrowRight,
  Leaf,
  Award,
  Phone,
  Mail,
  Package,
  Building,
  Star,
  Globe,
  Zap,
  Timer,
  Shield,
  FileText,
  Image as ImageIcon,
  X,
  Plus,
  Loader2
} from 'lucide-react';

export default function DonatePage() {
  const [showForm, setShowForm] = useState(false);

  const foodTypes = [
    { name: 'Cooked Meals', icon: '🍽️', description: 'Ready-to-eat meals, leftovers from events', popular: true },
    { name: 'Fresh Produce', icon: '🥬', description: 'Fruits, vegetables, fresh ingredients' },
    { name: 'Packaged Food', icon: '📦', description: 'Canned goods, dry goods, non-perishables' },
    { name: 'Dairy Products', icon: '🥛', description: 'Milk, cheese, yogurt, dairy items' },
    { name: 'Baked Goods', icon: '🍞', description: 'Bread, pastries, baked items' },
    { name: 'Beverages', icon: '🥤', description: 'Juices, soft drinks, beverages' },
    { name: 'Frozen Food', icon: '🧊', description: 'Frozen meals, ice cream, frozen items' },
    { name: 'Desserts', icon: '🍰', description: 'Cakes, sweets, dessert items', popular: true },
    { name: 'Grains & Cereals', icon: '🌾', description: 'Rice, pasta, cereals, grains' },
    { name: 'Snacks', icon: '🍿', description: 'Chips, crackers, snack foods' }
  ];

  const impactStats = [
    { value: '1 meal', description: 'Can feed a hungry person', icon: '👤' },
    { value: '10 meals', description: 'Can support a family for a day', icon: '👨‍👩‍👧‍👦' },
    { value: '100 meals', description: 'Can help an entire community', icon: '🏘️' },
    { value: '1000 meals', description: 'Can make a lasting impact', icon: '🌟' }
  ];

  if (showForm) {
    return <DonationForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ZeroWasteLink</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">2.0</Badge>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>1-800-FOOD-HELP</span>
              </div>
              <Link href="/auth/login">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-800 text-sm font-medium mb-4">
              <Leaf className="w-4 h-4 mr-2" />
              Food Donation is the Greatest Gift
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Donate Food, Create Hope
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Every meal you donate can make a difference in someone's life. Join our global community of donors helping to reduce food waste and fight hunger worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg"
                onClick={() => setShowForm(true)}
              >
                Donate Food Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call for Pickup
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-green-600" />
                <span>Verified Platform</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                <span>Global Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Accept */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Food Can You Donate?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We accept various types of food items from around the world. All donations are reviewed for quality and safety before distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foodTypes.map((type, index) => (
              <Card key={index} className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 group ${type.popular ? 'ring-2 ring-blue-200' : ''}`}>
                <CardContent className="p-6">
                  {type.popular && (
                    <Badge className="mb-3 bg-blue-100 text-blue-800">Most Needed</Badge>
                  )}
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">{type.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Special Requirements */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Food Safety Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fresh & Safe</h4>
                <p className="text-sm text-gray-600">Food should be fresh and safe for consumption</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Timely Pickup</h4>
                <p className="text-sm text-gray-600">Food should be available for pickup within specified time</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Adequate Quantity</h4>
                <p className="text-sm text-gray-600">Minimum quantity to serve multiple people efficiently</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Food Donation Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes food donation simple, safe, and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Submit Details",
                description: "Fill out the donation form with food details, photos, and pickup location",
                icon: Upload,
                color: "bg-green-100 text-green-600"
              },
              {
                step: 2,
                title: "AI Matching",
                description: "Our AI finds the best NGO based on location, capacity, and food type",
                icon: CheckCircle,
                color: "bg-blue-100 text-blue-600"
              },
              {
                step: 3,
                title: "Volunteer Pickup",
                description: "Trained volunteer collects the food safely with real-time tracking",
                icon: Truck,
                color: "bg-purple-100 text-purple-600"
              },
              {
                step: 4,
                title: "Distribution",
                description: "Food reaches beneficiaries in your community with impact tracking",
                icon: Users,
                color: "bg-orange-100 text-orange-600"
              }
            ].map((step, index) => (
              <Card key={index} className="border-0 shadow-md relative group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 mt-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </CardContent>

                {/* Connecting line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-300 to-blue-300"></div>
                )}
              </Card>
            ))}
          </div>

          {/* AI Features Highlight */}
          <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              🤖 AI-Powered Smart Matching
            </h3>
            <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              Our advanced AI analyzes food quality, matches with nearby NGOs, and optimizes delivery routes for maximum impact
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                <span className="text-sm">Image Quality Analysis</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                <span className="text-sm">Smart NGO Matching</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                <span className="text-sm">Route Optimization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Your Impact Matters
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Every donation creates a ripple effect of positive change in your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-0 text-white hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-lg opacity-90">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Real Impact Numbers */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2.5M+</div>
              <div className="text-lg opacity-90">Meals Served Globally</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$50M+</div>
              <div className="text-lg opacity-90">Food Waste Value Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">Tons CO2 Emissions Prevented</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 rounded-xl shadow-lg"
              onClick={() => setShowForm(true)}
            >
              Start Your Donation Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-red-50 border-t-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-red-800 mb-4">
              🚨 Emergency Food Donation
            </h3>
            <p className="text-red-700 mb-6">
              For urgent food donations during disasters, emergencies, or large-scale events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Phone className="mr-2 w-5 h-5" />
                Emergency Hotline: 1-800-FOOD-911
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <Mail className="mr-2 w-5 h-5" />
                emergency@zerowastelink.org
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ZeroWasteLink</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">2.0</Badge>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Connecting donors with NGOs to reduce food waste and fight hunger globally.
              </p>
              <div className="text-sm text-gray-400">
                <p>🌍 Global Impact Platform</p>
                <p>Registered Non-Profit Organization</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/donate" className="hover:text-white transition-colors">Donate Food</Link></li>
                <li><Link href="/auth/register?role=ngo" className="hover:text-white transition-colors">Join as NGO</Link></li>
                <li><Link href="/auth/register?role=volunteer" className="hover:text-white transition-colors">Become Volunteer</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="tel:1-800-FOOD-HELP" className="hover:text-white transition-colors">1-800-FOOD-HELP</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Food Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Impact Reports</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Food Safety Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Non-Profit Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 ZeroWasteLink 2.0. All rights reserved. | Making a global impact 🌍</p>
            <p className="mt-2">Together we can end hunger - One meal at a time</p>
          </div>
        </div>
      </footer>
    </div>
  );
}