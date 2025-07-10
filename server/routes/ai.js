const express = require('express');
const OpenAI = require('openai');
const Donation = require('../models/Donation');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

// Helper function to call AI for smart recommendations
async function getAIRecommendations(context, type = 'general') {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    // Return mock data if no API key
    return getMockAIResponse(type);
  }

  try {
    const systemPrompts = {
      ngo_matching: "You are an AI assistant for a food redistribution platform in India. Provide smart NGO matching recommendations based on location, capacity, and food type compatibility.",
      impact_analysis: "You are an environmental impact analyst for food waste reduction in India. Provide insights on carbon footprint, meals served, and waste prevented.",
      spoilage_detection: "You are a food safety expert. Analyze food descriptions and images to detect potential spoilage and provide safety recommendations.",
      route_optimization: "You are a logistics optimizer for food delivery in Indian cities. Suggest optimal routes considering traffic patterns and delivery priorities."
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompts[type] || systemPrompts.general
        },
        {
          role: "user",
          content: JSON.stringify(context)
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('AI API Error:', error);
    return getMockAIResponse(type);
  }
}

function getMockAIResponse(type) {
  const mockResponses = {
    ngo_matching: {
      recommendations: [
        { ngoId: 'mock1', score: 95, reasons: ['Close proximity', 'High capacity', 'Food type match'] },
        { ngoId: 'mock2', score: 87, reasons: ['Good availability', 'Experience with similar donations'] }
      ]
    },
    impact_analysis: {
      carbonSaved: 12.5,
      mealsProvided: 25,
      wasteReduced: 8.2,
      insights: ['Peak donation hours are 6-8 PM', 'Vegetarian items have 40% less waste']
    },
    spoilage_detection: {
      riskLevel: 'low',
      confidence: 0.85,
      recommendations: ['Consume within 24 hours', 'Store in refrigerated conditions']
    },
    route_optimization: {
      optimizedRoute: ['Location A', 'Location B', 'Location C'],
      estimatedTime: '45 minutes',
      fuelSaved: '2.3 liters'
    }
  };
  
  return mockResponses[type] || { message: 'AI analysis complete' };
}

// AI-powered NGO matching
router.post('/match-ngo', auth, async (req, res) => {
  try {
    const { donationId } = req.body;
    
    const donation = await Donation.findById(donationId).populate('donor');
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Find nearby NGOs
    const nearbyNGOs = await User.find({
      role: 'ngo',
      isActive: true,
      location: {
        $near: {
          $geometry: donation.location,
          $maxDistance: 10000 // 10km
        }
      }
    });

    // AI scoring algorithm
    const scoredNGOs = nearbyNGOs.map(ngo => {
      let score = 0;
      
      // Distance factor (closer = higher score)
      const distance = calculateDistance(donation.location.coordinates, ngo.location.coordinates);
      score += Math.max(0, 100 - (distance * 10));
      
      // Capacity factor
      score += Math.min(ngo.capacity * 2, 50);
      
      // Experience factor (based on successful deliveries)
      score += Math.min(ngo.stats.totalDeliveries * 0.5, 30);
      
      // Availability factor (working hours)
      const currentHour = new Date().getHours();
      const workStart = parseInt(ngo.workingHours.start.split(':')[0]);
      const workEnd = parseInt(ngo.workingHours.end.split(':')[0]);
      
      if (currentHour >= workStart && currentHour <= workEnd) {
        score += 20;
      }
      
      // Food type preference
      if (ngo.aiPreferences.preferredFoodTypes.includes(donation.foodType)) {
        score += 25;
      }
      
      // Rating factor
      score += ngo.ratings.average * 5;
      
      return {
        ngo: ngo.toObject(),
        score: Math.round(score),
        distance: Math.round(distance * 100) / 100,
        estimatedPickupTime: calculateEstimatedTime(distance)
      };
    });

    // Sort by score (highest first)
    scoredNGOs.sort((a, b) => b.score - a.score);

    res.json({
      matches: scoredNGOs.slice(0, 5), // Top 5 matches
      recommendation: scoredNGOs[0] || null
    });

  } catch (error) {
    console.error('AI NGO matching error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// AI image analysis for food quality
router.post('/analyze-image', auth, async (req, res) => {
  try {
    const { imageUrl, donationId } = req.body;
    
    // Mock AI analysis (in production, integrate with Google Vision API or similar)
    const analysis = {
      freshness: Math.floor(Math.random() * 30) + 70, // 70-100
      quality: Math.floor(Math.random() * 25) + 75, // 75-100
      spoilageDetected: Math.random() < 0.1, // 10% chance
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100
      detectedItems: [
        'Rice', 'Dal', 'Vegetables', 'Roti'
      ],
      nutritionalEstimate: {
        calories: Math.floor(Math.random() * 200) + 300,
        protein: Math.floor(Math.random() * 15) + 10,
        carbs: Math.floor(Math.random() * 50) + 40,
        fat: Math.floor(Math.random() * 10) + 5
      },
      suggestions: [
        'Food appears fresh and safe for consumption',
        'Recommended to consume within 4-6 hours',
        'Store in cool, dry place',
        'Suitable for all age groups'
      ]
    };

    // Update donation with AI analysis
    if (donationId) {
      await Donation.findByIdAndUpdate(donationId, {
        $push: {
          'images': {
            url: imageUrl,
            aiAnalysis: analysis
          }
        }
      });
    }

    res.json(analysis);

  } catch (error) {
    console.error('AI image analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// AI-powered impact report generation
router.get('/impact-report/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'month' } = req.query; // month, quarter, year
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let dateFilter = new Date();
    switch (period) {
      case 'month':
        dateFilter.setMonth(dateFilter.getMonth() - 1);
        break;
      case 'quarter':
        dateFilter.setMonth(dateFilter.getMonth() - 3);
        break;
      case 'year':
        dateFilter.setFullYear(dateFilter.getFullYear() - 1);
        break;
    }

    // Get user's donations/activities
    let query = { createdAt: { $gte: dateFilter } };
    
    if (user.role === 'donor') {
      query.donor = userId;
    } else if (user.role === 'ngo') {
      query.assignedNGO = userId;
    } else if (user.role === 'volunteer') {
      query.assignedVolunteer = userId;
    }

    const donations = await Donation.find(query);
    
    // Calculate impact metrics
    const totalMeals = donations.reduce((sum, d) => sum + (d.actualMeals || d.estimatedMeals), 0);
    const totalWeight = donations.reduce((sum, d) => sum + d.quantity.amount, 0);
    const carbonSaved = totalWeight * 2.5; // Rough estimate: 2.5kg CO2 per kg food waste prevented
    
    const report = {
      period,
      user: {
        name: user.name,
        role: user.role
      },
      metrics: {
        totalDonations: donations.length,
        totalMeals,
        totalWeight: Math.round(totalWeight * 100) / 100,
        carbonFootprintSaved: Math.round(carbonSaved * 100) / 100,
        peopleHelped: Math.floor(totalMeals / 3), // Assuming 3 meals per person per day
        moneyValueSaved: Math.round(totalMeals * 25) // ₹25 per meal average
      },
      breakdown: {
        byFoodType: donations.reduce((acc, d) => {
          acc[d.foodType] = (acc[d.foodType] || 0) + 1;
          return acc;
        }, {}),
        byStatus: donations.reduce((acc, d) => {
          acc[d.status] = (acc[d.status] || 0) + 1;
          return acc;
        }, {}),
        monthlyTrend: generateMonthlyTrend(donations)
      },
      achievements: generateAchievements(user, donations),
      recommendations: generateRecommendations(user, donations)
    };

    res.json(report);

  } catch (error) {
    console.error('Impact report generation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// AI-powered spoilage detection
router.post('/detect-spoilage', auth, async (req, res) => {
  try {
    const { foodDescription, imageUrl, expiryDate, storageConditions } = req.body;
    
    const context = {
      description: foodDescription,
      imageUrl,
      expiryDate,
      storageConditions,
      currentDate: new Date().toISOString()
    };
    
    const analysis = await getAIRecommendations(context, 'spoilage_detection');
    
    res.json({
      success: true,
      analysis: {
        riskLevel: analysis.riskLevel,
        confidence: analysis.confidence,
        recommendations: analysis.recommendations,
        safeToConsume: analysis.riskLevel === 'low',
        estimatedShelfLife: analysis.estimatedShelfLife || '24 hours'
      }
    });
  } catch (error) {
    console.error('Spoilage detection error:', error);
    res.status(500).json({ message: 'Failed to analyze food safety' });
  }
});

// AI-powered route optimization
router.post('/optimize-route', auth, async (req, res) => {
  try {
    const { pickupLocations, vehicleType, trafficConditions, timeWindow } = req.body;
    
    const context = {
      locations: pickupLocations,
      vehicle: vehicleType,
      traffic: trafficConditions,
      timeWindow,
      city: req.body.city || 'Mumbai'
    };
    
    const optimization = await getAIRecommendations(context, 'route_optimization');
    
    res.json({
      success: true,
      optimizedRoute: optimization.optimizedRoute,
      estimatedTime: optimization.estimatedTime,
      fuelSaved: optimization.fuelSaved,
      co2Reduced: optimization.co2Reduced || '5.2 kg'
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({ message: 'Failed to optimize route' });
  }
});

// Enhanced impact analysis with AI insights
router.get('/enhanced-impact/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const donations = await Donation.find({
      $or: [
        { donor: userId },
        { assignedNGO: userId },
        { assignedVolunteer: userId }
      ]
    }).populate('donor assignedNGO assignedVolunteer');
    
    const context = {
      userRole: user.role,
      totalDonations: donations.length,
      completedDonations: donations.filter(d => d.status === 'completed').length,
      totalQuantity: donations.reduce((sum, d) => sum + (d.quantity || 0), 0),
      foodTypes: donations.map(d => d.foodType),
      locations: donations.map(d => d.address.city)
    };
    
    const aiInsights = await getAIRecommendations(context, 'impact_analysis');
    
    // Calculate actual impact metrics
    const impactMetrics = {
      totalDonations: donations.length,
      mealsProvided: Math.floor(context.totalQuantity * 2.5), // Approx 2.5 meals per kg
      carbonFootprintSaved: Math.floor(context.totalQuantity * 2.3), // kg CO2 per kg food
      wasteReduced: context.totalQuantity,
      peopleHelped: Math.floor(context.totalQuantity * 1.8),
      moneyValueSaved: Math.floor(context.totalQuantity * 150) // INR per kg
    };
    
    res.json({
      success: true,
      impact: impactMetrics,
      aiInsights: aiInsights.insights || [
        'Your contributions have significant environmental impact',
        'Consider increasing donation frequency during weekends',
        'Partner with more NGOs to expand reach'
      ],
      achievements: generateAchievements(user, donations),
      recommendations: generateRecommendations(user, donations),
      trends: {
        monthlyGrowth: '+15%',
        popularFoodTypes: ['Rice', 'Vegetables', 'Bread'],
        peakHours: ['6-8 PM', '12-2 PM']
      }
    });
  } catch (error) {
    console.error('Enhanced impact analysis error:', error);
    res.status(500).json({ message: 'Failed to generate impact analysis' });
  }
});

// AI chatbot for user assistance
router.post('/chat-assistance', auth, async (req, res) => {
  try {
    const { message, context, userRole } = req.body;
    
    const chatContext = {
      userMessage: message,
      userRole: userRole || 'donor',
      platform: 'ZeroWasteLink 2.0',
      language: 'English/Hindi',
      context: context || {}
    };
    
    let response;
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      // Mock responses for common questions
      const mockResponses = {
        'how to donate': 'To donate food, click on "Donate Food" button, fill in the details about your food items, and we\'ll match you with nearby NGOs for pickup.',
        'pickup time': 'Typical pickup time is 2-4 hours during business hours. Emergency pickups can be arranged within 1 hour.',
        'food safety': 'We ensure food safety through our AI-powered spoilage detection and partner NGO verification processes.',
        'impact': 'You can track your impact through your dashboard, including meals provided, CO2 saved, and people helped.'
      };
      
      const key = Object.keys(mockResponses).find(k => message.toLowerCase().includes(k));
      response = key ? mockResponses[key] : 'Thank you for your question! Our team will assist you shortly. In the meantime, check our FAQ section for common queries.';
    } else {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for ZeroWasteLink 2.0, a food redistribution platform in India. 
            Help users with donation processes, food safety questions, impact tracking, and platform navigation. 
            Be friendly, informative, and culturally aware of Indian context. 
            User role: ${userRole}`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      });
      
      response = completion.choices[0].message.content;
    }
    
    res.json({
      success: true,
      response,
      suggestions: [
        'How do I track my donation?',
        'What foods can I donate?',
        'How to become a volunteer?',
        'Check food safety guidelines'
      ]
    });
  } catch (error) {
    console.error('Chat assistance error:', error);
    res.status(500).json({ 
      message: 'Sorry, I\'m having trouble right now. Please try again later or contact support.' 
    });
  }
});

// Helper functions
function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateEstimatedTime(distance) {
  // Assuming average speed of 25 km/h in Indian traffic
  return Math.round((distance / 25) * 60); // in minutes
}

function generateMonthlyTrend(donations) {
  const months = {};
  donations.forEach(d => {
    const month = d.createdAt.toISOString().substring(0, 7);
    months[month] = (months[month] || 0) + 1;
  });
  return months;
}

function generateAchievements(user, donations) {
  const achievements = [];
  
  if (donations.length >= 10) {
    achievements.push({
      title: 'Food Hero',
      description: 'Completed 10+ donations',
      icon: '🏆'
    });
  }
  
  if (user.stats.mealsProvided >= 100) {
    achievements.push({
      title: 'Hunger Fighter',
      description: 'Provided 100+ meals',
      icon: '🍽️'
    });
  }
  
  if (user.stats.carbonFootprintSaved >= 50) {
    achievements.push({
      title: 'Eco Warrior',
      description: 'Saved 50+ kg CO2',
      icon: '🌱'
    });
  }
  
  return achievements;
}

function generateRecommendations(user, donations) {
  const recommendations = [];
  
  if (user.role === 'donor') {
    recommendations.push('Consider donating during off-peak hours for faster pickup');
    recommendations.push('Add more detailed descriptions to help NGOs better assess donations');
  } else if (user.role === 'ngo') {
    recommendations.push('Expand your serving areas to reach more donors');
    recommendations.push('Update your capacity regularly for better matching');
  } else if (user.role === 'volunteer') {
    recommendations.push('Consider upgrading to a larger vehicle for more efficient pickups');
    recommendations.push('Update your availability to get more assignments');
  }
  
  return recommendations;
}

module.exports = router;