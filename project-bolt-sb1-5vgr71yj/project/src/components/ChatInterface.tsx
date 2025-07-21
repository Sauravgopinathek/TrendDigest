import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Mail, Clock, TrendingUp, Zap, Globe, AlertCircle, CheckCircle, MessageSquare, Lightbulb } from 'lucide-react';
import { useTrend } from '../context/TrendContext';
import { newsService, NewsArticle, TrendAnalysis, LiveFeed } from '../services/newsService';
import { emailService } from '../services/emailService';
import { aiChatService, AIResponse } from '../services/aiChatService';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  articles?: NewsArticle[];
  trends?: TrendAnalysis[];
  liveFeeds?: LiveFeed[];
  responseType?: 'news' | 'trends' | 'search' | 'email' | 'help' | 'feeds';
  aiResponse?: AIResponse;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: aiChatService.generateGreeting(),
      timestamp: new Date(),
      suggestions: ['Latest breaking news', 'Trending topics now', 'Send email digest', 'AI industry trends'],
      followUpQuestions: ['What industry interests you most?', 'Would you like real-time alerts?']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [liveFeeds, setLiveFeeds] = useState<LiveFeed[]>([]);
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mockTrends } = useTrend();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize live feeds
    const initializeFeeds = async () => {
      const feeds = await newsService.fetchLiveNewsFeeds();
      setLiveFeeds(feeds);
    };
    initializeFeeds();

    // Update feeds every 30 seconds
    const interval = setInterval(async () => {
      const feeds = await newsService.fetchLiveNewsFeeds();
      setLiveFeeds(feeds);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const simulateTyping = (text: string, callback: (char: string) => void) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        callback(text[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTypingResponse(false);
      }
    }, 30);
  };

  const handleNewsQuery = async (userMessage: string): Promise<{ 
    content: string; 
    articles?: NewsArticle[]; 
    trends?: TrendAnalysis[];
    liveFeeds?: LiveFeed[];
    responseType?: 'news' | 'trends' | 'search' | 'email' | 'help' | 'feeds';
    aiResponse?: AIResponse;
    suggestions?: string[];
    followUpQuestions?: string[];
  }> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Generate AI contextual response
    const aiResponse = aiChatService.generateContextualResponse(userMessage);
    
    // Live feeds query
    if (lowerMessage.includes('live feed') || lowerMessage.includes('sources status') || lowerMessage.includes('feed status')) {
      const feeds = await newsService.fetchLiveNewsFeeds();
      const activeFeeds = feeds.filter(f => f.status === 'active').length;
      const totalArticles = feeds.reduce((sum, f) => sum + f.articlesCount, 0);
      
      return {
        content: `${aiResponse.content}\n\n🔴 **Live News Feeds Status**\n\n📊 **Overview:**\n• ${activeFeeds}/${feeds.length} sources active\n• ${totalArticles} articles processed today\n• Real-time updates every 15 minutes\n\n🎯 **Source Performance:**`,
        liveFeeds: feeds,
        responseType: 'feeds',
        aiResponse,
        suggestions: aiResponse.suggestions,
        followUpQuestions: aiResponse.followUpQuestions
      };
    }
    
    // Enhanced news queries with varied responses
    if (lowerMessage.includes('latest news') || lowerMessage.includes('recent news') || lowerMessage.includes('news today') || lowerMessage.includes('breaking news')) {
      const articles = await newsService.fetchLatestNews();
      const summary = await newsService.generateNewsSummary(articles);
      
      return {
        content: `${aiResponse.content}\n\n${summary}\n\n💡 **Featured Articles Below** - Click to explore detailed insights`,
        articles,
        responseType: 'news',
        aiResponse,
        suggestions: aiResponse.suggestions,
        followUpQuestions: aiResponse.followUpQuestions
      };
    }
    
    // Enhanced trend analysis
    if (lowerMessage.includes('trend') || lowerMessage.includes('trending') || lowerMessage.includes('market analysis') || lowerMessage.includes('trending now')) {
      const trends = await newsService.fetchTrendingTopics();
      let content = `${aiResponse.content}\n\n📈 **Detailed Trend Analysis**\n\nAnalyzing 25+ premium sources with ${aiResponse.confidence}% confidence:\n\n`;
      
      trends.forEach((trend, index) => {
        content += `🔥 **${index + 1}. ${trend.topic}** ${trend.growth}\n`;
        content += `   📊 ${trend.mentions} mentions • ${trend.confidence}% confidence\n`;
        content += `   💭 Sentiment: ${trend.sentiment}\n`;
        content += `   🎯 ${trend.keyPoints[0]}\n\n`;
      });
      
      return { 
        content, 
        trends, 
        responseType: 'trends',
        aiResponse,
        suggestions: aiResponse.suggestions,
        followUpQuestions: aiResponse.followUpQuestions
      };
    }
    
    // Enhanced search functionality
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('ai trends') || lowerMessage.includes('startup funding')) {
      const searchTerm = lowerMessage.replace(/search|find|for|about/g, '').trim();
      if (searchTerm) {
        const articles = await newsService.searchNews(searchTerm);
        return {
          content: `${aiResponse.content}\n\n🔍 **Smart Search Results: "${searchTerm}"**\n\n📰 Found ${articles.length} highly relevant articles from premium sources:\n\n${articles.slice(0, 3).map((a, i) => `${i + 1}. ${a.title}\n   📍 ${a.source} • ${a.readTime || '5 min read'}`).join('\n\n')}`,
          articles,
          responseType: 'search',
          aiResponse,
          suggestions: aiResponse.suggestions,
          followUpQuestions: aiResponse.followUpQuestions
        };
      }
    }
    
    // Enhanced email functionality
    if (lowerMessage.includes('email') || lowerMessage.includes('send digest') || lowerMessage.includes('schedule') || lowerMessage.includes('email update')) {
      const articles = await newsService.fetchLatestNews();
      const summary = await newsService.generateNewsSummary(articles);
      const result = await emailService.scheduleDigest(summary);
      
      return {
        content: `${aiResponse.content}\n\n📧 **Automated Email Digest Delivered!**\n\n${result}\n\n✨ **Email Features:**\n• Personalized content for each subscriber\n• Mobile-responsive HTML design\n• One-click unsubscribe option\n• Professional branding\n\n📋 **Content Preview:**\n${summary.substring(0, 250)}...\n\n🎯 All ${emailService.getUsers().length} subscribers notified successfully!`,
        responseType: 'email',
        aiResponse,
        suggestions: aiResponse.suggestions,
        followUpQuestions: aiResponse.followUpQuestions
      };
    }

    // Help and default responses
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('commands')) {
      return {
        content: aiResponse.content,
        responseType: 'help',
        aiResponse,
        suggestions: aiResponse.suggestions,
        followUpQuestions: aiResponse.followUpQuestions
      };
    }

    // Default intelligent response with varied greetings
    return {
      content: aiResponse.content,
      responseType: 'help',
      aiResponse,
      suggestions: aiResponse.suggestions,
      followUpQuestions: aiResponse.followUpQuestions
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsTypingResponse(true);
    setIsLoadingNews(true);

    try {
      const response = await handleNewsQuery(inputValue);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        articles: response.articles,
        trends: response.trends,
        liveFeeds: response.liveFeeds,
        responseType: response.responseType,
        aiResponse: response.aiResponse,
        suggestions: response.suggestions,
        followUpQuestions: response.followUpQuestions
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: newsService.getVariedResponse('error'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      setIsTypingResponse(false);
      setIsLoadingNews(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleQuickPromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const quickPrompts = [
    "Latest breaking news",
    "What's trending now?",
    "Send email digest",
    "Search AI trends",
    "Live feed status",
    "Market analysis"
  ];

  const renderSuggestions = (suggestions: string[]) => (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );

  const renderFollowUpQuestions = (questions: string[]) => (
    <div className="mt-3 space-y-2">
      <div className="flex items-center space-x-2 text-gray-600">
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm font-medium">Follow-up questions:</span>
      </div>
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => handleSuggestionClick(question)}
          className="block w-full text-left px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors"
        >
          💭 {question}
        </button>
      ))}
    </div>
  );

  const renderLiveFeeds = (feeds: LiveFeed[]) => (
    <div className="mt-4 space-y-2">
      <h4 className="font-semibold text-gray-700 text-sm">🔴 Live Source Status</h4>
      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
        {feeds.map((feed, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {feed.status === 'active' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : feed.status === 'updating' ? (
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <Globe className="w-3 h-3 text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-sm">{feed.source}</div>
                <div className="text-xs text-gray-500">{feed.category}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{feed.articlesCount}</div>
              <div className="text-xs text-gray-500">{feed.lastUpdate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderArticles = (articles: NewsArticle[]) => (
    <div className="mt-4 space-y-3">
      <h4 className="font-semibold text-gray-700 text-sm">📰 Related Articles</h4>
      {articles.slice(0, 4).map((article) => (
        <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="font-medium text-gray-900 text-sm leading-tight">{article.title}</h5>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{article.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{article.source}</span>
                {article.author && (
                  <span className="text-xs text-gray-500">by {article.author}</span>
                )}
                {article.readTime && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{article.readTime}</span>
                )}
                <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(article.publishedAt))} ago</span>
                {article.sentiment && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    article.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                    article.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {article.sentiment}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrends = (trends: TrendAnalysis[]) => (
    <div className="mt-4 space-y-3">
      <h4 className="font-semibold text-gray-700 text-sm">📈 Trend Details</h4>
      {trends.map((trend, index) => (
        <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-semibold text-gray-900">{trend.topic}</h5>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold text-sm">{trend.growth}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{trend.confidence}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{trend.mentions} mentions • {trend.sentiment} sentiment</p>
            <div className="text-xs text-gray-500">
              Sources: {trend.sources.join(', ')}
            </div>
            {trend.relatedTopics && (
              <div className="flex flex-wrap gap-1 mt-2">
                {trend.relatedTopics.map((topic, i) => (
                  <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
              Live Market Intelligence
            </h2>
            <p className="text-sm text-gray-500 mt-1">Real-time news analysis • Automated email digests • Trend monitoring</p>
          </div>
          {isLoadingNews && (
            <div className="flex items-center space-x-2 text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Fetching latest news...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-blue-600 ml-2' : 'bg-gray-100 mr-2'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div className={`rounded-lg px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.articles && renderArticles(message.articles)}
                {message.trends && renderTrends(message.trends)}
                {message.liveFeeds && renderLiveFeeds(message.liveFeeds)}
                {message.suggestions && renderSuggestions(message.suggestions)}
                {message.followUpQuestions && renderFollowUpQuestions(message.followUpQuestions)}
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-3xl">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 mr-2 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="p-4 border-t border-gray-100">
          <div className="mb-4">
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{liveFeeds.filter(f => f.status === 'active').length} Live Sources Active</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{emailService.getUsers().length} users subscribed</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-600">
                <Zap className="w-4 h-4" />
                <span className="text-sm">AI Analysis Ready</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">🚀 Your market intelligence hub is ready! Try these commands:</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPromptClick(prompt)}
                className="text-left p-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-md"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me: 'breaking news', 'trending now', 'AI trends', 'send digest', 'live feed status'..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-w-[60px] justify-center"
          >
            {isLoadingNews ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isTypingResponse ? (
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};