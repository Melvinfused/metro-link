import './ProfilePicture.css';

// Helper function to get correct image path for production
const getImageUrl = (path) => {
    if (!path) return path;
    const IS_PRODUCTION = import.meta.env.PROD;
    const PRODUCTION_BASE = '/metro-link/';
    // If in production and path starts with /uploads/, prepend base path
    if (IS_PRODUCTION && path.startsWith('/uploads/')) {
        return PRODUCTION_BASE.replace(/\/$/, '') + path;
    }
    return path;
};

const ProfilePicture = ({ image, name, onClick }) => {
    return (
        <div className="profile-container" title={name || "User"} onClick={onClick}>
            <div className="profile-picture">
                {image ? (
                    <img src={getImageUrl(image)} alt={name} />
                ) : (
                    <span className="profile-placeholder">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ProfilePicture;
