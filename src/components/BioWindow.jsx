import { useState, useEffect, useRef } from 'react';
import './BioWindow.css';

const BioWindow = ({ onClose, profile }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const windowRef = useRef(null);

    // Center the window on mount
    useEffect(() => {
        const winWidth = 400; // Match CSS width
        const winHeight = 500; // Approx height
        const x = (window.innerWidth - winWidth) / 2;
        const y = (window.innerHeight - winHeight) / 2;
        setPosition({ x, y });
    }, []);

    const handleMouseDown = (e) => {
        if (e.target.closest('.window-controls')) return; // Don't drag if clicking buttons
        setIsDragging(true);
        const rect = windowRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            className="bio-window"
            ref={windowRef}
            style={{ left: position.x, top: position.y }}
        >
            <div className="window-titlebar" onMouseDown={handleMouseDown}>
                <div className="window-app-icon">👤</div>
                <div className="window-title">Me</div>
                <div className="window-controls">
                    <button className="control-btn minimize">─</button>
                    <button className="control-btn maximize">☐</button>
                    <button className="control-btn close" onClick={onClose}>✕</button>
                </div>
            </div>
            <div className="window-content">
                <div className="bio-header">
                    <div className="bio-avatar">
                        {profile.image ? (
                            <img src={profile.image} alt={profile.name} />
                        ) : (
                            <div className="bio-placeholder">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                    </div>
                    <h2>{profile.name}</h2>
                </div>
                <div className="bio-body">
                    <div className="bio-section">
                        <h3>About Me</h3>
                        <p>{profile.bio || 'Welcome to my digital space.'}</p>
                    </div>

                    <div className="bio-section">
                        <h3>About Website</h3>
                        <p>{profile.aboutWebsite || 'A collection of my links and projects.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BioWindow;
