import React from 'react';

interface PopupProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

const CustomPopup: React.FC<PopupProps> = ({ message, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className='custom-popup-container'>
            <div className='custom-popup-content'>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
            <div className='custom-popup-overlay' onClick={onClose}></div>
        </div>
    );
};

export default CustomPopup;
