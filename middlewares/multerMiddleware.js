const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Δημιουργία φακέλου αν δεν υπάρχει
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Ρύθμιση αποθήκευσης για το multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Δυναμικός φάκελος αποθήκευσης
    let folder = 'categories'; // Default folder
    if (req.originalUrl.includes('/city')) {
      folder = 'cities';
    }

    console.log('Uploading to folder:', folder);

    const uploadDir = path.join(__dirname, '..', `public/uploads/${folder}`);
    createFolderIfNotExists(uploadDir);
    cb(null, uploadDir); // Φάκελος αποθήκευσης
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Δημιουργία μοναδικού ονόματος αρχείου
  },
});

// Φιλτράρισμα τύπων αρχείων
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and JPG files are allowed'));
  }
};

// Ρύθμιση του multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Μέγιστο μέγεθος αρχείου: 2MB
});

module.exports = upload;