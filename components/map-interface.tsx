'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Package, 
  Clock, 
  Phone,
  MessageSquare,
  Route,
  Target,
  AlertCircle,
  CheckCircle,
  Heart,
  Building,
  User,
  RefreshCw,
  Zap
} from 'lucide-react';

// Leaflet imports
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mock data for demonstration
interface Location {
  id: string;
  lat: number;
  lng: number;
  address: string;
  type: 'donor' | 'ngo' | 'volunteer' | 'pickup' | 'delivery';
  name: string;
  status?: 'pending' | 'active' | 'completed';
  details?: {
    foodType?: string;
    quantity?: string;
    estimatedTime?: string;
    contact?: string;
  };
}

const mockLocations: Location[] = [
  {
    id: 'donor1',
    lat: 19.0760,
    lng: 72.8777,
    address: 'Andheri West, Mumbai, Maharashtra 400058',
    type: 'donor',
    name: 'Taj Hotel Mumbai',
    status: 'active',
    details: {
      foodType: 'Cooked Food',
      quantity: '25 kg',
      contact: '+91 98765 43210'
    }
  },
  {
    id: 'ngo1',
    lat: 19.0463,
    lng: 72.8570,
    address: 'Dharavi, Mumbai, Maharashtra 400017',
    type: 'ngo',
    name: 'Mumbai Food Bank',
    status: 'active',
    details: {
      contact: '+91 98765 43211'
    }
  },
  {
    id: 'volunteer1',
    lat: 19.0596,
    lng: 72.8295,
    address: 'Currently in Bandra West',
    type: 'volunteer',
    name: 'Rajesh Kumar (Volunteer)',
    status: 'active',
    details: {
      estimatedTime: '15 min to pickup',
      contact: '+91 98765 43212'
    }
  },
  {
    id: 'pickup1',
    lat: 19.1197,
    lng: 72.8464,
    address: 'Big Bazaar, Andheri East',
    type: 'pickup',
    name: 'Pickup Location #2',
    status: 'pending',
    details: {
      foodType: 'Packaged Food',
      quantity: '40 kg',
      estimatedTime: '45 min'
    }
  },
  {
    id: 'delivery1',
    lat: 19.1075,
    lng: 72.8263,
    address: 'Annamrita Foundation, Juhu',
    type: 'delivery',
    name: 'Delivery Location #2',
    status: 'pending',
    details: {
      estimatedTime: '1 hr 20 min'
    }
  }
];

const mockRoute = [
  { lat: 19.0596, lng: 72.8295, time: '14:50', status: 'current' },
  { lat: 19.0760, lng: 72.8777, time: '15:05', status: 'next' },
  { lat: 19.0463, lng: 72.8570, time: '15:30', status: 'upcoming' },
  { lat: 19.1197, lng: 72.8464, time: '16:00', status: 'upcoming' },
  { lat: 19.1075, lng: 72.8263, time: '16:30', status: 'upcoming' }
];

export default function MapInterface() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showRoute, setShowRoute] = useState(true);
  const [trackingMode, setTrackingMode] = useState<'overview' | 'navigation' | 'delivery'>('overview');
  const [isLive, setIsLive] = useState(true);

  // Fix for default markers
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  // Custom icon creators
  const createCustomIcon = (type: string, status?: string) => {
    const colors = {
      donor: status === 'completed' ? '#10b981' : status === 'active' ? '#3b82f6' : '#6b7280',
      ngo: status === 'completed' ? '#10b981' : status === 'active' ? '#8b5cf6' : '#6b7280',
      volunteer: status === 'completed' ? '#10b981' : status === 'active' ? '#f59e0b' : '#6b7280',
      pickup: status === 'completed' ? '#10b981' : status === 'active' ? '#ef4444' : '#6b7280',
      delivery: status === 'completed' ? '#10b981' : status === 'active' ? '#06b6d4' : '#6b7280',
    };

    const color = colors[type as keyof typeof colors] || '#6b7280';
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <div style="color: white; font-size: 12px; font-weight: bold;">
          ${type === 'donor' ? '♥' : type === 'ngo' ? '🏢' : type === 'volunteer' ? '🚚' : type === 'pickup' ? '📦' : '🎯'}
        </div>
      </div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map centered on Mumbai
      const map = L.map(mapRef.current).setView([19.0760, 72.8777], 12);

      // Add OpenStreetMap tiles (free alternative to Google Maps)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Create markers layer group
      const markersGroup = L.layerGroup().addTo(map);

      // Add markers for all locations
      mockLocations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng], {
          icon: createCustomIcon(location.type, location.status)
        });

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${location.address}</p>
            ${location.status ? `<span style="background: ${location.status === 'active' ? '#3b82f6' : location.status === 'completed' ? '#10b981' : '#f59e0b'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px;">${location.status}</span>` : ''}
            ${location.details?.foodType ? `<br><br><strong>Food Type:</strong> ${location.details.foodType}` : ''}
            ${location.details?.quantity ? `<br><strong>Quantity:</strong> ${location.details.quantity}` : ''}
            ${location.details?.estimatedTime ? `<br><strong>ETA:</strong> ${location.details.estimatedTime}` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        
        // Add click handler
        marker.on('click', () => {
          setSelectedLocation(location);
        });

        markersGroup.addLayer(marker);
      });

      // Create route polyline
      const routeCoords: [number, number][] = mockRoute.map(point => [point.lat, point.lng]);
      const routeLine = L.polyline(routeCoords, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
      }).addTo(map);

      // Store references
      mapInstanceRef.current = map;
      markersRef.current = markersGroup;
      routeLayerRef.current = routeLine;

      // Cleanup function
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Update route visibility
  useEffect(() => {
    if (routeLayerRef.current && mapInstanceRef.current) {
      if (showRoute) {
        routeLayerRef.current.addTo(mapInstanceRef.current);
      } else {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }
    }
  }, [showRoute]);

  const getLocationIcon = (type: string, status?: string) => {
    const iconClass = status === 'completed' ? 'text-green-600' : status === 'active' ? 'text-blue-600' : 'text-gray-600';
    
    switch (type) {
      case 'donor': return <Heart className={`w-5 h-5 ${iconClass}`} />;
      case 'ngo': return <Building className={`w-5 h-5 ${iconClass}`} />;
      case 'volunteer': return <Truck className={`w-5 h-5 ${iconClass}`} />;
      case 'pickup': return <Package className={`w-5 h-5 ${iconClass}`} />;
      case 'delivery': return <Target className={`w-5 h-5 ${iconClass}`} />;
      default: return <MapPin className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleStartNavigation = () => {
    if (selectedLocation) {
      // Use OpenStreetMap-based navigation instead of Google Maps
      const osmUrl = `https://www.openstreetmap.org/directions?from=${19.0760},${72.8777}&to=${selectedLocation.lat},${selectedLocation.lng}`;
      window.open(osmUrl, '_blank');
    }
  };

  const centerMapOnLocation = (location: Location) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.lat, location.lng], 15);
    }
  };

  const centerMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([19.0760, 72.8777], 12);
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Live Tracking</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">{isLive ? 'Live' : 'Offline'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={trackingMode === 'overview' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTrackingMode('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={trackingMode === 'navigation' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTrackingMode('navigation')}
          >
            Navigation
          </Button>
          <Button 
            variant={trackingMode === 'delivery' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTrackingMode('delivery')}
          >
            Delivery
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                {/* Leaflet Map Container */}
                <div 
                  ref={mapRef}
                  className="h-[500px] w-full rounded-lg"
                  style={{ zIndex: 1 }}
                />

                {/* Map Controls Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2" style={{ zIndex: 1000 }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowRoute(!showRoute)}
                    className="shadow-lg"
                  >
                    <Route className="w-4 h-4 mr-2" />
                    {showRoute ? 'Hide Route' : 'Show Route'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="shadow-lg"
                    onClick={centerMap}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Center
                  </Button>
                </div>

                {/* Live Updates Indicator */}
                <div className="absolute bottom-4 left-4" style={{ zIndex: 1000 }}>
                  <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live Updates</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Selected Location Details */}
          {selectedLocation && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  {getLocationIcon(selectedLocation.type, selectedLocation.status)}
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedLocation.name}</h3>
                  <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                  <Badge variant="outline" className={`mt-2 ${getStatusColor(selectedLocation.status)}`}>
                    {selectedLocation.status}
                  </Badge>
                </div>

                {selectedLocation.details && (
                  <div className="space-y-2">
                    {selectedLocation.details.foodType && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Food Type:</span>
                        <span className="text-sm font-medium">{selectedLocation.details.foodType}</span>
                      </div>
                    )}
                    {selectedLocation.details.quantity && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <span className="text-sm font-medium">{selectedLocation.details.quantity}</span>
                      </div>
                    )}
                    {selectedLocation.details.estimatedTime && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ETA:</span>
                        <span className="text-sm font-medium">{selectedLocation.details.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleStartNavigation}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => centerMapOnLocation(selectedLocation)}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Center
                  </Button>
                  {selectedLocation.details?.contact && (
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Route Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                Today's Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRoute.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      point.status === 'current' ? 'bg-blue-500 animate-pulse' :
                      point.status === 'next' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Stop {index + 1}</div>
                      <div className="text-xs text-gray-500">{point.time}</div>
                    </div>
                    {point.status === 'current' && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nearby Locations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Nearby Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLocations.slice(0, 3).map((location) => (
                  <div 
                    key={location.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleLocationClick(location)}
                  >
                    {getLocationIcon(location.type, location.status)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{location.name}</div>
                      <div className="text-xs text-gray-500 truncate">{location.address}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {location.details?.estimatedTime || '---'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Request Delay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Real-time map powered by Leaflet.js with OpenStreetMap. Live GPS tracking, 
          route optimization, and location updates via WebSocket connections.
        </AlertDescription>
      </Alert>
    </div>
  );
}
