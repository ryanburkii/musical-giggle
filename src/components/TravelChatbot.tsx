"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizonal, Plane, Hotel, MapPin, Globe } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
};

const QUICK_REPLIES = [
  { text: 'Best beaches in Thailand', icon: <MapPin className="w-4 h-4" /> },
  { text: 'Affordable hotels in Paris', icon: <Hotel className="w-4 h-4" /> },
  { text: 'Flight deals to Japan', icon: <Plane className="w-4 h-4" /> },
  { text: 'Cultural tours in Italy', icon: <Globe className="w-4 h-4" /> }
];

export const TravelChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your travel assistant. Where would you like to go?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const simulateTyping = (text: string, delay = 1000) => {
    setIsBotTyping(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          text,
          sender: 'bot',
          timestamp: new Date(),
          isTyping: false
        };
        setMessages(prev => [...prev, botMessage]);
        setIsBotTyping(false);
        resolve();
      }, delay);
    });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot thinking
    setTimeout(() => {
      simulateTyping(`I'm researching ${inputValue}... Here's what I found:`);
    }, 800);
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text);
    // Auto-send the quick reply
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-b from-blue-50 to-cyan-50 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5" />
          <h2 className="text-xl font-bold">Travel Assistant</h2>
        </div>
      </CardHeader>
      <CardContent className="p-4 h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={cn(
                  "max-w-xs md:max-w-md rounded-lg px-4 py-2 transition-all",
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200',
                  message.isTyping ? 'opacity-80' : 'opacity-100'
                )}
              >
                {message.isTyping ? (
                  <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <>
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md rounded-lg px-4 py-2 bg-white text-gray-800 border border-gray-200">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {QUICK_REPLIES.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-xs h-auto py-2 whitespace-normal text-left"
                onClick={() => handleQuickReply(reply.text)}
              >
                <span className="flex items-center gap-1">
                  {reply.icon}
                  {reply.text}
                </span>
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about destinations, flights, hotels..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isBotTyping}
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};