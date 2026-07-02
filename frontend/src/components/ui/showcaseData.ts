import googleLogo from '../../assets/company-logos/Google.png'
import microsoftLogo from '../../assets/company-logos/microsoft_PNG6.png'
import appleLogo from '../../assets/company-logos/apple.png'
import accentureLogo from '../../assets/company-logos/accenture.png'
import cognizantLogo from '../../assets/company-logos/Cognizant.png'
import uberLogo from '../../assets/company-logos/uber.png'
import ibmLogo from '../../assets/company-logos/ibm.png'
import netflixLogo from '../../assets/company-logos/netflix.png'
import spotifyLogo from '../../assets/company-logos/Spotify.png'
import samsungLogo from '../../assets/company-logos/samsung.png'
import nvidiaLogo from '../../assets/company-logos/nvidia.png'
import amazonLogo from '../../assets/company-logos/amazon.png'
import metaLogo from '../../assets/company-logos/meta.png'
import adobeLogo from '../../assets/company-logos/adobe.png'
import oracleLogo from '../../assets/company-logos/oracle.png'
import infosysLogo from '../../assets/company-logos/infosys.png'
import tcsLogo from '../../assets/company-logos/tcs.png'
import wiproLogo from '../../assets/company-logos/wipro.png'
import globallogicLogo from '../../assets/company-logos/globallogic.png'
import capgeminiLogo from '../../assets/company-logos/Capgemini.png'
import salesforceLogo from '../../assets/company-logos/salesforce.png'
import airbnbLogo from '../../assets/company-logos/airbnb.png'
import stripeLogo from '../../assets/company-logos/stripe.png'

export interface ShowcaseCompany {
  id: string
  company_name: string
  logo: string
  industry: string
  location: string // Headquarters
  company_tagline: string
  verified: boolean
  open_jobs_count: number
  cover_gradient: string
  founded_year: number
  employee_count: string
  company_size: string
  website: string
  linkedin: string
  technologies: string[]
  company_culture: string
  benefits: string[]
  mission: string
  vision: string
  about: string
  hiring_process: string[]
}

export interface ShowcaseJob {
  id: string
  title: string
  company_name: string
  company_logo: string
  salary_range: string
  experience_level: string
  employment_type: string
  work_mode: string // 'Remote' | 'Hybrid' | 'On-site'
  department: string
  team_size: number
  location: string
  posted_time: string
  description: string
  responsibilities: string[]
  requirements: string[]
  nice_to_have: string[]
  benefits: string[]
  skills: string[]
  hiring_process: string[]
  education: string
}

export const showcaseCompanies: ShowcaseCompany[] = [
  {
    id: 'sc-google',
    company_name: 'Google',
    logo: googleLogo,
    industry: 'Search Engines, Cloud Computing, AI, Hardware, Software',
    location: 'Mountain View, CA',
    company_tagline: 'Organize the world\'s information and make it universally accessible.',
    verified: true,
    open_jobs_count: 2,
    cover_gradient: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
    founded_year: 1998,
    employee_count: '150,000+',
    company_size: '10,000+',
    website: 'https://google.com',
    linkedin: 'https://linkedin.com/company/google',
    technologies: ['C++', 'Java', 'Python', 'Go', 'TypeScript'],
    company_culture: 'Open, innovation-focused, employee autonomy, high \'Googliness\' (collaboration, ethics)',
    benefits: ['100% covered health insurance', 'Free gourmet meals & micro-kitchens', 'Generous 401(k) matching', 'On-site gyms and wellness support', 'Flexible hybrid working models'],
    mission: 'To organize the world\'s information and make it universally accessible and useful.',
    vision: 'To provide access to the world\'s information in one click.',
    about: 'Google\'s mission is to organize the world\'s information and make it universally accessible and useful. From Search and Maps to Android and Google Cloud, they build products that improve the lives of billions.',
    hiring_process: ['Resume screening', 'Online coding assessment', '1-2 Technical phone interviews', 'On-site technical interviews (System Design & Coding)', 'Googleyness & Leadership fit round', 'Team matching & offer'],
  },
  {
    id: 'sc-microsoft',
    company_name: 'Microsoft',
    logo: microsoftLogo,
    industry: 'Software, Hardware, Cloud Computing, Personal Computers',
    location: 'Redmond, WA',
    company_tagline: 'Empower every person and every organization on the planet to achieve more.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #00A4EF 0%, #F25022 100%)',
    founded_year: 1975,
    employee_count: '220,000+',
    company_size: '10,000+',
    website: 'https://microsoft.com',
    linkedin: 'https://linkedin.com/company/microsoft',
    technologies: ['C#', '.NET', 'C++', 'TypeScript', 'Azure ecosystem'],
    company_culture: 'Growth mindset, collaborative, diverse, heavily focused on cloud and AI',
    benefits: ['Comprehensive health & life coverage', 'Generous annual training allowance', 'Employee stock purchase program (ESPP)', 'Paid parental leave & family support', 'Hybrid work setup'],
    mission: 'To empower every person and every organization on the planet to achieve more.',
    vision: 'To help people and businesses realize their full potential.',
    about: 'Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Its mission is to empower every person and every organization on the planet to achieve more.',
    hiring_process: ['Application review', 'Technical recruiter call', 'Technical screen (algorithms & coding)', 'Loop interview stage (System design, Architecture, Coding)', 'Hiring manager final discussion'],
  },
  {
    id: 'sc-apple',
    company_name: 'Apple',
    logo: appleLogo,
    industry: 'Consumer Electronics, Software, Services',
    location: 'Cupertino, CA',
    company_tagline: 'Designing the world\'s best personal devices and services.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #1A1A1A 0%, #444444 100%)',
    founded_year: 1976,
    employee_count: '160,000+',
    company_size: '10,000+',
    website: 'https://apple.com',
    linkedin: 'https://linkedin.com/company/apple',
    technologies: ['Swift', 'Objective-C', 'C++', 'Python', 'Internal Tools'],
    company_culture: 'Highly secretive, perfectionist, detail-oriented, product excellence driven',
    benefits: ['Top-tier health, dental & vision plans', 'Discounts on Apple hardware', 'Tuition reimbursement', 'Commuter benefits', 'On-site health clinics'],
    mission: 'To bring the best user experience to customers through innovative hardware, software, and services.',
    vision: 'We believe that we are on the face of the earth to make great products.',
    about: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services. Famous for tight integration of hardware and software.',
    hiring_process: ['Resume evaluation', '1-2 Coding phone screens', 'Deep technical panel round (Coding & Apple Architecture)', 'Design & quality-focused interview', 'VP/Director sign-off'],
  },
  {
    id: 'sc-amazon',
    company_name: 'Amazon',
    logo: amazonLogo,
    industry: 'E-Commerce & Cloud',
    location: 'Seattle, WA',
    company_tagline: 'Earth\'s most customer-centric company.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #FF9900 0%, #146B93 100%)',
    founded_year: 1994,
    employee_count: '1,500,000+',
    company_size: '10,000+',
    website: 'https://amazon.com',
    linkedin: 'https://linkedin.com/company/amazon',
    technologies: ['Java', 'C++', 'Python', 'Rust', 'AWS', 'React', 'Linux'],
    company_culture: 'Driven by our Leadership Principles, we focus on customer obsession, ownership, bias for action, and delivering results. Decisions are analytical and backed by writing narratives.',
    benefits: ['Competitive salary & stock options', 'AWS certification sponsorships', 'Restricted Stock Units (RSUs)', 'Healthcare coverage from day one', 'Career choice training programs'],
    mission: 'To be Earth\'s most customer-centric company, Earth\'s best employer, and Earth\'s safest place to work.',
    vision: 'To build a place where people can come to find and discover anything they might want to buy online.',
    about: 'Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking. Amazon is a leader in retail, cloud infrastructure via AWS, digital streaming, and artificial intelligence.',
    hiring_process: ['Online assessment (Work simulation & Coding)', 'Recruiter consultation', 'Phone interview', 'The Loop (5 rounds focusing on Amazon Leadership Principles & Technical Skills)', 'Bar Raiser review'],
  },
  {
    id: 'sc-meta',
    company_name: 'Meta',
    logo: metaLogo,
    industry: 'Social Technology',
    location: 'Menlo Park, CA',
    company_tagline: 'Giving people the power to build community and bring the world closer together.',
    verified: true,
    open_jobs_count: 0,
    cover_gradient: 'linear-gradient(135deg, #0081FB 0%, #00152B 100%)',
    founded_year: 2004,
    employee_count: '80,000+',
    company_size: '10,000+',
    website: 'https://meta.com',
    linkedin: 'https://linkedin.com/company/meta',
    technologies: ['React', 'React Native', 'PHP', 'Python', 'C++', 'PyTorch', 'Rust'],
    company_culture: 'We encourage engineers to "move fast" and solve impactful problems. Code is deployed daily, and technical teams have huge autonomy.',
    benefits: ['Top medical, dental & vision coverages', 'Wellness and mental health stipends', 'Generous 401(k) matching', 'Meals and transportation services', 'Equity refreshers annually'],
    mission: 'To give people the power to build community and bring the world closer together.',
    vision: 'To help build the metaverse, the next evolution of social connection.',
    about: 'Meta builds technologies that help people connect, find communities, and grow businesses. Moving beyond 2D social screens, Meta is building the future of immersive computing platforms.',
    hiring_process: ['Resume screen', 'Recruiter briefing', '1-2 Technical phone interviews', 'Virtual on-site (2 coding, 1 system design, 1 behavioral)', 'Offer negotiation'],
  },
  {
    id: 'sc-netflix',
    company_name: 'Netflix',
    logo: netflixLogo,
    industry: 'Entertainment, Subscription Streaming, Production',
    location: 'Los Gatos, CA',
    company_tagline: 'Entertaining the world with movies, TV shows, and games.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #E50914 0%, #141414 100%)',
    founded_year: 1997,
    employee_count: '12,000+',
    company_size: '10,000+',
    website: 'https://netflix.com',
    linkedin: 'https://linkedin.com/company/netflix',
    technologies: ['Java', 'JavaScript/Node.js', 'Python', 'AWS'],
    company_culture: 'Freedom and responsibility, stunning colleagues, high density of talent, radical candor',
    benefits: ['Top-of-market cash compensation', 'Open unlimited vacation policy', 'Flexible stock options allocation', 'Full coverage medical & health plans', 'Relocation and housing support'],
    mission: 'To entertain the world with stories that inspire, connect, and thrill.',
    vision: 'To become the best global entertainment distribution service.',
    about: 'Netflix is one of the world\'s leading entertainment services with hundreds of millions of paid memberships in over 190 countries enjoying TV series, documentaries, feature films and mobile games across a wide variety of genres and languages.',
    hiring_process: ['Initial recruiter screen', 'Hiring manager technical interview', 'Technical screen (system design or coding)', 'On-site loops (focusing heavily on freedom & responsibility culture alignment)', 'Director review'],
  },
  {
    id: 'sc-spotify',
    company_name: 'Spotify',
    logo: spotifyLogo,
    industry: 'Audio Streaming, Digital Media, SaaS',
    location: 'Stockholm, Sweden',
    company_tagline: 'Unlock the potential of human creativity.',
    verified: true,
    open_jobs_count: 2,
    cover_gradient: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)',
    founded_year: 2006,
    employee_count: '9,000+',
    company_size: '5,000-10,000',
    website: 'https://spotify.com',
    linkedin: 'https://linkedin.com/company/spotify',
    technologies: ['Java', 'Python', 'C++', 'JavaScript', 'GCP'],
    company_culture: 'Autonomous Squads/Tribes model, playful, innovative, work-from-anywhere',
    benefits: ['Six months of paid parental leave globally', 'Flexible working hours & location options', 'Restricted Stock Units', 'Well-being and counseling apps', 'Learning and growth stipends'],
    mission: 'To unlock the potential of human creativity by giving a million creative artists the opportunity to live off their art.',
    vision: 'A cultural platform where creators can live off their work and billions of fans can enjoy and be inspired by it.',
    about: 'Spotify\'s mission is to unlock the potential of human creativity—by giving a million creative artists the opportunity to live off their art and billions of fans the opportunity to enjoy and be inspired by it.',
    hiring_process: ['Application screening', 'Recruiter call', 'Technical assessment (pair programming)', 'System design & scale discussion', 'Hiring manager & values fit alignment'],
  },
  {
    id: 'sc-adobe',
    company_name: 'Adobe',
    logo: adobeLogo,
    industry: 'Creative Software',
    location: 'San Jose, CA',
    company_tagline: 'Changing the world through digital experiences.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #FF0000 0%, #FF6666 100%)',
    founded_year: 1982,
    employee_count: '28,000+',
    company_size: '10,000+',
    website: 'https://adobe.com',
    linkedin: 'https://linkedin.com/company/adobe',
    technologies: ['C++', 'Java', 'TypeScript', 'Python', 'React', 'AWS', 'WebAssembly'],
    company_culture: 'Genuine, exceptional, innovative, and involved. Adobe is widely recognized for nurturing employee well-being, equality, and high community involvement.',
    benefits: ['Competitive medical plans', 'Annual wellness stipend', 'Employee stock purchase plan (ESPP)', 'Community service matching grant', 'Educational reimbursement'],
    mission: 'To change the world through digital experiences.',
    vision: 'To help creators and enterprises design and deliver exceptional digital journeys.',
    about: 'Adobe is the global leader in digital media and digital marketing solutions. Creative Cloud, Document Cloud, and Experience Cloud empower everyone from individual artists to global brands to create and deliver digital experiences.',
    hiring_process: ['Resume selection', 'Recruiter initial contact', '1-2 Technical interviews', 'Final presentation or coding rounds', 'Hiring manager discussion'],
  },
  {
    id: 'sc-oracle',
    company_name: 'Oracle',
    logo: oracleLogo,
    industry: 'Database & Cloud',
    location: 'Austin, TX',
    company_tagline: 'Transforming businesses with autonomous cloud databases.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #F80000 0%, #1A1A1A 100%)',
    founded_year: 1977,
    employee_count: '140,000+',
    company_size: '10,000+',
    website: 'https://oracle.com',
    linkedin: 'https://linkedin.com/company/oracle',
    technologies: ['Java', 'C', 'PL/SQL', 'Python', 'Docker', 'Kubernetes', 'OCI'],
    company_culture: 'Integrity, mutual respect, and engineering quality are core. We build enterprise-grade database and cloud systems that power global financial networks.',
    benefits: ['Comprehensive health, dental, and vision', 'Employee discount programs', '401(k) retirement matching', 'Professional development courses', 'Flexible office/remote plans'],
    mission: 'To help people see data in new ways, discover insights, unlock endless possibilities.',
    vision: 'To become the premier cloud provider for critical enterprise systems.',
    about: 'Oracle provides organizations around the world with silicon-to-software computing infrastructure and software to help them innovate and become more efficient.',
    hiring_process: ['Online evaluation', 'Recruiter interview', 'Technical screen', 'Panel loops (coding, SQL, system design)', 'Compensation discussion'],
  },
  {
    id: 'sc-ibm',
    company_name: 'IBM',
    logo: ibmLogo,
    industry: 'Enterprise Systems, Cloud Computing, Cognitive Software, Consulting',
    location: 'Armonk, NY',
    company_tagline: 'Be essential.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #006699 0%, #004466 100%)',
    founded_year: 1911,
    employee_count: '280,005+',
    company_size: '10,000+',
    website: 'https://ibm.com',
    linkedin: 'https://linkedin.com/company/ibm',
    technologies: ['Java', 'Python', 'Red Hat OpenShift', 'Go', 'Enterprise Architecture'],
    company_culture: 'Research and development focused, structured, value-driven, legacy of innovation',
    benefits: ['Comprehensive medical, dental, vision', 'Quantum research lab visits', 'Retirement savings plans', 'Mental health support systems', 'Paid volunteer days'],
    mission: 'To lead in the creation, development, and manufacture of the industry\'s most advanced information technologies.',
    vision: 'To make the world work better through smart and trusted technology.',
    about: 'IBM is a global technology and innovation company. It is the largest technology and consulting employer in the world, serving clients in 170 countries, deeply focused on hybrid cloud and AI solutions',
    hiring_process: ['Cognitive capability assessment', 'Recruiter screening', 'Technical validation', 'System design interview', 'Values & final match'],
  },
  {
    id: 'sc-samsung',
    company_name: 'Samsung',
    logo: samsungLogo,
    industry: 'Electronics, Consumer Hardware, Semiconductors',
    location: 'Suwon, Gyeonggi-do, South Korea',
    company_tagline: 'Inspire the world, create the future.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #0A47A3 0%, #032A69 100%)',
    founded_year: 1969,
    employee_count: '287,000+',
    company_size: '10,000+',
    website: 'https://samsung.com',
    linkedin: 'https://linkedin.com/company/samsung-electronics',
    technologies: ['C/C++', 'Java', 'Android development', 'Embedded Software', 'Python'],
    company_culture: 'Result-oriented, speed-to-market, deeply analytical, high corporate accountability',
    benefits: ['Comprehensive premium health plans', 'Samsung product employee purchase discounts', 'Performance-based incentive plans', 'On-site cafeterias and fitness centers', 'Housing and travel allowance'],
    mission: 'We will devote our human resources and technology to create superior products and services, thereby contributing to a better global society.',
    vision: 'Inspire the world with innovative technologies, products, and designs that enrich people\'s lives.',
    about: 'Samsung Electronics is a global leader in technology, opening new possibilities for people everywhere through relentless innovation and discovery across smartphones, TVs, home appliances, and semiconductors.',
    hiring_process: ['Document screening', 'Samsung Global Aptitude Test (GSAT)', 'Technical interview (coding & embedded design)', 'Executive core fit interview'],
  },
  {
    id: 'sc-nvidia',
    company_name: 'NVIDIA',
    logo: nvidiaLogo,
    industry: 'Semiconductors, Artificial Intelligence, Graphics Processors',
    location: 'Santa Clara, CA',
    company_tagline: 'The pioneer of GPU-accelerated computing.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #76B900 0%, #4D7C00 100%)',
    founded_year: 1993,
    employee_count: '26,000+',
    company_size: '10,000+',
    website: 'https://nvidia.com',
    linkedin: 'https://linkedin.com/company/nvidia',
    technologies: ['C++', 'CUDA', 'Python', 'C', 'Deep Learning Frameworks'],
    company_culture: 'Flat hierarchy, high accountability, engineering excellence, intense speed',
    benefits: ['Top-tier health and medical insurance', 'ESP and stock grants', 'Generous 401(k) matching', 'On-site meals & cafes', 'Flexible hybrid schedules'],
    mission: 'To solve the world\'s most challenging computing problems through GPU innovation.',
    vision: 'To build the intelligence engine that powers self-driving cars, supercomputing, and generative AI systems.',
    about: 'NVIDIA pioneered accelerated computing to tackle challenges no one else can solve. Their work in AI and digital twins is transforming the world\'s largest industries and profoundly impacting society.',
    hiring_process: ['Technical phone screening', 'CUDA/Coding live interview', 'On-site panel (3-4 technical loops on GPU architecture & algorithms)', 'Hiring manager final round'],
  },
  {
    id: 'sc-accenture',
    company_name: 'Accenture',
    logo: accentureLogo,
    industry: 'Professional Services, Strategy, Consulting, Technology',
    location: 'Dublin, Ireland',
    company_tagline: 'Deliver on the promise of technology and human ingenuity.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #A200FF 0%, #7000B3 100%)',
    founded_year: 1989,
    employee_count: '738,000+',
    company_size: '10,000+',
    website: 'https://accenture.com',
    linkedin: 'https://linkedin.com/company/accenture',
    technologies: ['Enterprise Platforms (SAP, Oracle, Salesforce)', 'Full Stack', 'Cloud Architectures'],
    company_culture: 'Client-first, professional, expansive networking opportunities, strong delivery framework',
    benefits: ['Employee Share Purchase Plan', 'Comprehensive wellness programs', 'Global consulting exposure', 'Extensive online learning credentials', 'Commuter and travel allowance'],
    mission: 'To deliver high performance by matching consulting expertise with top-tier technical delivery.',
    vision: 'To become the premier trusted partner for digital enterprise transformation.',
    about: 'Accenture is a leading global professional services company, providing a broad range of services and solutions in strategy, consulting, digital, technology and operations.',
    hiring_process: ['Online cognitive & reasoning test', 'Technical coding interview', 'Case study presentation', 'Behavioral assessment', 'Leadership alignment'],
  },
  {
    id: 'sc-cognizant',
    company_name: 'Cognizant',
    logo: cognizantLogo,
    industry: 'IT Services, Digital Engineering, Consulting',
    location: 'Teaneck, NJ',
    company_tagline: 'We engineer modern businesses to improve everyday life.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #003366 0%, #006699 100%)',
    founded_year: 1994,
    employee_count: '350,000+',
    company_size: '10,000+',
    website: 'https://cognizant.com',
    linkedin: 'https://linkedin.com/company/cognizant',
    technologies: ['Java', '.NET', 'Python', 'Angular', 'Cloud Data Platforms'],
    company_culture: 'Client-centric, delivery excellence, collaborative global workforce',
    benefits: ['Flexible health, dental and vision', 'ESP plan and performance bonuses', 'Professional training sponsorships', 'Maternity and paternity leaves', 'Work-from-home allowance'],
    mission: 'We dedicate our technology expertise to help businesses engineer their systems for the next digital decade.',
    vision: 'To be the partner of choice for digital transformations worldwide.',
    about: 'Cognizant engineers modern businesses. They help clients modernize technology, reimagine processes and transform experiences so they can stay ahead in our fast-changing world.',
    hiring_process: ['Aptitude & Coding online exam', 'Technical interview rounds', 'System integration test case review', 'HR and manager discussion'],
  },
  {
    id: 'sc-infosys',
    company_name: 'Infosys',
    logo: infosysLogo,
    industry: 'IT Consulting',
    location: 'Bengaluru, India',
    company_tagline: 'Navigate your next.',
    verified: true,
    open_jobs_count: 0,
    cover_gradient: 'linear-gradient(135deg, #007CC3 0%, #005080 100%)',
    founded_year: 1981,
    employee_count: '340,000+',
    company_size: '10,000+',
    website: 'https://infosys.com',
    linkedin: 'https://linkedin.com/company/infosys',
    technologies: ['Java', '.NET', 'React', 'Angular', 'Python', 'AWS', 'Azure'],
    company_culture: 'Driven by values of Integrity, Customer Focus, Professionalism, and Mutual Respect. We prioritize comprehensive technical training via our global campuses.',
    benefits: ['Company-sponsored health plans', 'Employee stock ownership incentives', 'Continuous learning via Lex platform', 'On-campus recreation centers', 'Maternity support'],
    mission: 'To build a global business consulting and IT services leader that delivers innovative solutions.',
    vision: 'To navigate our clients\' next business challenges through technology.',
    about: 'Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries to navigate their digital transformation, powered by our cloud capabilities and AI-driven cores.',
    hiring_process: ['Online evaluation (math & basic coding)', 'Technical coding round', 'Core system engineering interview', 'HR discussion & offer'],
  },
  {
    id: 'sc-tcs',
    company_name: 'TCS',
    logo: tcsLogo,
    industry: 'IT Consulting & Services',
    location: 'Mumbai, India',
    company_tagline: 'Building on belief.',
    verified: true,
    open_jobs_count: 0,
    cover_gradient: 'linear-gradient(135deg, #0082C9 0%, #004D78 100%)',
    founded_year: 1968,
    employee_count: '615,000+',
    company_size: '10,000+',
    website: 'https://tcs.com',
    linkedin: 'https://linkedin.com/company/tata-consultancy-services',
    technologies: ['Java', 'Python', 'Spring Boot', 'Angular', 'Cloud Technologies', 'Oracle'],
    company_culture: 'Believe in building long-term relationships with clients and employees. We value loyalty, comprehensive training, and digital literacy across all business sectors.',
    benefits: ['Full health & dental insurance', 'Pension benefits and gratuity', 'TCS internal certification rewards', 'Gym memberships and recreation', 'Flexible commute plans'],
    mission: 'To help customers achieve their business objectives by providing innovative, best-in-class consulting, IT solutions, and services.',
    vision: 'To be the premier globally integrated digital consultant.',
    about: 'Tata Consultancy Services is an IT services, consulting, and business solutions organization that has been partnering with many of the world\'s largest businesses in their transformation journeys for over 50 years.',
    hiring_process: ['National Qualifier Test (NQT)', 'Technical interview (coding & algorithms)', 'Managerial case interview', 'HR interview'],
  },
  {
    id: 'sc-wipro',
    company_name: 'Wipro',
    logo: wiproLogo,
    industry: 'Consulting & IT Services',
    location: 'Bengaluru, India',
    company_tagline: 'Spirit of Wipro.',
    verified: true,
    open_jobs_count: 0,
    cover_gradient: 'linear-gradient(135deg, #FFA500 0%, #0A69D9 100%)',
    founded_year: 1945,
    employee_count: '250,000+',
    company_size: '10,000+',
    website: 'https://wipro.com',
    linkedin: 'https://linkedin.com/company/wipro',
    technologies: ['React', 'Node.js', 'Java', 'Salesforce', 'Azure', 'Python', 'Kubernetes'],
    company_culture: 'Be passionate about client success, be global and responsible, and respect every individual. We run large-scale community welfare programs.',
    benefits: ['Flexible medical insurance plans', 'Employee stock plans', 'Training opportunities via Wipro Academy', 'Work-life balance wellness programs', 'Travel assistance'],
    mission: 'To provide enterprise services that help businesses innovate and perform at their peak.',
    vision: 'To enable a modern digital business landscape through technology and human expertise.',
    about: 'Wipro Limited is a leading technology services and consulting company focused on building innovative solutions that address clients\' most complex digital transformation needs.',
    hiring_process: ['Online coding test', 'Technical screening interview', 'Client scenario engineering round', 'HR/Manager round'],
  },
  {
    id: 'sc-globallogic',
    company_name: 'GlobalLogic',
    logo: globallogicLogo,
    industry: 'Digital Product Engineering',
    location: 'San Jose, CA',
    company_tagline: 'Engineering digital products for the future.',
    verified: true,
    open_jobs_count: 0,
    cover_gradient: 'linear-gradient(135deg, #EA5C2B 0%, #9E2A00 100%)',
    founded_year: 2000,
    employee_count: '30,000+',
    company_size: '10,000+',
    website: 'https://globallogic.com',
    linkedin: 'https://linkedin.com/company/globallogic',
    technologies: ['C++', 'Qt', 'React', 'Embedded C', 'Java', 'AWS', 'Docker'],
    company_culture: 'Innovation, speed, and cross-border engineering collaboration define us. We design user-centric digital products for major automotive and medical industries.',
    benefits: ['Comprehensive medical plans', 'Annual certification bonus', 'Flexible working models', 'Wellness and fitness support', 'Commuter subsidies'],
    mission: 'To help brands design, build, and deploy modern digital products and software experiences.',
    vision: 'To be the global product engineering partner of choice.',
    about: 'GlobalLogic, a Hitachi Group Company, is a leader in digital product engineering. We help our clients design and build innovative products, platforms, and digital experiences for the modern world.',
    hiring_process: ['Technical screening call', 'Coding test or portfolio review', 'Design panel round', 'Hiring manager final fitment'],
  },
  {
    id: 'sc-capgemini',
    company_name: 'Capgemini',
    logo: capgeminiLogo,
    industry: 'Consulting & Technology',
    location: 'Paris, France',
    company_tagline: 'Get the future you want.',
    verified: true,
    open_jobs_count: 0,
    cover_gradient: 'linear-gradient(135deg, #0070AD 0%, #002844 100%)',
    founded_year: 1967,
    employee_count: '360,500+',
    company_size: '10,000+',
    website: 'https://capgemini.com',
    linkedin: 'https://linkedin.com/company/capgemini',
    technologies: ['Java', 'Angular', 'React', 'Salesforce', 'Cloud Infrastructure', 'Python'],
    company_culture: 'Multicultural, inclusive, with strong ethical principles — Honesty, Boldness, and Trust guide every team and every client engagement worldwide.',
    benefits: ['Comprehensive health coverage', 'Employee stock ownership plan', 'Diverse training pathways', 'Flexible workspace arrangements', 'Commuting allowance'],
    mission: 'To help organizations grow through technology and business transformation.',
    vision: 'To deliver value by harnessing human energy through technology for an inclusive and sustainable future.',
    about: 'Capgemini is a global leader in partnering with companies to transform and manage their business by harnessing the power of technology. It is a multicultural organization responsible for unleashing human energy through technology for an inclusive and sustainable future.',
    hiring_process: ['Aptitude & logical test', 'Technical coding interview', 'Project scenario presentation', 'Executive fit interview'],
  },
  {
    id: 'sc-salesforce',
    company_name: 'Salesforce',
    logo: salesforceLogo,
    industry: 'Enterprise Software, CRM, SaaS',
    location: 'San Francisco, CA',
    company_tagline: 'The global leader in CRM and enterprise cloud applications.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #00A1E0 0%, #004D73 100%)',
    founded_year: 1999,
    employee_count: '79,000+',
    company_size: '10,000+',
    website: 'https://salesforce.com',
    linkedin: 'https://linkedin.com/company/salesforce',
    technologies: ['Apex', 'Visualforce', 'Java', 'JavaScript', 'Python'],
    company_culture: 'Ohana culture (family, trust, inclusivity), highly philanthropic, collaborative',
    benefits: ['Premium healthcare plans', '1-1-1 Philanthropy model (time, equity, product)', 'Annual health & wellness stipend', 'Employee stock purchase program', 'Flexible hybrid schedule'],
    mission: 'To bring companies and customers together in the digital age through the world\'s #1 CRM platform.',
    vision: 'To empower businesses of every size to achieve digital customer success.',
    about: 'Salesforce is the global leader in Customer Relationship Management (CRM), bringing companies and customers together in the digital age. Their integrated CRM platform, Customer 360, gives all departments a single, shared view of every customer.',
    hiring_process: ['Recruiter phone screen', 'Technical code challenge', 'Panel presentation (Coding, System Design)', 'Manager values-alignment interview'],
  },
  {
    id: 'sc-uber',
    company_name: 'Uber',
    logo: uberLogo,
    industry: 'Mobility, Logistics, Delivery, Autonomous Technology',
    location: 'San Francisco, CA',
    company_tagline: 'We ignite opportunity by setting the world in motion.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #000000 0%, #444444 100%)',
    founded_year: 2009,
    employee_count: '32,000+',
    company_size: '10,000+',
    website: 'https://uber.com',
    linkedin: 'https://linkedin.com/company/uber',
    technologies: ['Go', 'Java', 'Python', 'Node.js', 'Microservices architecture'],
    company_culture: 'Go-getters, data-driven, customer-obsessed, fast executing',
    benefits: ['Competitive stock options and refreshers', 'Monthly Uber credits for rides and food', 'Fully covered top-tier health benefits', 'On-site lunch and dinner catering', 'Flexible hybrid office working'],
    mission: 'To ignite opportunity by setting the world in motion.',
    vision: 'Provide seamless, reliable, and accessible transport and logistics for everyone, everywhere.',
    about: 'Uber\'s mission is to ignite opportunity by setting the world in motion. They reimagine the way the world moves for the better, shifting from ridesharing to food delivery, freight transport, and urban mobility.',
    hiring_process: ['Recruiter check-in', '1-2 Technical phone interviews', 'Virtual on-site (2 coding, 1 system design, 1 architecture review, 1 manager behavioral)', 'Final decision'],
  },
  {
    id: 'sc-airbnb',
    company_name: 'Airbnb',
    logo: airbnbLogo,
    industry: 'Hospitality, Travel Technology, Marketplace',
    location: 'San Francisco, CA',
    company_tagline: 'Belong anywhere.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #FF5A5F 0%, #A6161C 100%)',
    founded_year: 2008,
    employee_count: '6,000+',
    company_size: '5,000-10,000',
    website: 'https://airbnb.com',
    linkedin: 'https://linkedin.com/company/airbnb',
    technologies: ['Ruby on Rails', 'React', 'Java', 'Kotlin', 'Swift'],
    company_culture: 'Design-led, highly creative, hospitality-driven, work-from-anywhere flexibility',
    benefits: ['Annual travel credits for Airbnb bookings', 'Full medical and family healthcare plans', 'Equity stock options matching', 'Creative learning budget', '100% remote working flexibility'],
    mission: 'To create a world where anyone can belong anywhere.',
    vision: 'A world where travel connects people on a deeply human level.',
    about: 'Airbnb operates an online marketplace for lodging, primarily homestays for vacation rentals, and tourism activities. Driven by the mission to create a world where anyone can belong anywhere.',
    hiring_process: ['Technical phone interview', 'Frontend/Full-stack coding assessment', 'On-site loops (coding, system design, architectural review)', 'Core Values cultural round'],
  },
  {
    id: 'sc-stripe',
    company_name: 'Stripe',
    logo: stripeLogo,
    industry: 'Financial Infrastructure',
    location: 'San Francisco, CA',
    company_tagline: 'Financial infrastructure for the internet.',
    verified: true,
    open_jobs_count: 1,
    cover_gradient: 'linear-gradient(135deg, #635BFF 0%, #0A2540 100%)',
    founded_year: 2010,
    employee_count: '8,000+',
    company_size: '5,000-10,000',
    website: 'https://stripe.com',
    linkedin: 'https://linkedin.com/company/stripe',
    technologies: ['Ruby', 'Go', 'Scala', 'React', 'TypeScript', 'AWS', 'Kubernetes'],
    company_culture: 'Stripe operates with high intellectual rigor, prioritizing clear writing, technical depth, and building elegant, developer-first payment APIs.',
    benefits: ['Top-tier medical, dental, vision plans', 'Home office setup stipend', 'Generous retirement 401(k) matching', 'Educational learning support budget', 'Hybrid and remote options'],
    mission: 'To increase the GDP of the internet.',
    vision: 'To build the economic infrastructure that enables online commerce globally.',
    about: 'Stripe is a financial infrastructure platform for the internet. Millions of businesses, from startups to large enterprises, use Stripe to accept payments, grow revenue, and facilitate online business models.',
    hiring_process: ['Recruiter introductory call', 'Technical debugging assessment', 'Technical system integration design', 'On-site loop (coding, design, behavioral)', 'Offer proposal'],
  },
]

export const showcaseJobs: ShowcaseJob[] = [
  {
    id: 'sj-senior-react',
    title: 'Senior React Developer',
    company_name: 'Spotify',
    company_logo: spotifyLogo,
    salary_range: '$150,000 - $185,000',
    experience_level: 'Senior',
    employment_type: 'Full-time',
    work_mode: 'Remote',
    department: 'Engineering - Web Platform',
    team_size: 8,
    location: 'New York, NY',
    posted_time: '2 hours ago',
    description: 'We are seeking a Senior React Developer to lead the engineering of our web streaming client. You will build highly responsive interfaces, optimize audio player playback systems, and set guidelines for design system adoption across all web squads.',
    responsibilities: [
      'Architect and build modular React components for our primary web streaming interface.',
      'Optimize web application performance to ensure seamless audio playback and transition latency.',
      'Mentor mid-level developers and conduct code reviews for high-quality TypeScript engineering.',
      'Collaborate with Product Designers to refine design tokens and implement responsive UI components.'
    ],
    requirements: [
      '5+ years of commercial frontend engineering experience.',
      'Expert knowledge of React, modern state management (Zustand/Redux), and TypeScript.',
      'Proven experience optimizing Webpack/Vite build pipelines and code-splitting.',
      'Strong communication skills and comfort working in async/sync environments.'
    ],
    nice_to_have: [
      'Experience with Web Audio APIs or streaming protocols.',
      'Familiarity with monorepos (Turborepo/Nx).',
      'Contributions to open-source UI libraries.'
    ],
    benefits: [
      'Top-tier medical, dental, and vision insurance',
      'Six months of paid parental leave',
      'Flexible home office setup stipend',
      'Restricted Stock Units (RSUs) package',
      'Unlimited paid time off'
    ],
    skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Zustand', 'Web Audio API'],
    hiring_process: [
      'Recruiter introductory check-in (30 min)',
      'Frontend coding pair assessment (60 min)',
      'System design & web architecture round (60 min)',
      'Hiring Manager & values alignment discussion (45 min)'
    ],
    education: 'Bachelor\'s Degree in Computer Science or equivalent practical experience',
  },
  {
    id: 'sj-frontend-dev',
    title: 'Frontend Developer',
    company_name: 'Cognizant',
    company_logo: cognizantLogo,
    salary_range: '$105,000 - $135,000',
    experience_level: 'Mid-level',
    employment_type: 'Full-time',
    work_mode: 'Hybrid',
    department: 'Digital Business Practice',
    team_size: 12,
    location: 'Teaneck, NJ',
    posted_time: 'Yesterday',
    description: 'Join our Digital Consulting team to build outstanding web applications for our enterprise SaaS customers. You will work directly with clients to translate business requirements into clean, performant, and accessible React interfaces.',
    responsibilities: [
      'Develop client-side features for modern web applications using React and TailwindCSS.',
      'Integrate REST APIs and coordinate data synchronization using TanStack Query.',
      'Ensure web pages are highly responsive and conform to WCAG AA accessibility standards.'
    ],
    requirements: [
      '3+ years of professional web development experience.',
      'Solid command of JavaScript, CSS, HTML, and React.',
      'Familiarity with Git workflows and package managers (npm/yarn).'
    ],
    nice_to_have: [
      'Experience with UI testing frameworks (Cypress/Jest).',
      'Basic knowledge of Node.js and backend integrations.',
      'Experience working in client-facing consulting setups.'
    ],
    benefits: [
      'Comprehensive health insurance plans',
      'Annual performance bonus',
      'Professional training certification sponsorship',
      'Employee stock purchase plan',
      'Commuter assistance'
    ],
    skills: ['React', 'TypeScript', 'TailwindCSS', 'REST APIs', 'TanStack Query'],
    hiring_process: [
      'Aptitude & basic programming assessment (online)',
      'Technical coding & logic interview (60 min)',
      'Hiring Manager discussion & salary fit (45 min)'
    ],
    education: 'Bachelor\'s Degree in Computer Science, IT, or related field',
  },
  {
    id: 'sj-backend-dev',
    title: 'Backend Developer',
    company_name: 'IBM',
    company_logo: ibmLogo,
    salary_range: '$125,000 - $160,000',
    experience_level: 'Mid-level',
    employment_type: 'Full-time',
    work_mode: 'On-site',
    department: 'Cloud Platform Infrastructure',
    team_size: 10,
    location: 'Armonk, NY',
    posted_time: '3 days ago',
    description: 'We are looking for a Backend Developer to build scalable APIs and microservices for IBM Cloud platform infrastructure. You will manage high-performance data systems and secure distributed workloads.',
    responsibilities: [
      'Design, implement, and maintain high-performance REST and gRPC backend APIs.',
      'Optimize database queries and schema designs in MongoDB and PostgreSQL.',
      'Configure Docker containers and orchestrate microservices using Kubernetes.'
    ],
    requirements: [
      '3+ years of professional backend development experience.',
      'Strong expertise in Java or Go, including Spring Boot frameworks.',
      'Solid understanding of SQL, NoSQL, and relational database design principles.'
    ],
    nice_to_have: [
      'Experience with RedHat OpenShift.',
      'Familiarity with message queues (Kafka, RabbitMQ).',
      'Experience building cloud-native SaaS systems.'
    ],
    benefits: [
      'Health, dental, and vision premium coverage',
      'Quantum lab visitor pass & research exposure',
      'Retirement savings plan matching',
      'Work-from-home device allowance',
      'Paid volunteer and community days'
    ],
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'MongoDB', 'Go', 'gRPC'],
    hiring_process: [
      'Cognitive aptitude evaluation (online)',
      'Technical coding & backend architecture interview (60 min)',
      'Microservices design panel interview (60 min)',
      'Managerial cultural match (45 min)'
    ],
    education: 'Bachelor\'s or Master\'s Degree in Computer Science or similar technical field',
  },
  {
    id: 'sj-python-dev',
    title: 'Python Developer',
    company_name: 'Netflix',
    company_logo: netflixLogo,
    salary_range: '$160,000 - $210,000',
    experience_level: 'Senior',
    employment_type: 'Full-time',
    work_mode: 'Hybrid',
    department: 'Streaming Personalization Group',
    team_size: 6,
    location: 'Los Gatos, CA',
    posted_time: 'Yesterday',
    description: 'Join Netflix to engineer the high-performance backend pipelines that power our global personalization algorithms. You will build and scale Python microservices serving millions of requests per second.',
    responsibilities: [
      'Build robust APIs and microservices using Python (FastAPI/Django) and Redis.',
      'Implement real-time data pipelines feeding streaming recommendation filters.',
      'Optimize application latency and throughput at massive scales.'
    ],
    requirements: [
      '5+ years of professional experience building backend systems in Python.',
      'Deep understanding of asynchronous programming and concurrency in Python.',
      'Experience with distributed datastores and caching layers (Redis, Cassandra).'
    ],
    nice_to_have: [
      'Familiarity with Apache Kafka or Spark.',
      'Experience running containerized services on AWS infrastructure.',
      'Understanding of machine learning pipeline orchestration.'
    ],
    benefits: [
      'Top-of-market base salary compensation',
      'Flexible vacation policy',
      'Restricted Stock Units allocation program',
      'Comprehensive health coverage',
      'Housing/Relocation stipend'
    ],
    skills: ['Python', 'Django', 'FastAPI', 'Redis', 'AWS', 'Cassandra'],
    hiring_process: [
      'Recruiter introductory conversation (30 min)',
      'Technical phone screen (60 min)',
      'System design & scale loop (60 min)',
      'Freedom & responsibility cultural fit interviews (2x 45 min)'
    ],
    education: 'Degree in Computer Science, Software Engineering or equivalent experience',
  },
  {
    id: 'sj-fullstack-dev',
    title: 'Full Stack Developer',
    company_name: 'Uber',
    company_logo: uberLogo,
    salary_range: '$140,000 - $175,000',
    experience_level: 'Mid-Senior',
    employment_type: 'Full-time',
    work_mode: 'Hybrid',
    department: 'Rider Experience Team',
    team_size: 9,
    location: 'San Francisco, CA',
    posted_time: '1 day ago',
    description: 'We are seeking a Full Stack Developer to build rider-facing dashboard portals. You will build fluid web interfaces and scale backend systems orchestrating payment and dispatch integrations.',
    responsibilities: [
      'Build and maintain responsive React web apps and developer dashboards.',
      'Implement high-throughput backend services in Go and Node.js.',
      'Integrate with distributed queues and real-time mapping databases.'
    ],
    requirements: [
      '4+ years of professional software development experience.',
      'Proficiency in React (TypeScript) and Go (Golang) or Node.js.',
      'Experience designing database schemas and managing PostgreSQL instances.'
    ],
    nice_to_have: [
      'Experience with WebSockets or real-time event streaming.',
      'Familiarity with ride-hailing or logistics product domains.',
      'Knowledge of Docker containerization.'
    ],
    benefits: [
      'Uber ride credits and monthly meal credits',
      'Equity options package with annual refreshers',
      'Complete health, dental, and vision insurance',
      'In-office gym and catered lunches',
      'Flexible time-off policies'
    ],
    skills: ['Go', 'React', 'Node.js', 'PostgreSQL', 'TypeScript', 'WebSockets'],
    hiring_process: [
      'Recruiter call (30 min)',
      'Technical live programming phone screen (60 min)',
      'Full-stack on-site loop (coding, system design, architecture)',
      'Managerial and values-alignment round (45 min)'
    ],
    education: 'Bachelor\'s Degree in Computer Science or related fields',
  },
  {
    id: 'sj-software-eng',
    title: 'Software Engineer',
    company_name: 'Samsung',
    company_logo: samsungLogo,
    salary_range: '$120,000 - $155,000',
    experience_level: 'Mid-level',
    employment_type: 'Full-time',
    work_mode: 'On-site',
    department: 'Mobile R&D Group',
    team_size: 15,
    location: 'Suwon, South Korea',
    posted_time: '1 week ago',
    description: 'Join Samsung Mobile R&D to develop embedded applications and optimize Android system performance. You will write code that runs directly on billions of smart devices.',
    responsibilities: [
      'Develop embedded system software and kernel-level drivers in C++ and C.',
      'Optimize operating system memory footprint and battery efficiency.',
      'Collaborate with hardware designers to validate system integration.'
    ],
    requirements: [
      '3+ years of professional experience in embedded C/C++ development.',
      'Solid understanding of Linux operating system internals and RTOS.',
      'Experience writing low-level drivers and working with hardware debuggers.'
    ],
    nice_to_have: [
      'Familiarity with Android HAL or Android NDK development.',
      'Knowledge of arm assembly or processor architectures.',
      'Experience in wireless communications protocols (Bluetooth/WiFi).'
    ],
    benefits: [
      'Competitive base salary + performance bonuses',
      'Samsung product purchase discount programs',
      'Comprehensive medical insurance plans',
      'On-site health clinic, cafe, and fitness',
      'Commute and travel allowances'
    ],
    skills: ['C++', 'Embedded Systems', 'RTOS', 'Linux', 'C', 'Android NDK'],
    hiring_process: [
      'Document and portfolio evaluation',
      'Samsung Global Aptitude Test (GSAT)',
      'Technical code challenge & design check (90 min)',
      'Executive board fit round (45 min)'
    ],
    education: 'Bachelor\'s or Master\'s Degree in Computer Engineering, Electrical Engineering, or similar',
  },
  {
    id: 'sj-ai-eng',
    title: 'AI Engineer',
    company_name: 'NVIDIA',
    company_logo: nvidiaLogo,
    salary_range: '$180,000 - $240,000',
    experience_level: 'Senior',
    employment_type: 'Full-time',
    work_mode: 'Hybrid',
    department: 'Autonomous Driving & AI Systems',
    team_size: 7,
    location: 'Santa Clara, CA',
    posted_time: '3 days ago',
    description: 'We are seeking an AI Engineer to develop next-generation neural networks for autonomous vehicle processing. You will optimize neural model execution using NVIDIA TensorRT and CUDA compiler tools.',
    responsibilities: [
      'Design, train, and validate neural networks in PyTorch for computer vision tasks.',
      'Optimize AI model inference speeds to execute real-time on DRIVE hardware.',
      'Write highly parallelized kernels in CUDA C++ for custom neural network layers.'
    ],
    requirements: [
      '5+ years of experience training and deploying deep learning models.',
      'Expert proficiency in Python and C++.',
      'Direct hands-on experience with CUDA programming and GPU architectures.'
    ],
    nice_to_have: [
      'Publications in top AI conferences (CVPR, NeurIPS, ICCV).',
      'Experience with Autonomous Driving datasets and simulation platforms.',
      'Familiarity with PyTorch TensorRT integration.'
    ],
    benefits: [
      'Comprehensive high-tier medical plans',
      'Restricted Stock Units and ESPP matching',
      'Annual performance incentives',
      'On-site meals, gym, and wellness events',
      'Hybrid work flexibility'
    ],
    skills: ['Python', 'PyTorch', 'CUDA', 'LLMs', 'C++', 'TensorRT'],
    hiring_process: [
      'Recruiter initial screen (30 min)',
      'Technical telephone coding screen (60 min)',
      'CUDA architecture & live parallel coding round (60 min)',
      'System design loop (System Architecture & ML pipelines, 2x 60 min)',
      'Hiring Manager final round (45 min)'
    ],
    education: 'Master\'s or Ph.D. in Computer Science, AI, Robotics, or related fields',
  },
  {
    id: 'sj-ml-eng',
    title: 'Machine Learning Engineer',
    company_name: 'Apple',
    company_logo: appleLogo,
    salary_range: '$170,000 - $220,000',
    experience_level: 'Mid-Senior',
    employment_type: 'Full-time',
    work_mode: 'Hybrid',
    department: 'Siri & Language Technologies',
    team_size: 8,
    location: 'Cupertino, CA',
    posted_time: '4 days ago',
    description: 'Join Siri\'s Natural Language team to build conversational AI models running on the edge. You will train high-performance language models and compile them to execute efficiently on Apple Silicon Neural Engines.',
    responsibilities: [
      'Develop, train, and evaluate NLP and LLM systems for smart assistants.',
      'Optimize and compress model parameters using quantization and pruning techniques.',
      'Integrate machine learning pipelines into Swift/CoreML execution runtimes.'
    ],
    requirements: [
      '4+ years of professional experience as an ML Engineer.',
      'Strong command of Python, PyTorch/TensorFlow, and ML algorithms.',
      'Experience optimizing neural networks for mobile/edge hardware deployment.'
    ],
    nice_to_have: [
      'Familiarity with Swift or Objective-C.',
      'Experience compiling models for Apple Silicon Neural Engines.',
      'Deep understanding of on-device neural model quantization.'
    ],
    benefits: [
      'Excellent health, dental, and vision insurance',
      'Discounts on Apple devices & merchandise',
      'Equity stock grants and ESPP',
      'On-site health clinics and wellness centers',
      'Flexible hybrid schedule'
    ],
    skills: ['Python', 'TensorFlow', 'CoreML', 'NLP', 'Computer Vision', 'PyTorch'],
    hiring_process: [
      'Recruiter screening call (30 min)',
      'Technical programming phone screen (60 min)',
      'Edge compiling & model optimization loop (60 min)',
      'NLP System design panel interview (60 min)',
      'VP cultural & engineering alignment round (45 min)'
    ],
    education: 'Bachelor\'s or Master\'s Degree in Computer Science, Mathematics, Data Science or related',
  },
  {
    id: 'sj-devops-eng',
    title: 'DevOps Engineer',
    company_name: 'Microsoft',
    company_logo: microsoftLogo,
    salary_range: '$145,000 - $180,000',
    experience_level: 'Senior',
    employment_type: 'Full-time',
    work_mode: 'Hybrid',
    department: 'Azure Developer Tools',
    team_size: 11,
    location: 'Redmond, WA',
    posted_time: '5 days ago',
    description: 'We are seeking a DevOps Engineer to build secure, automated CI/CD pathways for Azure Developer Tools. You will manage cloud infrastructure, optimize telemetry collectors, and secure release workflows.',
    responsibilities: [
      'Design and manage declarative infrastructure configurations in Azure using Terraform.',
      'Build and secure automated CI/CD workflows using GitHub Actions and Azure DevOps.',
      'Implement real-time alerting systems, dashboards, and distributed log aggregators.'
    ],
    requirements: [
      '5+ years of experience as a DevOps or Site Reliability Engineer.',
      'Expertise in Azure cloud systems and services.',
      'Strong scripting skills (Bash, Python, or PowerShell).'
    ],
    nice_to_have: [
      'Azure Administrator or DevOps Solutions Architect certifications.',
      'Experience managing large-scale Kubernetes clusters.',
      'Understanding of security compliance policies (SOC2/ISO).'
    ],
    benefits: [
      'Full health, dental, vision plans',
      'Generous learning and training allowance',
      'Employee stock grants (ESPP)',
      'Paid parental leaves',
      'Hybrid work setup'
    ],
    skills: ['Azure', 'CI/CD', 'GitHub Actions', 'Terraform', 'Docker', 'Kubernetes'],
    hiring_process: [
      'Recruiter call (30 min)',
      'Online systems architecture test (60 min)',
      'Technical live scripting & cloud design screen (60 min)',
      'On-site DevOps loops (Infrastructure scale, CI/CD, scripting)',
      'Manager final review'
    ],
    education: 'Degree in Computer Science, IT, or equivalent experience',
  },
  {
    id: 'sj-cloud-eng',
    title: 'Cloud Engineer',
    company_name: 'Google',
    company_logo: googleLogo,
    salary_range: '$135,000 - $165,000',
    experience_level: 'Mid-level',
    employment_type: 'Full-time',
    work_mode: 'Hybrid',
    department: 'Google Cloud Platform (GCP) Solutions',
    team_size: 10,
    location: 'Mountain View, CA',
    posted_time: '2 days ago',
    description: 'Join our Google Cloud Platform team to design scalable, secure cloud landing zones for enterprise SaaS architectures. You will write Terraform modules and orchestrate containerized services.',
    responsibilities: [
      'Provision scalable GCP infrastructure (GKE, VPC, Cloud SQL) using Terraform.',
      'Deploy and maintain containerized applications inside Kubernetes clusters.',
      'Build telemetry dashboards, alerts, and automate network routing tasks.'
    ],
    requirements: [
      '3+ years of experience in Cloud Engineering or System Operations.',
      'Solid command of Google Cloud Platform (GCP) and service architectures.',
      'Hands-on experience writing Terraform infrastructure configurations.'
    ],
    nice_to_have: [
      'Google Cloud Certified Associate Cloud Engineer or Professional Architect.',
      'Experience managing multi-region databases.',
      'Proficiency in writing automation scripts in Go or Python.'
    ],
    benefits: [
      'Top-tier health, dental, vision coverage',
      'Free meals and on-site micro-kitchens',
      'Generous retirement matching',
      'Wellness stipends and gym access',
      'Hybrid working setup'
    ],
    skills: ['GCP', 'Kubernetes', 'Terraform', 'Docker', 'Helm', 'Prometheus'],
    hiring_process: [
      'Recruiter phone call (30 min)',
      'Technical phone interview (coding/scripting, 60 min)',
      'GCP Infrastructure and scale design round (60 min)',
      'Geyness & Leadership fit round (45 min)'
    ],
    education: 'Bachelor\'s Degree in Computer Science, engineering, or related field',
  },
  {
    id: 'sj-cyber-security',
    title: 'Cyber Security Engineer',
    company_name: 'Accenture',
    company_logo: accentureLogo,
    salary_range: '$130,000 - $170,000',
    experience_level: 'Senior',
    employment_type: 'Full-time',
    work_mode: 'Remote',
    department: 'Accenture Security Operations',
    team_size: 8,
    location: 'Chicago, IL',
    posted_time: '6 days ago',
    description: 'We are seeking a Cyber Security Engineer to perform vulnerability testing and design secure network architectures for our enterprise client platforms. You will establish SIEM analytics and secure OAuth flows.',
    responsibilities: [
      'Conduct penetration testing and security audits of cloud application endpoints.',
      'Configure SIEM systems and analyze traffic anomalies in real-time.',
      'Collaborate with developers to remediate secure coding vulnerability findings.'
    ],
    requirements: [
      '5+ years of experience in Cyber Security Engineering or Penetration Testing.',
      'Experience securing cloud environments (AWS, Azure, or GCP).',
      'Deep understanding of OAuth, SAML, and API security mechanisms.'
    ],
    nice_to_have: [
      'CISSP, CEH, or OSCP security certifications.',
      'Experience writing custom security scanners in Go or Python.',
      'Understanding of DevSecOps automated container scanning.'
    ],
    benefits: [
      'Employee stock purchase plan (ESPP)',
      'Comprehensive family medical coverage',
      'Worldwide security consulting projects exposure',
      'Paid certification fees reimbursement',
      'Travel subsidies'
    ],
    skills: ['Penetration Testing', 'SIEM', 'OAuth', 'Cloud Security', 'SAML', 'Kali Linux'],
    hiring_process: [
      'Online security reasoning test (60 min)',
      'Technical security analysis & scenario interview (60 min)',
      'Client scenario penetration testing review (60 min)',
      'HR fitment discussion (45 min)'
    ],
    education: 'Bachelor\'s Degree in Cyber Security, Computer Science, or similar',
  },
  {
    id: 'sj-data-analyst',
    title: 'Data Analyst',
    company_name: 'Spotify',
    company_logo: spotifyLogo,
    salary_range: '$95,000 - $125,000',
    experience_level: 'Junior-Mid',
    employment_type: 'Full-time',
    work_mode: 'Remote',
    department: 'Product Insights - Podcast Group',
    team_size: 7,
    location: 'New York, NY',
    posted_time: 'Today',
    description: 'We are looking for a Data Analyst to join the Podcast Product team. You will run SQL queries, compile business intelligence reports, and design A/B testing evaluations to optimize listener conversion.',
    responsibilities: [
      'Query large datasets using BigQuery SQL to extract product usage patterns.',
      'Build and maintain interactive Tableau charts and dashboards.',
      'Design A/B testing metrics and evaluate statistical experimental outcomes.'
    ],
    requirements: [
      '2+ years of professional experience as a Data Analyst or Business Analyst.',
      'Advanced proficiency writing SQL queries.',
      'Solid understanding of statistical analysis (A/B testing, hypothesis testing).'
    ],
    nice_to_have: [
      'Basic scripting experience in Python (Pandas/NumPy).',
      'Familiarity with data warehouses (BigQuery/Snowflake).',
      'Experience working inside product engineering organizations.'
    ],
    benefits: [
      'Paid health, dental, and vision insurance',
      'Flexible working arrangements',
      'RSUs matching program',
      'Growth and online learning budgets',
      'Wellness and fitness app access'
    ],
    skills: ['SQL', 'Python', 'Tableau', 'BigQuery', 'A/B Testing', 'Statistics'],
    hiring_process: [
      'Recruiter screening call (30 min)',
      'SQL & coding pair assessment (60 min)',
      'Case study & A/B testing evaluation (60 min)',
      'Hiring Manager interview (45 min)'
    ],
    education: 'Degree in Statistics, Mathematics, Economics, Computer Science, or related fields',
  },
  {
    id: 'sj-product-designer',
    title: 'Product Designer',
    company_name: 'Airbnb',
    company_logo: spotifyLogo, // Reused asset
    salary_range: '$130,050 - $170,000',
    experience_level: 'Mid-Senior',
    employment_type: 'Full-time',
    work_mode: 'Remote',
    department: 'Guest Experience Group',
    team_size: 6,
    location: 'Remote, US',
    posted_time: '5 days ago',
    description: 'Join the Airbnb design team to shape the guest booking journey. You will design user flows, build high-fidelity interactive prototypes in Figma, and conduct usability research.',
    responsibilities: [
      'Design intuitive user flows, wires, and pixel-perfect high-fidelity layouts.',
      'Create interactive UI prototypes to validate web product flow sequences.',
      'Conduct usability tests and iterate designs based on feedback.'
    ],
    requirements: [
      '4+ years of experience as a Product Designer or UX Designer.',
      'Strong portfolio demonstrating detailed web interface design and product thinking.',
      'Expert proficiency in Figma, design systems, and modern prototyping.'
    ],
    nice_to_have: [
      'Basic knowledge of HTML/CSS/JS (React is a plus).',
      'Experience designing travel or marketplace web products.',
      'Experience hosting design critiques and design system tokens.'
    ],
    benefits: [
      'Annual Airbnb travel booking credits',
      'Top-tier health and dental insurance plans',
      'Equity options package',
      'Creative learning and growth stipend',
      'Remote working autonomy'
    ],
    skills: ['Figma', 'Prototyping', 'UX Research', 'Design Systems', 'UI Design', 'Wireframing'],
    hiring_process: [
      'Recruiter portfolio review (30 min)',
      'Hiring Manager portfolio deep-dive (45 min)',
      'Design critique assessment session (60 min)',
      'On-site design loop & values fit (3x 45 min)'
    ],
    education: 'Degree in Design, HCI, Cognitive Science, or equivalent experience',
  },
  {
    id: 'sj-ui-ux-designer',
    title: 'UI UX Designer',
    company_name: 'Salesforce',
    company_logo: googleLogo, // Reused asset
    salary_range: '$110,000 - $145,000',
    experience_level: 'Mid-level',
    employment_type: 'Full-time',
    work_mode: 'Hybrid',
    department: 'Sales Cloud UX Group',
    team_size: 8,
    location: 'San Francisco, CA',
    posted_time: '6 days ago',
    description: 'We are seeking a UI UX Designer to design enterprise portal workflows. You will design custom layouts, optimize SaaS telemetry charts, and build prototype assets matching our Lightning Design System.',
    responsibilities: [
      'Create wireframes, mockups, and high-fidelity mock assets for CRM dashboards.',
      'Ensure layouts conform to digital accessibility rules.',
      'Maintain design system tokens and component libraries in Figma.'
    ],
    requirements: [
      '3+ years of experience as a UI/UX Designer or Interaction Designer.',
      'Portfolio showcasing enterprise dashboards or complex SaaS layouts.',
      'Proficiency in Figma and interactive wireframing tools.'
    ],
    nice_to_have: [
      'Understanding of CRM products.',
      'Experience conducting virtual user testing research sessions.',
      'Familiarity with Lightning Design System.'
    ],
    benefits: [
      'Excellent medical, dental, and vision insurance',
      'Philanthropy time-off matching',
      'Annual health & wellness stipend',
      'Employee stock purchase matching',
      'Flexible home-office hybrid options'
    ],
    skills: ['Figma', 'Wireframing', 'UI Design', 'Interaction Design', 'Accessibility', 'SaaS Design'],
    hiring_process: [
      'Recruiter introductory call (30 min)',
      'UI/UX Portfolio walkthrough (45 min)',
      'Lightning Design System case analysis round (60 min)',
      'Hiring Manager values alignment (45 min)'
    ],
    education: 'Degree in Graphic Design, HCI, or related field',
  },
]
