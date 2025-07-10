const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  nationalId: {
    type: String,
    unique: true,
    sparse: true
  },
  googleId: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['donor', 'ngo', 'volunteer', 'admin'],
    required: true
  },
  address: {
    street: String,
    area: String,
    city: String,
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  avatar: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  // NGO specific fields
  organizationName: {
    type: String,
    required: function() {
      return this.role === 'ngo';
    }
  },
  registrationNumber: {
    type: String,
    required: function() {
      return this.role === 'ngo';
    }
  },
  taxId: {
    type: String,
    required: function() {
      return this.role === 'ngo';
    }
  },
  capacity: {
    type: Number,
    default: 0
  },
  servingAreas: [{
    type: String
  }],
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' }
  },
  // Volunteer specific fields
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'weekends', 'flexible'],
    default: 'flexible'
  },
  vehicleType: {
    type: String,
    enum: ['bicycle', 'motorcycle', 'car', 'van', 'truck', 'none'],
    default: 'none'
  },
  languages: [{
    type: String
  }],
  // AI Preferences
  aiPreferences: {
    autoAcceptDonations: { type: Boolean, default: false },
    preferredFoodTypes: [String],
    maxTravelDistance: { type: Number, default: 10 }, // in km
    notificationPreferences: {
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  // Statistics
  stats: {
    totalDonations: { type: Number, default: 0 },
    totalPickups: { type: Number, default: 0 },
    totalDeliveries: { type: Number, default: 0 },
    impactScore: { type: Number, default: 0 },
    carbonFootprintSaved: { type: Number, default: 0 }, // in kg CO2
    mealsProvided: { type: Number, default: 0 }
  },
  // Ratings and Reviews
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });
userSchema.index({ 'address.postalCode': 1 });
userSchema.index({ role: 1, isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);