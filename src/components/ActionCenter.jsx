import './ActionCenter.css';

const ActionCenter = ({ isOpen, onClose, serverAvailable }) => {
    const quickSettings = [
        {
            id: 'cellular',
            label: 'CELLULAR',
            icon: '\uE704',
            active: false,
            disabled: true
        },
        {
            id: 'wifi',
            label: serverAvailable ? 'WI-FI' : 'WI-FI',
            icon: '\uE701',
            active: serverAvailable,
            disabled: false
        },
        {
            id: 'airplane',
            label: 'AIRPLANE MODE',
            icon: '\uE709',
            active: true,
            disabled: false
        },
        {
            id: 'bluetooth',
            label: 'BLUETOOTH',
            icon: '\uE702',
            active: false,
            disabled: false
        }
    ];

    const notifications = [
        {
            app: 'Composer',
            app: 'Composer',
            icon: '\uE70F',
            title: serverAvailable ? 'Status: Online' : 'Status: Offline',
            message: serverAvailable
                ? 'Composer connected. Editing features are available.'
                : 'Composer not connected. Editing is disabled.',
            time: '12:00'
        }
    ];

    return (
        <>
            {isOpen && (
                <div className="action-center-overlay" onClick={onClose} />
            )}
            <div className={`action-center ${isOpen ? 'open' : ''}`}>
                <div className="action-center-content">
                    {/* Quick Settings - Single Row */}
                    <div className="quick-settings">
                        <div className="quick-settings-row">
                            {quickSettings.map(setting => (
                                <div
                                    key={setting.id}
                                    className={`quick-setting-button ${setting.active ? 'active' : ''} ${setting.disabled ? 'disabled' : ''}`}
                                >
                                    <div className="quick-setting-icon">{setting.icon}</div>
                                    <div className="quick-setting-label">{setting.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="action-button">
                            <span className="action-icon">✕</span>
                            <span>CLEAR ALL</span>
                        </button>
                        <button className="action-button">
                            <span className="action-icon">⚙</span>
                            <span>ALL SETTINGS</span>
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="notifications-list">
                        {notifications.map((notif, index) => (
                            <div key={index} className="notification-card">
                                <div className="notification-header">
                                    <span className="notification-icon">{notif.icon}</span>
                                    <span className="notification-app-name">{notif.app}</span>
                                </div>
                                <div className="notification-content">
                                    <div className="notification-text">
                                        <div className="notification-title">{notif.title}</div>
                                        <div className="notification-body">{notif.message}</div>
                                    </div>
                                    <div className="notification-time">{notif.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ActionCenter;
