import React, { createContext, useContext, ReactNode } from 'react';

interface TrendData {
  id: string;
  title: string;
  category: string;
  growth: string;
  mentions: number;
  summary: string;
}

interface TrendContextType {
  mockTrends: TrendData[];
}

const TrendContext = createContext<TrendContextType | undefined>(undefined);

export const TrendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mockTrends: TrendData[] = [
    {
      id: '1',
      title: 'AI Enterprise Adoption',
      category: 'Technology',
      growth: '+23%',
      mentions: 342,
      summary: 'Enterprises are rapidly adopting AI tools for productivity and automation.'
    },
    {
      id: '2',
      title: 'Remote Work Evolution',
      category: 'Workplace',
      growth: '+18%',
      mentions: 287,
      summary: 'Remote work tools are evolving with better collaboration features.'
    },
    {
      id: '3',
      title: 'Sustainable Finance',
      category: 'Finance',
      growth: '+31%',
      mentions: 219,
      summary: 'Green finance initiatives gaining traction among investors.'
    }
  ];

  return (
    <TrendContext.Provider value={{ mockTrends }}>
      {children}
    </TrendContext.Provider>
  );
};

export const useTrend = () => {
  const context = useContext(TrendContext);
  if (context === undefined) {
    throw new Error('useTrend must be used within a TrendProvider');
  }
  return context;
};