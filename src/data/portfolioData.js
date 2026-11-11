import portraitImage from '../assets/portrait.jpg'
import ghostImage from '../assets/ghost-project.jpg'

export const projects = [
  {
    title: 'Portfolio Website',
    category: 'Frontend Development',
    description:
      'A React and Vite portfolio with scroll-linked portrait motion, a saved theme preference, project filters, and an interactive visual lab.',
    tags: ['React', 'CSS', 'JavaScript'],
    link: 'https://github.com/SameerRajput007/dmn.devfolio',
    image: portraitImage,
  },
  {
    title: 'Todo List App',
    category: 'Web Application',
    description:
      'A task app where visitors can add, edit, complete, and delete tasks. Tasks are saved in the browser between visits.',
    tags: ['React', 'Hooks', 'CSS'],
    link: '#playground', // the live todo app on this page
    image: ghostImage,
  },
  {
    title: 'Interaction Lab',
    category: 'UI Development',
    description:
      'A set of Canvas and CSS portrait studies with particle, dither, CRT, glitch, and flashlight treatments, plus layered image views.',
    tags: ['HTML', 'CSS', 'Responsive'],
    link: '#visual-lab',
    image: ghostImage,
  },
]

export const skills = [
  { name: 'HTML5', level: 'Advanced', percent: 90, category: 'Markup' },
  { name: 'CSS3', level: 'Advanced', percent: 85, category: 'Styling' },
  { name: 'JavaScript', level: 'Intermediate', percent: 70, category: 'Language' },
  { name: 'React.js', level: 'Intermediate', percent: 70, category: 'Framework' },
  { name: 'Responsive Design', level: 'Intermediate', percent: 80, category: 'Design' },
  { name: 'Git & GitHub', level: 'Learning', percent: 60, category: 'Workflow' },
  { name: 'Bootstrap 5', level: 'Learning', percent: 60, category: 'Framework' },
  { name: 'PHP', level: 'Learning', percent: 50, category: 'Language' },
]

export const roles = ['Frontend Developer', 'React Learner', 'UI Builder', 'Problem Solver']
