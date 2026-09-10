import friends from '../assets/shelf/friends.jpeg'
import graysAnatomy from '../assets/shelf/graysanatomy.jpg'
import himym from '../assets/shelf/howimetyourmother.jpg'
import loki from '../assets/shelf/loki.jpg'
import siliconValley from '../assets/shelf/siliconvalley.jpg'
import sky from '../assets/shelf/sky.jpg'
import honorOfKings from '../assets/shelf/honorofkings.jpg'
import drawGuess from '../assets/shelf/drawandguess.jpg'
import researchPdf2025 from '../assets/research/Undergrad Research Symposium 2025.pdf'
import researchPdf2026 from '../assets/research/Undergrad Research Symposium 2026.pdf'
import catsDesktop from '../assets/research/cats_desktop.jpg'

export const shows = [
  { title: 'How I Met Your Mother', tone: 'sand', poster: himym, note: 'legen… wait for it' },
  { title: 'Loki', tone: 'mocha', poster: loki, note: 'glorious purpose' },
  { title: "Grey's Anatomy", tone: 'fog', poster: graysAnatomy, note: 'it’s a beautiful day to save lives' },
  { title: 'Friends', tone: 'taupe', poster: friends, note: 'PIVOT' },
  { title: 'Silicon Valley', tone: 'cream', poster: siliconValley, note: 'tabs > spaces' },
]

export const games = [
  { title: 'Sky', art: sky, fit: 'cover', body: '#E7DCC5', playable: true },
  { title: 'Honor of Kings', art: honorOfKings, fit: 'contain', iconBg: '#f3f1ec', body: '#EAD3B6' },
  { title: 'Draw & Guess', art: drawGuess, fit: 'cover', body: '#DFD6C8' },
]

export const research = {
  lab: 'Golden Lab',
  labUrl: 'https://goldenneurolab.com/',
  text: [
    "I'm a Research Assistant at Golden Lab, where I apply machine learning to classify behavior from physiological time-series data. My work focuses on learning behavioral patterns from noisy, real-world biological signals.",
    'The project aims to uncover relationships between physiological dynamics and behavioral states in freely moving animals, with applications in neuroscience and anesthetic state analysis.',
  ],
  posters: [
    { year: 2026, label: '2026 UW Undergraduate Research Symposium', href: researchPdf2026 },
    { year: 2025, label: '2025 UW Undergraduate Research Symposium', href: researchPdf2025 },
  ],
  images: { desktop: catsDesktop },
}
