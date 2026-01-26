
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface HealthInfoResponse {
  summary: string;
  generalInformation: string[];
  suggestedQuestionsForDoctor: string[];
  redFlags: string[];
  isVague: boolean;
  questionsToUser?: string[];
  homeCareSuggestions?: string[];
}
