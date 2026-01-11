import { useState, useRef, useEffect } from 'react';
import TileAPI from '../services/api';
import ImageCropModal from './ImageCropModal';
import './TileEditor.css';

const TileEditor = ({ isOpen, onClose, sections, setSections, profile, setProfile }) => {
    const [activeTab, setActiveTab] = useState('tiles');
    const [selectedSection, setSelectedSection] = useState(0);
    const [editingTile, setEditingTile] = useState(null); // { sectionIdx, tileIdx }
    const [formData, setFormData] = useState({
        title: '',
        icon: '',
        url: '',
        size: 'medium',
        message: '',
        accentColor: ''
    });
    const [profileForm, setProfileForm] = useState({
        name: profile?.name || '',
        image: profile?.image || '',
        bio: profile?.bio || '',
        aboutWebsite: profile?.aboutWebsite || ''
    });
    const [newSectionName, setNewSectionName] = useState('');
    const [showCropModal, setShowCropModal] = useState(false);
    const [pendingImageFile, setPendingImageFile] = useState(null);

    useEffect(() => {
        if (profile) {
            setProfileForm({
                name: profile.name || '',
                image: profile.image || '',
                bio: profile.bio || '',
                aboutWebsite: profile.aboutWebsite || ''
            });
        }
    }, [profile]);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);
    const tileIconInputRef = useRef(null);

    // Get current section's tiles
    const currentTiles = sections[selectedSection]?.tiles || [];

    const handleAddNew = () => {
        setEditingTile(null);
        setFormData({ title: '', icon: '', url: '', size: 'medium', message: '', accentColor: '' });
        setError(null);
    };

    const handleEdit = (tile, tileIdx) => {
        setEditingTile({ sectionIdx: selectedSection, tileIdx });
        setFormData({ ...tile });
        setError(null);
    };

    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Open crop modal
        setPendingImageFile(file);
        setShowCropModal(true);
    };

    const handleCroppedImage = async (croppedBlob) => {
        setSaving(true);
        setShowCropModal(false);

        try {
            // Convert blob to file
            const croppedFile = new File([croppedBlob], 'profile.jpg', { type: 'image/jpeg' });
            const result = await TileAPI.uploadProfileImage(croppedFile);
            setProfileForm(prev => ({ ...prev, image: result.path }));
        } catch (err) {
            setError('Failed to upload profile image');
        } finally {
            setSaving(false);
            setPendingImageFile(null);
        }
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setPendingImageFile(null);
    };

    const handleTileIconUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSaving(true);
        try {
            const result = await TileAPI.uploadIcon(file);
            setFormData(prev => ({ ...prev, icon: result.path }));
        } catch (err) {
            setError('Failed to upload icon');
        } finally {
            setSaving(false);
        }
    };

    const handleProfileSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await TileAPI.saveProfile(profileForm);
            setProfile(profileForm);
        } catch (err) {
            setError('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const saveSections = async (newSections) => {
        await TileAPI.saveTiles({ sections: newSections });
        setSections(newSections);
    };

    const handleSave = async () => {
        if (!formData.title) {
            setError('Please enter a title');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const newSections = JSON.parse(JSON.stringify(sections));
            const tileData = { ...formData };

            if (editingTile !== null) {
                newSections[editingTile.sectionIdx].tiles[editingTile.tileIdx] = tileData;
            } else {
                newSections[selectedSection].tiles.push(tileData);
            }

            await saveSections(newSections);
            handleAddNew();
        } catch (err) {
            setError('Failed to save. Server may be unavailable.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (tileIdx) => {
        if (!confirm('Delete this tile?')) return;
        setSaving(true);
        setError(null);

        try {
            const newSections = JSON.parse(JSON.stringify(sections));
            newSections[selectedSection].tiles.splice(tileIdx, 1);
            await saveSections(newSections);
            if (editingTile?.tileIdx === tileIdx) handleAddNew();
        } catch (err) {
            setError('Failed to delete tile.');
        } finally {
            setSaving(false);
        }
    };

    const handleMoveTile = async (tileIdx, direction) => {
        const newIdx = tileIdx + direction;
        if (newIdx < 0 || newIdx >= currentTiles.length) return;

        setSaving(true);
        try {
            const newSections = JSON.parse(JSON.stringify(sections));
            const tiles = newSections[selectedSection].tiles;
            [tiles[tileIdx], tiles[newIdx]] = [tiles[newIdx], tiles[tileIdx]];
            await saveSections(newSections);
        } catch (err) {
            setError('Failed to move tile.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddSection = async () => {
        if (!newSectionName.trim()) return;
        setSaving(true);
        try {
            const newSections = [...sections, { name: newSectionName.trim(), tiles: [] }];
            await saveSections(newSections);
            setNewSectionName('');
            setSelectedSection(newSections.length - 1);
        } catch (err) {
            setError('Failed to add section.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSection = async (idx) => {
        if (sections.length <= 1) {
            setError("Can't delete the last section.");
            return;
        }
        if (!confirm(`Delete section "${sections[idx].name}" and all its tiles?`)) return;

        setSaving(true);
        try {
            const newSections = sections.filter((_, i) => i !== idx);
            await saveSections(newSections);
            if (selectedSection >= newSections.length) {
                setSelectedSection(newSections.length - 1);
            }
        } catch (err) {
            setError('Failed to delete section.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="tile-editor-overlay" onClick={onClose}>
            <div className="tile-editor" onClick={(e) => e.stopPropagation()}>
                <div className="editor-header">
                    <h2>Settings</h2>
                    <div className="tabs">
                        <button
                            className={`tab-btn ${activeTab === 'tiles' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tiles')}
                        >
                            Tiles
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <div className="editor-content">
                    {activeTab === 'tiles' ? (
                        <>
                            {/* Section Selector */}
                            <div className="section-selector">
                                <label>Section:</label>
                                <select
                                    value={selectedSection}
                                    onChange={(e) => { setSelectedSection(Number(e.target.value)); handleAddNew(); }}
                                    disabled={saving}
                                >
                                    {sections.map((sec, idx) => (
                                        <option key={idx} value={idx}>{sec.name}</option>
                                    ))}
                                </select>
                                <button
                                    className="delete-section-btn"
                                    onClick={() => handleDeleteSection(selectedSection)}
                                    disabled={saving || sections.length <= 1}
                                    title="Delete Section"
                                >
                                    🗑️
                                </button>
                            </div>

                            {/* Add New Section */}
                            <div className="add-section">
                                <input
                                    type="text"
                                    placeholder="New section name..."
                                    value={newSectionName}
                                    onChange={(e) => setNewSectionName(e.target.value)}
                                    disabled={saving}
                                />
                                <button onClick={handleAddSection} disabled={saving || !newSectionName.trim()}>
                                    + Add Section
                                </button>
                            </div>

                            <div className="tile-list">
                                <div className="list-header">
                                    <h3>Tiles in "{sections[selectedSection]?.name}"</h3>
                                    <button className="add-btn" onClick={handleAddNew} disabled={saving}>
                                        + New
                                    </button>
                                </div>
                                <div className="tiles-scroll">
                                    {currentTiles.map((tile, index) => (
                                        <div
                                            key={index}
                                            className={`tile-item ${editingTile?.tileIdx === index && editingTile?.sectionIdx === selectedSection ? 'active' : ''}`}
                                            onClick={() => handleEdit(tile, index)}
                                        >
                                            <div className="tile-move-btns">
                                                <button onClick={(e) => { e.stopPropagation(); handleMoveTile(index, -1); }} disabled={index === 0 || saving}>▲</button>
                                                <button onClick={(e) => { e.stopPropagation(); handleMoveTile(index, 1); }} disabled={index === currentTiles.length - 1 || saving}>▼</button>
                                            </div>
                                            <span className="tile-item-icon">
                                                {tile.icon && tile.icon.startsWith('/uploads/') ? '🖼️' : tile.icon}
                                            </span>
                                            <span className="tile-item-title">{tile.title}</span>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                                                disabled={saving}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="tile-form">
                                <h3>{editingTile !== null ? 'Edit Tile' : 'New Tile'}</h3>

                                <div className="form-group">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Portfolio"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Icon</label>
                                    <div className="icon-input-group">
                                        <input
                                            type="text"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            placeholder="Emoji e.g. 🎨 or Upload ->"
                                            disabled={saving}
                                        />
                                        <input
                                            type="file"
                                            ref={tileIconInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleTileIconUpload}
                                            accept="image/*"
                                        />
                                        <button
                                            className="upload-btn"
                                            onClick={() => tileIconInputRef.current?.click()}
                                            disabled={saving}
                                        >
                                            📁
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>URL</label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://example.com"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Size</label>
                                    <select
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        disabled={saving}
                                    >
                                        <option value="tiny">Tiny (66×66)</option>
                                        <option value="small">Small (140×140)</option>
                                        <option value="medium">Medium (280×140)</option>
                                        <option value="wide">Wide (420×140)</option>
                                        <option value="large">Large (280×280)</option>
                                    </select>
                                </div>

                                {(formData.size !== 'small' && formData.size !== 'tiny') ? (
                                    <>
                                        <div className="form-group">
                                            <label>Message</label>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Message shown when tile flips"
                                                rows="3"
                                                disabled={saving}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Accent Color</label>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <input
                                                    type="color"
                                                    value={formData.accentColor || '#000000'}
                                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                                    disabled={saving}
                                                    style={{ width: '50px', height: '30px', padding: 0, border: 'none', cursor: 'pointer' }}
                                                />
                                                <button
                                                    onClick={() => setFormData({ ...formData, accentColor: '' })}
                                                    disabled={saving}
                                                    style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', borderRadius: '4px' }}
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="form-group">
                                        <small style={{ color: '#888', fontStyle: 'italic' }}>
                                            Messages and custom colors are disabled for small/tiny tiles.
                                        </small>
                                    </div>
                                )}

                                <button className="save-btn" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : (editingTile !== null ? 'Update Tile' : 'Add Tile')}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="tile-form profile-settings" style={{ width: '100%' }}>
                            <h3>Profile Settings</h3>

                            <div className="form-group" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div
                                    className="profile-preview"
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        width: '100px', height: '100px',
                                        borderRadius: '50%',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        margin: '0 auto 1rem',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(255,255,255,0.1)'
                                    }}
                                >
                                    {profileForm.image ? (
                                        <img src={profileForm.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '2rem' }}>👤</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleProfileUpload}
                                    accept="image/*"
                                />
                                <button
                                    className="upload-btn"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={saving}
                                >
                                    Upload New Picture
                                </button>
                            </div>

                            <div className="form-group">
                                <label>Display Name</label>
                                <input
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    placeholder="Enter your name"
                                    disabled={saving}
                                />
                            </div>

                            <div className="form-group">
                                <label>About Me</label>
                                <textarea
                                    value={profileForm.bio || ''}
                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                    rows="4"
                                    disabled={saving}
                                />
                            </div>

                            <div className="form-group">
                                <label>About Website</label>
                                <textarea
                                    value={profileForm.aboutWebsite || ''}
                                    onChange={(e) => setProfileForm({ ...profileForm, aboutWebsite: e.target.value })}
                                    placeholder="What is this website about?"
                                    rows="4"
                                    disabled={saving}
                                />
                            </div>

                            <button className="save-btn" onClick={handleProfileSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ImageCropModal
                isOpen={showCropModal}
                imageFile={pendingImageFile}
                onCrop={handleCroppedImage}
                onCancel={handleCropCancel}
                aspectRatio={1}
            />
        </div>
    );
};

export default TileEditor;
