import PowerButton from './PowerButton';
import './MobileDock.css';

const MobileDock = ({ isOpen, onClose, onPowerClick }) => {
    return (
        <>
            {/* Backdrop overlay */}
            {isOpen && (
                <div className="mobile-dock-overlay" onClick={onClose} />
            )}

            {/* Dock panel */}
            <div className={`mobile-dock ${isOpen ? 'open' : ''}`}>
                <div className="mobile-dock-content">
                    <PowerButton onClick={onPowerClick} />
                </div>
            </div>
        </>
    );
};

export default MobileDock;
