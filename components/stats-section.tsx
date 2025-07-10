'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, MapPin, Award } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: "2.5M+",
      label: "Meals Served",
      description: "Nutritious meals delivered to those in need",
      color: "text-green-600"
    },
    {
      icon: Users,
      value: "15K+",
      label: "Active Users",
      description: "Donors, NGOs, and volunteers working together",
      color: "text-blue-600"
    },
    {
      icon: MapPin,
      value: "50+",
      label: "Cities",
      description: "Growing network across major urban areas",
      color: "text-purple-600"
    },
    {
      icon: Award,
      value: "95%",
      label: "Success Rate",
      description: "Donations successfully delivered to recipients",
      color: "text-orange-600"
    }
  ];

  return (
    <section id="impact" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Together, we're creating a significant positive impact on food waste and hunger in communities worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {stat.label}
                </div>
                
                <p className="text-sm text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional metrics */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">1.2M kg</div>
              <div className="text-gray-600">Food Waste Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">$3.2M</div>
              <div className="text-gray-600">Economic Value Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">850 tons</div>
              <div className="text-gray-600">CO2 Emissions Reduced</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}