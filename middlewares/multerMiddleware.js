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
    let folder = 'uploads'; // default

    // Mapping routes σε φακέλους
    if (req.originalUrl.includes('floorPanel')) {
      folder = 'floorPanelBackgrounds';
    } else if (req.originalUrl.includes('category')) {
      folder = 'categories';
    } else if (req.originalUrl.includes('city')) {
      folder = 'cities';
    } else if (req.originalUrl.includes('shop')) {
      folder = 'shops';
    }

    console.log(`[multerMiddleware] Uploading to folder: ${folder}`);
    console.log(`[multerMiddleware] Request URL: ${req.originalUrl}`);

    const uploadDir = path.join(__dirname, '..', `public/uploads/${folder}`);
    createFolderIfNotExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Ρύθμιση του multer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Μέγιστο μέγεθος αρχείου: 10MB
});


module.exports = upload;
