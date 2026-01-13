import React from 'react';
import './GithubTile.css';

const GithubTile = ({ size = 'medium', icon, title }) => {
    return (
        <a
            href="https://github.com/Melvinfused"
            target="_blank"
            rel="noopener noreferrer"
            className={`github-tile ${size}`}
        >
            <div className="tile-inner">
                {/* Front Side */}
                <div className="tile-front">
                    <div className="tile-icon">
                        {/* Use provided icon or default to GitHub emoji/text if generic */}
                        {icon && icon.startsWith('/uploads/') ? (
                            <img src={icon} alt="GitHub" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        ) : (
                            <span style={{ fontSize: '2.5rem' }}>{icon || '🐙'}</span>
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
