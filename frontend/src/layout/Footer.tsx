import { Link } from 'react-router-dom'
import { Briefcase, Github, Linkedin, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Branding Column */}
        <div className="space-y-4 md:col-span-2">
          <span className="font-extrabold text-white text-lg flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="tracking-tight font-black text-xl">JobBoard</span>
          </span>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Enterprise AI recruiting systems redefining global talent acquisitions for developers and fast-growing companies.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="mailto:support@jobboard.com" className="text-slate-500 hover:text-white transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Platform Column */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Platform</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/jobs" className="hover:text-white transition-colors font-medium">Find Jobs</Link></li>
            <li><Link to="/companies" className="hover:text-white transition-colors font-medium">Companies</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors font-medium">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors font-medium">Register Portal</Link></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Resources</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors font-medium">Interview Tips</a></li>
            <li><a href="#" className="hover:text-white transition-colors font-medium">Career Advice</a></li>
            <li><a href="#" className="hover:text-white transition-colors font-medium">Resume Builder</a></li>
            <li><a href="#" className="hover:text-white transition-colors font-medium">FAQs & Support</a></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white transition-colors font-medium">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors font-medium">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors font-medium">Cookie Preferences</a></li>
            <li><a href="mailto:contact@jobboard.com" className="hover:text-white transition-colors font-medium">Contact Us</a></li>
          </ul>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 font-medium">
        &copy; {new Date().getFullYear()} JobBoard. All rights reserved. Built for top tech engineering matches.
      </div>
    </footer>
  )
}
