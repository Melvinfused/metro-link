import './MessageTile.css';

const MessageTile = ({ name = "Melvin Francy" }) => {
    return (
        <div className="message-tile">
            <div className="message-header">
                <div className="message-header">
                    <svg className="message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Bubble */}
                        <path d="M21 2H3C2.45 2 2 2.45 2 3V17C2 17.55 2.45 18 3 18H6L9 22H11L9 18H21C21.55 18 22 17.55 22 17V3C22 2.45 21.55 2 21 2Z" fill="currentColor" />
                        {/* Smiley Face (Transparent/Cutout) */}
                        <circle cx="9" cy="9" r="1.5" fill="black" />
                        <circle cx="15" cy="9" r="1.5" fill="black" />
                        <path d="M16.5 13C16.5 13 14.5 15 12 15C9.5 15 7.5 13 7.5 13" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
            <div className="message-tile-content">
                <div className="message-greeting">Hi, I'm</div>
                <div className="message-sender">Melvin Francy</div>
            </div>
            <div className="message-footer">
                <span className="message-app-name">Messaging</span>
            </div>
        </div>
    );
};

export default MessageTile;
