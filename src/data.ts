import { Article } from './types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'How does screen time affect toddler language development?',
    authors: 'Dr. Sarah Miller, Prof. James Chen',
    affiliations: 'Princeton Department of Psychology, Yale Child Study Center',
    ageCategories: ['Babies (0–3)', 'Toddlers (3–6)'],
    topics: ['Normative development'],
    contentType: 'Research papers',
    summary: {
      whatWeKnew: 'Previous studies suggested high screen time correlates with lower language scores.',
      whatWeDidNotKnow: 'Whether the type of content or co-viewing with parents mitigates these effects.',
      whatThisStudyAdds: 'Educational content with active parent engagement neutralizes negative impacts on vocabulary.'
    },
    background: 'The digital age has brought screens into every aspect of life, including early childhood.',
    objectives: 'To determine if interactive educational media affects language acquisition differently than passive entertainment.',
    methods: 'A longitudinal study of 500 toddlers over 24 months using standardized language assessments.',
    mainFindings: 'Passive viewing > 2 hours/day was linked to a 15% delay in expressive language. Educational co-viewing showed no delay.',
    discussion: 'The quality of interaction remains the primary driver of development, regardless of the medium.',
    limitationsStrengths: 'Strength: Large sample size. Limitation: Self-reported screen time logs.',
    conclusions: 'Parents should prioritize high-quality educational content and watch together with their children.',
    practicalRecommendations: 'Limit passive viewing. Use screens as a tool for conversation rather than a babysitter.',
    extras: {
      originalPaperLink: 'https://example.com/study-1',
      funding: 'National Institute of Child Health'
    },
    references: ['Smith et al. (2020)', 'Jones & Wang (2021)'],
    comments: [
      { id: 'c1', author: 'Emily R.', text: 'This is so helpful! I always felt guilty about 20 mins of Sesame Street.', createdAt: '2024-03-01T10:00:00Z' }
    ],
    poll: {
      question: 'How much screen time does your toddler get daily?',
      options: [
        { text: 'None', votes: 12 },
        { text: 'Less than 1 hour', votes: 45 },
        { text: '1-2 hours', votes: 30 },
        { text: 'More than 2 hours', votes: 10 }
      ]
    },
    createdAt: '2024-03-01T08:00:00Z'
  },
  {
    id: '2',
    title: 'Can early mindfulness training reduce anxiety in elementary students?',
    authors: 'Dr. Robert Glass, Dr. Elena Rodriguez',
    affiliations: 'Harvard Graduate School of Education, Stanford Medicine',
    ageCategories: ['Children (6–12)'],
    topics: ['Anxiety', 'Normative development'],
    contentType: 'Review papers',
    summary: {
      whatWeKnew: 'Mindfulness is effective for adults with anxiety.',
      whatWeDidNotKnow: 'If school-based programs are effective for children under 10.',
      whatThisStudyAdds: 'Daily 5-minute mindfulness breaks significantly reduced cortisol levels in 8-year-olds.'
    },
    background: 'Childhood anxiety rates have risen by 20% in the last decade.',
    objectives: 'Evaluate the efficacy of a 12-week mindfulness curriculum in public schools.',
    methods: 'Randomized controlled trial across 10 schools.',
    mainFindings: 'Students in the mindfulness group reported 30% fewer "worry" episodes.',
    discussion: 'Simple breathing exercises can be integrated into the school day with minimal disruption.',
    limitationsStrengths: 'Strength: Randomized design. Limitation: Short follow-up period.',
    conclusions: 'Schools should consider integrating brief mindfulness practices into the daily routine.',
    practicalRecommendations: 'Try "box breathing" with your child before bed or before school.',
    extras: {
      videoUrl: 'https://example.com/mindfulness-demo',
      conflictOfInterest: 'None declared'
    },
    references: ['Kabat-Zinn (2019)', 'Brown et al. (2022)'],
    comments: [],
    poll: {
      question: 'Do you practice mindfulness with your child?',
      options: [
        { text: 'Yes, daily', votes: 5 },
        { text: 'Sometimes', votes: 20 },
        { text: 'Never', votes: 50 },
        { text: 'I want to start', votes: 35 }
      ]
    },
    createdAt: '2024-03-02T09:00:00Z'
  }
];
