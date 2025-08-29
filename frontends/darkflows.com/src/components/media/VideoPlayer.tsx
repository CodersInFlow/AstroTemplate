import React, { useState, useRef, useEffect } from 'react';
import { BaseComponentProps } from '../../types';

export interface Video {
  id: string | number;
  url: string;
  title: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
}

export interface VideoPlayerProps extends BaseComponentProps {
  videos: Video[];
  autoPlay?: boolean;
  muted?: boolean;
  showPlaylist?: boolean;
  theme?: 'light' | 'dark';
  onVideoChange?: (video: Video, index: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videos,
  autoPlay = true,
  muted = true,
  showPlaylist = true,
  theme = 'dark',
  className = '',
  onVideoChange
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const currentVideo = videos[currentVideoIndex];

  const textColors = isDark
    ? { primary: 'text-white', secondary: 'text-gray-300', muted: 'text-gray-400' }
    : { primary: 'text-gray-900', secondary: 'text-gray-700', muted: 'text-gray-500' };

  const bgColors = isDark
    ? { card: 'bg-gray-800', overlay: 'bg-black/50' }
    : { card: 'bg-white', overlay: 'bg-gray-900/50' };

  // Load video when index changes
  useEffect(() => {
    if (videoRef.current && currentVideo) {
      setIsLoading(true);
      videoRef.current.load();
    }
  }, [currentVideoIndex, currentVideo]);

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    setIsLoading(false);
    if (hasInteracted && autoPlay) {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  // Handle video ended
  const handleVideoEnded = () => {
    if (currentVideoIndex < videos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      onVideoChange?.(videos[nextIndex], nextIndex);
    } else {
      // Loop back to first video
      setCurrentVideoIndex(0);
      onVideoChange?.(videos[0], 0);
    }
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (!hasInteracted) setHasInteracted(true);
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Update progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  // Seek video
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  // Go to specific video
  const selectVideo = (index: number) => {
    if (!hasInteracted) setHasInteracted(true);
    setCurrentVideoIndex(index);
    onVideoChange?.(videos[index], index);
  };

  // Skip to next video
  const skipToNext = () => {
    if (!hasInteracted) setHasInteracted(true);
    handleVideoEnded();
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (videos.length === 0) {
    return (
      <div className={`${bgColors.card} rounded-lg p-8 text-center ${className}`}>
        <p className={textColors.muted}>No videos available</p>
      </div>
    );
  }

  const PlayIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );

  const PauseIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  );

  const VolumeIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  );

  const MuteIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  );

  const FullscreenIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </svg>
  );

  const SkipIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
    </svg>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Main Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden group">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-auto"
          src={currentVideo.url}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          muted={isMuted}
          playsInline
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className={`absolute inset-0 flex items-center justify-center ${bgColors.overlay}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Click to Play Overlay (before first interaction) */}
        {!hasInteracted && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={togglePlayPause}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 hover:bg-white/20 transition-colors">
              <div className="w-16 h-16 text-white">
                <PlayIcon />
              </div>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              {/* Skip to Next */}
              <button
                onClick={skipToNext}
                className="text-white hover:text-gray-300 transition-colors"
                title="Next Video"
              >
                <SkipIcon />
              </button>

              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted ? <MuteIcon /> : <VolumeIcon />}
              </button>

              {/* Current Video Title */}
              <span className="text-white text-sm font-medium">
                {currentVideo.title}
              </span>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FullscreenIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Video Playlist */}
      {showPlaylist && (
        <div className="mt-6">
          <h3 className={`text-lg font-semibold mb-4 ${textColors.primary}`}>Videos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => selectVideo(index)}
                className={`relative group overflow-hidden rounded-lg transition-all duration-300 ${
                  index === currentVideoIndex 
                    ? 'ring-2 ring-indigo-500 scale-95' 
                    : 'hover:scale-105'
                }`}
              >
                {/* Thumbnail or Placeholder */}
                <div className={`aspect-video ${bgColors.card} relative`}>
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={`w-8 h-8 ${textColors.muted}`}>
                        <PlayIcon />
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  
                  {/* Play Icon */}
                  {index === currentVideoIndex && isPlaying ? (
                    <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 text-white">
                        <PlayIcon />
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className={`p-3 ${bgColors.card}`}>
                  <p className={`text-sm text-left truncate ${textColors.secondary}`}>
                    {video.title}
                  </p>
                  {video.duration && (
                    <p className={`text-xs text-left ${textColors.muted}`}>
                      {video.duration}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;