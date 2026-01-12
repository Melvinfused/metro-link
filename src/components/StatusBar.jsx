import { useState, useEffect } from 'react';
import './StatusBar.css';

const StatusBar = ({ isActionCenterOpen, serverAvailable }) => {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`);

            const day = now.getDate().toString().padStart(2, '0');
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            setDate(`${day}/${month}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const isAirplaneModeOn = true; // Hardcoded for now

    return (
        <div className={`status-bar ${isActionCenterOpen ? 'expanded' : ''}`}>
            <div className="status-bar-left">
                {isAirplaneModeOn && (
                    <div className="status-item airplane-status">
                        <span className="status-icon mdl2">&#xE709;</span>
                        {isActionCenterOpen && <span className="status-label">AIRPLANE MODE</span>}
                    </div>
                )}
                <div className="status-item wifi-status">
                    <span className="status-icon mdl2">{serverAvailable ? '\uE701' : '\uE774'}</span>
                </div>
            </div>
            <div className="status-bar-right">
                <div className="status-item">
                    <span className="status-icon mdl2 battery-icon">&#xE83F;</span>
                    {isActionCenterOpen && <span className="status-label">100%</span>}
                </div>
                <div className="status-item">
                    <span className="status-time">{time}</span>
                    {isActionCenterOpen && <span className="status-label">{date}</span>}
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
