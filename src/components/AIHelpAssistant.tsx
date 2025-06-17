
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, X, Send, Mic, MicOff, Bot, User, Star, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { workingGames } from '@/data/workingGamesData';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  rating?: 'up' | 'down';
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I play games?",
    answer: "Simply click on any game card and select 'Play Now'. Games load instantly in your browser - no downloads needed!",
    category: "gameplay"
  },
  {
    question: "Where can I find racing games?",
    answer: "You can find racing games by going to Categories > Racing, or search for 'racing' in the search bar. Try Snail Sprint for a fun racing experience!",
    category: "navigation"
  },
  {
    question: "Show racing games",
    answer: "Here are our racing games: Snail Sprint - Race your snail through obstacle courses! You can find it in the Racing category or by searching 'snail sprint'.",
    category: "search"
  },
  {
    question: "How to play Nitro Drift",
    answer: "I don't see Nitro Drift in our current game collection, but you might enjoy Snail Sprint which has racing mechanics! Use keyboard or touch controls to navigate through courses.",
    category: "specific"
  },
  {
    question: "Are the games free?",
    answer: "Yes! All games on UNIGAMES are completely free to play. No hidden fees or subscriptions required.",
    category: "general"
  },
  {
    question: "Can I play on mobile?",
    answer: "Absolutely! All our games are optimized for mobile devices and work great on phones and tablets with touch controls.",
    category: "technical"
  },
  {
    question: "How do I save my progress?",
    answer: "Game progress is automatically saved in your browser. For persistent saves across devices, create an account by clicking the Login button.",
    category: "account"
  },
  {
    question: "I can't log in",
    answer: "Try refreshing the page and make sure you're using the correct email and password. If you don't have an account, click 'Sign Up' instead. Contact support if issues persist.",
    category: "login"
  }
];

const AIHelpAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history from localStorage
    const saved = localStorage.getItem('ai-chat-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        setShowWelcome(false);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Show context-aware welcome message when opening
    if (isOpen && showWelcome) {
      const contextMessage = getContextAwareWelcome();
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: contextMessage,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setShowWelcome(false);
    }
  }, [isOpen, showWelcome]);

  const getContextAwareWelcome = () => {
    const path = location.pathname;
    
    if (path.includes('/games')) {
      return "Hi! I see you're browsing our games collection. I can help you find specific games, explain how to play, or recommend games based on your preferences. What would you like to know?";
    } else if (path.includes('/categories')) {
      return "Welcome! I see you're exploring game categories. I can help you find games in specific categories, explain the differences between them, or suggest new categories to try. How can I assist?";
    } else if (path.includes('/trending')) {
      return "Hello! You're checking out our trending games. I can tell you why these games are popular, suggest similar trending games, or help you find games that match your interests. What would you like to explore?";
    } else {
      return "Hi there! 👋 Welcome to UNIGAMES! I'm your gaming assistant and I'm here to help you navigate our platform, find amazing games, and answer any questions you might have. What can I help you with today?";
    }
  };

  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem('ai-chat-history', JSON.stringify(msgs));
  };

  const findBestFAQMatch = (query: string): FAQ | null => {
    const normalizedQuery = query.toLowerCase();
    
    // Direct question matching
    for (const faq of faqs) {
      if (normalizedQuery.includes(faq.question.toLowerCase()) || 
          faq.question.toLowerCase().includes(normalizedQuery)) {
        return faq;
      }
    }
    
    // Keyword matching
    for (const faq of faqs) {
      const keywords = faq.question.toLowerCase().split(' ');
      const queryWords = normalizedQuery.split(' ');
      
      if (queryWords.some(word => keywords.includes(word) && word.length > 2)) {
        return faq;
      }
    }
    
    return null;
  };

  const findGameByName = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    return workingGames.find(game => 
      game.title.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes(game.title.toLowerCase())
    );
  };

  const getGamesByCategory = (category: string) => {
    return workingGames.filter(game => 
      game.category.toLowerCase().includes(category.toLowerCase())
    );
  };

  const generateContextualResponse = (query: string): string => {
    const normalizedQuery = query.toLowerCase();
    const currentPath = location.pathname;
    
    // Handle specific game queries
    if (normalizedQuery.includes('how to play') || normalizedQuery.includes('how do i play')) {
      const gameMatch = findGameByName(normalizedQuery);
      if (gameMatch) {
        return `To play ${gameMatch.title}: ${gameMatch.description} Controls: ${gameMatch.controls.join(', ')}. Click the "Play Now" button on the game card to start!`;
      }
    }
    
    // Handle game search queries
    if (normalizedQuery.includes('show') && normalizedQuery.includes('games')) {
      if (normalizedQuery.includes('racing')) {
        const racingGames = getGamesByCategory('racing');
        if (racingGames.length > 0) {
          return `Here are our racing games: ${racingGames.map(g => g.title).join(', ')}. You can find them in the Racing category or by clicking Games in the menu!`;
        }
      }
      if (normalizedQuery.includes('puzzle')) {
        const puzzleGames = getGamesByCategory('puzzle');
        return `Our puzzle games include: ${puzzleGames.map(g => g.title).join(', ')}. Great for brain training!`;
      }
      if (normalizedQuery.includes('arcade')) {
        const arcadeGames = getGamesByCategory('arcade');
        return `Our arcade games include: ${arcadeGames.map(g => g.title).join(', ')}. Perfect for quick fun!`;
      }
    }

    // Handle login issues
    if (normalizedQuery.includes("can't log in") || normalizedQuery.includes("login") || normalizedQuery.includes("sign in")) {
      return "If you're having trouble logging in: 1) Make sure you're using the correct email/password, 2) Try refreshing the page, 3) If you don't have an account, click 'Sign Up' instead. The login button is in the top right corner of the page.";
    }
    
    // Context-aware responses based on current page
    if (currentPath.includes('/games') && (normalizedQuery.includes('recommend') || normalizedQuery.includes('suggest'))) {
      return "Since you're on our games page, I'd recommend checking out our featured section at the top, or use the category filters to find games that match your interests. Popular choices include Snake, Tetris, and 2048!";
    }
    
    // Game recommendations
    if (normalizedQuery.includes('recommend') || normalizedQuery.includes('suggest')) {
      if (normalizedQuery.includes('action') || normalizedQuery.includes('arcade')) {
        return "For action/arcade games, I recommend trying Snake Classic, Flappy Bird, or Brick Breaker. You can find more in the Arcade category!";
      }
      if (normalizedQuery.includes('puzzle')) {
        return "Great puzzle games include 2048, Memory Match, and Tetris. Check out our Puzzle section for more brain teasers!";
      }
      return "I'd recommend starting with our featured games on the homepage or checking out Snake Classic, Tetris, and 2048 - they're very popular!";
    }
    
    // Navigation help
    if (normalizedQuery.includes('find') || normalizedQuery.includes('where')) {
      if (normalizedQuery.includes('category') || normalizedQuery.includes('categories')) {
        return "You can browse game categories by clicking 'Categories' in the main menu, or use the search bar at the top to find specific types of games.";
      }
      return "Use the search bar at the top to find specific games, or browse by categories in the main menu. The Games page shows all available games. What type of games are you looking for?";
    }
    
    // Technical support
    if (normalizedQuery.includes('not working') || normalizedQuery.includes('error') || normalizedQuery.includes('problem')) {
      return "If you're experiencing issues: 1) Try refreshing the page, 2) Clear your browser cache, 3) Make sure JavaScript is enabled. All our games are tested and should work on modern browsers. Which specific game is having issues?";
    }
    
    // Fallback with helpful suggestions
    return "I didn't quite understand that. I can help you with:\n• Finding games ('show puzzle games')\n• Learning how to play ('how to play Snake')\n• Technical issues ('game not working')\n• Account help ('can't log in')\n• Navigation ('where are categories')\n\nTry asking about a game or browse our collection!";
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      let response = '';
      
      // Try to find FAQ match first
      const faqMatch = findBestFAQMatch(currentMessage);
      if (faqMatch) {
        response = faqMatch.answer;
      } else {
        response = generateContextualResponse(currentMessage);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleRating = (messageId: string, rating: 'up' | 'down') => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    );
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'browse-games':
        navigate('/games');
        break;
      case 'categories':
        navigate('/categories');
        break;
      case 'trending':
        navigate('/trending');
        break;
      case 'featured':
        navigate('/browse');
        break;
    }
    setIsOpen(false);
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      if (!isListening) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCurrentMessage(transcript);
        };
        
        recognition.start();
      } else {
        setIsListening(false);
      }
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 shadow-lg hover:shadow-xl transition-all duration-300 z-40 ${isOpen ? 'hidden' : 'flex'} items-center justify-center group`}
      >
        <div className="relative">
          <MessageSquare className="h-6 w-6 text-white" />
          <Sparkles className="h-3 w-3 text-white absolute -top-1 -right-1 animate-pulse" />
        </div>
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] bg-background/98 backdrop-blur-lg border border-unigames-purple/20 shadow-2xl z-50 flex flex-col animate-fadeIn">
          <CardHeader className="pb-3 border-b border-border/50 bg-gradient-to-r from-unigames-purple/10 to-unigames-blue/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">Gaming Helper</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-unigames-purple text-white'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.type === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleRating(message.id, 'up')}
                      >
                        <ThumbsUp className={`h-3 w-3 ${message.rating === 'up' ? 'text-green-500' : 'text-muted-foreground'}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleRating(message.id, 'down')}
                      >
                        <ThumbsDown className={`h-3 w-3 ${message.rating === 'down' ? 'text-red-500' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleQuickAction('browse-games')}
                >
                  Browse Games
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleQuickAction('categories')}
                >
                  Categories
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleQuickAction('trending')}
                >
                  Trending
                </Button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Ask about games, help, or features..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={toggleVoiceInput}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIHelpAssistant;
