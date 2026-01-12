import { useState } from 'react';
import StatusBar from './StatusBar';
import MessageTile from './MessageTile';
import MusicTile from './MusicTile';
import ProfileTile from './ProfileTile';
import MobileDock from './MobileDock';
import ActionCenter from './ActionCenter';
import LinkTile from './LinkTile';
import './MobileView.css';

const MobileView = ({ sections, profile, onPowerClick, serverAvailable }) => {
    const [isDockOpen, setIsDockOpen] = useState(false);
    const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setTouchStartX(touch.clientX);
        setTouchStartY(touch.clientY);
    };

    const handleTouchMove = (e) => {
        if (touchStartX === null || touchStartY === null) return;

        const touch = e.touches[0];
        const deltaX = touchStartX - touch.clientX;
        const deltaY = touch.clientY - touchStartY;

        // Pull down from top to open action center
        if (touchStartY < 50 && deltaY > 80 && Math.abs(deltaX) < 50 && !isActionCenterOpen) {
            setIsActionCenterOpen(true);
            setTouchStartX(null);
            setTouchStartY(null);
            return;
        }

        // Swipe up to close action center
        if (isActionCenterOpen && deltaY < -50 && Math.abs(deltaX) < 50) {
            setIsActionCenterOpen(false);
            setTouchStartX(null);
            setTouchStartY(null);
            return;
        }

        // Swipe from right edge to left (open dock)
        if (touchStartX > window.innerWidth - 30 && deltaX > 50 && Math.abs(deltaY) < 50) {
            setIsDockOpen(true);
            setTouchStartX(null);
            setTouchStartY(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStartX(null);
        setTouchStartY(null);
    };

    const closeDock = () => {
        setIsDockOpen(false);
    };

    // Flatten all tiles from all sections
    const allTiles = sections.flatMap(section => section.tiles);

    return (
        <div
            className="mobile-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <StatusBar
                isActionCenterOpen={isActionCenterOpen}
                serverAvailable={serverAvailable}
            />

            <div className="mobile-tiles-wrapper">
                <div className="mobile-tiles-grid">
                    {/* Permanent messaging tile */}
                    <MessageTile name={profile.name} />



                    {/* Profile "Me" tile */}
                    <ProfileTile image={profile.image} name={profile.name} bio={profile.bio} />

                    {/* All tiles from sections */}
                    {allTiles.map((tile, index) => (
                        <div
                            key={index}
                            className={`mobile-tile-wrapper ${tile.size || 'medium'}`}
                        >
                            <LinkTile
                                title={tile.title}
                                icon={tile.icon}
                                url={tile.url}
                                size={tile.size}
                                message={tile.message}
                                accentColor={tile.accentColor}
                                index={index}
                            />
                        </div>
                    ))}

                    {/* Permanent Music Tile (Bottom) */}
                    <MusicTile />
                </div>
            </div>

            <MobileDock
                isOpen={isDockOpen}
                onClose={closeDock}
                onPowerClick={onPowerClick}
            />

            <ActionCenter
                isOpen={isActionCenterOpen}
                onClose={() => setIsActionCenterOpen(false)}
                serverAvailable={serverAvailable}
            />
        </div>
    );
};

export default MobileView;
