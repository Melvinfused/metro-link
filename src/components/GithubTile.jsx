import React from 'react';
import './GithubTile.css';

const GithubTile = ({ size = 'medium', icon, title, index = 0 }) => {
    // Stagger animation with prime number multiplier to prevent synchronization
    const animationDelay = `${index * 1.7}s`;

    return (
        <a
            href="https://github.com/Melvinfused"
            target="_blank"
            rel="noopener noreferrer"
            className={`github-tile ${size}`}
            style={{ '--animation-delay': animationDelay }}
        >
            <div className="tile-inner">
                {/* Front Side */}
                <div className="tile-front">
                    <div className="tile-icon">
                        {/* Use provided icon or default to GitHub icon from public folder */}
                        {icon && icon.startsWith('/uploads/') ? (
                            <img src={icon} alt="GitHub" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        ) : (
                            <img src="/icons/github.png" alt="GitHub" style={{ maxWidth: '60%', maxHeight: '60%', objectFit: 'contain' }} />
                        )}
                    </div>
                    <div className="tile-title">
                        {title || 'GitHub'}
                    </div>
                </div>

                {/* Back Side - Heatmap */}
                <div className="tile-back">
                    <img
                        src="https://ghchart.rshah.org/b02e3a/Melvinfused"
                        alt="Melvinfused's Github Chart"
                        className="github-heatmap"
                    />
                </div>
            </div>
        </a>
    );
};

export default GithubTile;
