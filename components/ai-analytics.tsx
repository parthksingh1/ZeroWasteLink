'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  Brain, 
  Lightbulb, 
  Target, 
  Award,
  Leaf,
  Users,
  Package,
  Clock,
  MapPin,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Heart,
  Building,
  Truck,
  Globe,
  Zap,
  Star
} from 'lucide-react';

// Mock AI-generated insights
const mockInsights = {
  foodWastePrevention: {
    totalSaved: 12567, // kg
    carbonFootprint: 30161, // kg CO2 equivalent
    mealsProvided: 31418,
    waterSaved: 188500, // liters
    economicValue: 754020, // INR
    growth: {
      monthly: 12.5,
      weekly: 3.2,
      daily: 0.8
    }
  },
  predictions: [
    {
      type: 'high_waste_period',
      title: 'Peak Waste Period Predicted',
      description: 'Wedding season (Nov-Feb) typically sees 40% more food waste. Prepare extra volunteer capacity.',
      confidence: 92,
      timeframe: '2 weeks',
      impact: 'high',
      actions: ['Recruit 15 more volunteers', 'Partner with 5 event caterers', 'Set up emergency collection points']
    },
    {
      type: 'demand_surge',
      title: 'Increased Demand Expected',
      description: 'NGO requests likely to increase by 25% in Dharavi area due to monsoon season.',
      confidence: 87,
      timeframe: '1 month',
      impact: 'medium',
      actions: ['Contact local NGOs', 'Stock emergency supplies', 'Optimize delivery routes']
    },
    {
      type: 'efficiency_opportunity',
      title: 'Route Optimization Opportunity',
      description: 'AI identified 18% potential reduction in delivery time for South Mumbai routes.',
      confidence: 95,
      timeframe: 'immediate',
      impact: 'medium',
      actions: ['Update volunteer routes', 'Implement new pickup schedule', 'Use traffic data integration']
    }
  ],
  trends: {
    foodTypes: [
      { name: 'Cooked Food', percentage: 45, change: +5.2, volume: '5,655 kg' },
      { name: 'Fresh Produce', percentage: 28, change: -2.1, volume: '3,519 kg' },
      { name: 'Packaged Food', percentage: 18, change: +8.7, volume: '2,262 kg' },
      { name: 'Dairy Products', percentage: 9, change: +1.3, volume: '1,131 kg' }
    ],
    locations: [
      { area: 'Andheri West', donations: 234, efficiency: 94, growth: +12.3 },
      { area: 'Bandra', donations: 189, efficiency: 87, growth: +8.1 },
      { area: 'Powai', donations: 156, efficiency: 91, growth: +15.6 },
      { area: 'Colaba', donations: 143, efficiency: 89, growth: +6.7 },
      { area: 'Kurla', donations: 98, efficiency: 92, growth: +22.1 }
    ],
    timePatterns: {
      peak_hours: ['11:00-13:00', '18:00-20:00'],
      peak_days: ['Wednesday', 'Friday', 'Sunday'],
      seasonal_trends: 'Winter months see 35% more donations'
    }
  },
  recommendations: [
    {
      title: 'Smart NGO Matching',
      description: 'AI suggests pairing large-scale donors with specialized NGOs based on food type and location.',
      impact: '+23% efficiency',
      difficulty: 'Easy',
      timeToImplement: '1 week'
    },
    {
      title: 'Predictive Volunteer Scheduling',
      description: 'Use ML to predict high-demand periods and automatically schedule volunteers.',
      impact: '+31% response time',
      difficulty: 'Medium',
      timeToImplement: '2 weeks'
    },
    {
      title: 'Dynamic Pricing for Emergency Pickups',
      description: 'Implement surge pricing during peak hours to incentivize immediate pickups.',
      impact: '+18% coverage',
      difficulty: 'Hard',
      timeToImplement: '1 month'
    }
  ],
  sustainability: {
    sdgGoals: [
      { goal: 'Zero Hunger', progress: 78, target: 85 },
      { goal: 'Climate Action', progress: 65, target: 70 },
      { goal: 'Sustainable Cities', progress: 82, target: 90 },
      { goal: 'Responsible Consumption', progress: 91, target: 95 }
    ],
    environmental: {
      co2Reduced: 30161, // kg
      waterSaved: 188500, // liters
      landfillDiverted: 12567, // kg
      energySaved: 25134 // kWh equivalent
    }
  }
};

export default function AIAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const generateNewInsight = async () => {
    setIsGeneratingInsight(true);
    // Mock AI insight generation
    setTimeout(() => {
      setIsGeneratingInsight(false);
    }, 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Impact Analytics</h1>
            <p className="text-gray-600">Smart insights powered by machine learning</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateNewInsight}
            disabled={isGeneratingInsight}
          >
            {isGeneratingInsight ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate Insight
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Saved</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockInsights.foodWastePrevention.totalSaved)} kg</div>
            <p className="text-xs text-green-100 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{mockInsights.foodWastePrevention.growth.monthly}% this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meals Provided</CardTitle>
            <Heart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockInsights.foodWastePrevention.mealsProvided)}</div>
            <p className="text-xs text-blue-100">Estimated from donations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
            <Leaf className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockInsights.foodWastePrevention.carbonFootprint)} kg</div>
            <p className="text-xs text-purple-100">Carbon footprint reduction</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economic Value</CardTitle>
            <Award className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{formatNumber(mockInsights.foodWastePrevention.economicValue)}</div>
            <p className="text-xs text-orange-100">Food waste prevented</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recommendations">Smart Suggestions</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Real-time Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500 rounded-full">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900">Donation Spike Detected</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        35% increase in donations from restaurants in the last 2 hours. 
                        Festival preparation phase identified.
                      </p>
                      <Badge variant="outline" className="mt-2 border-blue-300 text-blue-700">
                        Action needed: Deploy more volunteers
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500 rounded-full">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">Optimal NGO Match Found</h4>
                      <p className="text-sm text-green-700 mt-1">
                        AI identified perfect match: ITC Grand's surplus → Akshaya Patra Foundation.
                        97% compatibility score.
                      </p>
                      <Badge variant="outline" className="mt-2 border-green-300 text-green-700">
                        Auto-matched successfully
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500 rounded-full">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900">Efficiency Improvement</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Route optimization reduced average delivery time by 23 minutes today.
                        12 additional families served.
                      </p>
                      <Badge variant="outline" className="mt-2 border-purple-300 text-purple-700">
                        System optimized
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Donation Success Rate</span>
                    <span className="text-sm text-gray-600">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Volunteer Efficiency</span>
                    <span className="text-sm text-gray-600">89.7%</span>
                  </div>
                  <Progress value={89.7} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">NGO Response Time</span>
                    <span className="text-sm text-gray-600">91.5%</span>
                  </div>
                  <Progress value={91.5} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Food Quality Maintenance</span>
                    <span className="text-sm text-gray-600">96.8%</span>
                  </div>
                  <Progress value={96.8} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Today's Impact</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">127</div>
                      <div className="text-xs text-gray-600">Donations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">2.4K</div>
                      <div className="text-xs text-gray-600">Meals</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            {mockInsights.predictions.map((prediction, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{prediction.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getImpactColor(prediction.impact)}>
                            {prediction.impact} impact
                          </Badge>
                          <Badge variant="secondary">
                            {prediction.confidence}% confidence
                          </Badge>
                          <Badge variant="outline">
                            {prediction.timeframe}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{prediction.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Recommended Actions
                    </h4>
                    <ul className="space-y-1">
                      {prediction.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Food Type Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-500" />
                  Food Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInsights.trends.foodTypes.map((food, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{food.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{food.volume}</span>
                          <div className={`flex items-center gap-1 ${food.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {food.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span className="text-xs">{Math.abs(food.change)}%</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={food.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Top Performing Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInsights.trends.locations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{location.area}</div>
                        <div className="text-sm text-gray-600">{location.donations} donations</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {location.efficiency}% efficiency
                          </Badge>
                          <div className={`flex items-center gap-1 ${location.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-xs">+{location.growth}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Time-based Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Peak Hours</h4>
                  <div className="space-y-2">
                    {mockInsights.trends.timePatterns.peak_hours.map((hour, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {hour}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Peak Days</h4>
                  <div className="space-y-2">
                    {mockInsights.trends.timePatterns.peak_days.map((day, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Seasonal Trends</h4>
                  <p className="text-sm text-gray-600">
                    {mockInsights.trends.timePatterns.seasonal_trends}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {mockInsights.recommendations.map((rec, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getDifficultyColor(rec.difficulty)}>
                        {rec.difficulty}
                      </Badge>
                      <Badge variant="secondary">
                        {rec.timeToImplement}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{rec.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-green-600">{rec.impact}</span>
                      <span className="text-sm text-gray-600">expected improvement</span>
                    </div>
                    <Button size="sm">
                      Implement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sustainability Tab */}
        <TabsContent value="sustainability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SDG Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  UN SDG Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockInsights.sustainability.sdgGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{goal.goal}</span>
                      <span className="text-sm text-gray-600">{goal.progress}% / {goal.target}%</span>
                    </div>
                    <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatNumber(mockInsights.sustainability.environmental.co2Reduced)}</div>
                    <div className="text-sm text-gray-600">kg CO₂ Reduced</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatNumber(mockInsights.sustainability.environmental.waterSaved)}</div>
                    <div className="text-sm text-gray-600">Liters Water Saved</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{formatNumber(mockInsights.sustainability.environmental.landfillDiverted)}</div>
                    <div className="text-sm text-gray-600">kg from Landfill</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{formatNumber(mockInsights.sustainability.environmental.energySaved)}</div>
                    <div className="text-sm text-gray-600">kWh Energy Saved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
