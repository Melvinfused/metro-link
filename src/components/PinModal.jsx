import { useState } from 'react';
import './PinModal.css';

const PinModal = ({ isOpen, onClose, onSuccess }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState(false);
    const CORRECT_PIN = '9265';

    const handleInput = (index, value) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        setError(false);

        // Auto-focus next input
        if (value && index < 3) {
            document.getElementById(`pin-${index + 1}`)?.focus();
        }

        // Check PIN when all 4 digits entered
        if (index === 3 && value) {
            const enteredPin = newPin.join('');
            if (enteredPin === CORRECT_PIN) {
                onSuccess();
                setPin(['', '', '', '']);
            } else {
                setError(true);
                setTimeout(() => {
                    setPin(['', '', '', '']);
                    setError(false);
                    document.getElementById('pin-0')?.focus();
                }, 500);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            document.getElementById(`pin-${index - 1}`)?.focus();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="pin-modal-overlay" onClick={onClose}>
            <div className="pin-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Enter PIN</h2>
                <div className={`pin-inputs ${error ? 'error' : ''}`}>
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            id={`pin-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleInput(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            autoFocus={index === 0}
                        />
                    ))}
                </div>
                {error && <p className="error-message">Incorrect PIN</p>}
                <button className="cancel-btn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default PinModal;
