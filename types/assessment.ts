export interface Question {
  id: string;
  textEn: string;
  textFr: string;
  textAr: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  labelEn: string;
  labelFr: string;
  labelAr: string;
  points: number;
}

export interface Assessment {
  id: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  descriptionEn: string;
  descriptionFr: string;
  descriptionAr: string;
  questions: Question[];
  riskLevels: RiskLevel[];
}

export interface RiskLevel {
  minScore: number;
  maxScore: number;
  labelEn: string;
  labelFr: string;
  labelAr: string;
  messageEn: string;
  messageFr: string;
  messageAr: string;
  color: string;
}

export interface AssessmentAnswers {
  [questionId: string]: number;
}
