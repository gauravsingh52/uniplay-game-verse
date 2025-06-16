
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, X, Send, Mic, MicOff, Bot, User, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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
    question: "Where can I find puzzle games?",
    answer: "You can find puzzle games by going to Categories > Puzzle, or search for 'puzzle' in the search bar.",
    category: "navigation"
  },
  {
    question: "Are the games free?",
    answer: "Yes! All games on UNIGAMES are completely free to play. No hidden fees or subscriptions required.",
    category: "general"
  },
  {
    question: "Can I play on mobile?",
    answer: "Absolutely! All our games are optimized for mobile devices and work great on phones and tablets.",
    category: "technical"
  },
  {
    question: "How do I save my progress?",
    answer: "Game progress is automatically saved in your browser. For persistent saves across devices, create an account.",
    category: "account"
  }
];

const AIHelpAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }

    // Show welcome message if no history
    if (!saved || JSON.parse(saved).length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: "Hi! I'm your gaming assistant. I can help you find games, answer questions, and navigate the site. What would you like to know?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const saveMessages = (msgs: Message[]) => {
    localStorage.setItem('ai-chat-history', JSON.stringify(msgs));
  };

  const findBestFAQMatch = (query: string): FAQ | null => {
    const normalizedQuery = query.toLowerCase();
    
    // Direct keyword matching
    for (const faq of faqs) {
      const keywords = faq.question.toLowerCase();
      const words = normalizedQuery.split(' ');
      
      if (words.some(word => keywords.includes(word) && word.length > 2)) {
        return faq;
      }
    }
    
    return null;
  };

  const generateContextualResponse = (query: string): string => {
    const normalizedQuery = query.toLowerCase();
    
    // Game recommendations
    if (normalizedQuery.includes('recommend') || normalizedQuery.includes('suggest')) {
      if (normalizedQuery.includes('action')) {
        return "For action games, I recommend trying Brick Breaker, Snake, or Tetris. You can find more in the Action category!";
      }
      if (normalizedQuery.includes('puzzle')) {
        return "Great puzzle games include 2048, Memory Match, and Tic Tac Toe. Check out our Puzzle section for more brain teasers!";
      }
      return "I'd recommend starting with our featured games or trending section. Popular choices include Snake, Tetris, and 2048!";
    }
    
    // Navigation help
    if (normalizedQuery.includes('find') || normalizedQuery.includes('where')) {
      if (normalizedQuery.includes('category') || normalizedQuery.includes('categories')) {
        return "You can browse game categories by clicking 'Categories' in the main menu, or use the search bar to find specific types of games.";
      }
      return "Use the search bar at the top to find specific games, or browse by categories in the main menu. What are you looking for?";
    }
    
    // Technical support
    if (normalizedQuery.includes('not working') || normalizedQuery.includes('error') || normalizedQuery.includes('problem')) {
      return "If you're experiencing issues, try refreshing the page or clearing your browser cache. All games are tested and should work on modern browsers.";
    }
    
    return "I'm here to help! You can ask me about finding games, how to play, technical issues, or anything else about the site. What would you like to know?";
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
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 shadow-lg hover:shadow-xl transition-all duration-300 z-40 ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] bg-background/95 backdrop-blur-lg border border-border/50 shadow-2xl z-50 flex flex-col animate-fadeIn">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm">AI Gaming Assistant</CardTitle>
                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-600">
                    Online
                  </Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-unigames-purple text-white ml-auto' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.type === 'assistant' && (
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 ${message.rating === 'up' ? 'text-green-600' : 'text-muted-foreground'}`}
                          onClick={() => handleRating(message.id, 'up')}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 ${message.rating === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}
                          onClick={() => handleRating(message.id, 'down')}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-unigames-purple rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-unigames-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-unigames-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-border/50">
              <div className="text-xs text-muted-foreground mb-2">Quick Actions:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Browse Games', action: 'browse-games' },
                  { label: 'Categories', action: 'categories' },
                  { label: 'Trending', action: 'trending' }
                ].map((item) => (
                  <Button
                    key={item.action}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleQuickAction(item.action)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyPress={(e) =>{ if (e.key === 'Enter') handleSendMessage(); }}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={`${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  size="icon"
                  className="bg-unigames-purple hover:bg-unigames-purple/80"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIHelpAssistant;
