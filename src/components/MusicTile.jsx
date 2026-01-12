import { useState, useEffect, useRef } from 'react';
import './MusicTile.css';

const MusicTile = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    const tracks = [
        {
            title: "Everything At Once",
            artist: "Lenka",
            videoId: "eE9tV1WGTgE",
            art: "https://dn720901.ca.archive.org/0/items/mbid-b08b0cc3-9d53-4b18-bb5d-91d4c65a9904/mbid-b08b0cc3-9d53-4b18-bb5d-91d4c65a9904-43941654303.jpg"
        },
        {
            title: "What A Life",
            artist: "John Summit, Guz, Stevie Appleton",
            videoId: "Wxtme-S885Q",
            art: "https://coverartarchive.org/release/edc8f56b-1191-4a4a-9d32-744b7fc11225/front"
        }
    ];

    const currentTrack = tracks[currentTrackIndex];

    // Initialize YouTube Player
    useEffect(() => {
        // Load the IFrame Player API code asynchronously.
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // This function creates an <iframe> (and YouTube player)
        // after the API code downloads.
        window.onYouTubeIframeAPIReady = () => {
            const newPlayer = new window.YT.Player('youtube-audio-player', {
                height: '0',
                width: '0',
                videoId: currentTrack.videoId,
                playerVars: {
                    'playsinline': 1,
                    'controls': 0,
                    'disablekb': 1,
                    'fs': 0
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            setPlayer(newPlayer);
        };

        // If API is already loaded/ready (e.g. from previous navigation)
        if (window.YT && window.YT.Player) {
            const newPlayer = new window.YT.Player('youtube-audio-player', {
                height: '0',
                width: '0',
                videoId: currentTrack.videoId,
                playerVars: {
                    'playsinline': 1,
                    'controls': 0,
                    'disablekb': 1,
                    'fs': 0
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            setPlayer(newPlayer);
        }

        return () => {
            // Cleanup if needed
        }
    }, []);

    // Effect to handle track changes
    useEffect(() => {
        if (player && player.loadVideoById) {
            player.loadVideoById(currentTrack.videoId);
            if (isPlaying) {
                // The player might auto-play on load, but ensuring play state matching is good
                // However, loadVideoById usually auto-plays.
            } else {
                player.pauseVideo();
                // If we were paused and switched tracks, we might want to stay paused or auto-play.
                // Usually prev/next implies "play this now".
                // Let's auto-play on track switch if the user clicked next/prev
                player.playVideo();
                setIsPlaying(true);
            }
        }
    }, [currentTrackIndex]); // Only re-run if index changes


    const onPlayerReady = (event) => {
        // Player is ready
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
        } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            if (event.data === window.YT.PlayerState.ENDED) {
                playNext(); // Auto play next track
            }
        }
    };

    const togglePlay = () => {
        if (!player) return;
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    };

    const playNext = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
        // Video loading handled by useEffect
        setIsPlaying(true); // Ensure UI reflects playing state immediately
    };

    const playPrev = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
        setIsPlaying(true);
    };

    const restartTrack = () => {
        // Kept for reference but not used on buttons anymore
        if (!player) return;
        player.seekTo(0);
        player.playVideo();
    };

    return (
        <div className="music-tile">
            {/* Hidden Player Container */}
            <div id="youtube-audio-player" style={{ display: 'none' }}></div>

            <div className="tile-inner">
                {/* Front Side: Music Controls */}
                <div className="tile-front">
                    <div className="music-controls">
                        <button className="control-btn prev-btn" onClick={playPrev} aria-label="Previous">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                            </svg>
                        </button>

                        <button className="control-btn play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        <button className="control-btn next-btn" onClick={playNext} aria-label="Next">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                            </svg>
                        </button>
                    </div>

                    <div className="music-footer">
                        <span className="music-app-name">Music</span>
                    </div>
                </div>

                {/* Back Side: Track Info */}
                <div className="tile-back">
                    <div className="music-info" key={currentTrackIndex}>
                        <img
                            src={currentTrack.art}
                            alt="Album Art"
                            className="album-art"
                        />
                        <div className="track-details">
                            <div className="track-title">{currentTrack.title}</div>
                            <div className="track-artist">{currentTrack.artist}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicTile;
