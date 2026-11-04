import portraitImage from '../assets/portrait.jpg'
import ghostImage from '../assets/ghost-project.jpg'

export const projects = [
  {
    title: 'Portfolio Website',
    category: 'Frontend Development',
    description:
      'A personal portfolio to showcase my skills, projects, and experience with a responsive layout.',
    tags: ['React', 'CSS', 'JavaScript'],
    link: 'https://github.com/SameerRajput007/dmn.devfolio',
    image: portraitImage,
  },
  {
    title: 'Todo List App',
    category: 'Web Application',
    description:
      'A simple task manager that helps users add tasks, mark them complete, and remove them.',
    tags: ['React', 'Hooks', 'CSS'],
    link: '#playground', // the live todo app on this page
    image: ghostImage,
  },
  {
    title: 'Interaction Lab',
    category: 'UI Development',
    description:
      'An interactive portrait study exploring particles, visual treatments, and layered interfaces.',
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
