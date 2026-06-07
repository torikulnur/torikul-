/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { IPTVChannel } from "../types";
import { Play, Pause, Volume2, VolumeX, Tv, AlertCircle, RefreshCw, Maximize2, Sparkles } from "lucide-react";

interface IPTVPlayerProps {
  currentChannel: IPTVChannel | null;
  onPlayNextFallback?: () => void;
}

export default function IPTVPlayer({ currentChannel, onPlayNextFallback }: IPTVPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Restart loading state on channel change
  useEffect(() => {
    setPlaybackError(null);
    setIsLoading(true);
    setIsPlaying(false);

    if (!currentChannel) {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Clean up previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const handleLoadStart = () => {
      setIsLoading(true);
      setPlaybackError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Auto-play was blocked or failed
          setIsPlaying(false);
        });
    };

    const handleError = (e: Event) => {
      console.error("Native video element error:", e);
      // Wait a moment to confirm if it's actually blocked or corrupt
      setTimeout(() => {
        if (video.error && !video.src.includes("localhost")) {
          setPlaybackError("Failed to decode stream. This link may be offline.");
          setIsLoading(false);
        }
      }, 2000);
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferSize: 30 * 1000 * 1000, // 30MB
      });

      hlsRef.current = hls;
      hls.loadSource(currentChannel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            setIsPlaying(false);
            setIsLoading(false);
          });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.warn("HLS.js player error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Fatal network error, trying to recover...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Fatal media error, trying to recover...");
              hls.recoverMediaError();
              break;
            default:
              setPlaybackError("Unable to load IPTV stream. Please try another channel.");
              setIsLoading(false);
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Apple devices (Safari, iOS) supporting native HLS
      video.src = currentChannel.url;
    } else {
      setPlaybackError("HLS playback is not supported in this browser.");
      setIsLoading(false);
    }

    // Auto-hide controls after some duration
    resetControlsTimeout();

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [currentChannel]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Play request rejected:", err);
        });
    }
    resetControlsTimeout();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
    resetControlsTimeout();
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    }
  };

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 4500);
  };

  const handleScreenClick = () => {
    setShowControls(!showControls);
    if (!showControls) {
      resetControlsTimeout();
    }
  };

  return (
    <div 
      id="t-tech-player-container"
      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#01030a] border border-[#00f0ff]/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] neon-border"
      onMouseMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        id="t-tech-video"
        className="h-full w-full object-cover"
        playsInline
        muted={isMuted}
        onClick={handleScreenClick}
      />

      {/* Screen Interactive Overlay for clicking to toggle controls */}
      <div 
        onClick={handleScreenClick}
        className="absolute inset-0 cursor-pointer"
      />

      {/* Subtle Scanner Lines/Vibe filter */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#00f0ff]/2 to-transparent opacity-40" />

      {/* Loading Shimmer Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#03060f]/90 text-[#00f0ff] z-20">
          <div className="relative mb-3 h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-t-[#00f0ff] border-r-transparent border-b-[#00f0ff]/20 border-l-[#00f0ff]/20 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-t-[#ff0080]/80 border-r-transparent border-b-transparent border-l-transparent animate-spin [animation-duration:1s]" />
          </div>
          <span className="font-sans text-xs tracking-widest text-[#00f0ff]/80 font-semibold animate-pulse uppercase neon-text-glow flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 animate-bounce" /> CONNECTING LIVE TRANSMISSION...
          </span>
        </div>
      )}

      {/* Error State View */}
      {playbackError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#03060f]/95 px-6 text-center z-10 border border-[#ff0055]/30">
          <AlertCircle className="mb-3 h-12 w-12 text-[#ff0055] drop-shadow-[0_0_10px_rgba(255,0,85,0.4)]" />
          <h4 className="font-display text-base font-bold text-[#ff0055] tracking-wide">STREAM CONNECTION ERROR</h4>
          <p className="mt-1 max-w-sm text-xs text-gray-400 font-sans leading-relaxed">
            {playbackError}
          </p>
          <div className="mt-4 flex gap-2">
            {onPlayNextFallback && (
              <button
                id="player-fallback-btn"
                onClick={onPlayNextFallback}
                className="flex items-center gap-1.5 rounded-lg bg-linear-to-r from-[#ff0055] to-[#ff00a0] px-4 py-2 font-display text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Force Fallback
              </button>
            )}
          </div>
        </div>
      )}

      {/* Standby screen when no channel is active */}
      {!currentChannel && !playbackError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-[#060b1e]/95 to-[#02040a]/95 text-center z-10">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00f0ff]/5 border border-[#00f0ff]/20">
            <Tv className="h-8 w-8 text-[#00f0ff] animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#ff0055] border-2 border-[#03060f] live-pulse" />
          </div>
          <h3 className="font-display text-lg font-bold text-white tracking-widest uppercase">
            T-Tech IPTV
          </h3>
          <p className="mt-1 text-xs text-gray-400 font-sans max-w-xs px-4">
            Select a channel from the cyber collection below to begin direct streaming transmission
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#03060f] px-3 py-1 border border-[#00f0ff]/10 text-[10px] text-[#00f0ff] font-mono tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-ping" />
            SYSTEM STANDBY // DOCK READY
          </div>
        </div>
      )}

      {/* Top Details bar (shows up when controls visible) */}
      {currentChannel && showControls && (
        <div className="absolute top-0 right-0 left-0 bg-gradient-to-b from-[#03060f]/90 to-transparent p-4 flex items-center justify-between pointer-events-none z-10 transition-opacity duration-300">
          <div id="player-channel-brand" className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-black/60 border border-[#00f0ff]/20 flex items-center justify-center p-1">
              <img 
                src={currentChannel.logo} 
                alt={currentChannel.name}
                className="h-full w-full object-contain rounded"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&h=100&fit=crop&q=80`;
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-sm bg-[#ff0055] px-1.5 py-0.5 text-[8px] font-mono font-black text-white uppercase tracking-widest">
                  LIVE
                </span>
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-wider">
                  {currentChannel.category}
                </span>
              </div>
              <h2 className="font-display text-sm font-bold text-white truncate max-w-[180px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {currentChannel.name}
              </h2>
            </div>
          </div>

          <div className="rounded-full bg-[#03060f]/80 px-2.5 py-1 border border-white/5 text-[9px] font-mono text-[#00f0ff] tracking-widest backdrop-blur-md">
            HLS FEED OK
          </div>
        </div>
      )}

      {/* Bottom Controls Overlay */}
      {currentChannel && showControls && (
        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-[#03060f]/95 via-[#03060f]/70 to-transparent p-4 z-10 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            {/* Play/Pause Button */}
            <div className="flex items-center gap-3">
              <button
                id="player-toggle-play"
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00f0ff] text-[#03060f] transition-transform hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </button>

              <button
                id="player-toggle-mute"
                onClick={toggleMute}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#121b30]/80 border border-white/5 text-gray-300 transition-all hover:bg-[#1f2d4e] active:scale-95"
              >
                {isMuted ? <VolumeX className="h-4.5 w-4.5 text-[#ff0055]" /> : <Volume2 className="h-4.5 w-4.5 text-[#00f0ff]" />}
              </button>
            </div>

            {/* Scale/Status indicators */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-gray-400 mr-2 uppercase block">
                720p // 60FPS
              </span>
              <button
                id="player-toggle-fs"
                onClick={handleFullscreen}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#121b30]/80 border border-white/5 text-[#00f0ff] hover:bg-[#121b30] hover:border-[#00f0ff]/30 active:scale-95"
                title="Fullscreen"
              >
                <Maximize2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
