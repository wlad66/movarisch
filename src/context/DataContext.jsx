import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [workplaces, setWorkplaces] = useState([]);
    const [roles, setRoles] = useState([]); // Mansioni
    const [inventory, setInventory] = useState([]); // Agenti Chimici
    const [loading, setLoading] = useState(true);

    // Carica dati al login da API
    useEffect(() => {
        if (user && token) {
            loadAllData();
        } else {
            setWorkplaces([]);
            setRoles([]);
            setInventory([]);
            setLoading(false);
        }
    }, [user, token]);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [workplacesRes, rolesRes, inventoryRes] = await Promise.all([
                fetch('/api/workplaces', { headers }),
                fetch('/api/roles', { headers }),
                fetch('/api/inventory', { headers })
            ]);

            if (workplacesRes.ok) setWorkplaces(await workplacesRes.json());
            if (rolesRes.ok) setRoles(await rolesRes.json());
            if (inventoryRes.ok) setInventory(await inventoryRes.json());
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- WORKPLACES ---
    const addWorkplace = async (name) => {
        try {
            const response = await fetch('/api/workplaces', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });

            if (response.ok) {
                const newWorkplace = await response.json();
                setWorkplaces([...workplaces, newWorkplace]);
            } else {
                console.error('Failed to add workplace');
            }
        } catch (error) {
            console.error('Error adding workplace:', error);
        }
    };

    const deleteWorkplace = async (id) => {
        try {
            const response = await fetch(`/api/workplaces/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setWorkplaces(workplaces.filter(w => w.id !== id));
            } else {
                console.error('Failed to delete workplace');
            }
        } catch (error) {
            console.error('Error deleting workplace:', error);
        }
    };

    // --- ROLES (Mansioni) ---
    const addRole = async (name, description) => {
        try {
            const response = await fetch('/api/roles', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description })
            });

            if (response.ok) {
                const newRole = await response.json();
                setRoles([...roles, newRole]);
            } else {
                console.error('Failed to add role');
            }
        } catch (error) {
            console.error('Error adding role:', error);
        }
    };

    const deleteRole = async (id) => {
        try {
            const response = await fetch(`/api/roles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setRoles(roles.filter(r => r.id !== id));
            } else {
                console.error('Failed to delete role');
            }
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    // --- INVENTORY (Agenti) ---
    const addToInventory = async (agent) => {
        // agent: { name, cas, hCodes, ... }
        try {
            const response = await fetch('/api/inventory', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(agent)
            });

            if (response.ok) {
                const newAgent = await response.json();
                setInventory([...inventory, newAgent]);
            } else {
                const error = await response.json();
                console.error('Failed to add to inventory:', error.error);
                if (error.error.includes('already exists')) {
                    alert('Agente con questo CAS già presente in inventario');
                }
            }
        } catch (error) {
            console.error('Error adding to inventory:', error);
        }
    };

    const updateInventory = async (id, updatedAgent) => {
        try {
            const response = await fetch(`/api/inventory/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAgent)
            });

            if (response.ok) {
                const updated = await response.json();
                setInventory(inventory.map(item =>
                    item.id === id ? updated : item
                ));
            } else {
                console.error('Failed to update inventory');
            }
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    const deleteFromInventory = async (id) => {
        try {
            const response = await fetch(`/api/inventory/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setInventory(inventory.filter(i => i.id !== id));
            } else {
                console.error('Failed to delete from inventory');
            }
        } catch (error) {
            console.error('Error deleting from inventory:', error);
        }
    };

    return (
        <DataContext.Provider value={{
            workplaces, addWorkplace, deleteWorkplace,
            roles, addRole, deleteRole,
            inventory, addToInventory, updateInventory, deleteFromInventory,
            loading
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
