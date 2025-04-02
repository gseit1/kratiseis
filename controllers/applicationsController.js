const Application = require('../models/applications');
const User = require('../models/user');
const Shop = require('../models/shop');

// GET: Επιστροφή όλων των αιτήσεων
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('userId', 'name surname email'); // Επιστροφή μόνο συγκεκριμένων πεδίων του χρήστη
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error.message);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// POST: Δημιουργία νέας αίτησης
const postApplication = async (req, res) => {
  try {
    const { userId, shopName, shopDescription } = req.body;

    // Επαλήθευση αν ο χρήστης υπάρχει
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newApplication = new Application({
      userId,
      shopName,
      shopDescription,
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
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (decision === 'accept') {
      // Δημιουργία νέου καταστήματος με τα δεδομένα της αίτησης
      

      // Ενημέρωση του χρήστη με το shopId
      const user = await User.findById(application.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.role = 'shopOwner'; // Ενημέρωση ρόλου χρήστη
      await user.save();

      // Διαγραφή της αίτησης
      await Application.findByIdAndDelete(applicationId);

      res.status(200).json({ message: 'Application accepted  successfully' });
    } else if (decision === 'reject') {
      // Διαγραφή της αίτησης
      await Application.findByIdAndDelete(applicationId);
      res.status(200).json({ message: 'Application rejected and deleted successfully' });
    } else {
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