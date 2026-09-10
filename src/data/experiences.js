import cursorLogo from '../assets/logos/cursor.png'
import ischoolLogo from '../assets/logos/ischool.jpg'
import goldenLabLogo from '../assets/logos/goldenlab.png'
import ibmLogo from '../assets/logos/ibm.jpg'

export const experiences = [
  {
    date: 'Jun 2026 — Present',
    title: 'Software Developer Intern',
    org: 'IBM',
    blurb: 'watsonx.ai QA automation',
    detail: 'Building test automation for watsonx.ai so shipping stays fast and boring (the good kind of boring).',
    skills: ['Test Automation', 'TypeScript', 'QA Engineering', 'watsonx.ai'],
    logo: ibmLogo,
    tone: 'sand',
  },
  {
    date: 'Mar 2025 — Jun 2026',
    title: 'Teaching Assistant',
    org: 'UW Information School',
    blurb: 'teach SQL and database design',
    detail: 'Ran sections and office hours for databases and data modeling. Many JOINs were explained. Many were understood.',
    skills: ['SQL', 'Relational Databases', 'Data Modeling', 'Mentorship'],
    logo: ischoolLogo,
    tone: 'oat',
  },
  {
    date: 'Sep 2024 — Present',
    title: 'Research Assistant',
    org: 'Golden Lab · UW Neurobiology & Biophysics',
    blurb: '🐁 research mouse behavior',
    detail: 'Applying machine learning to classify behavior from noisy physiological time-series in freely moving mice.',
    skills: ['Python', 'Behavioral Data Analysis', 'Machine Learning'],
    logo: goldenLabLogo,
    tone: 'stone',
  },
  {
    date: 'Aug 2025 — Jun 2026',
    title: 'Campus Lead @ UW Seattle',
    org: 'Cursor',
    blurb: "💻 grow Cursor's presence on campus",
    detail: 'Organized events, workshops and a small army of student builders.',
    skills: ['Community', 'Project Management', 'Event Coordination'],
    logo: cursorLogo,
    tone: 'cream',
  },
]

export const education = {
  date: 'Sep 2023 — Jun 2027 (expected)',
  school: 'University of Washington, Seattle',
  degree: 'B.S. Computer Science · B.S. Informatics',
  courses: [
    'Data Structures & Algorithms', 'Databases & Data Modeling', 'Client-Side Dev', 'Server-Side Dev',
    'Mobile Dev: iOS', 'Machine Learning', 'Linear Algebra', 'Foundations of Computing', 'Hardware/Software Interface',
  ],
}
