'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Camera,
  Calendar,
  Plus,
  X,
  Leaf,
  Zap,
  Phone,
  Star
} from 'lucide-react';

interface DonationFormProps {
  onBack: () => void;
}

export function DonationForm({ onBack }: DonationFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: '',
    cuisine: '',
    quantity: { amount: '', unit: 'kg' },
    expiryDate: '',
    location: { lat: '', lng: '' },
    address: {
      street: '',
      area: '',
      landmark: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States'
    },
    pickupWindow: { start: '', end: '' },
    notes: '',
    specialInstructions: '',
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isHalal: false,
      isKosher: false,
      allergens: []
    }
  });

  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway',
    'India', 'Japan', 'South Korea', 'Singapore', 'New Zealand'
  ];

  const cuisineTypes = [
    'American', 'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese',
    'French', 'Thai', 'Mediterranean', 'Middle Eastern', 'Korean',
    'Vietnamese', 'Greek', 'Spanish', 'German', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI analysis results
      const mockAnalysis = {
        freshness: Math.floor(Math.random() * 30) + 70,
        nutritionalValue: Math.floor(Math.random() * 25) + 75,
        estimatedMeals: Math.floor(parseInt(formData.quantity.amount) * 0.8),
        carbonFootprintSaved: Math.floor(parseInt(formData.quantity.amount) * 2.5),
        matchedNGOs: 3,
        estimatedPickupTime: '30-45 minutes'
      };
      
      setAiAnalysis(mockAnalysis);
      
      // Show success message
      alert(`🎉 Donation submitted successfully! 
      
AI Analysis Results:
• Freshness Score: ${mockAnalysis.freshness}%
• Estimated Meals: ${mockAnalysis.estimatedMeals}
• Carbon Footprint Saved: ${mockAnalysis.carbonFootprintSaved} kg CO2
• Matched NGOs: ${mockAnalysis.matchedNGOs}
• Estimated Pickup: ${mockAnalysis.estimatedPickupTime}

NGOs in your area will review your donation and contact you shortly.`);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        foodType: '',
        cuisine: '',
        quantity: { amount: '', unit: 'kg' },
        expiryDate: '',
        location: { lat: '', lng: '' },
        address: {
          street: '',
          area: '',
          landmark: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'United States'
        },
        pickupWindow: { start: '', end: '' },
        notes: '',
        specialInstructions: '',
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isHalal: false,
          isKosher: false,
          allergens: []
        }
      });
      setImages([]);
      setCurrentStep(1);
    } catch (error) {
      alert('Error submitting donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5));
    
    // Simulate AI image analysis
    if (files.length > 0) {
      const mockImageAnalysis = {
        freshness: Math.floor(Math.random() * 30) + 70,
        quality: Math.floor(Math.random() * 25) + 75,
        spoilageDetected: Math.random() < 0.1,
        confidence: Math.floor(Math.random() * 20) + 80
      };
      
      // Show AI analysis results
      setTimeout(() => {
        alert(`🤖 AI Image Analysis Complete:
        
• Freshness: ${mockImageAnalysis.freshness}%
• Quality: ${mockImageAnalysis.quality}%
• Spoilage Detected: ${mockImageAnalysis.spoilageDetected ? 'Yes' : 'No'}
• Confidence: ${mockImageAnalysis.confidence}%

${mockImageAnalysis.spoilageDetected ? '⚠️ Please check food quality before donation' : '✅ Food appears fresh and suitable for donation'}`);
      }, 1000);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-green-50 text-green-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Donation Info
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Donate Food
              </h1>
              <p className="text-gray-600">
                Fill out the details below to submit your food donation. Our AI will analyze and match with the best NGOs.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">AI-Powered</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 ${
                    step < currentStep ? 'bg-gradient-to-r from-green-600 to-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  Basic Information
                  <Badge className="ml-2 bg-blue-100 text-blue-800">Required</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Donation Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Fresh Pasta from Restaurant Event"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the food items, preparation method, ingredients, and any special notes..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="foodType">Food Type *</Label>
                    <Select value={formData.foodType} onValueChange={(value) => setFormData({ ...formData, foodType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select food type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cooked-meals">🍽️ Cooked Meals</SelectItem>
                        <SelectItem value="fresh-produce">🥬 Fresh Produce</SelectItem>
                        <SelectItem value="packaged-food">📦 Packaged Food</SelectItem>
                        <SelectItem value="dairy-products">🥛 Dairy Products</SelectItem>
                        <SelectItem value="baked-goods">🍞 Baked Goods</SelectItem>
                        <SelectItem value="beverages">🥤 Beverages</SelectItem>
                        <SelectItem value="frozen-food">🧊 Frozen Food</SelectItem>
                        <SelectItem value="desserts">🍰 Desserts</SelectItem>
                        <SelectItem value="grains-cereals">🌾 Grains & Cereals</SelectItem>
                        <SelectItem value="snacks">🍿 Snacks</SelectItem>
                        <SelectItem value="other">🥄 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cuisine">Cuisine Type</Label>
                    <Select value={formData.cuisine} onValueChange={(value) => setFormData({ ...formData, cuisine: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineTypes.map((cuisine) => (
                          <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity.amount}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          quantity: { ...formData.quantity, amount: e.target.value }
                        })}
                        placeholder="Amount"
                        required
                      />
                      <Select value={formData.quantity.unit} onValueChange={(value) => setFormData({ 
                        ...formData, 
                        quantity: { ...formData.quantity, unit: value }
                      })}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="lbs">lbs</SelectItem>
                          <SelectItem value="liters">liters</SelectItem>
                          <SelectItem value="gallons">gallons</SelectItem>
                          <SelectItem value="pieces">pieces</SelectItem>
                          <SelectItem value="servings">servings</SelectItem>
                          <SelectItem value="boxes">boxes</SelectItem>
                          <SelectItem value="bags">bags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="expiryDate">Best Before *</Label>
                    <Input
                      id="expiryDate"
                      type="datetime-local"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Dietary Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Dietary Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="vegetarian"
                        checked={formData.dietaryInfo.isVegetarian}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          dietaryInfo: { ...formData.dietaryInfo, isVegetarian: e.target.checked }
                        })}
                        className="rounded"
                      />
                      <Label htmlFor="vegetarian" className="flex items-center">
                        <Leaf className="w-4 h-4 mr-1 text-green-600" />
                        Vegetarian
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="vegan"
                        checked={formData.dietaryInfo.isVegan}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          dietaryInfo: { ...formData.dietaryInfo, isVegan: e.target.checked }
                        })}
                        className="rounded"
                      />
                      <Label htmlFor="vegan">Vegan</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="glutenFree"
                        checked={formData.dietaryInfo.isGlutenFree}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          dietaryInfo: { ...formData.dietaryInfo, isGlutenFree: e.target.checked }
                        })}
                        className="rounded"
                      />
                      <Label htmlFor="glutenFree">Gluten-Free</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="halal"
                        checked={formData.dietaryInfo.isHalal}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          dietaryInfo: { ...formData.dietaryInfo, isHalal: e.target.checked }
                        })}
                        className="rounded"
                      />
                      <Label htmlFor="halal">Halal</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="kosher"
                        checked={formData.dietaryInfo.isKosher}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          dietaryInfo: { ...formData.dietaryInfo, isKosher: e.target.checked }
                        })}
                        className="rounded"
                      />
                      <Label htmlFor="kosher">Kosher</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-green-600 to-blue-600">
                    Next Step
                    <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location Information */}
          {currentStep === 2 && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  Location Information
                  <Badge className="ml-2 bg-blue-100 text-blue-800">Required</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, street: e.target.value }
                    })}
                    placeholder="House/Building No., Street Name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="area">Area/Neighborhood *</Label>
                    <Input
                      id="area"
                      value={formData.address.area}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, area: e.target.value }
                      })}
                      placeholder="Neighborhood, District"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      value={formData.address.landmark}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, landmark: e.target.value }
                      })}
                      placeholder="Near Mall, Station, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, city: e.target.value }
                      })}
                      placeholder="New York, London, Mumbai"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, state: e.target.value }
                      })}
                      placeholder="State or Province"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={formData.address.postalCode}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, postalCode: e.target.value }
                      })}
                      placeholder="10001, SW1A 1AA, 400001"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.address.country} onValueChange={(value) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, country: value }
                    })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location Services */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">📍 Auto-detect Location</h4>
                      <p className="text-sm text-gray-600">Allow location access for faster pickup matching</p>
                    </div>
                    <Button type="button" variant="outline" className="border-blue-600 text-blue-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Location
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={prevStep} variant="outline">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-green-600 to-blue-600">
                    Next Step
                    <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Pickup & Photos */}
          {currentStep === 3 && (
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  Pickup Information & Photos
                  <Badge className="ml-2 bg-blue-100 text-blue-800">Required</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="pickupStart">Pickup Available From *</Label>
                    <Input
                      id="pickupStart"
                      type="datetime-local"
                      value={formData.pickupWindow.start}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        pickupWindow: { ...formData.pickupWindow, start: e.target.value }
                      })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="pickupEnd">Pickup Available Until *</Label>
                    <Input
                      id="pickupEnd"
                      type="datetime-local"
                      value={formData.pickupWindow.end}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        pickupWindow: { ...formData.pickupWindow, end: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Special Pickup Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="Gate number, floor, contact person, parking instructions, etc."
                    rows={3}
                  />
                </div>

                {/* Image Upload with AI Analysis */}
                <div>
                  <Label className="flex items-center mb-4">
                    <Camera className="w-5 h-5 mr-2" />
                    Food Photos *
                    <Badge className="ml-2 bg-blue-100 text-blue-800">AI Analysis Enabled</Badge>
                  </Label>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB (max 5 images)</p>
                          <p className="text-xs text-blue-600 mt-1">🤖 AI will analyze food quality automatically</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                              <div className="flex items-center">
                                <Zap className="w-3 h-3 mr-1" />
                                AI Analyzing...
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional information about the food, storage conditions, or special requirements..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={prevStep} variant="outline">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-green-600 to-blue-600">
                    Next Step
                    <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  Review & Submit
                  <Badge className="ml-2 bg-green-100 text-green-800">Final Step</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Review Summary */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Donation Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Food Details</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li><strong>Title:</strong> {formData.title}</li>
                        <li><strong>Type:</strong> {formData.foodType}</li>
                        <li><strong>Cuisine:</strong> {formData.cuisine}</li>
                        <li><strong>Quantity:</strong> {formData.quantity.amount} {formData.quantity.unit}</li>
                        <li><strong>Vegetarian:</strong> {formData.dietaryInfo.isVegetarian ? 'Yes' : 'No'}</li>
                        <li><strong>Vegan:</strong> {formData.dietaryInfo.isVegan ? 'Yes' : 'No'}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Pickup Details</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li><strong>Location:</strong> {formData.address.area}, {formData.address.city}</li>
                        <li><strong>Postal Code:</strong> {formData.address.postalCode}</li>
                        <li><strong>Country:</strong> {formData.address.country}</li>
                        <li><strong>Available From:</strong> {new Date(formData.pickupWindow.start).toLocaleString()}</li>
                        <li><strong>Available Until:</strong> {new Date(formData.pickupWindow.end).toLocaleString()}</li>
                        <li><strong>Photos:</strong> {images.length} uploaded</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI Predictions */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-600" />
                    AI Predictions
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formData.quantity.amount ? Math.floor(parseInt(formData.quantity.amount) * 0.8) : 0}
                      </div>
                      <div className="text-sm text-gray-600">Estimated Meals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">3-5</div>
                      <div className="text-sm text-gray-600">Matched NGOs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">30-45</div>
                      <div className="text-sm text-gray-600">Pickup Time (min)</div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Contact
                  </h4>
                  <p className="text-sm text-gray-600">
                    For urgent donations or issues, call our 24/7 helpline: <strong>1-800-FOOD-911</strong>
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button type="button" onClick={prevStep} variant="outline">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Previous
                  </Button>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full w-5 h-5 border-b-2 border-white mr-2"></div>
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Submit Donation
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">Call Support</div>
                <div className="text-sm text-gray-600">1-800-FOOD-HELP</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium">Live Chat</div>
                <div className="text-sm text-gray-600">Available 24/7</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium">Local Coordinator</div>
                <div className="text-sm text-gray-600">Based on your location</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}