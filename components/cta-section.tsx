'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Heart, Users, Truck } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  const roles = [
    {
      icon: Heart,
      title: "Become a Donor",
      description: "Share your excess food with those in need",
      action: "Start Donating",
      link: "/donate",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: Users,
      title: "Join as NGO",
      description: "Connect with donors and expand your reach",
      action: "Register NGO",
      link: "/auth/register?role=ngo",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Truck,
      title: "Volunteer Today",
      description: "Help deliver hope to your community",
      action: "Join Volunteers",
      link: "/auth/register?role=volunteer",
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your role and join thousands of people already making an impact in their communities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className={`w-8 h-8 text-gray-600`} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {role.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {role.description}
                </p>
                
                <Link href={role.link}>
                  <Button 
                    className={`w-full ${role.color} text-white py-3 rounded-xl group-hover:shadow-lg transition-all duration-200`}
                  >
                    {role.action}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you get started and make the most impact possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Contact Support
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}