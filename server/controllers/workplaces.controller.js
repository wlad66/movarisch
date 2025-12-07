const Workplace = require('../models/Workplace');

/**
 * GET /api/workplaces
 * Ottieni tutti i luoghi di lavoro dell'utente
 */
async function getAll(req, res) {
    try {
        const workplaces = await Workplace.findByUserId(req.user.id);
        res.json(workplaces);
    } catch (error) {
        console.error('Get workplaces error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * POST /api/workplaces
 * Crea un nuovo luogo di lavoro
 */
async function create(req, res) {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const workplace = await Workplace.create(req.user.id, name);
        res.json(workplace);
    } catch (error) {
        console.error('Create workplace error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * DELETE /api/workplaces/:id
 * Elimina un luogo di lavoro
 */
async function deleteWorkplace(req, res) {
    try {
        const deleted = await Workplace.delete(req.params.id, req.user.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Workplace not found' });
        }

        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete workplace error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    getAll,
    create,
    delete: deleteWorkplace
};
