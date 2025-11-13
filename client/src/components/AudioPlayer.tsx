import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";

interface AudioPlayerProps {
  episodeTitle: string;
  audioUrl: string;
  imageUrl?: string;
  playRequested?: number;
  onClose: () => void;
  onEpisodeEnded?: () => void;
}

export default function AudioPlayer({
  episodeTitle,
  audioUrl,
  imageUrl,
  playRequested,
  onClose,
  onEpisodeEnded,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const hasMarkedAsPlayedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(0);
    hasMarkedAsPlayedRef.current = false;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      // Mark as played when reached 95% or more of the episode (only once)
      if (!hasMarkedAsPlayedRef.current && audio.duration > 0 && audio.currentTime / audio.duration >= 0.95) {
        hasMarkedAsPlayedRef.current = true;
        if (onEpisodeEnded) {
          onEpisodeEnded();
        }
      }
    };
    const updateDuration = () => setDuration(audio.duration);
    
    const handleCanPlay = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Auto-play failed:", error);
        setIsPlaying(false);
      });
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (!hasMarkedAsPlayedRef.current && onEpisodeEnded) {
        hasMarkedAsPlayedRef.current = true;
        onEpisodeEnded();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplay", handleCanPlay, { once: true });
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl, onEpisodeEnded]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      if (isTyping) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skip(-10);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skip(10);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  useEffect(() => {
    if (!playRequested || playRequested === 0) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Play failed:", error);
      });
    }
  }, [playRequested]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="container mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="h-14 w-14 overflow-hidden rounded-md bg-muted flex-shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt={episodeTitle} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-lg font-bold text-muted-foreground">DT</span>
                </div>
              )}
            </div>
            <div className="hidden sm:block max-w-xs">
              <p className="truncate text-sm font-semibold">{episodeTitle}</p>
              <p className="text-xs text-muted-foreground">Dev Talks</p>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-3">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(-15)}
                className="h-8 w-8"
                data-testid="button-skip-back"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={togglePlay}
                className="h-9 w-9"
                data-testid="button-play-pause"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(15)}
                className="h-8 w-8"
                data-testid="button-skip-forward"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-1 items-center gap-2">
              <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
                data-testid="slider-progress"
              />
              <span className="text-xs text-muted-foreground min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 min-w-[120px]">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8"
                data-testid="button-mute"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20"
                data-testid="slider-volume"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 flex-shrink-0"
            data-testid="button-close-player"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
