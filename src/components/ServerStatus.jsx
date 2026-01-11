import { useState, useEffect } from 'react';
import './ServerStatus.css';

const ServerStatus = ({ onStatusChange }) => {
    const [status, setStatus] = useState('connecting'); // "connecting" | "online" | "offline"
    const [dots, setDots] = useState('');

    // Animated dots during connecting
    useEffect(() => {
        if (status !== 'connecting') return;

        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 400);

        return () => clearInterval(interval);
    }, [status]);

    // Check server connection
    useEffect(() => {
        const checkServer = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch('http://localhost:3001/api/health', {
                    method: 'GET',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    setStatus('online');
                    onStatusChange?.(true);
                } else {
                    setStatus('offline');
                    onStatusChange?.(false);
                }
            } catch (error) {
                setStatus('offline');
                onStatusChange?.(false);
            }
        };

        // Start checking after a brief delay for visual effect
        const timer = setTimeout(checkServer, 1500);
        return () => clearTimeout(timer);
    }, [onStatusChange]);

    return (
        <div className={`server-status ${status}`}>
            {status === 'connecting' && (
                <>
                    <div className="loader-spinner"></div>
                    <span className="status-text">Connecting to Server<span className="dots">{dots}</span></span>
                </>
            )}

            {status === 'online' && (
                <>
                    <div className="wifi-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M12 21l-6-6.7C7.7 12.5 9.7 12 12 12s4.3.5 6 2.3L12 21zm-8-8.5C6.3 10.2 9 9 12 9s5.7 1.2 8 3.5l-1.4 1.6C16.6 12.1 14.4 11 12 11s-4.6 1.1-6.6 3.1L4 12.5zM1 9c3-2.9 7-4.5 11-4.5S20 6.1 23 9l-1.4 1.4C19.1 7.8 15.7 6.5 12 6.5S4.9 7.8 2.4 10.4L1 9z" />
                        </svg>
                    </div>
                    <span className="status-text">Composer Online</span>
                </>
            )}

            {status === 'offline' && (
                <>
                    <div className="wifi-icon">
                        <svg viewBox="0 0 24 24" fill="#ff4757" width="18" height="18">
                            <path d="M2.80815 1.39343L20.4858 19.0711L19.0716 20.4853L15.3889 16.8034L12.0005 21L0.689941 6.99674C1.60407 6.25747 2.59204 5.60589 3.64107 5.05479L1.39394 2.80765L2.80815 1.39343ZM3.57997 7.39183L12.0005 17.817L13.9669 15.3804L5.13163 6.54439C4.59981 6.79756 4.08187 7.0804 3.57997 7.39183ZM12.0005 3.00003C16.2849 3.00003 20.2196 4.49687 23.3104 6.99611L17.9039 13.689L16.4819 12.267L20.4204 7.39135C17.9226 5.84171 15.0278 5.00003 12.0005 5.00003C11.1277 5.00003 10.2659 5.07 9.42141 5.20674L7.72504 3.51088C9.09547 3.17702 10.5273 3.00003 12.0005 3.00003Z"></path>
                        </svg>
                    </div>
                    <span className="status-text">Composer Offline</span>
                </>
            )}
        </div>
    );
};

export default ServerStatus;
