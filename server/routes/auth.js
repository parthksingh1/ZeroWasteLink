const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['donor', 'ngo', 'volunteer']).withMessage('Invalid role'),
  body('phone').matches(/^\+91\s[6-9]\d{9}$/).withMessage('Please provide a valid Indian mobile number (+91 XXXXXXXXXX)'),
  body('address.postalCode').isLength({ min: 3 }).withMessage('Please provide a valid postal code')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone, address, organizationName, registrationNumber, nationalId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { phone },
        ...(nationalId ? [{ nationalId }] : [])
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email, phone, or national ID already exists' });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role,
      phone,
      address,
      nationalId
    };

    if (role === 'ngo') {
      userData.organizationName = organizationName;
      userData.registrationNumber = registrationNumber;
      userData.taxId = req.body.taxId;
    }

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated. Please contact support.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP (for phone verification)
router.post('/verify-otp', [
  body('phone').matches(/^\+91\s[6-9]\d{9}$/).withMessage('Please provide a valid Indian mobile number (+91 XXXXXXXXXX)'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp } = req.body;

    // Mock OTP verification (in production, integrate with SMS service)
    if (otp === '123456') {
      const user = await User.findOne({ phone });
      if (user) {
        user.isPhoneVerified = true;
        await user.save();
        
        res.json({ message: 'Phone verified successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Social login endpoint
router.post('/social-login', async (req, res) => {
  try {
    const { provider, email, name, image, googleId } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with social login
      user = new User({
        name,
        email,
        role: 'donor', // Default role
        isActive: true,
        socialLogin: {
          provider,
          googleId: provider === 'google' ? googleId : undefined,
        },
        profileImage: image,
        address: {
          country: 'India'
        }
      });
      
      await user.save();
    } else {
      // Update existing user with social login info if not already set
      if (!user.socialLogin || !user.socialLogin.provider) {
        user.socialLogin = {
          provider,
          googleId: provider === 'google' ? googleId : undefined,
        };
        
        if (image && !user.profileImage) {
          user.profileImage = image;
        }
        
        await user.save();
      }
    }
    
    res.json({
      message: 'Social login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.profileImage
      }
    });
    
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ message: 'Social login failed' });
  }
});

module.exports = router;