'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Camera, 
  MapPin, 
  Clock, 
  Package, 
  Heart,
  Leaf,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Star
} from 'lucide-react';

interface DonationFormData {
  title: string;
  description: string;
  foodType: string;
  quantity: { amount: number; unit: string };
  expiryDate: string;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    postalCode: string;
  };
  location: { lat: number; lng: number };
  pickupWindow: {
    startTime: string;
    endTime: string;
    flexibleTiming: boolean;
  };
  images: File[];
  additionalNotes: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  contactPerson: string;
  contactPhone: string;
}

export default function NewDonationForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [impactPreview, setImpactPreview] = useState({
    estimatedMeals: 0,
    carbonSaved: 0,
    peopleHelped: 0
  });
  
  const [formData, setFormData] = useState<DonationFormData>({
    title: '',
    description: '',
    foodType: '',
    quantity: { amount: 0, unit: 'kg' },
    expiryDate: '',
    address: {
      street: '',
      area: '',
      city: '',
      state: '',
      postalCode: ''
    },
    location: { lat: 0, lng: 0 },
    pickupWindow: {
      startTime: '',
      endTime: '',
      flexibleTiming: false
    },
    images: [],
    additionalNotes: '',
    urgencyLevel: 'medium',
    contactPerson: '',
    contactPhone: ''
  });

  const totalSteps = 4;
  const stepTitles = [
    'Food Details',
    'Location & Pickup', 
    'Images & Verification',
    'Review & Submit'
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    if (field === 'quantity.amount' && value > 0) {
      calculateImpactPreview(value);
    }
  };

  const calculateImpactPreview = (amount: number) => {
    setImpactPreview({
      estimatedMeals: Math.floor(amount * 2.5),
      carbonSaved: Math.floor(amount * 2.3),
      peopleHelped: Math.floor(amount * 1.8)
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== newFiles.length) {
      setError('Some files were rejected. Only images under 5MB are allowed.');
    }

    if (formData.images.length + validFiles.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Location error:', error);
          setError('Unable to get current location. Please enter address manually.');
        }
      );
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.foodType && 
                 formData.quantity.amount > 0 && formData.expiryDate);
      case 2:
        return !!(formData.address.street && formData.address.city && 
                 formData.address.state && formData.pickupWindow.startTime);
      case 3:
        return formData.images.length > 0;
      case 4:
        return !!(formData.contactPerson && formData.contactPhone);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setError('');
    } else {
      setError('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const submitDonation = async () => {
    if (!validateStep(4)) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach(image => {
            submitData.append('images', image);
          });
        } else if (typeof value === 'object') {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value as string);
        }
      });

      const response = await fetch('/api/donations', {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/dashboard?success=donation-created&id=${result.donation._id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create donation');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Donation Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Fresh vegetables from restaurant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foodType">Food Type *</Label>
              <Select value={formData.foodType} onValueChange={(value) => handleInputChange('foodType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select food type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="grains">Grains & Cereals</SelectItem>
                  <SelectItem value="cooked">Cooked Food</SelectItem>
                  <SelectItem value="dairy">Dairy Products</SelectItem>
                  <SelectItem value="bakery">Bakery Items</SelectItem>
                  <SelectItem value="packaged">Packaged Food</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Quantity *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.quantity.amount}
                  onChange={(e) => handleInputChange('quantity.amount', parseFloat(e.target.value) || 0)}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select value={formData.quantity.unit} onValueChange={(value) => handleInputChange('quantity.unit', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="portions">Portions</SelectItem>
                    <SelectItem value="plates">Plates</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Best Before Date *</Label>
              <Input
                id="expiryDate"
                type="datetime-local"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the food items, cooking method, storage conditions..."
                rows={4}
              />
            </div>

            {impactPreview.estimatedMeals > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Estimated Impact</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{impactPreview.estimatedMeals}</div>
                    <div className="text-sm text-green-700">Meals</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{impactPreview.carbonSaved}kg</div>
                    <div className="text-sm text-blue-700">CO₂ Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{impactPreview.peopleHelped}</div>
                    <div className="text-sm text-purple-700">People Helped</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pickup Location</h3>
              <Button type="button" variant="outline" onClick={getCurrentLocation}>
                <MapPin className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                placeholder="123 Main Street, Building Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Area/Neighborhood *</Label>
                <Input
                  id="area"
                  value={formData.address.area}
                  onChange={(e) => handleInputChange('address.area', e.target.value)}
                  placeholder="Bandra West"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  placeholder="Mumbai"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.address.state} onValueChange={(value) => handleInputChange('address.state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={formData.address.postalCode}
                  onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  placeholder="400050"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pickup Time Window</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Available From *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.pickupWindow.startTime}
                    onChange={(e) => handleInputChange('pickupWindow.startTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Available Until *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.pickupWindow.endTime}
                    onChange={(e) => handleInputChange('pickupWindow.endTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="flexibleTiming"
                  checked={formData.pickupWindow.flexibleTiming}
                  onChange={(e) => handleInputChange('pickupWindow.flexibleTiming', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="flexibleTiming">I'm flexible with pickup timing</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={formData.urgencyLevel} onValueChange={(value) => handleInputChange('urgencyLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Can wait 24+ hours</SelectItem>
                  <SelectItem value="medium">Medium - Pickup today preferred</SelectItem>
                  <SelectItem value="high">High - Urgent pickup needed (within 4 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Food Images</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload clear images of the food to help NGOs better assess your donation.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Maximum 5 images, up to 5MB each
                </p>
              </div>
            </div>

            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Special handling instructions, dietary information, etc."
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Donation Summary</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Food:</span> {formData.title}</div>
                <div><span className="font-medium">Quantity:</span> {formData.quantity.amount} {formData.quantity.unit}</div>
                <div><span className="font-medium">Location:</span> {formData.address.area}, {formData.address.city}</div>
                <div><span className="font-medium">Pickup:</span> {formData.pickupWindow.startTime} - {formData.pickupWindow.endTime}</div>
                <div><span className="font-medium">Images:</span> {formData.images.length} uploaded</div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🌟 Your Impact</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-600">{impactPreview.estimatedMeals}</div>
                  <div className="text-xs text-green-700">Meals</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">{impactPreview.carbonSaved}kg</div>
                  <div className="text-xs text-blue-700">CO₂ Saved</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">{impactPreview.peopleHelped}</div>
                  <div className="text-xs text-purple-700">People Helped</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Donation</h1>
          <p className="text-gray-600">Help reduce food waste and feed those in need</p>
        </div>

        <Card className="border-2 border-green-100 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                {stepTitles[currentStep - 1]}
              </CardTitle>
              <Badge variant="secondary">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="mt-2" />
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {renderStepContent()}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={submitDonation}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Create Donation
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
