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
  aadhaarNumber: String,
  organizationType: String, // for NGOs
  organizationRegistration: String, // for NGOs
  vehicleType: String, // for volunteers
  vehicleLicensePlate: String, // for volunteers
  businessLicense: String, // for donors
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

const dummyUsers = [
  // Admin User
  {
    name: 'Admin User',
    email: 'admin@zerowaste.com',
    password: 'admin123',
    phone: '+91 98765 43210',
    role: 'admin',
    address: {
      street: 'Admin Office, Tech Park',
      area: 'Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400051'
    },
    aadhaarNumber: '1234 5678 9012'
  },
  
  // Donor Users
  {
    name: 'Rajesh Sharma',
    email: 'donor1@zerowaste.com',
    password: 'donor123',
    phone: '+91 98765 43211',
    role: 'donor',
    address: {
      street: 'Taj Hotel, Apollo Bunder',
      area: 'Colaba',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001'
    },
    aadhaarNumber: '2345 6789 0123',
    businessLicense: 'BL-MH-2024-001'
  },
  {
    name: 'Priya Patel',
    email: 'donor2@zerowaste.com',
    password: 'donor123',
    phone: '+91 98765 43212',
    role: 'donor',
    address: {
      street: 'Big Bazaar, Phoenix Mall',
      area: 'Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400069'
    },
    aadhaarNumber: '3456 7890 1234',
    businessLicense: 'BL-MH-2024-002'
  },
  
  // NGO Users
  {
    name: 'Mumbai Food Bank',
    email: 'ngo1@zerowaste.com',
    password: 'ngo123',
    phone: '+91 98765 43213',
    role: 'ngo',
    address: {
      street: 'Food Distribution Center',
      area: 'Dharavi',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400017'
    },
    aadhaarNumber: '4567 8901 2345',
    organizationType: 'Food Security',
    organizationRegistration: 'NGO-MH-2020-001'
  },
  {
    name: 'Annamrita Foundation',
    email: 'ngo2@zerowaste.com',
    password: 'ngo123',
    phone: '+91 98765 43214',
    role: 'ngo',
    address: {
      street: 'ISKCON Temple Complex',
      area: 'Juhu',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400049'
    },
    aadhaarNumber: '5678 9012 3456',
    organizationType: 'Religious Charity',
    organizationRegistration: 'NGO-MH-2018-005'
  },
  
  // Volunteer Users
  {
    name: 'Arjun Kumar',
    email: 'volunteer1@zerowaste.com',
    password: 'volunteer123',
    phone: '+91 98765 43215',
    role: 'volunteer',
    address: {
      street: 'Residency Apartments, 15th Road',
      area: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050'
    },
    aadhaarNumber: '6789 0123 4567',
    vehicleType: 'Two Wheeler',
    vehicleLicensePlate: 'MH-01-AB-1234'
  },
  {
    name: 'Sneha Reddy',
    email: 'volunteer2@zerowaste.com',
    password: 'volunteer123',
    phone: '+91 98765 43216',
    role: 'volunteer',
    address: {
      street: 'Green Heights Society',
      area: 'Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400076'
    },
    aadhaarNumber: '7890 1234 5678',
    vehicleType: 'Four Wheeler',
    vehicleLicensePlate: 'MH-01-CD-5678'
  }
];

async function createDummyUsers() {
  try {
    console.log('🚀 Creating dummy users for all roles...\n');
    
    for (const userData of dummyUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} (${userData.role}) already exists!`);
        continue;
      }
      
      // Create new user
      const user = new User(userData);
      await user.save();
      
      console.log(`✅ Created ${userData.role}: ${userData.name} (${userData.email})`);
    }
    
    console.log('\n🎉 All dummy users created successfully!\n');
    
    // Display login credentials
    console.log('='.repeat(60));
    console.log('📋 DUMMY LOGIN CREDENTIALS FOR TESTING');
    console.log('='.repeat(60));
    
    console.log('\n👨‍💼 ADMIN LOGIN:');
    console.log('Email: admin@zerowaste.com');
    console.log('Password: admin123');
    
    console.log('\n🏢 DONOR LOGINS:');
    console.log('Email: donor1@zerowaste.com (Rajesh Sharma - Taj Hotel)');
    console.log('Password: donor123');
    console.log('Email: donor2@zerowaste.com (Priya Patel - Big Bazaar)');
    console.log('Password: donor123');
    
    console.log('\n🏛️ NGO LOGINS:');
    console.log('Email: ngo1@zerowaste.com (Mumbai Food Bank)');
    console.log('Password: ngo123');
    console.log('Email: ngo2@zerowaste.com (Annamrita Foundation)');
    console.log('Password: ngo123');
    
    console.log('\n🚚 VOLUNTEER LOGINS:');
    console.log('Email: volunteer1@zerowaste.com (Arjun Kumar - Two Wheeler)');
    console.log('Password: volunteer123');
    console.log('Email: volunteer2@zerowaste.com (Sneha Reddy - Four Wheeler)');
    console.log('Password: volunteer123');
    
    console.log('\n' + '='.repeat(60));
    console.log('💡 All passwords are simple for testing purposes.');
    console.log('🌐 Access dashboards at: http://localhost:3000/auth/login');
    console.log('⚡ Admin panel at: http://localhost:3000/auth/admin');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error creating dummy users:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
createDummyUsers();
