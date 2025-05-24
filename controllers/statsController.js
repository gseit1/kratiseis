const Reservation = require('../models/reservation');
const Table = require('../models/table');

exports.getTableReservationPercentages = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const tables = await Table.find({ shopId });
        const tableIds = tables.map(t => t._id);

        // Count reservations per table
        const counts = await Reservation.aggregate([
            { $match: { tableId: { $in: tableIds } } },
            { $group: { _id: "$tableId", count: { $sum: 1 } } }
        ]);

        const totalReservations = counts.reduce((sum, c) => sum + c.count, 0);

        const tablePercentages = tables.map(table => {
            const found = counts.find(c => String(c._id) === String(table._id));
            const count = found ? found.count : 0;
            const percentage = totalReservations > 0 ? ((count / totalReservations) * 100).toFixed(2) : "0.00";
            return {
                tableId: table._id,
                tableNumber: table.tableNumber, // <-- σωστό πεδίο!
                count,
                percentage
            };
        });

        res.json({ tablePercentages, totalReservations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTotalReservations = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const total = await Reservation.countDocuments({ shopId });
        res.json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReservationsByDay = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const reservations = await Reservation.find({ shopId });
        const counts = {};
        reservations.forEach(r => {
            const date = r.reservationDate ? new Date(r.reservationDate).toLocaleDateString('el-GR') : null;
            if (date) counts[date] = (counts[date] || 0) + 1;
        });
        res.json({ counts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReservationsByHour = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const reservations = await Reservation.find({ shopId });
        const counts = {};
        reservations.forEach(r => {
            if (r.reservationDate) {
                const hour = new Date(r.reservationDate).getHours();
                counts[hour] = (counts[hour] || 0) + 1;
            }
        });
        res.json({ counts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOccupancyByDay = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const tablesCount = await Table.countDocuments({ shopId });
        const reservations = await Reservation.find({ shopId });
        const occupancy = {};
        reservations.forEach(r => {
            const date = r.reservationDate ? new Date(r.reservationDate).toLocaleDateString('el-GR') : null;
            if (date) occupancy[date] = (occupancy[date] || 0) + 1;
        });
        // Υπολογισμός ποσοστού πληρότητας ανά ημέρα
        const percentages = {};
        Object.keys(occupancy).forEach(date => {
            percentages[date] = tablesCount > 0 ? ((occupancy[date] / tablesCount) * 100).toFixed(2) : "0.00";
        });
        res.json({ percentages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNoShowsStats = async (req, res) => {
    try {
        const shopId = req.user.shopId;
        const total = await Reservation.countDocuments({ shopId });
        // Δες τι state υπάρχουν
        const allStates = await Reservation.find({ shopId }, { state: 1 });
        console.log('All states:', allStates.map(r => r.state));
        const notShown = await Reservation.countDocuments({ shopId, state: 'notShown' });
        console.log('NoShows DEBUG:', { shopId, total, notShown });
        const percentage = total > 0 ? ((notShown / total) * 100).toFixed(2) : "0.00";
        res.json({ notShown, percentage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};