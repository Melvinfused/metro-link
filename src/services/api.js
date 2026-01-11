// Use backend API in development, static files in production
const IS_PRODUCTION = import.meta.env.PROD;
const API_URL = IS_PRODUCTION ? '' : 'http://localhost:3001/api';

const TileAPI = {
    checkHealth: async () => {
        if (IS_PRODUCTION) return false; // No backend in production

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
        if (IS_PRODUCTION) {
            // In production, save to localStorage as fallback
            localStorage.setItem('tiles', JSON.stringify(tiles));
            console.warn('Production mode: Tiles saved to localStorage (not persisted on server)');
            return { success: true };
        }

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
        // Always try to load from static file first
        try {
            const response = await fetch('/tiles.json');
            if (response.ok) return await response.json();
        } catch (e) {
            console.log('Could not load tiles.json');
        }

        // Fallback to localStorage in production
        if (IS_PRODUCTION) {
            const stored = localStorage.getItem('tiles');
            if (stored) return JSON.parse(stored);
            return { sections: [] };
        }

        // In development, try backend
        const response = await fetch(`${API_URL}/tiles`);
        if (!response.ok) throw new Error('Failed to fetch tiles');
        return await response.json();
    },

    getProfile: async () => {
        // Try static file first
        try {
            const response = await fetch('/profile.json');
            if (response.ok) return await response.json();
        } catch (e) {
            console.log('Could not load profile.json');
        }

        // Fallback to localStorage in production
        if (IS_PRODUCTION) {
            const stored = localStorage.getItem('profile');
            if (stored) return JSON.parse(stored);
            return { name: "My Portfolio", image: null };
        }

        // In development, try backend
        const response = await fetch(`${API_URL}/profile`);
        if (!response.ok) {
            return { name: "Melvin Francy", image: null };
        }
        return await response.json();
    },

    saveProfile: async (profile) => {
        if (IS_PRODUCTION) {
            localStorage.setItem('profile', JSON.stringify(profile));
            console.warn('Production mode: Profile saved to localStorage (not persisted on server)');
            return { success: true };
        }

        const response = await fetch(`${API_URL}/save-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        });
        if (!response.ok) throw new Error('Failed to save profile');
        return await response.json();
    },

    uploadProfileImage: async (file) => {
        if (IS_PRODUCTION) {
            // In production, convert to data URL for localStorage
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({ success: true, path: e.target.result });
                };
                reader.readAsDataURL(file);
            });
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${API_URL}/upload-profile`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image');
        return await response.json();
    },

    uploadIcon: async (file) => {
        if (IS_PRODUCTION) {
            // In production, convert to data URL for localStorage
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({ success: true, path: e.target.result });
                };
                reader.readAsDataURL(file);
            });
        }

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
