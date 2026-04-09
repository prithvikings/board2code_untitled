import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true); // Start muted to respect browser auto-play policies until user interaction
  const [musicVolume, setMusicVolume] = useState(60);
  const audioRef = useRef(null);

  // Sync volume and mute state dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [musicVolume, isMuted]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Attempt to forcibly play if user just explicitly unmuted globally
    if (!newMutedState && audioRef.current) {
       audioRef.current.play().catch(e => console.warn("Browser prevented playback until interaction.", e));
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, setIsMuted, musicVolume, setMusicVolume }}>
      {/* Hidden Global Audio Element pointing to public folder */}
      <audio ref={audioRef} src="/audio/music/backgroundmusic.mp3" loop />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
