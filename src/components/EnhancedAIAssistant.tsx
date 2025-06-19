
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, X, Send, Bot, User, Gamepad, TrendingUp, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const EnhancedAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your gaming assistant. Ask me about games, support, or features!',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Game-related queries
    if (lowerMessage.includes('game') || lowerMessage.includes('play')) {
      if (lowerMessage.includes('snake')) {
        return 'Snake is one of our most popular games! Use arrow keys or swipe to control the snake. Eat food to grow and avoid hitting walls or yourself. Would you like me to take you to the games page?';
      }
      if (lowerMessage.includes('tetris')) {
        return 'Tetris is a classic puzzle game! Use arrow keys to move and rotate blocks. Complete lines to clear them and score points. The game speeds up as you progress!';
      }
      if (lowerMessage.includes('bubble')) {
        return 'Bubble Bop is super fun! Aim and shoot bubbles to match colors and clear the board. Try to create chain reactions for bonus points!';
      }
      if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
        return 'Our trending games include Snake, Tetris, Bubble Bop, and 2048! Check out the Trending page to see what\'s hot right now.';
      }
      return 'We have 13 amazing games including Snake, Tetris, Bubble Bop, 2048, and more! All are browser-based and work on mobile. Which type of game interests you?';
    }

    // Support queries
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
      return 'I\'m here to help! For technical issues, account problems, or general questions, you can use our contact form or reach out directly. What specific issue are you facing?';
    }

    // Login/account queries
    if (lowerMessage.includes('login') || lowerMessage.includes('account') || lowerMessage.includes('sign')) {
      return 'You can create an account to save your progress and compete on leaderboards! Click the Sign Up button in the top navigation. Already have an account? Use the Login button.';
    }

    // Navigation queries
    if (lowerMessage.includes('categories') || lowerMessage.includes('browse')) {
      return 'You can browse games by categories like Puzzle, Action, Arcade, and Strategy. Visit our Categories or Browse pages to explore all available games!';
    }

    // Features queries
    if (lowerMessage.includes('feature') || lowerMessage.includes('what can')) {
      return 'UNIGAMES offers instant browser gaming, responsive design for all devices, leaderboards, achievements, and a growing library of games. All games work without downloads!';
    }

    // Mobile/device queries
    if (lowerMessage.includes('mobile') || lowerMessage.includes('phone') || lowerMessage.includes('tablet')) {
      return 'All our games are optimized for mobile and tablet play! Touch controls work seamlessly, and the interface adapts to your screen size. No app download needed!';
    }

    // Default fallback responses
    const fallbacks = [
      'I can help you with games, support questions, account issues, or site navigation. What would you like to know?',
      'Feel free to ask me about our games, how to play them, account features, or any technical support you need!',
      'I\'m here to assist with gaming questions, troubleshooting, or general site navigation. How can I help you today?'
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      label: 'Show Games',
      action: () => {
        navigate('/games');
        toast({ title: 'Navigating to Games', description: 'Check out all our available games!' });
        setIsOpen(false);
      },
      icon: Gamepad
    },
    {
      label: 'Trending',
      action: () => {
        navigate('/trending');
        toast({ title: 'Trending Games', description: 'See what\'s popular right now!' });
        setIsOpen(false);
      },
      icon: TrendingUp
    },
    {
      label: 'Get Help',
      action: () => {
        navigate('/support');
        toast({ title: 'Support Center', description: 'Find answers and get assistance!' });
        setIsOpen(false);
      },
      icon: HelpCircle
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="lg"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <Card className="w-80 h-96 flex flex-col bg-background/95 backdrop-blur-md border-border/50 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-unigames-purple" />
                <span>Gaming Assistant</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-3 space-y-3">
            {/* Quick Actions */}
            <div className="flex gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="flex-1 text-xs"
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-xs ${
                      message.sender === 'user'
                        ? 'bg-unigames-purple text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-1">
                      {message.sender === 'ai' && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                      {message.sender === 'user' && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                      <span className="flex-1">{message.text}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-2 rounded-lg text-xs flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    <span>Typing...</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about games, support, or features..."
                className="flex-1 text-xs"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="bg-unigames-purple hover:bg-unigames-purple/80"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAIAssistant;
