import './WindowsLoader.css';

const WindowsLoader = ({ text }) => {
    return (
        <div className="windows-loader-container">
            <div className="windows-loader">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            {text && <div className="loader-text">{text}</div>}
        </div>
    );
};

export default WindowsLoader;
