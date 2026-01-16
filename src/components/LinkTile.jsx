import './LinkTile.css';

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

// Helper function to convert hex color to rgba with low opacity for tinting effect
const hexToRgba = (hex, alpha = 0.3) => {
    if (!hex) return null;
    // Remove # if present
    hex = hex.replace('#', '');
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const LinkTile = ({
    title, icon, url, size = 'medium', message, index = 0, accentColor,
    draggable, onDragStart, onDragEnd, isArranging
}) => {
    const animationDelay = `${index * 1}s`;

    // Apply accent color variable if provided
    const style = {
        animationDelay,
        ...(accentColor ? { '--tile-accent-color': hexToRgba(accentColor, 0.3) } : {})
    };

    const handleClick = (e) => {
        if (isArranging) {
            e.preventDefault();
        }
    };

    return (
        <a
            href={url || '#'}
            className={`link-tile ${size} ${message ? 'has-message' : ''} ${isArranging ? 'arranging' : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            style={style}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={handleClick}
        >
            <div className="tile-inner">
                <div className="tile-front">
                    <div className="tile-icon">
                        {icon && icon.startsWith('/uploads/') ? (
                            <img src={getImageUrl(icon)} alt={title} />
                        ) : (
                            icon
                        )}
                    </div>
                    <div className="tile-title">
                        {title || 'Link Title'}
                    </div>
                </div>

                {message && (
                    <div
                        className="tile-back"
                        style={accentColor ? {
                            backgroundColor: hexToRgba(accentColor, 0.3),
                            borderColor: hexToRgba(accentColor, 0.6)
                        } : {}}
                    >
                        <div className="tile-message">
                            {message}
                        </div>
                        <div className="tile-title">
                            {title || 'Link Title'}
                        </div>
                    </div>
                )}
            </div>
        </a>
    );
};

export default LinkTile;
