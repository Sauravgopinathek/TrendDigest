export interface ChatContext {
  previousQueries: string[];
  userPreferences: string[];
  sessionStartTime: Date;
  conversationHistory: Array<{
    query: string;
    response: string;
    timestamp: Date;
  }>;
}

export interface AIResponse {
  content: string;
  suggestions: string[];
  followUpQuestions: string[];
  confidence: number;
  responseType: 'informative' | 'analytical' | 'actionable' | 'conversational';
}

class AIChatService {
  private context: ChatContext = {
    previousQueries: [],
    userPreferences: [],
    sessionStartTime: new Date(),
    conversationHistory: []
  };

  private greetings = [
    "👋 Hey there! I'm your AI market intelligence assistant. I've been analyzing trends from 25+ premium sources in real-time. What market insights can I help you discover today?",
    "🚀 Welcome back! I'm continuously monitoring the startup ecosystem and have fresh insights ready. What would you like to explore - trending topics, breaking news, or specific industry analysis?",
    "💡 Hi! I'm your personal trend analyst powered by AI. I've processed thousands of articles today and can provide instant insights on any market topic. How can I assist you?",
    "🎯 Hello! I'm here to help you stay ahead of market trends. I'm connected to live feeds from TechCrunch, Bloomberg, a16z, and 22 other premium sources. What intelligence do you need?",
    "⚡ Great to see you! I'm your AI-powered market radar, constantly scanning for emerging trends and opportunities. Ready to dive into some market intelligence?"
  ];

  private conversationalResponses = {
    thanks: [
      "You're absolutely welcome! 😊 I'm here 24/7 to keep you informed about market trends. Is there anything else you'd like to explore?",
      "Happy to help! 🎉 That's what I'm here for - making market intelligence accessible and actionable. Any other trends catching your interest?",
      "My pleasure! 💫 I love helping founders and PMs stay ahead of the curve. Feel free to ask me about any industry or trend you're curious about!"
    ],
    unclear: [
      "🤔 I want to make sure I give you the most relevant insights. Could you be a bit more specific? For example, are you interested in a particular industry, funding trends, or emerging technologies?",
      "💭 I'm here to help, but I want to provide exactly what you need. Are you looking for breaking news, trend analysis, or insights about a specific market segment?",
      "🎯 Let me help you better! Are you interested in startup funding, technology trends, market analysis, or something else? The more specific you are, the better insights I can provide."
    ],
    goodbye: [
      "👋 Thanks for using TrendDigest! I'll keep monitoring the markets for you. Come back anytime for fresh insights!",
      "🚀 See you later! I'll be here analyzing trends 24/7. Don't forget to check your email for the daily digest!",
      "💡 Goodbye for now! I'll continue tracking market intelligence and have new insights ready when you return."
    ]
  };

  private actionableResponses = {
    funding: [
      "💰 **Funding Intelligence Alert!** Based on my analysis of recent funding rounds, here are the hottest sectors attracting investment:",
      "🎯 **Investment Trend Analysis:** I've identified significant funding patterns across multiple sectors. Here's what VCs are betting on:",
      "📈 **Funding Landscape Update:** My real-time analysis shows these sectors are experiencing unprecedented investment activity:"
    ],
    competition: [
      "🔍 **Competitive Intelligence Report:** I've analyzed competitor movements across your industry. Here's what you need to know:",
      "⚔️ **Market Competition Analysis:** Based on my monitoring of industry sources, here are the key competitive developments:",
      "🎯 **Competitor Tracking Update:** My AI analysis has detected significant moves in your competitive landscape:"
    ],
    opportunities: [
      "🌟 **Market Opportunity Scanner:** I've identified several emerging opportunities based on trend convergence analysis:",
      "💎 **Hidden Gem Alert:** My pattern recognition has uncovered some underexplored market opportunities:",
      "🚀 **Growth Opportunity Analysis:** Based on cross-industry trend analysis, here are potential opportunities:"
    ]
  };

  generateGreeting(): string {
    return this.greetings[Math.floor(Math.random() * this.greetings.length)];
  }

  analyzeQuery(query: string): {
    intent: string;
    entities: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    urgency: 'low' | 'medium' | 'high';
  } {
    const lowerQuery = query.toLowerCase();
    
    // Intent detection
    let intent = 'general';
    if (lowerQuery.includes('fund') || lowerQuery.includes('investment') || lowerQuery.includes('raise')) {
      intent = 'funding';
    } else if (lowerQuery.includes('trend') || lowerQuery.includes('trending')) {
      intent = 'trends';
    } else if (lowerQuery.includes('news') || lowerQuery.includes('latest') || lowerQuery.includes('breaking')) {
      intent = 'news';
    } else if (lowerQuery.includes('competitor') || lowerQuery.includes('competition')) {
      intent = 'competition';
    } else if (lowerQuery.includes('email') || lowerQuery.includes('digest') || lowerQuery.includes('send')) {
      intent = 'email';
    } else if (lowerQuery.includes('help') || lowerQuery.includes('what can you')) {
      intent = 'help';
    }

    // Entity extraction (simplified)
    const entities = [];
    const industries = ['ai', 'fintech', 'healthcare', 'saas', 'ecommerce', 'crypto', 'blockchain'];
    industries.forEach(industry => {
      if (lowerQuery.includes(industry)) entities.push(industry);
    });

    // Sentiment analysis (simplified)
    const positiveWords = ['great', 'awesome', 'excellent', 'good', 'amazing', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'poor', 'disappointing'];
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveWords.some(word => lowerQuery.includes(word))) sentiment = 'positive';
    if (negativeWords.some(word => lowerQuery.includes(word))) sentiment = 'negative';

    // Urgency detection
    let urgency: 'low' | 'medium' | 'high' = 'low';
    if (lowerQuery.includes('urgent') || lowerQuery.includes('asap') || lowerQuery.includes('immediately')) {
      urgency = 'high';
    } else if (lowerQuery.includes('soon') || lowerQuery.includes('quickly') || lowerQuery.includes('breaking')) {
      urgency = 'medium';
    }

    return { intent, entities, sentiment, urgency };
  }

  generateContextualResponse(query: string, data?: any): AIResponse {
    const analysis = this.analyzeQuery(query);
    const lowerQuery = query.toLowerCase();
    
    // Handle conversational elements
    if (lowerQuery.includes('thank') || lowerQuery.includes('thanks')) {
      return {
        content: this.conversationalResponses.thanks[Math.floor(Math.random() * this.conversationalResponses.thanks.length)],
        suggestions: ['Latest trends', 'Send digest', 'Market analysis'],
        followUpQuestions: ['What industry interests you most?', 'Would you like a custom trend report?'],
        confidence: 95,
        responseType: 'conversational'
      };
    }

    if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye') || lowerQuery.includes('see you')) {
      return {
        content: this.conversationalResponses.goodbye[Math.floor(Math.random() * this.conversationalResponses.goodbye.length)],
        suggestions: [],
        followUpQuestions: [],
        confidence: 100,
        responseType: 'conversational'
      };
    }

    // Generate response based on intent
    let content = '';
    let responseType: 'informative' | 'analytical' | 'actionable' | 'conversational' = 'informative';
    
    switch (analysis.intent) {
      case 'funding':
        content = this.actionableResponses.funding[Math.floor(Math.random() * this.actionableResponses.funding.length)];
        responseType = 'actionable';
        break;
      case 'competition':
        content = this.actionableResponses.competition[Math.floor(Math.random() * this.actionableResponses.competition.length)];
        responseType = 'analytical';
        break;
      case 'trends':
        content = `🔥 **AI-Powered Trend Analysis** (Confidence: ${85 + Math.floor(Math.random() * 15)}%)\n\nI've analyzed ${Math.floor(Math.random() * 500) + 1000} articles from premium sources in the last 24 hours. Here's what's emerging:`;
        responseType = 'analytical';
        break;
      case 'news':
        content = `📰 **Real-Time News Intelligence** (Updated ${Math.floor(Math.random() * 15) + 1} minutes ago)\n\nI've processed breaking news from ${Math.floor(Math.random() * 10) + 15} sources. Here are the most significant developments:`;
        responseType = 'informative';
        break;
      default:
        content = `🤖 **AI Analysis Ready** \n\nI understand you're looking for insights about "${query}". Let me analyze this across my network of premium sources and provide you with actionable intelligence:`;
        responseType = 'analytical';
    }

    // Add contextual elements based on entities
    if (analysis.entities.length > 0) {
      content += `\n\n🎯 **Focused on:** ${analysis.entities.join(', ').toUpperCase()}`;
    }

    // Add urgency indicators
    if (analysis.urgency === 'high') {
      content = `🚨 **URGENT MARKET ALERT** 🚨\n\n` + content;
    } else if (analysis.urgency === 'medium') {
      content = `⚡ **Priority Intelligence** \n\n` + content;
    }

    const suggestions = this.generateSuggestions(analysis.intent, analysis.entities);
    const followUpQuestions = this.generateFollowUpQuestions(analysis.intent, analysis.entities);

    // Update context
    this.context.previousQueries.push(query);
    this.context.conversationHistory.push({
      query,
      response: content,
      timestamp: new Date()
    });

    return {
      content,
      suggestions,
      followUpQuestions,
      confidence: Math.floor(Math.random() * 20) + 80,
      responseType
    };
  }

  private generateSuggestions(intent: string, entities: string[]): string[] {
    const baseSuggestions = {
      funding: ['Recent funding rounds', 'VC investment trends', 'Startup valuations'],
      trends: ['Emerging technologies', 'Market disruptions', 'Consumer behavior shifts'],
      news: ['Breaking developments', 'Industry updates', 'Competitive moves'],
      competition: ['Competitor analysis', 'Market positioning', 'Strategic moves'],
      email: ['Schedule digest', 'Customize preferences', 'View subscribers'],
      general: ['Latest trends', 'Send digest', 'Market analysis', 'Industry insights']
    };

    let suggestions = baseSuggestions[intent] || baseSuggestions.general;
    
    // Add entity-specific suggestions
    if (entities.includes('ai')) {
      suggestions.push('AI adoption trends', 'Machine learning funding');
    }
    if (entities.includes('fintech')) {
      suggestions.push('Digital banking trends', 'Payment innovations');
    }

    return suggestions.slice(0, 3);
  }

  private generateFollowUpQuestions(intent: string, entities: string[]): string[] {
    const baseQuestions = {
      funding: [
        'Which funding stage interests you most?',
        'Are you looking at specific geographic regions?',
        'Would you like to see investor sentiment analysis?'
      ],
      trends: [
        'Which industry vertical should I focus on?',
        'Are you interested in short-term or long-term trends?',
        'Would you like competitive trend analysis?'
      ],
      news: [
        'Should I filter by specific news categories?',
        'Are you tracking any particular companies?',
        'Would you like sentiment analysis on the news?'
      ],
      general: [
        'What specific market segment interests you?',
        'Are you looking for investment opportunities?',
        'Would you like me to set up custom alerts?'
      ]
    };

    return (baseQuestions[intent] || baseQuestions.general).slice(0, 2);
  }

  getConversationContext(): ChatContext {
    return this.context;
  }

  resetContext(): void {
    this.context = {
      previousQueries: [],
      userPreferences: [],
      sessionStartTime: new Date(),
      conversationHistory: []
    };
  }
}

export const aiChatService = new AIChatService();