import { useState, useEffect } from 'react';
import Background from './components/Background';
import LinkTile from './components/LinkTile';
import SettingsIcon from './components/SettingsIcon';
import PinModal from './components/PinModal';
import TileEditor from './components/TileEditor';
import ServerStatus from './components/ServerStatus';
import PowerButton from './components/PowerButton';
import ShutdownOverlay from './components/ShutdownOverlay';
import ProfilePicture from './components/ProfilePicture';
import ArrangeButton from './components/ArrangeButton';
import BioWindow from './components/BioWindow';
import TileAPI from './services/api';
import './App.css';
import WindowsLoader from './components/WindowsLoader';

function App() {
  const [sections, setSections] = useState([]);
  const [profile, setProfile] = useState({ name: "Melvin Francy", image: null });
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinMode, setPinMode] = useState('settings'); // 'settings' or 'arrange'
  const [showEditor, setShowEditor] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [isArranging, setIsArranging] = useState(false);
  const [serverAvailable, setServerAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const handleServerStatusChange = (isOnline) => {
    setServerAvailable(isOnline);
    if (!isOnline) {
      setIsArranging(false); // Disable arrange mode if server goes offline
    }
  };

  // Load tiles and profile on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Load tiles
        const tilesResponse = await fetch('/tiles.json');
        if (tilesResponse.ok) {
          const data = await tilesResponse.json();
          // Migration: If data is flat array, wrap in default section
          if (Array.isArray(data)) {
            setSections([{ name: 'Links', tiles: data }]);
          } else if (data.sections) {
            setSections(data.sections);
          }
        }

        // Load profile
        try {
          const profileData = await TileAPI.getProfile();
          setProfile(profileData);
        } catch (e) {
          console.log("Could not load profile from backend, using default");
        }

      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [serverAvailable]);

  const handleSettingsClick = () => {
    setPinMode('settings');
    setShowPinModal(true);
  };

  const handleArrangeClick = () => {
    if (isArranging) {
      setIsArranging(false);
      return;
    }
    setPinMode('arrange');
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (pinMode === 'settings') {
      setShowEditor(true);
    } else if (pinMode === 'arrange') {
      setIsArranging(true);
    }
  };

  const handlePowerClick = () => {
    setIsShuttingDown(true);
  };

  const handleShutdownComplete = () => {
    window.location.href = "https://www.google.com";
  };

  // Drag and drop handlers
  const handleDragStart = (e, sectionIndex, tileIndex) => {
    e.dataTransfer.setData('sourceSection', sectionIndex);
    e.dataTransfer.setData('sourceTile', tileIndex);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e, targetSectionIndex, targetTileIndex) => {
    e.preventDefault();
    const sourceSectionIndex = parseInt(e.dataTransfer.getData('sourceSection'));
    const sourceTileIndex = parseInt(e.dataTransfer.getData('sourceTile'));

    if (isNaN(sourceSectionIndex) || isNaN(sourceTileIndex)) return;

    // Create deep copy
    const newSections = JSON.parse(JSON.stringify(sections));

    // Remove tile from source FIRST to avoid index shifting confusion if in same section
    const [movedTile] = newSections[sourceSectionIndex].tiles.splice(sourceTileIndex, 1);

    // Calculate drop index
    let finalTargetIndex = targetTileIndex;

    // If dropped on section background (gap), find nearest tile
    if (targetTileIndex === -1) {
      // Get all tile wrappers in this section
      const sectionEl = e.currentTarget; // The section-tiles container or section div
      const tileWrappers = Array.from(sectionEl.querySelectorAll('.tile-wrapper'));

      let closestIndex = newSections[targetSectionIndex].tiles.length; // Default to end
      let minDistance = Infinity;

      tileWrappers.forEach((wrapper, index) => {
        const rect = wrapper.getBoundingClientRect();
        // Calculate distance to center of tile
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < minDistance) {
          minDistance = dist;
          // If cursor is to the right/bottom of center, insert after. Else before.
          // Simplified: just use that index as insertion point or +1
          // For dense grid, generic "closest" is usually "insert at this index"
          closestIndex = index;
        }
      });

      // Refine: if we are well past the last tile, append.
      // But the loop defaults to end, so if no close tiles, it appends.
      finalTargetIndex = closestIndex;
    }

    // Adjust index if moving within same section and we removed before target
    // (Because we spliced out source first, indices shifted down)
    // Actually, if we remove first, then index 'i' refers to the *current* state.
    // So extracting nearest index from DOM (which still has the old tile) might be off by 1?
    // Correct approach using DOM:
    // The DOM elements still exist including the source. 
    // If source was BEFORE target visually, target index effectively decreases by 1.

    // Let's stick to simple logic: Input relative to NEW array.

    if (finalTargetIndex === -1) {
      newSections[targetSectionIndex].tiles.push(movedTile);
    } else {
      newSections[targetSectionIndex].tiles.splice(finalTargetIndex, 0, movedTile);
    }

    setSections(newSections);

    // Save to server
    try {
      await TileAPI.saveTiles({ sections: newSections });
    } catch (err) {
      console.error("Failed to save reorder", err);
    }
  };



  if (loading) {
    return (
      <>
        <Background />
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WindowsLoader />
        </div>
      </>
    );
  }

  // Flatten all tiles for index calculation (for animation delay)
  let globalIndex = 0;

  return (
    <>
      <Background />
      {isShuttingDown && <ShutdownOverlay onComplete={handleShutdownComplete} />}

      <div className="app-container">
        {/* Profile Image removed from here, moved to Start Menu */}
        <h1>Hi, I'm {profile.name}</h1>
      </div>

      <div className="tiles-grid">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="tile-section"
            onDragOver={isArranging ? handleDragOver : undefined}
            onDrop={isArranging ? (e) => handleDrop(e, sectionIndex, -1) : undefined} // Allow drop on section to append
          >
            <div className="section-title">{section.name}</div>
            <div className="section-tiles">
              {section.tiles.map((tile, tileIndex) => {
                const idx = globalIndex++;
                return (
                  <div
                    key={idx}
                    className={`tile-wrapper ${tile.size || 'medium'}`}
                    onDragOver={isArranging ? handleDragOver : undefined}
                    onDrop={isArranging ? (e) => {
                      e.stopPropagation(); // Stop propagation so we don't trigger section drop
                      handleDrop(e, sectionIndex, tileIndex);
                    } : undefined}
                  >
                    <LinkTile
                      title={tile.title}
                      icon={tile.icon}
                      url={tile.url}
                      size={tile.size}
                      message={tile.message}
                      accentColor={tile.accentColor}
                      index={idx}
                      draggable={isArranging}
                      onDragStart={(e) => handleDragStart(e, sectionIndex, tileIndex)}
                      onDragEnd={handleDragEnd}
                      isArranging={isArranging}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Top Right - Status Only */}
      <ServerStatus onStatusChange={handleServerStatusChange} />

      {/* Bottom Left - Start Menu Controls */}
      <div className="start-menu-controls">
        <PowerButton onClick={handlePowerClick} />
        <SettingsIcon
          onClick={serverAvailable ? handleSettingsClick : undefined}
          disabled={!serverAvailable}
        />
        <ArrangeButton
          onClick={handleArrangeClick}
          disabled={!serverAvailable}
          isActive={isArranging}
        />
        <ProfilePicture
          image={profile.image}
          name={profile.name}
          onClick={() => setShowBio(true)}
        />
      </div>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
      />
      <TileEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        sections={sections}
        setSections={setSections}
        profile={profile}
        setProfile={setProfile}
      />

      {showBio && (
        <BioWindow
          profile={profile}
          onClose={() => setShowBio(false)}
        />
      )}
    </>
  );
}

export default App;
