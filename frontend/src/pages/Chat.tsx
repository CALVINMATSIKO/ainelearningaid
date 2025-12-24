import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Loader2, Plus, Menu, X, Copy, Trash2, MessageSquare } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface Message {
  id: number;
  chat_id: number;
  role: 'user' | 'assistant';
  content: string;
  tokens_used: number | null;
  created_at: string;
}

interface Chat {
  id: number;
  user_id: number | null;
  session_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const sessionId = localStorage.getItem('session_id') || 'default_session';
      const response = await fetch(`/api/chat?session_id=${sessionId}`);

      if (response.ok) {
        const chatsList = await response.json();
        setChats(chatsList);

        // Select the most recent chat or create new if none
        if (chatsList.length > 0) {
          selectChat(chatsList[0]);
        } else {
          await createNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
      addToast('error', 'Failed to load chat history');
    } finally {
      setIsLoadingChats(false);
    }
  };

  const selectChat = async (chat: Chat) => {
    setCurrentChat(chat);
    setIsSidebarOpen(false);

    try {
      const response = await fetch(`/api/chat/${chat.id}/messages`);
      if (response.ok) {
        const messagesList = await response.json();
        setMessages(messagesList);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      addToast('error', 'Failed to load messages');
    }
  };

  const createNewChat = async () => {
    try {
      const sessionId = localStorage.getItem('session_id') || 'default_session';
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          title: `Chat ${new Date().toLocaleDateString()}`
        })
      });

      if (response.ok) {
        const newChat = await response.json();
        setChats(prev => [newChat, ...prev]);
        selectChat(newChat);
        addToast('success', 'New chat created');
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      addToast('error', 'Failed to create new chat');
    }
  };

  const deleteChat = async (chatId: number) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setChats(prev => prev.filter(chat => chat.id !== chatId));
        if (currentChat?.id === chatId) {
          setMessages([]);
          setCurrentChat(null);
          // Select another chat or create new
          if (chats.length > 1) {
            const remainingChats = chats.filter(chat => chat.id !== chatId);
            selectChat(remainingChats[0]);
          } else {
            createNewChat();
          }
        }
        addToast('success', 'Chat deleted');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      addToast('error', 'Failed to delete chat');
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      addToast('success', 'Message copied to clipboard');
    } catch (error) {
      console.error('Failed to copy message:', error);
      addToast('error', 'Failed to copy message');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !currentChat) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat/${currentChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.user_message, data.ai_message]);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto flex h-screen">
        {/* Sidebar */}
        <div className={`w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat History</h2>
              <button
                onClick={createNewChat}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                title="New Chat"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingChats ? (
              <div className="p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading chats...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats yet</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    currentChat?.id === chat.id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-600' : ''
                  }`}
                  onClick={() => selectChat(chat)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(chat.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete Chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 text-gray-600 dark:text-gray-400"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <MessageCircle className="h-6 w-6 text-primary-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentChat?.title || 'AI Chat Assistant'}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Have a conversation with our educational AI assistant
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 bg-white dark:bg-gray-800 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Start a conversation</p>
                    <p className="text-sm">Ask me anything about your studies!</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-3 relative ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-opacity"
                          title="Copy message"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;