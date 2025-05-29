
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export function VoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const commands: VoiceCommand[] = [
    {
      command: "play bubble bop",
      action: () => {
        navigate('/games');
        setTimeout(() => {
          const event = new CustomEvent('playGame', { detail: { gameId: 'bubble-bop' } });
          window.dispatchEvent(event);
        }, 100);
      },
      description: "Opens Bubble Bop game"
    },
    {
      command: "play snake",
      action: () => {
        navigate('/games');
        setTimeout(() => {
          const event = new CustomEvent('playGame', { detail: { gameId: 'snake' } });
          window.dispatchEvent(event);
        }, 100);
      },
      description: "Opens Snake game"
    },
    {
      command: "play tetris",
      action: () => {
        navigate('/games');
        setTimeout(() => {
          const event = new CustomEvent('playGame', { detail: { gameId: 'tetris' } });
          window.dispatchEvent(event);
        }, 100);
      },
      description: "Opens Tetris game"
    },
    {
      command: "go home",
      action: () => navigate('/'),
      description: "Navigate to home page"
    },
    {
      command: "show games",
      action: () => navigate('/games'),
      description: "Navigate to games page"
    },
    {
      command: "trending games",
      action: () => navigate('/trending'),
      description: "Navigate to trending page"
    },
    {
      command: "surprise me",
      action: () => {
        const games = ['bubble-bop', 'snake', 'flappy-bird', 'tetris', '2048', 'pong'];
        const randomGame = games[Math.floor(Math.random() * games.length)];
        navigate('/games');
        setTimeout(() => {
          const event = new CustomEvent('playGame', { detail: { gameId: randomGame } });
          window.dispatchEvent(event);
        }, 100);
      },
      description: "Play a random game"
    }
  ];

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handleVoiceCommand(transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice command failed",
          description: "Please try again or check your microphone",
          variant: "destructive"
        });
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (transcript: string) => {
    const matchedCommand = commands.find(cmd => 
      transcript.includes(cmd.command.toLowerCase())
    );

    if (matchedCommand) {
      toast({
        title: "Voice command recognized! 🎤",
        description: `Executing: ${matchedCommand.description}`,
      });
      matchedCommand.action();
    } else {
      toast({
        title: "Command not recognized",
        description: `Try saying: "${commands[0].command}"`,
        variant: "destructive"
      });
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Listening for voice commands...",
        description: "Say a command like 'play bubble bop' or 'go home'",
      });
    }
  };

  if (!isSupported) {
    return null; // Hide component if not supported
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={toggleListening}
        className={`transition-all duration-300 ${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}`}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        <span className="hidden sm:inline ml-2">
          {isListening ? 'Stop' : 'Voice'}
        </span>
      </Button>
      
      {isListening && (
        <Badge variant="outline" className="animate-pulse">
          <Volume2 className="h-3 w-3 mr-1" />
          Listening...
        </Badge>
      )}
    </div>
  );
}
