import { useState, useEffect } from 'react';
import './ProfileTile.css';

// Helper function to get correct image path for production
const getImageUrl = (path) => {
    if (!path) return path;
    const IS_PRODUCTION = import.meta.env.PROD;
    const PRODUCTION_BASE = '/metro-link/';
    if (IS_PRODUCTION && path.startsWith('/uploads/')) {
        return PRODUCTION_BASE.replace(/\/$/, '') + path;
    }
    return path;
};

const ProfileTile = ({ image, name, bio }) => {
    return (
        <div className="profile-tile">
            <div className="profile-tile-inner">
                <div className="profile-tile-front">
                    {image ? (
                        <img src={getImageUrl(image)} alt={name} className="profile-tile-image" />
                    ) : (
                        <div className="profile-tile-placeholder">
                            {name?.charAt(0) || 'M'}
                        </div>
                    )}
                    <div className="profile-tile-label">Me</div>
                </div>
                <div className="profile-tile-back">
                    <div className="profile-tile-message">
                        {bio || 'About Me'}
                    </div>
                    <div className="profile-tile-name">{name}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTile;
