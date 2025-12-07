const Report = require('../models/Report');

async function getAll(req, res) {
    try {
        const reports = await Report.findByUserId(req.user.id);
        res.json(reports);
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function create(req, res) {
    try {
        const reportData = req.body;
        const report = await Report.create(req.user.id, reportData);
        res.json(report);
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function deleteReport(req, res) {
    try {
        const deleted = await Report.delete(req.params.id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete report error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { getAll, create, delete: deleteReport };
