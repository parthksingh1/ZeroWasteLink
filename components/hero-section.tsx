'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Play, MapPin, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-purple-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Fighting hunger, one meal at a time
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Turn Food Waste Into
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Hope</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with local NGOs and volunteers to redistribute excess food from restaurants and homes to those in need. Together, we can reduce waste and fight hunger.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">Meals Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">200+</div>
                <div className="text-sm text-gray-600">NGO Partners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1K+</div>
                <div className="text-sm text-gray-600">Volunteers</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/donate">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  Donate Food Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-300 hover:border-green-600 hover:text-green-600 px-8 py-4 rounded-xl group"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-sm">Available in 50+ cities</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right side - Hero image/illustration */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Volunteers distributing food"
                className="rounded-2xl shadow-2xl"
              />
              
              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">250 Meals</div>
                    <div className="text-sm text-gray-500">Donated today</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">15 NGOs</div>
                    <div className="text-sm text-gray-500">Active nearby</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 rounded-2xl transform rotate-3 -z-10 opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}