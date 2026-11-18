export const profile = {
  name: 'Rohinth S',
  role: 'Full Stack Developer',
  location: 'Salem, Tamil Nadu',
  status: 'Open to full-stack roles · Chennai · Hybrid · Remote',
};

export const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rohinths1904', icon: 'linkedin', color: '#0a66c2' },
  { name: 'GitHub', url: 'https://github.com/rohinth375', icon: 'github', color: '#f0f3f8' },
  { name: 'WhatsApp', url: 'https://wa.me/919524707476', icon: 'whatsapp', color: '#25d366' },
  { name: 'Email', url: 'mailto:rohinths.dev@gmail.com', icon: 'email', color: '#ea4335' },
];

export const stats = [
  { value: '1+ yr', label: 'Full-time full-stack development' },
  { value: '4', label: 'Internships across product & engineering' },
  { value: 'MERN', label: 'MongoDB · Express · React · Node' },
  { value: '1K+', label: 'Followers on LinkedIn' },
];

export const skills = [
  {
    group: 'Frontend', file: 'frontend.jsx', icon: 'layout', accent: '#38bdf8', span: 2,
    blurb: 'Interfaces people enjoy using, on every screen size.',
    items: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Responsive Design'],
  },
  {
    group: 'Backend', file: 'server.js', icon: 'server', accent: '#22d3a6',
    blurb: 'Secure APIs and the logic behind them.',
    items: ['Node.js', 'Express.js', 'REST APIs', 'Authentication'],
  },
  {
    group: 'Database', file: 'schema.js', icon: 'database', accent: '#a3e635',
    blurb: 'Data models that stay fast as apps grow.',
    items: ['MongoDB', 'Mongoose', 'Data Modeling'],
  },
  {
    group: 'AI-assisted dev', file: 'prompt.md', icon: 'sparkles', accent: '#a48bff', span: 2,
    blurb: 'AI coding tools that help me ship faster without cutting corners.',
    items: ['Claude Code', 'Claude Design', 'OpenAI Codex', 'Google Antigravity', 'Prompt Engineering'],
  },
  {
    group: 'Tools', file: 'tools.sh', icon: 'wrench', accent: '#f5b84b',
    blurb: 'The everyday workbench.',
    items: ['Git', 'GitHub', 'VS Code', 'Postman'],
  },
  {
    group: 'Deployment', file: 'deploy.yml', icon: 'rocket', accent: '#f472b6', span: 2,
    blurb: 'From git push to a live URL.',
    items: ['Vercel', 'Netlify', 'Render', 'Coolify'],
  },
];

export const experience = [
  {
    title: 'Software Developer', company: 'Trueline Research', when: 'Aug 2025 — Present',
    loc: 'Salem, Tamil Nadu · On-site · Full-time', current: true,
    points: [
      'Build end-to-end web applications on the MERN stack (MongoDB, Express.js, React.js, Node.js).',
      'Design responsive user interfaces with React and Tailwind CSS.',
      'Build secure REST APIs with Node.js and Express, and manage data with MongoDB.',
    ],
  },
  {
    title: 'Software Engineer Intern', company: 'StartNet Ventures', when: 'May 2025 — Jul 2025',
    loc: 'Salem, Tamil Nadu · On-site · Internship',
    points: [
      'Built and styled responsive web pages using HTML, CSS, JavaScript and React.js.',
      'Turned design mockups into working front-end components.',
    ],
  },
  {
    title: 'Full Stack Development Intern', company: 'Cognifyz Technologies', when: 'Mar 2025 — Apr 2025',
    loc: 'Nagpur, Maharashtra · Remote · Internship',
    points: ['Built responsive, scalable full-stack web applications with Node.js and modern front-end tooling.'],
  },
  {
    title: 'Software Development Intern', company: 'Bluestock', when: 'Nov 2024 — Dec 2024',
    loc: 'Remote · Internship',
    points: ['Built web features with HTML, CSS, JavaScript and Node.js.'],
  },
  {
    title: 'Graduate Engineering Trainee', company: 'Nexteer Automotive', when: 'Mar 2024 — Jun 2024',
    loc: 'Full-time',
    points: [
      'Handled purchasing for the Maintenance department, plus maintenance store improvement and management.',
      'Managed revenue and capex budgets, which taught me the business side of engineering decisions.',
    ],
  },
  {
    title: 'Graduate Trainee', company: 'Ashok Leyland (CPPS)', when: 'Nov 2022 — Nov 2023',
    loc: 'Full-time',
    points: [
      'Was responsible for a robotic automation line.',
      'Implemented Kaizens to increase MTBF and reduce MTTR.',
      'Prepared shift schedule charts.',
    ],
  },
];

export const projects = [
  {
    title: 'Trueline Research', url: 'https://truelineresearch.in/', host: 'truelineresearch.in',
    desc: "The company's main website, presenting Trueline's mission of turning multidisciplinary research into real-world impact, along with its services and divisions.",
    tags: ['React', 'Node.js', 'Responsive UI'],
  },
  {
    title: 'Trueline Publisher', url: 'https://truelinepublisher.in/', host: 'truelinepublisher.in',
    desc: 'Website for an international multidisciplinary academic publisher, where researchers and authors find its journals and publishing information.',
    tags: ['React', 'Express', 'MongoDB'],
  },
  {
    title: 'Trueline Spectrum', url: 'https://truelinespectrum.in/', host: 'truelinespectrum.in',
    desc: 'Website for a monthly science and technology magazine, which presents each issue and its articles to readers.',
    tags: ['React', 'Tailwind CSS', 'Content'],
  },
  {
    title: 'JAEID Journal', url: 'https://www.jaeid.com/', host: 'jaeid.com',
    desc: 'Website for the Journal of AI Enabled Innovation and Discovery, an academic journal on AI-driven research and innovation.',
    tags: ['MERN', 'Academic Journal', 'Responsive UI'],
  },
];
