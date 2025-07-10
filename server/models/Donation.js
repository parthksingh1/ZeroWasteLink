const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedNGO: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    enum: [
      'cooked-meals', 'fresh-produce', 'packaged-food', 'dairy-products', 
      'baked-goods', 'beverages', 'frozen-food', 'canned-goods', 
      'grains-cereals', 'snacks', 'desserts', 'other'
    ],
    required: true
  },
  cuisine: {
    type: String,
    enum: [
      'American', 'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese',
      'French', 'Thai', 'Mediterranean', 'Middle Eastern', 'Korean',
      'Vietnamese', 'Greek', 'Spanish', 'German', 'Other'
    ]
  },
  quantity: {
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs', 'liters', 'gallons', 'pieces', 'portions', 'servings', 'boxes', 'bags'],
      required: true
    }
  },
  expiryDate: {
    type: Date,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    street: String,
    area: String,
    landmark: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'United States' }
  },
  images: [{
    url: String,
    publicId: String,
    aiAnalysis: {
      freshness: Number,
      quality: Number,
      spoilageDetected: Boolean,
      confidence: Number
    }
  }],
  pickupWindow: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'assigned', 'picked-up', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  estimatedMeals: {
    type: Number,
    default: 0
  },
  actualMeals: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  // Dietary preferences
  dietaryInfo: {
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isHalal: { type: Boolean, default: false },
    isKosher: { type: Boolean, default: false },
    allergens: [String]
  },
  // Tracking information
  tracking: {
    acceptedAt: Date,
    assignedAt: Date,
    pickedUpAt: Date,
    inTransitAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    gpsTrackingId: String
  },
  // AI Analysis
  aiAnalysis: {
    freshness: {
      type: Number,
      min: 0,
      max: 100
    },
    nutritionalValue: {
      type: Number,
      min: 0,
      max: 100
    },
    shelfLife: {
      type: Number, // in hours
      default: 24
    },
    carbonFootprint: {
      type: Number, // in kg CO2
      default: 0
    },
    suggestions: [String],
    riskAssessment: {
      spoilageRisk: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      transportationRisk: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
    }
  },
  // Weather impact
  weatherConditions: {
    temperature: Number,
    humidity: Number,
    impact: { type: String, enum: ['favorable', 'moderate', 'challenging'] }
  },
  // Beneficiary information
  beneficiaries: {
    targetGroup: {
      type: String,
      enum: ['children', 'elderly', 'homeless', 'families', 'disaster-victims', 'general'],
      default: 'general'
    },
    estimatedCount: Number,
    actualCount: Number
  },
  // Feedback
  feedback: {
    donorRating: { type: Number, min: 1, max: 5 },
    ngoRating: { type: Number, min: 1, max: 5 },
    volunteerRating: { type: Number, min: 1, max: 5 },
    comments: String
  }
}, {
  timestamps: true
});

// Index for geospatial queries
donationSchema.index({ location: '2dsphere' });
donationSchema.index({ status: 1 });
donationSchema.index({ expiryDate: 1 });
donationSchema.index({ donor: 1 });
donationSchema.index({ 'address.postalCode': 1 });
donationSchema.index({ foodType: 1 });

// Pre-save middleware to calculate estimated meals
donationSchema.pre('save', function(next) {
  if (this.isModified('quantity')) {
    // AI-based meal estimation logic
    let mealMultiplier = 1;
    
    switch (this.foodType) {
      case 'cooked-meals':
        mealMultiplier = this.quantity.unit === 'servings' ? 1 : 0.8;
        break;
      case 'fresh-produce':
        mealMultiplier = 0.6;
        break;
      case 'packaged-food':
        mealMultiplier = 0.9;
        break;
      case 'dairy-products':
        mealMultiplier = 0.3;
        break;
      default:
        mealMultiplier = 0.7;
    }
    
    this.estimatedMeals = Math.floor(this.quantity.amount * mealMultiplier);
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);