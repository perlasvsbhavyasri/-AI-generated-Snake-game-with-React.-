import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

export const TRACKS = [
  { id: 1, title: 'PROC. HORIZON', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'PROC. ECHOES', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 3, title: 'PROC. VAPOR', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
];

export function MusicPlayer({ autoPlay = false }: { autoPlay?: boolean }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Playback blocked by browser initially', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="mt-auto border-t border-[#222] pt-[20px] flex flex-col">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        loop={false}
      />
      
      <div className="mb-[10px] text-[14px] font-bold">{currentTrack.title}</div>
      <div className="mb-[20px] text-[12px] text-text-dim">Now Playing...</div>
      
      <div className="h-[4px] bg-[#222] w-full rounded-[2px] mb-[20px] relative">
         <div className="absolute left-0 top-0 h-full w-[45%] bg-neon-cyan shadow-neon-cyan transition-all duration-300"></div>
      </div>
      
      <div className="flex items-center justify-center gap-[20px]">
        <button
          onClick={skipBack}
          className="w-[50px] h-[40px] border-2 border-text-dim text-text-main flex items-center justify-center cursor-pointer text-[14px] hover:border-neon-magenta hover:bg-neon-magenta hover:text-black transition-none uppercase"
        >
          [R]
        </button>

        <button
          onClick={togglePlay}
          className="w-[80px] h-[50px] border-2 border-neon-cyan text-neon-cyan flex items-center justify-center cursor-pointer text-[20px] hover:bg-neon-cyan hover:text-black transition-none uppercase shadow-none"
        >
          {isPlaying ? '[II]' : '[P]'}
        </button>

        <button
          onClick={skipForward}
          className="w-[50px] h-[40px] border-2 border-text-dim text-text-main flex items-center justify-center cursor-pointer text-[14px] hover:border-neon-magenta hover:bg-neon-magenta hover:text-black transition-none uppercase"
        >
          [F]
        </button>
      </div>
    </div>
  );
}
