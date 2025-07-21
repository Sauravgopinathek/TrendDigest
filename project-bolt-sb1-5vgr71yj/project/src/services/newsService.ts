import axios from 'axios';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  imageUrl?: string;
  author?: string;
  readTime?: string;
}

export interface TrendAnalysis {
  topic: string;
  mentions: number;
  growth: string;
  sentiment: string;
  keyPoints: string[];
  sources: string[];
  confidence: number;
  relatedTopics: string[];
}

export interface LiveFeed {
  source: string;
  status: 'active' | 'error' | 'updating';
  lastUpdate: string;
  articlesCount: number;
  category: string;
}

class NewsService {
  private readonly NEWS_SOURCES = [
    'TechCrunch', 'VentureBeat', 'Forbes', 'Bloomberg', 'Reuters', 'Wired', 'The Verge',
    'Hacker News', 'Product Hunt', 'First Round Review', 'a16z', 'Y Combinator',
    'Fast Company', 'Harvard Business Review', 'MIT Technology Review', 'Ars Technica',
    'TechRadar', 'Engadget', 'Mashable', 'The Next Web', 'Business Insider',
    'Wall Street Journal', 'Financial Times', 'CNBC', 'MarketWatch'
  ];

  private readonly RESPONSE_TEMPLATES = [
    "🔥 Breaking insights from the startup ecosystem!",
    "📊 Here's what's trending in the market right now:",
    "🚀 Fresh intelligence from top industry sources:",
    "💡 Latest developments that founders need to know:",
    "⚡ Real-time market pulse - just for you:",
    "🎯 Curated insights from 25+ premium sources:",
    "🌟 Today's most important business developments:",
    "📈 Market intelligence update - hot off the press:"
  ];

  async fetchLiveNewsFeeds(): Promise<LiveFeed[]> {
    // Simulate live feeds from various sources
    return this.NEWS_SOURCES.map((source, index) => ({
      source,
      status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'updating' : 'error'),
      lastUpdate: this.getRandomTimeAgo(),
      articlesCount: Math.floor(Math.random() * 50) + 5,
      category: this.getSourceCategory(source)
    }));
  }

  async fetchLatestNews(category?: string, query?: string): Promise<NewsArticle[]> {
    // Enhanced mock data with more variety and realistic content
    const mockArticles = this.generateDiverseNews();
    
    if (category) {
      return mockArticles.filter(article => article.category === category);
    }

    if (query) {
      return mockArticles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    return mockArticles;
  }

  async fetchTrendingTopics(): Promise<TrendAnalysis[]> {
    const trendTopics = [
      {
        topic: 'AI Agent Automation',
        mentions: 456,
        growth: '+34%',
        sentiment: 'very positive',
        keyPoints: [
          'Enterprise AI agents reducing operational costs by 40%',
          'New funding rounds for AI automation startups exceed $500M',
          'Microsoft and Google expanding AI agent capabilities'
        ],
        sources: ['TechCrunch', 'VentureBeat', 'a16z', 'First Round'],
        confidence: 94,
        relatedTopics: ['Machine Learning', 'Enterprise Software', 'Productivity Tools']
      },
      {
        topic: 'Sustainable Tech Investment',
        mentions: 342,
        growth: '+28%',
        sentiment: 'positive',
        keyPoints: [
          'Climate tech funding reaches record $8.1B in Q4',
          'Carbon capture startups gaining enterprise traction',
          'ESG compliance driving green tech adoption'
        ],
        sources: ['Bloomberg', 'Reuters', 'Financial Times'],
        confidence: 89,
        relatedTopics: ['Climate Tech', 'ESG', 'Clean Energy']
      },
      {
        topic: 'Remote Work Infrastructure',
        mentions: 298,
        growth: '+22%',
        sentiment: 'neutral',
        keyPoints: [
          'Hybrid work models becoming permanent for 70% of companies',
          'Virtual collaboration tools see sustained growth',
          'Office real estate market continues transformation'
        ],
        sources: ['Harvard Business Review', 'Fast Company', 'Wired'],
        confidence: 87,
        relatedTopics: ['Future of Work', 'PropTech', 'Collaboration Tools']
      },
      {
        topic: 'Fintech Regulation Changes',
        mentions: 267,
        growth: '+19%',
        sentiment: 'mixed',
        keyPoints: [
          'New crypto regulations creating compliance challenges',
          'Open banking initiatives expanding globally',
          'Digital payment security requirements tightening'
        ],
        sources: ['Wall Street Journal', 'CNBC', 'Financial Times'],
        confidence: 82,
        relatedTopics: ['Cryptocurrency', 'Digital Payments', 'RegTech']
      },
      {
        topic: 'Healthcare AI Breakthroughs',
        mentions: 234,
        growth: '+41%',
        sentiment: 'very positive',
        keyPoints: [
          'AI diagnostics showing 95% accuracy in clinical trials',
          'Drug discovery timelines reduced by 60% with AI',
          'Telemedicine platforms integrating advanced AI features'
        ],
        sources: ['MIT Technology Review', 'Nature', 'Forbes'],
        confidence: 91,
        relatedTopics: ['Medical AI', 'Drug Discovery', 'Telemedicine']
      }
    ];

    return trendTopics;
  }

  async searchNews(query: string): Promise<NewsArticle[]> {
    const allNews = await this.fetchLatestNews();
    const results = allNews.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase()) ||
      article.category.toLowerCase().includes(query.toLowerCase())
    );

    // Add some query-specific mock results
    if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('artificial intelligence')) {
      results.unshift(...this.getAISpecificNews());
    }

    return results;
  }

  async generateNewsSummary(articles: NewsArticle[]): Promise<string> {
    const randomTemplate = this.RESPONSE_TEMPLATES[Math.floor(Math.random() * this.RESPONSE_TEMPLATES.length)];
    const categories = [...new Set(articles.map(a => a.category))];
    const totalArticles = articles.length;
    
    let summary = `${randomTemplate}\n\n`;
    summary += `📊 **Market Intelligence Report** (${totalArticles} articles from ${this.NEWS_SOURCES.length} sources)\n\n`;
    
    categories.forEach(category => {
      const categoryArticles = articles.filter(a => a.category === category);
      const emoji = this.getCategoryEmoji(category);
      summary += `${emoji} **${category.toUpperCase()}** (${categoryArticles.length} updates)\n`;
      
      categoryArticles.slice(0, 2).forEach(article => {
        summary += `• ${article.title} - ${article.source}\n`;
      });
      summary += '\n';
    });

    summary += `🎯 **Key Market Insights:**\n`;
    summary += `• ${this.getRandomInsight()}\n`;
    summary += `• ${this.getRandomInsight()}\n`;
    summary += `• ${this.getRandomInsight()}\n`;
    summary += `• ${this.getRandomInsight()}\n\n`;
    
    summary += `📈 **Sentiment Analysis:** ${this.calculateOverallSentiment(articles)}\n`;
    summary += `🔄 **Live Updates:** Every 15 minutes from ${this.NEWS_SOURCES.length} premium sources\n`;
    summary += `⏰ **Generated:** ${new Date().toLocaleString()}\n`;
    summary += `🎯 **Confidence Score:** ${Math.floor(Math.random() * 15) + 85}%`;

    return summary;
  }

  getVariedResponse(type: 'greeting' | 'help' | 'error' | 'success'): string {
    const responses = {
      greeting: [
        "🚀 Welcome to your personal market intelligence hub! I'm analyzing trends from 25+ sources in real-time.",
        "👋 Hey there! Ready to dive into the latest market insights? I've got fresh data from top industry sources.",
        "💡 Hi! I'm your AI trend analyst. I can help you discover what's happening in your industry right now.",
        "🎯 Welcome! I'm monitoring the startup ecosystem 24/7. What market intelligence can I share with you today?"
      ],
      help: [
        "🤖 I'm your market intelligence assistant! Try these commands:\n\n📰 **'latest news'** - Real-time updates from 25+ sources\n📈 **'trending now'** - Hot topics with growth metrics\n🔍 **'search [topic]'** - Find specific industry news\n📧 **'send digest'** - Email summary to subscribers\n💼 **'industry analysis'** - Deep dive into market trends",
        "🔥 Here's what I can do for you:\n\n🌟 **Live News Feed** - Fresh updates every 15 minutes\n📊 **Trend Analysis** - AI-powered market insights\n🎯 **Smart Search** - Find exactly what you need\n📧 **Auto Digest** - Daily summaries via email\n💡 **Custom Alerts** - Never miss important developments",
        "⚡ Your personal market radar is active! Commands:\n\n📱 **'breaking news'** - Latest developments\n🚀 **'startup funding'** - Investment updates\n🤖 **'ai trends'** - Technology insights\n💰 **'market analysis'** - Financial trends\n📧 **'email update'** - Send digest to team"
      ],
      error: [
        "🔄 Oops! I'm having trouble fetching the latest data. The market never sleeps, and neither do I - let me try again!",
        "⚠️ Hmm, seems like there's a hiccup in the data stream. Don't worry, I'm reconnecting to our premium sources now.",
        "🛠️ Technical glitch detected! I'm working on getting you the freshest market intelligence. Please try again in a moment."
      ],
      success: [
        "✅ Mission accomplished! Your market intelligence is ready.",
        "🎉 Done! Fresh insights delivered straight from the source.",
        "⚡ Success! Your personalized market update is complete.",
        "🚀 All set! Latest trends and insights are now available."
      ]
    };

    const options = responses[type];
    return options[Math.floor(Math.random() * options.length)];
  }

  private generateDiverseNews(): NewsArticle[] {
    const newsTemplates = [
      {
        title: "OpenAI Unveils GPT-5 with Revolutionary Reasoning Capabilities",
        description: "The latest AI model demonstrates unprecedented logical reasoning and problem-solving abilities, potentially transforming enterprise applications across industries.",
        source: "TechCrunch",
        category: "technology",
        sentiment: "positive" as const,
        author: "Sarah Chen",
        readTime: "4 min read"
      },
      {
        title: "Startup Funding Surge: $3.2B Raised This Week Despite Economic Headwinds",
        description: "Venture capital continues flowing into promising startups, with AI, healthcare, and climate tech leading investment rounds.",
        source: "VentureBeat",
        category: "business",
        sentiment: "positive" as const,
        author: "Michael Rodriguez",
        readTime: "6 min read"
      },
      {
        title: "Remote Work Revolution: 85% of Companies Adopt Permanent Hybrid Models",
        description: "New research reveals the lasting impact of remote work on corporate culture, productivity, and real estate decisions.",
        source: "Harvard Business Review",
        category: "workplace",
        sentiment: "neutral" as const,
        author: "Dr. Jennifer Walsh",
        readTime: "8 min read"
      },
      {
        title: "Climate Tech Boom: Green Startups Raise Record $2.1B in Q4",
        description: "Sustainable technology companies attract unprecedented investment as climate concerns drive innovation and regulatory changes.",
        source: "Bloomberg",
        category: "environment",
        sentiment: "positive" as const,
        author: "David Kim",
        readTime: "5 min read"
      },
      {
        title: "Cybersecurity Alert: 70% Increase in AI-Powered Attacks",
        description: "Security experts warn of sophisticated new threats as cybercriminals leverage artificial intelligence for more effective attacks.",
        source: "Wired",
        category: "security",
        sentiment: "negative" as const,
        author: "Alex Thompson",
        readTime: "7 min read"
      },
      {
        title: "Fintech Disruption: Digital Banks Capture 40% Market Share",
        description: "Traditional banking faces unprecedented competition as digital-first financial services gain mainstream adoption.",
        source: "Financial Times",
        category: "finance",
        sentiment: "neutral" as const,
        author: "Emma Watson",
        readTime: "6 min read"
      },
      {
        title: "Healthcare AI Breakthrough: 98% Accuracy in Early Cancer Detection",
        description: "Revolutionary AI system outperforms human radiologists in detecting early-stage cancers, promising to save thousands of lives.",
        source: "MIT Technology Review",
        category: "healthcare",
        sentiment: "positive" as const,
        author: "Dr. Robert Chang",
        readTime: "9 min read"
      },
      {
        title: "E-commerce Evolution: Social Commerce Drives 60% of Online Sales",
        description: "Social media platforms become primary shopping destinations as consumers embrace integrated shopping experiences.",
        source: "Fast Company",
        category: "ecommerce",
        sentiment: "positive" as const,
        author: "Lisa Park",
        readTime: "5 min read"
      }
    ];

    return newsTemplates.map((template, index) => ({
      id: (index + 1).toString(),
      ...template,
      url: `https://example.com/article-${index + 1}`,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=200&fit=crop`
    }));
  }

  private getAISpecificNews(): NewsArticle[] {
    return [
      {
        id: 'ai-1',
        title: "Google DeepMind Achieves Breakthrough in Protein Folding Prediction",
        description: "AlphaFold 3 demonstrates 99.5% accuracy in predicting protein structures, accelerating drug discovery timelines.",
        url: "https://example.com/deepmind-protein",
        source: "Nature",
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        category: "technology",
        sentiment: "positive",
        author: "Dr. Maria Gonzalez",
        readTime: "12 min read"
      },
      {
        id: 'ai-2',
        title: "Enterprise AI Adoption Reaches 78% Among Fortune 500 Companies",
        description: "New survey reveals rapid AI integration across industries, with productivity gains averaging 35% in early adopters.",
        url: "https://example.com/enterprise-ai",
        source: "McKinsey",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        category: "business",
        sentiment: "positive",
        author: "James Liu",
        readTime: "7 min read"
      }
    ];
  }

  private getRandomTimeAgo(): string {
    const times = ['2 min ago', '15 min ago', '1 hour ago', '3 hours ago', '6 hours ago', 'just now', '30 min ago'];
    return times[Math.floor(Math.random() * times.length)];
  }

  private getSourceCategory(source: string): string {
    const categories: { [key: string]: string } = {
      'TechCrunch': 'Technology',
      'VentureBeat': 'Startups',
      'Forbes': 'Business',
      'Bloomberg': 'Finance',
      'Reuters': 'News',
      'Wired': 'Technology',
      'The Verge': 'Technology',
      'Hacker News': 'Tech Community',
      'Product Hunt': 'Products',
      'First Round Review': 'Venture Capital',
      'a16z': 'Venture Capital',
      'Y Combinator': 'Startups'
    };
    return categories[source] || 'General';
  }

  private getCategoryEmoji(category: string): string {
    const emojis: { [key: string]: string } = {
      'technology': '🤖',
      'business': '💼',
      'finance': '💰',
      'healthcare': '🏥',
      'environment': '🌱',
      'security': '🔒',
      'workplace': '🏢',
      'ecommerce': '🛒'
    };
    return emojis[category.toLowerCase()] || '📰';
  }

  private getRandomInsight(): string {
    const insights = [
      "AI automation is reshaping traditional business models across industries",
      "Sustainable tech investments are outperforming traditional sectors by 23%",
      "Remote-first companies report 40% higher employee satisfaction rates",
      "Fintech innovations are driving financial inclusion in emerging markets",
      "Healthcare AI is reducing diagnostic errors by up to 60%",
      "E-commerce personalization is increasing conversion rates by 35%",
      "Cybersecurity spending is projected to reach $300B by 2025",
      "Climate tech startups are attracting record venture capital funding"
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private calculateOverallSentiment(articles: NewsArticle[]): string {
    const sentiments = articles.map(a => a.sentiment).filter(Boolean);
    const positive = sentiments.filter(s => s === 'positive').length;
    const negative = sentiments.filter(s => s === 'negative').length;
    const neutral = sentiments.filter(s => s === 'neutral').length;

    const total = sentiments.length;
    const positivePercent = Math.round((positive / total) * 100);
    const negativePercent = Math.round((negative / total) * 100);

    if (positive > negative && positive > neutral) return `Bullish 📈 (${positivePercent}% positive sentiment)`;
    if (negative > positive && negative > neutral) return `Bearish 📉 (${negativePercent}% negative sentiment)`;
    return `Balanced 📊 (Mixed sentiment across ${total} sources)`;
  }
}

export const newsService = new NewsService();