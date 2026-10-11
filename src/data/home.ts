export const tracks = [
  {
    num: '01',
    title: 'Research',
    lead: 'I research to discover.',
    body: "Applied machine learning and AI in healthcare and finance, plus climate risk work on Ghana's coast. Flood forecasting, stroke risk, youth public health.",
    cta: { label: 'Read my research', href: '/research' },
    shape: 'circle',
  },
  {
    num: '02',
    title: 'Innovation',
    lead: 'Then I build it.',
    body: 'Software engineer working in FastAPI, JavaScript, TypeScript, Node.js, React and React Native. A live campus shuttle system, a lab-results explainer in English and Twi, ML apps that serve real predictions.',
    cta: { label: 'See my innovations', href: '/innovations' },
    shape: 'square',
  },
] as const;

export const stats = [
  { value: '3.94', label: 'GPA · Presidential Scholar' },
  { value: '#1', label: 'Research project of 49 teams, AUCC PFx 2026' },
  { value: '93%', label: 'Accuracy, LSTM flood-risk classifier' },
  { value: '200+', label: 'Students reached through CIReN' },
];

export const selectedWork = [
  {
    title: 'Flood-Risk Forecasting with LSTMs',
    meta: 'Youth In AI Research Lab · Python, Google Earth Engine · 93% accuracy',
    href: '/research#flood-risk',
  },
  {
    title: 'LC Shuttle System',
    meta: 'Real-time campus shuttle tracking · React, Node.js, MongoDB, WebSockets',
    href: '/innovations#lc-shuttle',
  },
  {
    title: 'Stroke Risk Prediction App',
    meta: '4,908 patient records · TensorFlow, Streamlit · 94% accuracy',
    href: '/innovations/stroke-risk-prediction',
  },
  {
    title: 'BioBrief',
    meta: 'Lab results explained in English and Twi · 3rd place, Claude Builder Hackathon',
    href: '/innovations/biobrief',
  },
];
