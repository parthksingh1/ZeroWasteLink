const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Donation = require('../models/Donation');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo-cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo-secret'
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to upload images to Cloudinary
async function uploadImages(files) {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = files.map(file => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'zerowaste-donations',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      ).end(file.buffer);
    });
  });
  
  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return [];
  }
}

const router = express.Router();

// Get all donations with filters
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      foodType, 
      city, 
      limit = 10, 
      page = 1,
      lat,
      lng,
      radius = 10 // km
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (foodType) query.foodType = foodType;
    if (city) query['address.city'] = new RegExp(city, 'i');

    // Geospatial query if coordinates provided
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name email phone')
      .populate('assignedNGO', 'name organizationName')
      .populate('assignedVolunteer', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    res.json({
      donations,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalDonations: total
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create donation with image upload
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      foodType,
      quantity,
      expiryDate,
      location,
      address,
      pickupWindow,
      notes
    } = req.body;

    // Parse JSON strings if needed
    const parsedQuantity = typeof quantity === 'string' ? JSON.parse(quantity) : quantity;
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    const parsedPickupWindow = typeof pickupWindow === 'string' ? JSON.parse(pickupWindow) : pickupWindow;

    // Upload images to Cloudinary
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = await uploadImages(req.files);
    }

    // Calculate estimated meals based on quantity
    const estimatedMeals = Math.floor(parsedQuantity.amount * 0.8); // Rough estimate

    const donation = new Donation({
      donor: req.user.userId,
      title,
      description,
      foodType,
      quantity: parsedQuantity,
      expiryDate,
      location: parsedLocation,
      address: parsedAddress,
      images: uploadedImages,
      pickupWindow: parsedPickupWindow,
      notes,
      estimatedMeals
    });

    await donation.save();

    // AI Analysis for spoilage detection
    if (uploadedImages.length > 0) {
      try {
        const aiAnalysis = await fetch('http://localhost:5000/api/ai/detect-spoilage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
          },
          body: JSON.stringify({
            foodDescription: description,
            imageUrl: uploadedImages[0].url,
            expiryDate,
            storageConditions: 'normal'
          })
        });
        
        if (aiAnalysis.ok) {
          const analysisResult = await aiAnalysis.json();
          donation.aiAnalysis = {
            spoilageRisk: analysisResult.analysis.riskLevel,
            confidence: analysisResult.analysis.confidence,
            recommendations: analysisResult.analysis.recommendations,
            lastAnalyzed: new Date()
          };
          await donation.save();
        }
      } catch (error) {
        console.error('AI analysis error:', error);
      }
    }

    // Auto-match with nearby NGOs using AI
    try {
      const matchingResponse = await fetch('http://localhost:5000/api/ai/match-ngo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        },
        body: JSON.stringify({
          donationId: donation._id
        })
      });
      
      if (matchingResponse.ok) {
        const matchingResult = await matchingResponse.json();
        console.log('AI matching completed:', matchingResult);
      }
    } catch (error) {
      console.error('AI matching error:', error);
    }

    res.status(201).json({
      message: 'Donation created successfully',
      donation: await donation.populate('donor', 'name email phone')
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone address')
      .populate('assignedNGO', 'name organizationName email phone')
      .populate('assignedVolunteer', 'name email phone vehicleType');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept donation (NGO)
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({ message: 'Donation already processed' });
    }

    donation.status = 'accepted';
    donation.assignedNGO = req.user.userId;
    donation.tracking.acceptedAt = new Date();

    await donation.save();

    res.json({
      message: 'Donation accepted successfully',
      donation
    });
  } catch (error) {
    console.error('Accept donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign volunteer (NGO)
router.patch('/:id/assign-volunteer', auth, async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.assignedNGO.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    donation.status = 'assigned';
    donation.assignedVolunteer = volunteerId;
    donation.tracking.assignedAt = new Date();

    await donation.save();

    res.json({
      message: 'Volunteer assigned successfully',
      donation
    });
  } catch (error) {
    console.error('Assign volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update donation status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = status;
    
    // Update tracking
    if (status === 'picked-up') {
      donation.tracking.pickedUpAt = new Date();
    } else if (status === 'delivered') {
      donation.tracking.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      donation.tracking.cancelledAt = new Date();
    }

    await donation.save();

    res.json({
      message: 'Status updated successfully',
      donation
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;