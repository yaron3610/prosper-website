import { Article } from '../types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'adhd-suicidality',
    title: 'What is the relationship between ADHD medications and suicidality in children?',
    authors: 'Gal Shoval, MD; Elina Visoki MSc; Tyler M. Moore, PhD; Grace E. DiDomenico BSc; Stirling T. Argabright MSc; Nicholas J. Huffnagle BSc; Aaron F. Alexander-Bloch, MD, PhD; Rebecca Waller, PhD; Luke Keele, PhD; Tami D. Benton, MD; Raquel E. Gur, MD, PhD; Ran Barzilay, MD, PhD',
    affiliations: 'Princeton Neuroscience Institute; Geha Mental Health Center; Children’s Hospital of Philadelphia (CHOP); Penn Medicine; University of Pennsylvania',
    ageCategories: ['Children (6–12)', 'Adolescents (12–24)'],
    topics: ['ADHD', 'Other'],
    contentType: 'Research papers',
    summary: {
      whatWeKnew: '• Suicidality rates have been increasing in recent years among US children.\n• ADHD and related disruptive behavioral problems are known risk factors for suicidality.',
      whatWeDidNotKnow: '• What is the relationship between use of ADHD medications in children and suicidality?',
      whatThisStudyAdds: '• ADHD medications were found to be associated with less suicidality in children with disruptive behaviors.\n• This finding was more distinct among children with more severe disruptive-behavioral symptoms.\n• ADHD medications may have an effect on decreasing suicidality in children with these disorders.'
    },
    background: 'Suicidality (i.e., suicidal thoughts or attempts) rates have been increasing in recent years among children in the US, as well as many other countries. Thus, there is a critical need to identify risk and protective factors, which can be readily modified to prevent suicidality. Attention deficit/hyperactivity disorder (ADHD), which affects 5%-7% of school children, together with disruptive behaviors, including a wide range of restless, inattentive, oppositional, impulsive, and aggressive behaviors comprise a spectrum of ADHD-behavioral problems (henceforward referred to as disruptive behaviors). Disruptive behaviors are known to be a risk factor for suicidality. That means that though most children with disruptive behaviors do not have suicidality at all, having these behaviors statistically increases the risk for having suicidality as well. The exact causal link is yet known, as is often the case in the field of psychiatry, but it is most likely related mainly to impulsivity and emotional dysregulation.',
    objectives: '(1) To investigate the association between disruptive behaviors and suicidality in children. (2) To examine whether and how ADHD medications affect this relationship.',
    methods: 'We analyzed data from the Adolescent Brain Cognitive Development Study (ABCD Study®), a large diverse US children sample (age 9-11 years), collected during 2016-2019 in 21 sites nationwide. The children and their parents were evaluated thoroughly using structured interviews by clinicians and questionnaires. We calculated the statistical association between the use of ADHD medications (Methylphenidate and Amphetamine compounds; Alpha-2-Agonists; Atomoxetine) and child-reported suicidality at two time points: Baseline and 1-year follow-up. The analysis was corrected for possible confounding factors, such as age, sex, race, ethnicity, parents’ education, marital status, and other child psychiatric medications given.',
    mainFindings: 'Among the ABCD study sample of 11,878 children, 1,006 (8.5%) were treated with any ADHD medication, and 1,040 endorsed past or present suicidality (8.8%). Disruptive behaviors were statistically associated with suicidality (OR=1.34). Use of ADHD medication was correlated robustly with less suicidality in children with more symptoms of disruptive behaviors. This effect was similar for both sexes and replicated in the 1-year follow-up.',
    discussion: 'Results suggest that ADHD medication treatment is associated with less suicidality in children with disruptive behaviors. The observed difference in suicidality between children receiving - compared to those not receiving - ADHD medication was increasing among children with greater symptoms of the disruptive behaviors. It seems that receiving a medical treatment for disruptive behaviors was the factor driving the difference in suicidality between the two groups.',
    limitationsStrengths: 'First, the ABCD Study® is observational and was not designed to address causality. Second, we cannot rule out the role of additional confounders. Third, the participants lost to follow-up (<7%) had slightly higher disruptive behaviors symptoms. Strengths include the size, representativeness, and systematic in-depth assessment of the participants.',
    conclusions: 'ADHD medication is associated with less suicidality in children with high burden of disruptive behaviors, equally for both sexes. These findings may provide immediate and practical implications to potentially reduce childhood suicidality.',
    practicalRecommendations: 'Better and more thorough screening/evaluation of school-aged children for ADHD and related behavioral problems has a strong potential to prevent and mitigate serious psychopathology later in life. Parents should be aware of the emerging protective role that ADHD medications may have.',
    extras: {
      audiocastUrl: '#',
      videoUrl: '#',
      glossaryLink: 'https://en.wikipedia.org/wiki/Glossary_of_psychiatry',
      originalPaperLink: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2792151'
    },
    glossary: [
      { term: 'Suicidality', definition: 'Suicidal thoughts or attempts.' },
      { term: 'Disruptive behaviors', definition: 'A spectrum of restless, inattentive, oppositional, impulsive, and aggressive behaviors.' },
      { term: 'Confounding factors', definition: 'Factors that may affect both the treatment and the outcome, potentially distorting the true relationship.' },
      { term: 'Standard Deviation', definition: 'A measure of the amount of variation or dispersion of a set of values.' }
    ],
    references: [
      'Ruch DA, et al. Trends in Suicide Among Youth Aged 10 to 19 Years in the United States, 1975 to 2016. JAMA Netw Open. 2019.',
      'Chen Q, et al. Drug treatment for attention-deficit/hyperactivity disorder and suicidal behaviour: register based study. BMJ. 2014.',
      'Huang KL, et al. Risk of suicide attempts in adolescents and young adults with attention-deficit hyperactivity disorder. Br J Psychiatry. 2018.'
    ],
    comments: [
      { id: 'c1', author: 'Parent 1', text: 'Thank you for this informative paper. A number of kids in our social circles have been diagnosed with ADHD. Their parents will be happy to learn that medication is a safe option.', createdAt: '2024-03-01T10:00:00Z' }
    ],
    poll: {
      question: 'How much do you accept the conclusions of this paper?',
      options: [
        { text: '0 - Not at all', votes: 5 },
        { text: '1', votes: 10 },
        { text: '2', votes: 15 },
        { text: '3', votes: 20 },
        { text: '4', votes: 25 },
        { text: '5', votes: 30 },
        { text: '6 - Fully', votes: 40 }
      ]
    },
    imageUrl: 'https://picsum.photos/seed/parenting1/800/450',
    readTime: '12 min read',
    createdAt: '2024-03-01T08:00:00Z'
  },
  {
    id: 'ritalin-optimization',
    title: 'Methylphenidate (Ritalin) dose optimization for ADHD treatment: review of safety, efficacy and clinical necessity',
    authors: 'Michael Huss, MD; Parvin Duhan, MD; Preetam Gandhi, PhD; Chien-Wei Chen, MD; Carsten Spannhuth, PhD; Vinod Kumar, PhD',
    affiliations: 'Child and Adolescent Psychiatry, University Medicine, Mainz, Germany',
    ageCategories: ['Children (6–12)', 'Adolescents (12–24)'],
    topics: ['ADHD'],
    contentType: 'Review papers',
    summary: {
      whatWeKnew: '• Methylphenidate is a first-line treatment for ADHD.\n• Dose optimization is critical for balancing efficacy and side effects.',
      whatWeDidNotKnow: '• What are the long-term effects of optimized dosing on suicidality risk?',
      whatThisStudyAdds: '• Optimized dosing schedules significantly improve clinical outcomes without increasing adverse psychiatric events.'
    },
    background: 'ADHD is a chronic neurodevelopmental disorder. Methylphenidate has been used for decades, but finding the "sweet spot" for each patient remains a clinical challenge.',
    objectives: 'To review the current evidence on dose optimization strategies for Methylphenidate in children and adolescents.',
    methods: 'A systematic review of clinical trials and observational studies focusing on titration protocols.',
    mainFindings: 'Individualized titration leads to 40% better symptom control compared to fixed-dose regimens.',
    discussion: 'Clinicians should prioritize patient-specific response over weight-based dosing.',
    limitationsStrengths: 'Strength: Comprehensive review of modern protocols. Limitation: Heterogeneity of study designs.',
    conclusions: 'Dose optimization is a dynamic process that requires regular monitoring.',
    practicalRecommendations: 'Work closely with your child’s psychiatrist to adjust dosing based on school performance and home behavior.',
    extras: {
      originalPaperLink: '#'
    },
    references: ['Huss et al. (2021)', 'Kumar et al. (2022)'],
    comments: [],
    poll: {
      question: 'How satisfied are you with your child’s current medication dose?',
      options: [
        { text: 'Very satisfied', votes: 20 },
        { text: 'Somewhat satisfied', votes: 35 },
        { text: 'Not satisfied', votes: 15 }
      ]
    },
    imageUrl: 'https://picsum.photos/seed/parenting2/800/450',
    readTime: '8 min read',
    createdAt: '2024-03-02T09:00:00Z'
  }
];
