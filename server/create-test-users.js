const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zerowaste-link', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  address: {
    street: String,
    area: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  // Additional fields for specific roles
  organizationName: { type: String }, // For NGOs
  licenseNumber: { type: String }, // For NGOs
  vehicleType: { type: String }, // For volunteers
  availability: { type: String } // For volunteers
}, { timestamps: true });

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

const User = mongoose.model('User', userSchema);

// Test users data
const testUsers = [
  // Admin
  {
    name: 'ZeroWaste Admin',
    email: 'admin@zerowaste.com',
    password: 'admin123',
    phone: '+91 9999999999',
    role: 'admin',
    address: {
      street: 'Admin Office',
      area: 'Central Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India'
    }
  },
  
  // Donors
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'donor123',
    phone: '+91 9876543210',
    role: 'donor',
    address: {
      street: 'MG Road',
      area: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India'
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'donor123',
    phone: '+91 9876543211',
    role: 'donor',
    address: {
      street: 'Park Street',
      area: 'Salt Lake',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700091',
      country: 'India'
    }
  },
  {
    name: 'Mumbai Restaurant',
    email: 'restaurant@example.com',
    password: 'donor123',
    phone: '+91 9876543212',
    role: 'donor',
    address: {
      street: 'Linking Road',
      area: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India'
    }
  },
  
  // NGOs
  {
    name: 'Ankit Verma',
    email: 'ankit@helpinghands.org',
    password: 'ngo123',
    phone: '+91 9876543213',
    role: 'ngo',
    organizationName: 'Helping Hands Foundation',
    licenseNumber: 'NGO/DEL/2023/001',
    address: {
      street: 'Gandhi Nagar',
      area: 'Lajpat Nagar',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110024',
      country: 'India'
    }
  },
  {
    name: 'Sunita Devi',
    email: 'sunita@foodforall.org',
    password: 'ngo123',
    phone: '+91 9876543214',
    role: 'ngo',
    organizationName: 'Food For All NGO',
    licenseNumber: 'NGO/MH/2023/002',
    address: {
      street: 'SV Road',
      area: 'Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400069',
      country: 'India'
    }
  },
  {
    name: 'Ravi Krishnan',
    email: 'ravi@careconnect.org',
    password: 'ngo123',
    phone: '+91 9876543215',
    role: 'ngo',
    organizationName: 'Care Connect Foundation',
    licenseNumber: 'NGO/KA/2023/003',
    address: {
      street: 'Brigade Road',
      area: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India'
    }
  },
  
  // Volunteers
  {
    name: 'Arjun Singh',
    email: 'arjun@volunteer.com',
    password: 'volunteer123',
    phone: '+91 9876543216',
    role: 'volunteer',
    vehicleType: 'Motorcycle',
    availability: 'Full-time',
    address: {
      street: 'Sector 18',
      area: 'Noida',
      city: 'Noida',
      state: 'Uttar Pradesh',
      postalCode: '201301',
      country: 'India'
    }
  },
  {
    name: 'Kavya Reddy',
    email: 'kavya@volunteer.com',
    password: 'volunteer123',
    phone: '+91 9876543217',
    role: 'volunteer',
    vehicleType: 'Car',
    availability: 'Part-time',
    address: {
      street: 'Jubilee Hills',
      area: 'Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500033',
      country: 'India'
    }
  },
  {
    name: 'Rohit Agarwal',
    email: 'rohit@volunteer.com',
    password: 'volunteer123',
    phone: '+91 9876543218',
    role: 'volunteer',
    vehicleType: 'Bicycle',
    availability: 'Weekends',
    address: {
      street: 'Civil Lines',
      area: 'Allahabad',
      city: 'Prayagraj',
      state: 'Uttar Pradesh',
      postalCode: '211001',
      country: 'India'
    }
  }
];

async function createTestUsers() {
  try {
    console.log('🚀 Creating test users for all roles...\n');
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Create new user
      const newUser = new User(userData);
      await newUser.save();
      
      console.log(`✅ Created ${userData.role.toUpperCase()}: ${userData.name} (${userData.email})`);
    }
    
    console.log('\n🎉 All test users created successfully!\n');
    
    // Display login credentials
    console.log('📋 LOGIN CREDENTIALS FOR TESTING:\n');
    
    console.log('👑 ADMIN:');
    console.log('   Email: admin@zerowaste.com');
    console.log('   Password: admin123');
    console.log('   URL: http://localhost:3000/auth/admin\n');
    
    console.log('🏠 DONORS:');
    console.log('   Email: rajesh@example.com | Password: donor123');
    console.log('   Email: priya@example.com | Password: donor123');
    console.log('   Email: restaurant@example.com | Password: donor123');
    console.log('   URL: http://localhost:3000/auth/login\n');
    
    console.log('🏢 NGOs:');
    console.log('   Email: ankit@helpinghands.org | Password: ngo123');
    console.log('   Email: sunita@foodforall.org | Password: ngo123');
    console.log('   Email: ravi@careconnect.org | Password: ngo123');
    console.log('   URL: http://localhost:3000/auth/login\n');
    
    console.log('🚚 VOLUNTEERS:');
    console.log('   Email: arjun@volunteer.com | Password: volunteer123');
    console.log('   Email: kavya@volunteer.com | Password: volunteer123');
    console.log('   Email: rohit@volunteer.com | Password: volunteer123');
    console.log('   URL: http://localhost:3000/auth/login\n');
    
    console.log('📝 NOTE: All users use the same login page except admin.');
    console.log('🔐 The system will redirect to appropriate dashboard based on role.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
}

// Run the script
createTestUsers();
