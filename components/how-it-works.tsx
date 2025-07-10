'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Truck, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Heart,
      title: "Donate Food",
      description: "Restaurants and individuals post excess food details with photos and pickup times.",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Users,
      title: "NGO Reviews",
      description: "Local NGOs review donations and accept those that match their capacity and needs.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Truck,
      title: "Volunteer Pickup",
      description: "Trained volunteers are assigned to collect food and transport it safely to beneficiaries.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: CheckCircle,
      title: "Impact Delivered",
      description: "Food reaches those in need, reducing waste and providing nutritious meals to communities.",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple 4-step process connects food donors with NGOs and volunteers to create maximum impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8 text-center">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>

              {/* Connecting line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-300 to-blue-300"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Real-time Tracking & Communication
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Every donation is tracked from pickup to delivery with live updates. Built-in chat keeps all parties connected throughout the process.
          </p>
          <div className="flex justify-center items-center space-x-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Live GPS Tracking</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Instant Messaging</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Impact Reports</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}