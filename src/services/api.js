// Use backend API in development, static files in production
const IS_PRODUCTION = import.meta.env.PROD;
const API_URL = IS_PRODUCTION ? '' : 'http://localhost:3001/api';
// GitHub Pages base path
const PRODUCTION_BASE = '/metro-link/';

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
        // In development, use backend API
        if (!IS_PRODUCTION) {
            const response = await fetch(`${API_URL}/tiles`);
            if (!response.ok) throw new Error('Failed to fetch tiles');
            return await response.json();
        }

        // In production, try static file first
        try {
            const baseUrl = import.meta.env.BASE_URL || '/';
            const response = await fetch(`${baseUrl}tiles.json`);
            if (response.ok) return await response.json();
        } catch (e) {
            console.log('Could not load tiles.json', e);
        }

        // Fallback to localStorage in production
        const stored = localStorage.getItem('tiles');
        if (stored) return JSON.parse(stored);
        return { sections: [] };
    },

    getProfile: async () => {
        // In development, use backend API
        if (!IS_PRODUCTION) {
            const response = await fetch(`${API_URL}/profile`);
            if (!response.ok) {
                return { name: "Melvin Francy", image: null };
            }
            return await response.json();
        }

        // In production, try static file first
        try {
            const baseUrl = import.meta.env.BASE_URL || '/';
            const response = await fetch(`${baseUrl}profile.json`);
            if (response.ok) return await response.json();
        } catch (e) {
            console.log('Could not load profile.json', e);
        }

        // Fallback to localStorage in production
        const stored = localStorage.getItem('profile');
        if (stored) return JSON.parse(stored);
        return { name: "My Portfolio", image: null };
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
