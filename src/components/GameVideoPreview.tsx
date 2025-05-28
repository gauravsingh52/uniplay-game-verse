
import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameVideoPreviewProps {
  videoUrl: string;
  title: string;
  className?: string;
}

const GameVideoPreview = ({ videoUrl, title, className = '' }: GameVideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div 
      className={`relative group rounded-lg overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted={isMuted}
        loop
        poster={`https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/videos/game-preview.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="absolute top-4 left-4">
        <span className="bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
          {title} Preview
        </span>
      </div>
    </div>
  );
};

export default GameVideoPreview;
