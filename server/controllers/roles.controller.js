const Role = require('../models/Role');

async function getAll(req, res) {
    try {
        const roles = await Role.findByUserId(req.user.id);
        res.json(roles);
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function create(req, res) {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const role = await Role.create(req.user.id, name, description);
        res.json(role);
    } catch (error) {
        console.error('Create role error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function deleteRole(req, res) {
    try {
        const deleted = await Role.delete(req.params.id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete role error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { getAll, create, delete: deleteRole };
