export interface JargonTerm {
  term: string;
  pronunciation?: string;
  simpleDefinition: string;
  lemonadeAnalogy: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface IpoLevelData {
  id: number;
  levelNumber: number;
  badge: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  runningAnalogyTitle: string;
  runningAnalogyText: string;
  realWorldExampleTitle: string;
  realWorldExampleText: string;
  keyConcepts: {
    heading: string;
    body: string;
    inShortRecap: string;
    jargonTerms: JargonTerm[];
  }[];
  quickRecapBullets: string[];
  diagramType: 'ownership_pie' | 'private_vs_public' | 'ipo_lifecycle' | 'bidding_journey' | 'listing_day_matrix';
  quiz: QuizQuestion[];
}
