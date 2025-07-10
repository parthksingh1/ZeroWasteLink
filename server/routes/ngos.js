const express = require('express');
const User = require('../models/User');
const Donation = require('../models/Donation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get nearby NGOs
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const ngos = await User.find({
      role: 'ngo',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    }).select('name organizationName email phone address capacity servingAreas stats');

    res.json(ngos);
  } catch (error) {
    console.error('Get nearby NGOs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get NGO dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const ngoId = req.user.userId;

    // Get donations assigned to this NGO
    const donations = await Donation.find({ assignedNGO: ngoId })
      .populate('donor', 'name email phone')
      .populate('assignedVolunteer', 'name phone')
      .sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      totalDonations: donations.length,
      pendingPickups: donations.filter(d => d.status === 'assigned').length,
      completedDeliveries: donations.filter(d => d.status === 'delivered').length,
      totalMealsServed: donations.reduce((sum, d) => sum + (d.estimatedMeals || 0), 0)
    };

    res.json({
      donations,
      stats
    });
  } catch (error) {
    console.error('Get NGO dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available volunteers
router.get('/volunteers', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const volunteers = await User.find({
      role: 'volunteer',
      isActive: true
    }).select('name email phone availability vehicleType stats');

    res.json(volunteers);
  } catch (error) {
    console.error('Get volunteers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;