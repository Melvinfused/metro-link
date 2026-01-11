import './Background.css';
import asciiArt from '../assets/ascii-art.png';

const Background = () => {
    return (
        <div className="background-container">
            <img
                src={asciiArt}
                alt="ASCII Art Background"
                className="ascii-art-background"
            />
        </div>
    );
};

export default Background;
