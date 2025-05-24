const express = require('express');
const statisticsRouter = express.Router();
const {
    getTableReservationPercentages,
    getTotalReservations,
    getReservationsByDay,
    getReservationsByHour,
    getOccupancyByDay,
    getNoShowsStats,
} = require('../controllers/statsController');
const { verifyToken, isShopOwner } = require('../middlewares/authMiddleware');

// GET /api/stats/table-reservation-percentages
statisticsRouter.get('/table-reservation-percentages', verifyToken, isShopOwner, getTableReservationPercentages);
// GET /api/stats/total-reservations
statisticsRouter.get('/total-reservations', verifyToken, isShopOwner, getTotalReservations);
// GET /api/stats/reservations-by-day
statisticsRouter.get('/reservations-by-day', verifyToken, isShopOwner, getReservationsByDay);
// GET /api/stats/reservations-by-hour
statisticsRouter.get('/reservations-by-hour', verifyToken, isShopOwner, getReservationsByHour);
// GET /api/stats/occupancy-by-day
statisticsRouter.get('/occupancy-by-day', verifyToken, isShopOwner, getOccupancyByDay);
// GET /api/stats/no-shows
statisticsRouter.get('/no-shows', verifyToken, isShopOwner, getNoShowsStats);

module.exports = statisticsRouter;