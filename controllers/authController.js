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
      role: 'user',
    });

    await newUser.save();

    // Αυτόματο login του χρήστη
    const loginResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const idToken = loginResponse.data.idToken;

    // Αποθήκευση του token ως HTTP-only cookie
    res.cookie('jwt', idToken, {
      httpOnly: true,
      secure: false, // Χρησιμοποίησε `true` σε παραγωγή με HTTPS
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60, // 1 ώρα
    });

    res.status(201).json({
      message: 'User registered and logged in successfully',
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Error during sign up:', error.message);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Σύνδεση χρήστη
const axios = require('axios');



const login = async (req, res) => {
  console.log('Login function called'); // Log for function entry
  const { email, password } = req.body;

  console.log('Received email:', email); // Log the email received
  console.log('Received password:', password ? 'Password provided' : 'No password provided'); // Avoid logging the actual password for security

  try {
    // Firebase REST API for login
    console.log('Sending request to Firebase for login...');
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    console.log('Firebase login successful:', response.data); // Log the response from Firebase

   // In your login function, after getting the Firebase token:
const idToken = response.data.idToken;
const firebaseUid = response.data.localId;

// Find the user in MongoDB
const user = await User.findOne({ firebaseUid });

// Set HTTP-only cookie with the token
res.cookie('jwt', idToken, {
  httpOnly: true,
  secure: false, // Use HTTPS in production
  sameSite: 'Lax',
  maxAge: 1000 * 60 * 60, // 1 hour
});

// Fetch the current custom claims to include in the response
const userRecord = await admin.auth().getUser(firebaseUid);
const customClaims = userRecord.customClaims || {};

// Return data to client including claims
res.status(200).json({
  message: 'Login successful',
  role: user.role,
  shopId: user.shopId || customClaims.shopId || null,
  userId: user._id
});

    console.log('Login response sent successfully'); // Log for successful response
  } catch (error) {
    console.error('Error during login:', error.message); // Log the error message
    console.error('Error details:', error.response?.data || error); // Log detailed error information
    res.status(500).json({
      message: 'Error logging in',
      error: error.response?.data || error.message,
    });
  }
};

// Αλλαγή ρόλου χρήστη από admin
const changeUserRole = async (req, res) => {
  const { email, newRole } = req.body;

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
    // Αναζήτηση χρήστη στο Firebase Auhentication βάσει email
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
    const user = await User.findById(id).select('-password'); // Εξαιρούμε το password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Επιστρέφουμε τον ρόλο και το shopId (αν υπάρχει)
    res.status(200).json({ role: user.role, shopId: user.shopId || null });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user role', error: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'email'); // Επιστροφή μόνο του email
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


   
const mongoose = require('mongoose');

const getUserDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        isAuthenticated: false,
        message: 'Unauthorized: No authenticated user',
      });
    }

    const user = await User.findById(req.user._id).select('name surname email role shopId').lean();

    if (!user) {
      return res.status(404).json({
        isAuthenticated: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      isAuthenticated: true,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        shopId: user.shopId || null,
      },
    });
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    res.status(500).json({
      isAuthenticated: false,
      message: 'Error fetching user details',
      error: error.message,
    });
  }
};


const setUserShopId = async (req, res) => {
  const { shopId } = req.body;
  console.log('setUserShopId called');
  console.log('Received shopId:', shopId);

  if (!req.user || !req.user.id) {
    console.error('Missing or invalid user in request');
    return res.status(401).json({ message: 'Unauthorized: Missing user information' });
  }

  try {
    console.log('Fetching user with id:', req.user.id);

    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found for id:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Update shopId in MongoDB
    user.shopId = shopId;
    user.role = 'shopOwner'; // Ensure the role is set to shopOwner
    console.log('Updating user shopId to:', shopId);
    await user.save();

    // Set Firebase custom claims
    if (user.firebaseUid) {
      try {
        // Get current custom claims
        const userRecord = await admin.auth().getUser(user.firebaseUid);
        const currentClaims = userRecord.customClaims || {};
        
        // Update with new claims
        await admin.auth().setCustomUserClaims(user.firebaseUid, { 
          ...currentClaims,
          shopId: shopId.toString(),
          role: 'shopOwner'
        });
        console.log('Firebase custom claims set for user:', user.firebaseUid);
      } catch (firebaseError) {
        console.error('Error setting Firebase custom claims:', firebaseError);
        // Continue with the process even if Firebase update fails
      }
    }

    console.log('Shop ID updated successfully for user:', user);
    res.status(200).json({ message: 'Shop ID set successfully', shopId: user.shopId });
  } catch (error) {
    console.error('Error setting shop ID:', error.message);
    res.status(500).json({ message: 'Error setting shop ID', error: error.message });
  }
};








const filterByRole = async (req, res) => {
  const { role } = req.query; // Παίρνουμε το role από το body

  console.log('filterByRole called'); // Log για την κλήση της συνάρτησης
  console.log('Received role:', role); // Log για το role που λαμβάνεται
  
  // Έλεγχος για έγκυρο role
  const validRoles = ['user', 'shopOwner', 'admin'];
  if (!role || !validRoles.includes(role)) {
    console.error('Invalid or missing role parameter:', role); // Log για μη έγκυρο role
    return res.status(400).json({ message: 'Invalid or missing role parameter' });
  }

  try {
    // Εύρεση χρηστών με το συγκεκριμένο role
    console.log('Searching for users with role:', role); // Log πριν την αναζήτηση
    const users = await User.find({ role }).select('email'); // Επιλέγουμε μόνο το email (το _id περιλαμβάνεται αυτόματα)

    if (!users || users.length === 0) {
      console.warn('No users found with the specified role:', role); // Log αν δεν βρεθούν χρήστες
      return res.status(404).json({ message: 'No users found with the specified role' });
    }

    console.log('Users found:', users); // Log για τους χρήστες που βρέθηκαν

    // Επιστροφή των χρηστών
    res.status(200).json(users);
  } catch (error) {
    console.error('Error filtering users by role:', error.message); // Log για σφάλμα
    res.status(500).json({ message: 'Error filtering users by role', error: error.message });
  }
};


const getUserReservationHistory = async (req, res) => {
  try {
    // Ελέγξτε αν ο χρήστης είναι συνδεδεμένος
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Unauthorized: No authenticated user',
      });
    }

    // Βρείτε τον χρήστη στη βάση δεδομένων
    const user = await User.findById(req.user.id).populate('reservationHistory').lean();

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Επιστροφή του reservationHistory
    res.status(200).json({
      reservationHistory: user.reservationHistory || [],
    });
  } catch (error) {
    console.error('Error fetching reservation history:', error.message);
    res.status(500).json({
      message: 'Error fetching reservation history',
      error: error.message,
    });
  }
};


const addToFavourites = async (req, res) => {
  const { shopId } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: No authenticated user' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.favouriteShops.includes(shopId)) {
      return res.status(400).json({ message: 'Shop is already in favourites' });
    }

    user.favouriteShops.push(shopId);
    await user.save();

    res.status(200).json({ message: 'Shop added to favourites', favouriteShops: user.favouriteShops });
  } catch (error) {
    console.error('Error adding to favourites:', error.message);
    res.status(500).json({ message: 'Error adding to favourites', error: error.message });
  }
};


const deleteFromFavourites = async (req, res) => {
  const { shopId } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: No authenticated user' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favouriteShops.includes(shopId)) {
      return res.status(400).json({ message: 'Shop is not in favourites' });
    }

    user.favouriteShops = user.favouriteShops.filter(id => id.toString() !== shopId);
    await user.save();

    res.status(200).json({ message: 'Shop removed from favourites', favouriteShops: user.favouriteShops });
  } catch (error) {
    console.error('Error removing from favourites:', error.message);
    res.status(500).json({ message: 'Error removing from favourites', error: error.message });
  }
};


const getFavouriteShops = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: No authenticated user' });
    }

    const user = await User.findById(req.user.id).populate('favouriteShops');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ favouriteShops: user.favouriteShops });
  } catch (error) {
    console.error('Error fetching favourite shops:', error.message);
    res.status(500).json({ message: 'Error fetching favourite shops', error: error.message });
  }
};


const toggleAppliedStatus = async (req, res) => {
  try {
    const { userId, applied } = req.body;

    if (typeof applied !== 'boolean') {
      return res.status(400).json({ message: 'Invalid value for applied. Must be true or false.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.applied = applied;
    await user.save();

    res.status(200).json({ message: 'Applied status updated successfully', applied: user.applied });
  } catch (error) {
    console.error('Error updating applied status:', error.message);
    res.status(500).json({ message: 'Error updating applied status', error: error.message });
  }
};


const getUserReviews = async (req, res) => {
  try {
    // Ελέγξτε αν ο χρήστης είναι συνδεδεμένος
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Unauthorized: No authenticated user',
      });
    }

    // Βρείτε τον χρήστη και φορτώστε τα reviews με το shopName
    const user = await User.findById(req.user.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'shopId', // Αναφορά στο Shop
          select: 'name', // Επιλέγουμε μόνο το πεδίο name
        },
      })
      .select('reviews')
      .lean();

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Επιστροφή του πίνακα reviews
    res.status(200).json({
      reviews: user.reviews || [],
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error.message);
    res.status(500).json({
      message: 'Error fetching user reviews',
      error: error.message,
    });
  }
};

module.exports = {
  signUp,
  login,
  changeUserRole,
  deleteUser,
  getUserRole,
  getUserDetails,
  setUserShopId,
  getAllUsers,
  filterByRole,
  getUserReservationHistory,
  addToFavourites,
  deleteFromFavourites,
  getFavouriteShops,
  toggleAppliedStatus,
  getUserReviews,
};