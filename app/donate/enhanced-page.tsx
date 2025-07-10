'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import Link from 'next/link';

export default function DonatePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    donorType: 'restaurant',
    foodType: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    expiryTime: '',
    
    // Location
    pickupLocation: {
      address: '',
      area: '',
      city: '',
      state: '',
      postalCode: '',
      landmark: '',
      coordinates: { lat: 0, lng: 0 }
    },
    
    // Contact & Timing
    contactPerson: '',
    phoneNumber: '',
    email: '',
    preferredPickupTime: '',
    urgency: 'medium',
    
    // Food Details
    foodCondition: 'fresh',
    allergens: [],
    specialInstructions: '',
    packagingType: 'containers',
    estimatedMeals: '',
    
    // Images
    images: [],
    
    // Preferences
    preferredNGO: '',
    allowPublicRecognition: true,
    receiveUpdates: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);

  const steps = [
    { id: 1, title: 'Food Details', description: 'Tell us about the food' },
    { id: 2, title: 'Location & Timing', description: 'Where and when to pick up' },
    { id: 3, title: 'Contact Info', description: 'How to reach you' },
    { id: 4, title: 'Additional Details', description: 'Final information' },
    { id: 5, title: 'Review & Submit', description: 'Confirm your donation' }
  ];

  const donorTypes = [
    { value: 'restaurant', label: 'Restaurant/Hotel', icon: '🍽️' },
    { value: 'catering', label: 'Catering Service', icon: '🎉' },
    { value: 'grocery', label: 'Grocery Store', icon: '🛒' },
    { value: 'bakery', label: 'Bakery/Café', icon: '🥖' },
    { value: 'event', label: 'Event/Wedding', icon: '💒' },
    { value: 'home', label: 'Home Kitchen', icon: '🏠' },
    { value: 'corporate', label: 'Corporate Event', icon: '🏢' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  const foodTypes = [
    { value: 'cooked_food', label: 'Cooked Food', shelf: '2-4 hours' },
    { value: 'raw_vegetables', label: 'Raw Vegetables', shelf: '2-3 days' },
    { value: 'fruits', label: 'Fresh Fruits', shelf: '1-2 days' },
    { value: 'dairy', label: 'Dairy Products', shelf: '1-2 days' },
    { value: 'packaged', label: 'Packaged Food', shelf: '1-6 months' },
    { value: 'grains', label: 'Grains/Cereals', shelf: '6-12 months' },
    { value: 'bread', label: 'Bread/Bakery', shelf: '1-2 days' },
    { value: 'mixed', label: 'Mixed Items', shelf: 'Various' }
  ];

  const allergens = [
    'Nuts', 'Dairy', 'Eggs', 'Wheat/Gluten', 'Soy', 'Fish', 'Shellfish', 'Sesame'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'Can wait 4-6 hours', color: 'green' },
    { value: 'medium', label: 'Medium', description: 'Needs pickup in 2-4 hours', color: 'yellow' },
    { value: 'high', label: 'High', description: 'Urgent - within 2 hours', color: 'red' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAllergenToggle = (allergen) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // In real app, upload to Cloudinary
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name,
          size: file.size
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.donorType) newErrors.donorType = 'Please select donor type';
        if (!formData.foodType) newErrors.foodType = 'Please select food type';
        if (!formData.quantity) newErrors.quantity = 'Please enter quantity';
        break;
      case 2:
        if (!formData.pickupLocation.address) newErrors['pickupLocation.address'] = 'Address is required';
        if (!formData.pickupLocation.city) newErrors['pickupLocation.city'] = 'City is required';
        if (!formData.preferredPickupTime) newErrors.preferredPickupTime = 'Pickup time is required';
        break;
      case 3:
        if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.email) newErrors.email = 'Email is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    
    setIsLoading(true);
    try {
      // Submit to API
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: uploadedImages,
          submittedAt: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        router.push('/dashboard?success=donation_submitted');
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Donor Type */}
            <div>
              <Label className="text-base font-medium mb-4 block">What type of donor are you?</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {donorTypes.map(type => (
                  <div
                    key={type.value}
                    onClick={() => handleInputChange('donorType', type.value)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center hover:shadow-md ${
                      formData.donorType === type.value 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Type */}
            <div>
              <Label className="text-base font-medium mb-4 block">What type of food are you donating?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {foodTypes.map(food => (
                  <div
                    key={food.value}
                    onClick={() => handleInputChange('foodType', food.value)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.foodType === food.value 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{food.label}</div>
                        <div className="text-sm text-gray-600">Shelf life: {food.shelf}</div>
                      </div>
                      {formData.foodType === food.value && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="portions">Portions/Plates</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="boxes">Boxes/Containers</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Expiry Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Best Before Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expiryTime">Best Before Time</Label>
                <Input
                  id="expiryTime"
                  type="time"
                  value={formData.expiryTime}
                  onChange={(e) => handleInputChange('expiryTime', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Address */}
            <div>
              <Label htmlFor="address">Pickup Address *</Label>
              <Textarea
                id="address"
                placeholder="Full address including building name, street, area"
                rows={3}
                value={formData.pickupLocation.address}
                onChange={(e) => handleInputChange('pickupLocation.address', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Area/Neighborhood</Label>
                <Input
                  id="area"
                  placeholder="Andheri West, Koramangala"
                  value={formData.pickupLocation.area}
                  onChange={(e) => handleInputChange('pickupLocation.area', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Mumbai, Delhi, Bangalore"
                  value={formData.pickupLocation.city}
                  onChange={(e) => handleInputChange('pickupLocation.city', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={formData.pickupLocation.state} onValueChange={(value) => handleInputChange('pickupLocation.state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="400001"
                  value={formData.pickupLocation.postalCode}
                  onChange={(e) => handleInputChange('pickupLocation.postalCode', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                placeholder="Near Metro Station, Opposite Mall"
                value={formData.pickupLocation.landmark}
                onChange={(e) => handleInputChange('pickupLocation.landmark', e.target.value)}
              />
            </div>

            {/* Timing */}
            <div>
              <Label className="text-base font-medium mb-4 block">When would you like the pickup?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupTime">Preferred Pickup Time *</Label>
                  <Input
                    id="pickupTime"
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={formData.preferredPickupTime}
                    onChange={(e) => handleInputChange('preferredPickupTime', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Urgency Level</Label>
                  <div className="mt-2 space-y-2">
                    {urgencyLevels.map(level => (
                      <div
                        key={level.value}
                        onClick={() => handleInputChange('urgency', level.value)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.urgency === level.value 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-sm text-gray-600">{level.description}</div>
                          </div>
                          <div className={`w-3 h-3 rounded-full bg-${level.color}-500`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  placeholder="Full Name"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <Textarea
                id="specialInstructions"
                rows={4}
                placeholder="Any special handling instructions, access codes, parking information, etc."
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Food Condition */}
            <div>
              <Label className="text-base font-medium mb-4 block">Food Condition</Label>
              <div className="grid grid-cols-3 gap-3">
                {['fresh', 'good', 'fair'].map(condition => (
                  <div
                    key={condition}
                    onClick={() => handleInputChange('foodCondition', condition)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                      formData.foodCondition === condition 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium capitalize">{condition}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div>
              <Label className="text-base font-medium mb-4 block">Allergens (Check all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {allergens.map(allergen => (
                  <div
                    key={allergen}
                    onClick={() => handleAllergenToggle(allergen)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all text-center text-sm ${
                      formData.allergens.includes(allergen)
                        ? 'border-orange-500 bg-orange-50 text-orange-800'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {allergen}
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <Label className="text-base font-medium mb-4 block">Photos (Optional but helpful)</Label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload photos of the food</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB each</p>
                  </label>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {uploadedImages.map(image => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt="Food"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Estimated Meals */}
            <div>
              <Label htmlFor="estimatedMeals">Estimated Number of Meals</Label>
              <Input
                id="estimatedMeals"
                type="number"
                placeholder="How many people can this food feed?"
                value={formData.estimatedMeals}
                onChange={(e) => handleInputChange('estimatedMeals', e.target.value)}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Please review all information before submitting your donation.
              </AlertDescription>
            </Alert>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Food Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donor Type:</span>
                    <span className="font-medium">{donorTypes.find(d => d.value === formData.donorType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Food Type:</span>
                    <span className="font-medium">{foodTypes.find(f => f.value === formData.foodType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{formData.quantity} {formData.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgency:</span>
                    <Badge variant={formData.urgency === 'high' ? 'destructive' : formData.urgency === 'medium' ? 'default' : 'secondary'}>
                      {formData.urgency}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pickup Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium">{formData.pickupLocation.address}</p>
                    <p className="text-sm text-gray-600">
                      {formData.pickupLocation.area}, {formData.pickupLocation.city}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup Time:</span>
                    <span className="font-medium">
                      {new Date(formData.preferredPickupTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{formData.contactPerson}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preferences */}
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="publicRecognition" className="font-medium">
                      Allow Public Recognition
                    </Label>
                    <p className="text-sm text-gray-600">
                      Show your donation on our public impact dashboard
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="publicRecognition"
                    checked={formData.allowPublicRecognition}
                    onChange={(e) => handleInputChange('allowPublicRecognition', e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="receiveUpdates" className="font-medium">
                      Receive Impact Updates
                    </Label>
                    <p className="text-sm text-gray-600">
                      Get updates on how your donation helped the community
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="receiveUpdates"
                    checked={formData.receiveUpdates}
                    onChange={(e) => handleInputChange('receiveUpdates', e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

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
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donate Food</h1>
          <p className="text-gray-600">Help us reduce food waste and feed those in need</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  activeStep >= step.id 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {activeStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${activeStep >= step.id ? 'text-green-600' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-12 ml-4 ${activeStep > step.id ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="border-2 border-green-100 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              {steps[activeStep - 1]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}

            {/* Error Display */}
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the following errors:
                  <ul className="list-disc list-inside mt-2">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <div>
                {activeStep > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
              </div>
              
              <div>
                {activeStep < 5 ? (
                  <Button onClick={nextStep} className="bg-gradient-to-r from-green-600 to-blue-600">
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Donation
                        <Heart className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Preview */}
        <Card className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Your Impact</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold">{formData.estimatedMeals || '?'}</div>
                  <div className="text-sm opacity-90">Meals Provided</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{formData.quantity || '?'}</div>
                  <div className="text-sm opacity-90">Food Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {formData.quantity ? Math.round(parseFloat(formData.quantity) * 2.4) : '?'}
                  </div>
                  <div className="text-sm opacity-90">kg CO₂ Saved</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
