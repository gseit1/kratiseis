const Application = require('../models/applications');
const Shop = require('../models/shop');
const User = require('../models/user');

// GET: Επιστροφή όλων των αιτήσεων
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('userId').populate('category').populate('city').populate('region');
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error.message);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// POST: Δημιουργία νέας αίτησης
const postApplication = async (req, res) => {
  try {
    const { userId, shopName, shopDescription, category,  city, region, location, phone, musicCategory, priceRange } = req.body;

    const newApplication = new Application({
      userId,
      shopName,
      shopDescription,
      category,
      city,
      region,
      location,
      phone,
      musicCategory,
      priceRange,
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
  } catch (error) {
    console.error('Error creating application:', error.message);
    res.status(500).json({ message: 'Error creating application', error: error.message });
  }
};

// PATCH: Αποδοχή ή απόρριψη αίτησης
const handleApplicationDecision = async (req, res) => {
    const { applicationId, decision } = req.body; // decision: 'accept' ή 'reject'
  
    try {
      console.log('Received applicationId:', applicationId);
      console.log('Received decision:', decision);
  
      const application = await Application.findById(applicationId);
      if (!application) {
        console.error('Application not found for ID:', applicationId);
        return res.status(404).json({ message: 'Application not found' });
      }
  
      console.log('Application found:', application);
  
      if (decision === 'accept') {
        // Δημιουργία νέου καταστήματος με τα δεδομένα της αίτησης
        const newShop = new Shop({
          shopName :application.shopName,
          shopDescription: application.shopDescription,
          category: application.category,
          city: application.city,
          region: application.region,
          location: application.location,
          phone: application.phone,
          musicCategory: application.musicCategory,
          priceRange: application.priceRange,
        });
  
        console.log('Creating new shop with data:', newShop);
  
        await newShop.save();
        console.log('New shop created successfully:', newShop);
  
        // Ενημέρωση του χρήστη με το shopId
        const user = await User.findById(application.userId);
        if (!user) {
          console.error('User not found for ID:', application.userId);
          return res.status(404).json({ message: 'User not found' });
        }
  
        console.log('User found:', user);
  
        user.shopId = newShop._id;
        user.role = 'shopOwner'; // Ενημέρωση ρόλου χρήστη
        await user.save();
        console.log('User updated with new shopId and role:', user);
  
        // Διαγραφή της αίτησης
        await Application.findByIdAndDelete(applicationId);
        console.log('Application deleted successfully for ID:', applicationId);
  
        res.status(200).json({ message: 'Application accepted and shop created successfully', shop: newShop });
      } else if (decision === 'reject') {
        console.log('Rejecting application with ID:', applicationId);
  
        // Διαγραφή της αίτησης
        await Application.findByIdAndDelete(applicationId);
        console.log('Application deleted successfully for ID:', applicationId);
  
        res.status(200).json({ message: 'Application rejected and deleted successfully' });
      } else {
        console.error('Invalid decision value:', decision);
        res.status(400).json({ message: 'Invalid decision value. Use "accept" or "reject".' });
      }
    } catch (error) {
      console.error('Error handling application decision:', error.message);
      res.status(500).json({ message: 'Error handling application decision', error: error.message });
    }
  };

module.exports = {
  getApplications,
  postApplication,
  handleApplicationDecision,
};