const admin = require('../firebase_auth/firebaseAdmin');
const User = require('../models/user');
const Shop = require('../models/shop');

// Εγγραφή χρήστη
// Εγγραφή χρήστη
const signUp = async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    // Δημιουργία χρήστη στο Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: `${name} ${surname}`,
    });

    // Δημιουργία χρήστη στη MongoDB
    const newUser = new User({
      firebaseUid: userRecord.uid,
      name: name,
      surname: surname,
      email: email,
      role: 'user', // Ο ρόλος είναι πάντα 'user' κατά την εγγραφή
    });

    await newUser.save();

    // Επιστροφή επιτυχίας με το userId
    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id, // Επιστροφή του MongoDB userId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Σύνδεση χρήστη
const axios = require('axios');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Firebase REST API για login
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD6yfJs_ICEC_M0lJvl3Q5_nTIbF-1nLOc`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const idToken = response.data.idToken;
    const firebaseUid = response.data.localId; // Παίρνουμε το UID από το Firebase

    // Εύρεση χρήστη στη MongoDB
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found in MongoDB' });
    }

    // Επιστροφή του token, του ρόλου και του shopId (αν υπάρχει)
    res.status(200).json({
      message: 'Login successful',
      idToken,
      role: user.role,
      shopId: user.shopId || null,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.response?.data || error.message,
    });
  }
};


// Αλλαγή ρόλου χρήστη από admin
const changeUserRole = async (req, res) => {
  const { email, newRole, shopId } = req.body;

  try {
    // Αναζήτηση χρήστη στο Firebase Authentication βάσει email
    const userRecord = await admin.auth().getUserByEmail(email);
    if (!userRecord) {
      return res.status(404).json({ message: 'User not found in Firebase' });
    }

    // Αναζήτηση χρήστη στη MongoDB βάσει firebaseUid
    const user = await User.findOne({ firebaseUid: userRecord.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found in MongoDB' });
    }

    // Ενημέρωση του ρόλου του χρήστη
    user.role = newRole;

    // Αν ο νέος ρόλος είναι "shopOwner", ορίζουμε το shopId
    if (newRole === 'shopOwner') {
      if (!shopId) {
        return res.status(400).json({ message: 'shopId is required for shopOwner role' });
      }

      // Επαλήθευση ότι το shopId υπάρχει στη βάση δεδομένων
      const shopExists = await Shop.findById(shopId);
      if (!shopExists) {
        return res.status(404).json({ message: 'Shop not found' });
      }

      user.shopId = shopId;
    } else {
      // Αν ο ρόλος δεν είναι "shopOwner", αφαιρούμε το shopId
      user.shopId = null;
    }

    // Αποθήκευση των αλλαγών
    await user.save();

    res.status(200).json({ message: 'User role and shopId updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};

// Διαγραφή χρήστη
const deleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Αναζήτηση χρήστη στο Firebase Authentication βάσει email
    const userRecord = await admin.auth().getUserByEmail(email);
    if (!userRecord) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Διαγραφή χρήστη από Firebase Authentication
    await admin.auth().deleteUser(userRecord.uid);

    // Διαγραφή χρήστη από MongoDB
    await User.findOneAndDelete({ firebaseUid: userRecord.uid });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

const getUserRole = async (req, res) => {
  try {
    // Βρίσκουμε τον χρήστη στη βάση δεδομένων με βάση το firebaseUid
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Επιστρέφουμε τον ρόλο και το shopId (αν υπάρχει)
    res.status(200).json({ role: user.role, shopId: user.shopId || null });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user role', error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // Παίρνουμε το firebaseUid από το token που επαληθεύτηκε στο middleware
    const user = await User.findOne({ firebaseUid: req.user.uid }).select('-password'); // Εξαιρούμε το password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      shopId: user.shopId,
      reservationHistory: user.reservationHistory,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};


const setUserShopId = async (req, res) => {
  const { shopId } = req.body;

  console.log('setUserShopId called');
  console.log('Received shopId:', shopId);

  try {
    // Παίρνουμε το firebaseUid από το token που επαληθεύτηκε στο middleware
    console.log('Fetching user with firebaseUid:', req.user?.uid);
    const user = await User.findOne({ firebaseUid: req.user?.uid });

    if (!user) {
      console.error('User not found for firebaseUid:', req.user?.uid);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Ενημέρωση του shopId του χρήστη
    user.shopId = shopId;
    console.log('Updating user shopId to:', shopId);
    await user.save();

    console.log('Shop ID updated successfully for user:', user);
    res.status(200).json({ message: 'Shop ID set successfully', shopId: user.shopId });
  } catch (error) {
    console.error('Error setting shop ID:', error.message);
    res.status(500).json({ message: 'Error setting shop ID', error: error.message });
  }
};
module.exports = { setUserShopId };

module.exports = {
  signUp,
  login,
  changeUserRole,
  deleteUser,
  getUserRole,
  getUserProfile,
  setUserShopId,
};