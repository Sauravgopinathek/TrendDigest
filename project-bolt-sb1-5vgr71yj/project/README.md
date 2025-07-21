# Market Trends Digest Platform

A modern React-TypeScript application built with Vite for tracking and analyzing market trends with AI-powered chat functionality.

## 🚀 Features

- **AI Chat Interface** - Interactive chat for market trend discussions
- **Dashboard** - Visual overview of market trends and analytics  
- **Sources Management** - Manage and configure data sources
- **Settings** - Customize platform preferences
- **Real-time Updates** - Stay updated with latest market information

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Web Scraping**: Cheerio + JSDOM
- **Date Handling**: date-fns

## 📁 Project Structure

```
project/
├── 📄 index.html                    # Main HTML entry point
├── 📄 package.json                  # Dependencies and scripts
├── 📄 vite.config.ts                # Vite configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 tsconfig.app.json             # App-specific TypeScript config
├── 📄 tsconfig.node.json            # Node-specific TypeScript config
├── 📄 tailwind.config.js            # Tailwind CSS configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 eslint.config.js              # ESLint configuration
└── 📁 src/
    ├── 📄 main.tsx                  # Application entry point
    ├── 📄 App.tsx                   # Main App component
    ├── 📄 index.css                 # Global styles
    ├── 📄 vite-env.d.ts            # Vite environment types
    ├── 📁 components/
    │   ├── 📄 ChatInterface.tsx     # AI chat component
    │   ├── 📄 Dashboard.tsx         # Analytics dashboard
    │   ├── 📄 Settings.tsx          # Settings panel
    │   ├── 📄 Sidebar.tsx           # Navigation sidebar
    │   └── 📄 Sources.tsx           # Data sources management
    ├── 📁 context/
    │   └── 📄 TrendContext.tsx      # Global state management
    └── 📁 services/
        ├── 📄 aiChatService.ts      # AI chat API service
        ├── 📄 emailService.ts       # Email notifications
        └── 📄 newsService.ts        # News data fetching
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Component Architecture

### Core Components

- **App.tsx** - Main application wrapper with routing logic
- **Sidebar.tsx** - Navigation component with tab switching
- **ChatInterface.tsx** - AI-powered chat functionality
- **Dashboard.tsx** - Market trends visualization
- **Sources.tsx** - Data source configuration
- **Settings.tsx** - Application settings

### Services

- **aiChatService.ts** - Handles AI chat API interactions
- **emailService.ts** - Manages email notifications
- **newsService.ts** - Fetches news and market data

### Context

- **TrendContext.tsx** - Global state management for market trends

## 🎨 Styling

The project uses Tailwind CSS for styling with:
- Responsive design principles
- Modern color palette
- Component-based styling approach

## 📦 Dependencies

### Production Dependencies
- React 18.3.1 - UI library
- Axios 1.10.0 - HTTP client
- Cheerio 1.1.0 - Server-side HTML parsing
- Date-fns 4.1.0 - Date utility library
- Lucide React 0.344.0 - Icon library

### Development Dependencies
- TypeScript 5.5.3 - Type safety
- Vite 5.4.2 - Build tool
- Tailwind CSS 3.4.1 - Styling
- ESLint 9.9.1 - Code linting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔧 Configuration Files

- **vite.config.ts** - Vite build configuration
- **tailwind.config.js** - Tailwind CSS customization
- **tsconfig.json** - TypeScript compiler options
- **eslint.config.js** - Code quality rules
- **postcss.config.js** - CSS processing configuration
