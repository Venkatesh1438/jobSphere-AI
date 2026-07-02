import { useNavigate, Link } from 'react-router-dom'
import { Briefcase, ArrowRight, ShieldCheck, Zap, Award, Target, CheckCircle2, Shield, Cpu, RefreshCw, Layers } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '../../components/ui/Button'
import { HeroSection } from '../../components/ui/HeroSection'
import { StatsCard } from '../../components/ui/StatsCard'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { showcaseCompanies, showcaseJobs } from '../../components/ui/showcaseData'
import { ShowcaseCompanyCard } from '../../components/ui/ShowcaseCompanyCard'
import { ShowcaseJobCard } from '../../components/ui/ShowcaseJobCard'
import { ScrollingLogos } from '../../components/ui/ScrollingLogos'
import AnimatedCounter from '../../components/ui/AnimatedCounter'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

export default function LandingPage() {

  const navigate = useNavigate()

  const handleSearch = ({ search, location }: { search: string; location: string }) => {
    let path = '/jobs'
    const query = []
    if (search) query.push(`search=${encodeURIComponent(search)}`)
    if (location) query.push(`location=${encodeURIComponent(location)}`)
    if (query.length > 0) path += `?${query.join('&')}`
    navigate(path)
  }

  // Landing page always shows the curated showcase for the best visual impression.
  // Real data lives in /companies and /jobs directory pages.
  const featuredCompanies = showcaseCompanies.slice(0, 6)
  const featuredJobs = showcaseJobs.slice(0, 4)
  const trendingJobs = showcaseJobs.slice(4, 7)

  // Popular skills to filter jobs page
  const popularSkills = [
    'React', 'Python', 'Java', 'Node.js', 'AI / ML', 'Cloud', 'DevOps', 'Cyber Security', 'Data Science', 'TypeScript'
  ]

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Trusted By Scrolling Logos */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Trusted by hiring engineering teams worldwide
          </span>
        </div>
        <ScrollingLogos />
      </div>

      {/* Statistics Section */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-5">
        <StatsCard
          value={<span className="flex items-center"><AnimatedCounter value={1200} /><span>+</span></span>}
          label="Global Employers"
          icon={ShieldCheck}
          description="Verified background screening for peace of mind."
        />
        <StatsCard
          value={<span className="flex items-center"><AnimatedCounter value={15000} /><span>+</span></span>}
          label="Active Postings"
          icon={Briefcase}
          description="Daily updated verified job openings."
        />
        <StatsCard
          value={<span className="flex items-center"><AnimatedCounter value={50000} /><span>+</span></span>}
          label="Tech Professionals"
          icon={Zap}
          description="Engineers, developers, and product designers."
        />
        <StatsCard
          value={<span className="flex items-center"><AnimatedCounter value={98} /><span>%</span></span>}
          label="Hiring Success"
          icon={Award}
          description="Successful long-term engineering matches."
        />
      </div>

      {/* Most Popular Skills */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">
            Trending Technologies
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Browse Opportunities by High-Demand Skills
          </h3>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {popularSkills.map((skill) => (
            <Link
              key={skill}
              to={`/jobs?search=${encodeURIComponent(skill)}`}
              className="px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-2xl border border-slate-200/60 hover:border-blue-200 text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>{skill}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Featured Tech Companies ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionTitle
            title="Featured Tech Companies"
            subtitle="Direct connections to engineering teams at the world's most innovative companies."
            badge="Top Companies"
          />
          <Link to="/companies">
            <Button variant="outline" className="font-bold border-slate-200 hover:bg-slate-50 gap-2 bg-white text-slate-700 text-sm rounded-xl">
              View All Companies <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredCompanies.map((company) => (
            <motion.div key={company.id} variants={itemVariants}>
              <ShowcaseCompanyCard company={company} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Latest Career Opportunities ───────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionTitle
            title="Latest Career Opportunities"
            subtitle="Explore highly-coveted tech jobs curated for developers, engineers, and product designers."
            badge="Featured Jobs"
          />
          <Link to="/jobs">
            <Button variant="outline" className="font-bold border-slate-200 hover:bg-slate-50 gap-2 bg-white text-slate-700 text-sm rounded-xl">
              View All Jobs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {featuredJobs.map((job) => (
            <motion.div key={job.id} variants={itemVariants}>
              <ShowcaseJobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Trending Positions ────────────────────────────────────────────── */}
      {trendingJobs.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionTitle
              title="Trending Positions"
              subtitle="The most sought-after and high-interest tech opportunities this week."
              badge="Trending Openings"
            />
            <Link to="/jobs">
              <Button variant="outline" className="font-bold border-slate-200 hover:bg-slate-50 gap-2 bg-white text-slate-700 text-sm rounded-xl">
                Explore All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            {trendingJobs.map((job) => (
              <motion.div key={job.id} variants={itemVariants}>
                <ShowcaseJobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ── How it Works ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <SectionTitle
          title="Simple, transparent talent matching"
          subtitle="Three steps to secure your next software engineering opportunity on JobBoard."
          badge="How JobBoard Works"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
          {[
            {
              step: 1,
              title: 'Create Developer Profile',
              desc: 'Register, list your tech skills, preferred salary, and upload your resume for automatic parsing.',
            },
            {
              step: 2,
              title: 'Discover Jobs',
              desc: 'Our matching algorithms filter database listings to present jobs matching your background.',
            },
            {
              step: 3,
              title: 'One Click Apply',
              desc: 'Submit your formatted developer credentials directly to the hiring recruiter and track status updates.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center space-y-4 p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-lg">
                {step}
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">{title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Choose Us ────────────────────────────────────────────────── */}
      <div className="bg-slate-950 text-white rounded-[32px] p-12 max-w-6xl mx-auto relative overflow-hidden shadow-lg border border-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full tracking-wide uppercase">
              <Target className="h-3.5 w-3.5" />
              <span>Core Values</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Why top developers trust JobBoard
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              JobBoard was built by engineers, for engineers. We omit the spam, the ghost listings, and the endless recruiter calls.
            </p>
            <ul className="space-y-3 pt-2 text-sm text-slate-400 font-medium">
              {[
                '100% verified employer and company profiles only.',
                'Clear salary bands published upfront for all postings.',
                'Direct recruiter routing (no middle-man agency).',
              ].map((point) => (
                <li key={point} className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Cpu, title: 'AI Matching', desc: 'Get scored matches based on your tech stack.' },
              { icon: Shield, title: 'Verified Companies', desc: 'All profiles undergo strict validation.' },
              { icon: Layers, title: 'Resume Analysis', desc: 'Auto-parse credentials for instant score.' },
              { icon: RefreshCw, title: 'Fast Hiring', desc: 'Direct recruiter pipeline routing.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 bg-slate-900/60 rounded-[24px] border border-slate-800 space-y-2 flex flex-col justify-between h-36">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 w-max">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-400">{title}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
