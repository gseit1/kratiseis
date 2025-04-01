const express = require('express');
const { getApplications, postApplication, handleApplicationDecision } = require('../controllers/applicationsController');
//const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const applicationsRouter = express.Router();

// GET: Επιστροφή όλων των αιτήσεων (μόνο για admin)
applicationsRouter.get('/api/applications', getApplications);

// POST: Δημιουργία νέας αίτησης
applicationsRouter.post('/api/applications',  postApplication);

// PATCH: Αποδοχή ή απόρριψη αίτησης
applicationsRouter.patch('/api/applications/handle',  handleApplicationDecision);

module.exports = applicationsRouter;