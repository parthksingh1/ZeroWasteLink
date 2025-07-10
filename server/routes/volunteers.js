const express = require('express');
const User = require('../models/User');
const Donation = require('../models/Donation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get volunteer dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const volunteerId = req.user.userId;

    // Get donations assigned to this volunteer
    const donations = await Donation.find({ assignedVolunteer: volunteerId })
      .populate('donor', 'name email phone address')
      .populate('assignedNGO', 'name organizationName email phone')
      .sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      totalPickups: donations.filter(d => d.status === 'picked-up' || d.status === 'delivered').length,
      pendingPickups: donations.filter(d => d.status === 'assigned').length,
      completedDeliveries: donations.filter(d => d.status === 'delivered').length,
      totalMealsDelivered: donations.reduce((sum, d) => sum + (d.estimatedMeals || 0), 0)
    };

    res.json({
      donations,
      stats
    });
  } catch (error) {
    console.error('Get volunteer dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get nearby volunteers
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const volunteers = await User.find({
      role: 'volunteer',
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
    }).select('name email phone availability vehicleType stats');

    res.json(volunteers);
  } catch (error) {
    console.error('Get nearby volunteers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;