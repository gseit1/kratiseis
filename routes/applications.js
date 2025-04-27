const express = require('express');
const { getApplications, postApplication, handleApplicationDecision ,getApplicationById} = require('../controllers/applicationsController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const applicationsRouter = express.Router();

// GET: Επιστροφή όλων των αιτήσεων (μόνο για admin)
applicationsRouter.get('/api/applications', getApplications);

// Route για επιστροφή συγκεκριμένης αίτησης
applicationsRouter.get('/api/applications/:applicationId', getApplicationById);

// POST: Δημιουργία νέας αίτησης
applicationsRouter.post('/api/applications', verifyToken ,   postApplication);

// PATCH: Αποδοχή ή απόρριψη αίτησης
applicationsRouter.patch('/api/applications/handle',  handleApplicationDecision);

module.exports = applicationsRouter;