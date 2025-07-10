'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile,
  Search,
  CheckCheck,
  Clock,
  Circle,
  Star,
  AlertCircle,
  Image as ImageIcon,
  File,
  MapPin,
  Truck,
  Package,
  User,
  Building,
  Heart
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'donor' | 'ngo' | 'volunteer' | 'admin';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'location' | 'system';
  read: boolean;
  metadata?: {
    fileName?: string;
    fileSize?: string;
    imageUrl?: string;
    location?: { lat: number; lng: number; address: string };
    systemEventType?: 'pickup_assigned' | 'delivery_completed' | 'donation_accepted';
  };
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'support';
  participants: Array<{
    id: string;
    name: string;
    role: 'donor' | 'ngo' | 'volunteer' | 'admin';
    avatar?: string;
    online: boolean;
    lastSeen?: Date;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  donationId?: string; // Associated donation if any
}

// Mock data for demonstration
const mockChatRooms: ChatRoom[] = [
  {
    id: 'room1',
    name: 'Mumbai Food Bank',
    type: 'direct',
    participants: [
      { id: 'ngo1', name: 'Mumbai Food Bank', role: 'ngo', online: true },
      { id: 'donor1', name: 'You', role: 'donor', online: true }
    ],
    lastMessage: {
      id: 'msg1',
      senderId: 'ngo1',
      senderName: 'Mumbai Food Bank',
      senderRole: 'ngo',
      content: 'Thank you for the donation! Our volunteer will pick it up at 3 PM.',
      timestamp: new Date('2024-01-15T14:30:00'),
      type: 'text',
      read: false
    },
    unreadCount: 2,
    donationId: 'DON001'
  },
  {
    id: 'room2',
    name: 'Rajesh Kumar (Volunteer)',
    type: 'direct',
    participants: [
      { id: 'vol1', name: 'Rajesh Kumar', role: 'volunteer', online: true },
      { id: 'donor1', name: 'You', role: 'donor', online: true }
    ],
    lastMessage: {
      id: 'msg2',
      senderId: 'vol1',
      senderName: 'Rajesh Kumar',
      senderRole: 'volunteer',
      content: 'I\'m on my way to pick up the food donation. ETA: 15 minutes.',
      timestamp: new Date('2024-01-15T14:45:00'),
      type: 'text',
      read: false
    },
    unreadCount: 1
  },
  {
    id: 'room3',
    name: 'Emergency Food Relief',
    type: 'group',
    participants: [
      { id: 'admin1', name: 'Admin Support', role: 'admin', online: true },
      { id: 'ngo1', name: 'Mumbai Food Bank', role: 'ngo', online: false, lastSeen: new Date('2024-01-15T13:00:00') },
      { id: 'vol2', name: 'Priya Sharma', role: 'volunteer', online: true },
      { id: 'donor1', name: 'You', role: 'donor', online: true }
    ],
    lastMessage: {
      id: 'msg3',
      senderId: 'admin1',
      senderName: 'Admin Support',
      senderRole: 'admin',
      content: 'Emergency situation in Dharavi area. Need immediate food donations.',
      timestamp: new Date('2024-01-15T12:00:00'),
      type: 'text',
      read: true
    },
    unreadCount: 0
  }
];

const mockMessages: { [roomId: string]: Message[] } = {
  room1: [
    {
      id: 'msg1-1',
      senderId: 'donor1',
      senderName: 'You',
      senderRole: 'donor',
      content: 'Hi! I have 20kg of fresh vegetables to donate from our restaurant.',
      timestamp: new Date('2024-01-15T14:00:00'),
      type: 'text',
      read: true
    },
    {
      id: 'msg1-2',
      senderId: 'ngo1',
      senderName: 'Mumbai Food Bank',
      senderRole: 'ngo',
      content: 'That\'s wonderful! Can you please share the location and when would be the best time for pickup?',
      timestamp: new Date('2024-01-15T14:05:00'),
      type: 'text',
      read: true
    },
    {
      id: 'msg1-3',
      senderId: 'donor1',
      senderName: 'You',
      senderRole: 'donor',
      content: 'Here\'s our location:',
      timestamp: new Date('2024-01-15T14:10:00'),
      type: 'location',
      read: true,
      metadata: {
        location: {
          lat: 19.0760,
          lng: 72.8777,
          address: 'Andheri West, Mumbai, Maharashtra 400058'
        }
      }
    },
    {
      id: 'msg1-4',
      senderId: 'system',
      senderName: 'System',
      senderRole: 'admin',
      content: 'Volunteer Rajesh Kumar has been assigned to this pickup.',
      timestamp: new Date('2024-01-15T14:25:00'),
      type: 'system',
      read: true,
      metadata: {
        systemEventType: 'pickup_assigned'
      }
    },
    {
      id: 'msg1-5',
      senderId: 'ngo1',
      senderName: 'Mumbai Food Bank',
      senderRole: 'ngo',
      content: 'Thank you for the donation! Our volunteer will pick it up at 3 PM.',
      timestamp: new Date('2024-01-15T14:30:00'),
      type: 'text',
      read: false
    }
  ],
  room2: [
    {
      id: 'msg2-1',
      senderId: 'vol1',
      senderName: 'Rajesh Kumar',
      senderRole: 'volunteer',
      content: 'Hello! I\'ve been assigned to pick up your food donation. When would be convenient for you?',
      timestamp: new Date('2024-01-15T14:35:00'),
      type: 'text',
      read: true
    },
    {
      id: 'msg2-2',
      senderId: 'donor1',
      senderName: 'You',
      senderRole: 'donor',
      content: 'Hi Rajesh! Anytime after 3 PM would work. The food is ready for pickup.',
      timestamp: new Date('2024-01-15T14:40:00'),
      type: 'text',
      read: true
    },
    {
      id: 'msg2-3',
      senderId: 'vol1',
      senderName: 'Rajesh Kumar',
      senderRole: 'volunteer',
      content: 'Perfect! I\'m on my way to pick up the food donation. ETA: 15 minutes.',
      timestamp: new Date('2024-01-15T14:45:00'),
      type: 'text',
      read: false
    }
  ]
};

export default function ChatInterface() {
  const [selectedRoom, setSelectedRoom] = useState<string>('room1');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedRoom]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Here you would integrate with Socket.IO
    console.log('Sending message:', message);
    setMessage('');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'donor': return <Heart className="w-4 h-4" />;
      case 'ngo': return <Building className="w-4 h-4" />;
      case 'volunteer': return <Truck className="w-4 h-4" />;
      case 'admin': return <Star className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'donor': return 'bg-green-100 text-green-800';
      case 'ngo': return 'bg-blue-100 text-blue-800';
      case 'volunteer': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const renderMessage = (msg: Message) => {
    const isOwn = msg.senderId === 'donor1'; // Current user
    
    if (msg.type === 'system') {
      return (
        <div key={msg.id} className="flex justify-center my-4">
          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {msg.content}
          </div>
        </div>
      );
    }

    return (
      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
          <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar className="h-6 w-6">
              <AvatarFallback className={getRoleColor(msg.senderRole)}>
                {getRoleIcon(msg.senderRole)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">{msg.senderName}</span>
            <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
          </div>
          
          <div className={`rounded-lg px-4 py-2 ${
            isOwn 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            {msg.type === 'text' && (
              <p className="text-sm">{msg.content}</p>
            )}
            
            {msg.type === 'location' && msg.metadata?.location && (
              <div className="space-y-2">
                <p className="text-sm">{msg.content}</p>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-xs">{msg.metadata.location.address}</p>
                </div>
              </div>
            )}
            
            {msg.type === 'image' && (
              <div className="space-y-2">
                <p className="text-sm">{msg.content}</p>
                <div className="bg-white bg-opacity-20 rounded-lg p-2">
                  <ImageIcon className="w-8 h-8 mx-auto" />
                </div>
              </div>
            )}
          </div>
          
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {isOwn && (
              <div className="flex items-center gap-1">
                {msg.read ? (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                ) : (
                  <Clock className="w-3 h-3 text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredRooms = mockChatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100%-80px)]">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`p-4 cursor-pointer border-b hover:bg-gray-100 transition-colors ${
                selectedRoom === room.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={getRoleColor(room.participants[0]?.role || 'donor')}>
                      {getRoleIcon(room.participants[0]?.role || 'donor')}
                    </AvatarFallback>
                  </Avatar>
                  {room.participants[0]?.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{room.name}</h3>
                    <div className="flex items-center gap-1">
                      {room.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(room.lastMessage.timestamp)}
                        </span>
                      )}
                      {room.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-5">
                          {room.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {room.type}
                    </Badge>
                    {room.donationId && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        {room.donationId}
                      </Badge>
                    )}
                  </div>
                  
                  {room.lastMessage && (
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {room.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={getRoleColor(mockChatRooms.find(r => r.id === selectedRoom)?.participants[0]?.role || 'donor')}>
                      {getRoleIcon(mockChatRooms.find(r => r.id === selectedRoom)?.participants[0]?.role || 'donor')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{mockChatRooms.find(r => r.id === selectedRoom)?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {mockChatRooms.find(r => r.id === selectedRoom)?.participants[0]?.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mockMessages[selectedRoom]?.map(renderMessage)}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-1">
                        <Circle className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <Circle className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <Circle className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
