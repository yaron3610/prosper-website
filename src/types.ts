export type AgeCategory = 'Pregnancy' | 'Babies (0–3)' | 'Toddlers (3–6)' | 'Children (6–12)' | 'Adolescents (12–24)' | 'Parenthood';
export type Topic = 'Normative development' | 'ADHD' | 'Mood disorders' | 'Anxiety' | 'OCD' | 'Trauma' | 'Other';
export type ContentType = 'Research papers' | 'Review papers' | 'Editorial papers';

export interface Article {
  id: string;
  title: string;
  authors: string;
  affiliations: string;
  ageCategories: AgeCategory[];
  topics: Topic[];
  contentType: ContentType;
  summary: {
    whatWeKnew: string;
    whatWeDidNotKnow: string;
    whatThisStudyAdds: string;
  };
  background: string;
  objectives: string;
  methods: string;
  mainFindings: string;
  discussion: string;
  limitationsStrengths: string;
  conclusions: string;
  practicalRecommendations: string;
  extras: {
    audiocastUrl?: string;
    videoUrl?: string;
    glossaryLink?: string;
    originalPaperLink?: string;
    conflictOfInterest?: string;
    funding?: string;
  };
  glossary?: { term: string; definition: string }[];
  references: string[];
  comments: Comment[];
  poll: Poll;
  imageUrl?: string;
  readTime?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Poll {
  question: string;
  options: { text: string; votes: number }[];
}
