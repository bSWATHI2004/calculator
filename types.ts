
export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export interface RedFlag {
  category: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface AnalysisResult {
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  summary: string;
  redFlags: RedFlag[];
  senderAnalysis: string;
  linkAnalysis: string;
  toneAnalysis: string;
  recommendations: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  analysis?: AnalysisResult;
}

export interface AppState {
  messages: Message[];
  isAnalyzing: boolean;
  error: string | null;
}
