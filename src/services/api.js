const API_URL = 'http://localhost:3001/api';

const TileAPI = {
    checkHealth: async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const response = await fetch(`${API_URL}/health`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    saveTiles: async (tiles) => {
        const response = await fetch(`${API_URL}/save-tiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tiles),
        });
        if (!response.ok) throw new Error('Failed to save tiles');
        return await response.json();
    },

    getTiles: async () => {
        const response = await fetch(`${API_URL}/tiles`);
        if (!response.ok) throw new Error('Failed to fetch tiles');
        return await response.json();
    },

    // New methods
    getProfile: async () => {
        const response = await fetch(`${API_URL}/profile`);
        if (!response.ok) {
            // If backend fails (e.g. 404), return default
            return { name: "Melvin Francy", image: null };
        }
        return await response.json();
    },

    saveProfile: async (profile) => {
        const response = await fetch(`${API_URL}/save-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        });
        if (!response.ok) throw new Error('Failed to save profile');
        return await response.json();
    },

    uploadProfileImage: async (file) => {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${API_URL}/upload-profile`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image');
        return await response.json(); // returns { success: true, path: '/uploads/...' }
    },

    uploadIcon: async (file) => {
        const formData = new FormData();
        formData.append('iconImage', file);

        const response = await fetch(`${API_URL}/upload-icon`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload icon');
        return await response.json();
    }
};

export default TileAPI;
