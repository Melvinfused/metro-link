import './LinkTile.css';

const LinkTile = ({
    title, icon, url, size = 'medium', message, index = 0, accentColor,
    draggable, onDragStart, onDragEnd, isArranging
}) => {
    const animationDelay = `${index * 0.1}s`;

    // Apply accent color variable if provided
    const style = {
        animationDelay,
        ...(accentColor ? { '--tile-accent-color': accentColor } : {})
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
                            <img src={icon} alt={title} />
                        ) : (
                            icon
                        )}
                    </div>
                    <div className="tile-title">
                        {title || 'Link Title'}
                    </div>
                </div>

                {message && (
                    <div className="tile-back">
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
