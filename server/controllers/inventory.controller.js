const Inventory = require('../models/Inventory');

async function getAll(req, res) {
    try {
        const inventory = await Inventory.findByUserId(req.user.id);
        res.json(inventory);
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function create(req, res) {
    try {
        const { name, cas, hCodes, riskLevel, ...additionalData } = req.body;

        if (!name || !cas) {
            return res.status(400).json({ error: 'Name and CAS are required' });
        }

        // Check duplicates
        const existing = await Inventory.findByCAS(req.user.id, cas);
        if (existing) {
            return res.status(400).json({ error: 'Agent with this CAS already exists in inventory' });
        }

        const item = await Inventory.create(req.user.id, { name, cas, hCodes, riskLevel, additionalData });
        res.json(item);
    } catch (error) {
        console.error('Create inventory error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function update(req, res) {
    try {
        const { name, cas, hCodes, riskLevel, ...additionalData } = req.body;

        const item = await Inventory.update(req.params.id, req.user.id, {
            name,
            cas,
            hCodes,
            riskLevel,
            additionalData
        });

        if (!item) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function deleteItem(req, res) {
    try {
        const deleted = await Inventory.delete(req.params.id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete inventory error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { getAll, create, update, delete: deleteItem };
