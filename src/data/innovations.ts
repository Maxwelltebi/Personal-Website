export const featured = {
  id: 'lc-shuttle',
  tags: ['Featured', 'Moving to React Native + Expo'],
  title: 'LC Shuttle System',
  lead: "Livingstone's shuttles ran on fixed schedules. Miss the window and you wait. I ride them a lot, so I built a system that shows every shuttle live.",
  points: [
    'Live positions over WebSockets for students and drivers',
    'OpenStreetMap and Leaflet map, JWT auth, Node.js APIs',
    'Next: a mobile app with push alerts and phone location',
  ],
  stack: 'React · Node.js · MongoDB · WebSockets · React Native',
  // TODO: replace with the repo and live demo URLs.
  code: '#',
  demo: '#',
};

export const filters = ['All', 'AI', 'Healthcare', 'Finance', 'Mobile'] as const;
export type Filter = (typeof filters)[number];

export type Build = {
  slug: string;
  badge: string;
  title: string;
  body: string;
  stack: string;
  categories: Filter[];
  code: string;
};

// TODO: replace each `code: '#'` with the project's repo URL.
export const builds: Build[] = [
  {
    slug: 'biobrief',
    badge: '3rd place · Claude Builder Hackathon',
    title: 'BioBrief',
    body: 'Explains medical lab results in plain English and Twi. Patients receive results by QR code or SMS, and lab technicians work from a dashboard. It grew into a B2B concept for hospitals.',
    stack: 'AI · Web app · Technician dashboard',
    categories: ['AI', 'Healthcare'],
    code: '#',
  },
  {
    slug: 'stroke-risk-prediction',
    badge: '94% accuracy',
    title: 'Stroke Risk Prediction',
    body: 'A neural network trained on 4,908 patient records, with SMOTE and class weighting for imbalance. A Streamlit app runs the saved pipeline and returns live risk probabilities.',
    stack: 'TensorFlow · scikit-learn · Streamlit',
    categories: ['AI', 'Healthcare'],
    code: '#',
  },
  {
    slug: 'voice-first-loan-platform',
    badge: 'In progress',
    title: 'Voice-First Loan Platform',
    body: 'Micro-loans for farmers and traders, including people who cannot read. Voice-first, usable offline, and scores credit from MoMo statements, guarantors and psychometric signals.',
    stack: 'Gemini API · Smile Identity · Offline-first',
    categories: ['AI', 'Finance', 'Mobile'],
    code: '#',
  },
  {
    slug: 'orbit',
    badge: 'In progress',
    title: 'Orbit',
    body: 'A journaling app that sorts your thoughts into bubbles by theme, in your own words. The model runs on your phone, so your journal never leaves it.',
    stack: 'Gemma 3 270M · LoRA · LiteRT',
    categories: ['AI', 'Mobile'],
    code: '#',
  },
  {
    slug: 'grade-prediction-system',
    badge: '88% test accuracy',
    title: 'Grade Prediction System',
    body: 'A Random Forest trained on 25,000 student records predicts A to F grades with class probabilities, served through a React and FastAPI app.',
    stack: 'scikit-learn · FastAPI · React',
    categories: ['AI'],
    code: '#',
  },
];
