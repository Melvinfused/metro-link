import { useEffect } from 'react';
import './ShutdownOverlay.css';

const ShutdownOverlay = ({ onComplete }) => {
  useEffect(() => {
    // Total duration: 2s fade in + 2s wait + 1s fade out = ~5s
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="shutdown-overlay">
      <div className="shutdown-loader-wrapper">
        <div className="shutdown-spinner">
          <div className="shutdown-dot"></div>
          <div className="shutdown-dot"></div>
          <div className="shutdown-dot"></div>
          <div className="shutdown-dot"></div>
          <div className="shutdown-dot"></div>
        </div>
        <div className="shutdown-message">Shutting down...</div>
      </div>
    </div>
  );
};

export default ShutdownOverlay;
