import portrait from '../assets/icons/portrait.png'

export const profile = {
  name: 'Xiang (Amelia) Li',
  short: 'Amelia Li',
  tagline: 'CS & Informatics @ University of Washington',
  roles: ['developer', 'CS + INFO student', 'community builder', 'boba + coffee lover', 'Hamilton enjoyer'],
  portrait,
  intro: [
    "I'm a third-year CS and Informatics student at the University of Washington with a love for building thoughtful, user-centered tech.",
    "I'm a builder of everything from practical tools to wonderfully questionable side projects, and I thrive at the intersection of software engineering and product thinking.",
    "Outside of code, you'll probably catch me rewatching Hamilton or SIX. I firmly believe they make the best background music for working and debugging.",
  ],
  motto: '⚙️ Software Engineering • 💭 Product Thinking • 🧋 Boba Dev Hours',
  links: {
    linkedin: 'https://www.linkedin.com/in/amelial9/',
    github: 'https://github.com/amelial9',
    email: 'mailto:amelial9@uw.edu',
    notes: 'https://notes.ameliali.com/',
    linktree: 'https://linktr.ee/amelial9',
  },
  // RPG-style character sheet shown in the About section and in the game
  sheet: {
    class: 'Builder / Product-brained SWE',
    level: 3,
    levelLabel: 'third year',
    hp: 'boba-powered',
    stats: [
      { key: 'Frontend', val: 88 },
      { key: 'Backend', val: 74 },
      { key: 'Databases / SQL', val: 90 },
      { key: 'ML & data', val: 70 },
      { key: 'Product sense', val: 92 },
      { key: 'Community', val: 95 },
    ],
    inventory: ['🧋 Boba (∞)', '☕ Coffee', '🎧 Hamilton OST', '🐱 Cat cursor', '💻 Laptop w/ stickers'],
    quests: [
      { name: 'Ship watsonx.ai test automation @ IBM', status: 'in progress' },
      { name: 'Teach SQL to 100+ students', status: 'done' },
      { name: 'Decode mouse behavior w/ ML', status: 'in progress' },
      { name: 'Grow Cursor on campus', status: 'done' },
    ],
  },
}
