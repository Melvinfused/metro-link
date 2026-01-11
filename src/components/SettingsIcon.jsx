import './SettingsIcon.css';
import gearIcon from '../icons/icons8-settings-32.png';

const SettingsIcon = ({ onClick, disabled }) => {
    return (
        <button
            className={`settings-icon ${disabled ? 'disabled' : ''}`}
            onClick={onClick}
            disabled={disabled}
            aria-label="Settings"
        >
            <img src={gearIcon} alt="Settings" />
        </button>
    );
};

export default SettingsIcon;
