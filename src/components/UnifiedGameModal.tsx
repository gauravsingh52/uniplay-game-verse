
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Share, Heart } from "lucide-react";
import { WorkingGame } from '@/data/workingGamesData';
import LazyGameLoader from './LazyGameLoader';

interface UnifiedGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: WorkingGame | null;
  onFavorite: (gameId: string) => void;
  onShare: (game: WorkingGame) => void;
  isFavorite: boolean;
}

export default function UnifiedGameModal({ 
  isOpen, 
  onClose, 
  game, 
  onFavorite, 
  onShare, 
  isFavorite 
}: UnifiedGameModalProps) {
  if (!game) return null;

  const handleClose = () => {
    console.log('Closing game modal for:', game.title);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] p-0 overflow-hidden game-modal">
        <DialogHeader className="p-4 md:p-6 pb-2 flex-shrink-0 border-b bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
              {game.title}
              <Badge className="bg-green-500 hover:bg-green-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                LIVE
              </Badge>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite(game.id);
                }}
                className="touch-target hover:bg-muted"
                title="Add to favorites"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(game);
                }}
                className="touch-target hover:bg-muted"
                title="Share game"
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose}
                className="touch-target hover:bg-muted"
                title="Close game"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-background">
          <LazyGameLoader gameId={game.id} onClose={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
