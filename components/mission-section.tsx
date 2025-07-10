'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Target, Globe, Heart, Users } from 'lucide-react';

export function MissionSection() {
  const missions = [
    {
      icon: Target,
      title: "Zero Food Waste",
      description: "Our goal is to eliminate food waste by creating efficient redistribution networks that connect surplus food with those who need it most.",
      color: "text-green-600"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Building a worldwide movement to address hunger and food insecurity through technology, community engagement, and sustainable practices.",
      color: "text-blue-600"
    },
    {
      icon: Heart,
      title: "Community First",
      description: "Empowering local communities by fostering connections between donors, NGOs, and volunteers to create lasting positive change.",
      color: "text-pink-600"
    },
    {
      icon: Users,
      title: "Inclusive Platform",
      description: "Creating an accessible platform that welcomes everyone - from individual donors to large organizations - to participate in fighting hunger.",
      color: "text-purple-600"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Mission & Vision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building a world where no food goes to waste and no one goes hungry. Through technology and community collaboration, we're creating sustainable solutions for a better future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {missions.map((mission, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8">
                <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <mission.icon className={`w-8 h-8 ${mission.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {mission.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {mission.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Impact statement */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-6">
            Together, We Can End Hunger
          </h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Every donation matters. Every volunteer makes a difference. Every NGO partnership creates hope. Join us in building a future where abundance reaches everyone.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">1.3B</div>
              <div className="text-lg opacity-90">Tons of food wasted globally</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">828M</div>
              <div className="text-lg opacity-90">People facing hunger</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">Preventable with action</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}