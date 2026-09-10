import datathon2025 from '../assets/projects/datathon2025.svg'
import voxtune from '../assets/projects/voxtune.svg'
import worthywave from '../assets/projects/worthywave.svg'
import info330 from '../assets/projects/info330.svg'
import mbti from '../assets/projects/mbti.png'
import tempad from '../assets/projects/tempad.png'
import roomio from '../assets/projects/roomio.svg'
import crossly from '../assets/projects/crossly.svg'
import petswipe from '../assets/projects/petswipe.png'

export const devProjects = [
  {
    id: 'crossly',
    title: 'Crossly',
    kicker: 'Full-stack · crossword generator',
    description: 'Interactive full-stack web app built with React and Node.js that generates custom crossword puzzles from user-inputted vocabulary terms and definitions.',
    image: crossly,
    tech: ['React', 'Node.js', 'MongoDB', 'Azure Auth'],
    github: 'https://github.com/info441-sp25/INFO441-Group5-25SP',
    tone: 'sand',
  },
  {
    id: 'datathon',
    title: 'Healthcare Cost Prediction',
    kicker: 'Datathon 2025 · 🥈 ML · 🥉 Data Viz',
    description: 'Machine learning models that predict hospital inpatient mean costs from healthcare data. Second place in Machine Learning and third in Data Visualization.',
    image: datathon2025,
    tech: ['Python', 'Machine Learning', 'Data Viz'],
    github: 'https://github.com/Marc0Guo/NY-Hospital-Analysis',
    presentation: 'https://www.canva.com/design/DAGlxQG7m3g/9873kRtrmPSsXDKxACnhmg/edit',
    tone: 'oat',
  },
  {
    id: 'voxtune',
    title: 'VoxTune',
    kicker: 'Web app · vocal warmups',
    description: 'Interactive vocal warmup web app that lets users upload, organize, and practice vocal exercises.',
    image: voxtune,
    tech: ['React', 'Vite', 'Firebase'],
    github: 'https://github.com/amelial9/VoxTune',
    tone: 'cream',
  },
  {
    id: 'petswipe',
    title: 'PetSwipe',
    kicker: 'iOS · Swift + UIKit',
    description: 'iOS app that helps users discover and match with adoptable pets through a swipe-based interface.',
    image: petswipe,
    tech: ['Swift', 'UIKit', 'Firebase'],
    github: 'https://github.com/wena04/petswipe',
    tone: 'stone',
  },
  {
    id: 'inequality',
    title: 'Global Inequality Insights DB',
    kicker: 'SQL · Azure Data Studio',
    description: 'A database project uncovering relationships between socio-economic factors and environmental impacts.',
    image: info330,
    tech: ['SQL', 'Azure', 'Database Design'],
    presentation: 'https://www.canva.com/design/DAGGWkbMels/81Yor2AAzQsNoCKKK6piFA/view?utm_content=DAGGWkbMels&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h7995c14894',
    tone: 'taupe',
  },
  {
    id: 'mbti',
    title: 'MBTI Recommender',
    kicker: 'R · Shiny · Spotify data',
    description: 'Shiny web app that predicts music preference for different MBTI personality types from Spotify playlist data.',
    image: mbti,
    tech: ['R', 'Shiny', 'Data Viz'],
    github: 'https://github.com/Mayogoose/info201mbti',
    link: 'https://ameli.shinyapps.io/MBTIRecommender/',
    tone: 'sand',
  },
]

export const designProjects = [
  {
    id: 'worthywave',
    title: 'WorthyWave',
    kicker: 'Product design · imposter syndrome',
    description: 'An app concept that helps users overcome the imposter syndrome they may face in academic and career settings.',
    image: worthywave,
    tech: ['Figma', 'UX Research'],
    link: 'https://www.figma.com/proto/dfcCURCTgOwgu8GhGpVg5e/Prototype?node-id=0-1&p=f&viewport=305%2C14%2C0.12&t=49K8XOBMNuuYVynY-0&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2',
    presentation: 'https://www.canva.com/design/DAGhTEfEj0k/YQDKR-zZMzqYL8LdFVvdOw/view?utm_content=DAGhTEfEj0k&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=he381205aa3',
    tone: 'cream',
  },
  {
    id: 'roomio',
    title: 'Room.io',
    kicker: 'WINFO Hackathon 2025',
    description: 'Enhances shared living by simplifying communication and managing chores for roommates.',
    image: roomio,
    tech: ['Figma', 'Prototyping'],
    link: 'https://www.figma.com/proto/pxdgGyPidtwJt02gE6AlmY/Room.io?page-id=0%3A1&node-id=2-7&viewport=-1158%2C-29%2C0.79&t=2gSrBBkpBHyYpcWl-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=2%3A7',
    presentation: 'https://www.figma.com/deck/mJWbmwb01GYAzLrPWBtXLZ/Room.io?node-id=1-310&t=pnmFPYHvKwT7frWs-1',
    tone: 'oat',
  },
  {
    id: 'tempad',
    title: 'TEMPAD 2.0',
    kicker: 'DubsTech Protothon 2024 · Loki-inspired',
    description: 'A time-travel application inspired by the TV series Loki, designed in a two-day protothon.',
    image: tempad,
    tech: ['Figma', 'UI Design'],
    link: 'https://www.figma.com/proto/LwjP9jGd7bmgFA2xF9OAOr/TEMPAD-2.0?node-id=59-106&t=oSMGhQG6OhaQq6dN-1&starting-point-node-id=59%3A106',
    presentation: 'https://www.figma.com/proto/LwjP9jGd7bmgFA2xF9OAOr/TEMPAD-2.0?node-id=34-1356&t=oSMGhQG6OhaQq6dN-1',
    tone: 'stone',
  },
]
