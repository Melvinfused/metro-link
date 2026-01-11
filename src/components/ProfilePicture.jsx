import './ProfilePicture.css';

const ProfilePicture = ({ image, name, onClick }) => {
    return (
        <div className="profile-container" title={name || "User"} onClick={onClick}>
            <div className="profile-picture">
                {image ? (
                    <img src={image} alt={name} />
                ) : (
                    <span className="profile-placeholder">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ProfilePicture;
