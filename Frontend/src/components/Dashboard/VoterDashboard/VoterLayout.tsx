import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import LOGO from '../../../assets/logo.png'
import {
  Bell,
  Settings,
  Sun,
  Moon,
  UsersRound ,
  Calendar,
  BarChart2,
  TrendingUp,
  Share2,
  Menu,
  X ,
  House,
  Vote
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  firstName : string;
  lastName : string;
  setRender : (render : string) => void;
}

export default function VoterLayout({ children, firstName, lastName, setRender }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navItems = [
    { icon: <House className="w-5 h-5" />, label: 'Home'},
    { icon: <UsersRound className="w-5 h-5" />, label: 'Registered Parties'},
    { icon: <Calendar className="w-5 h-5" />, label: 'Upcoming Elections'},
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Voting Analytics'},
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Vote now'},
    { icon: <Share2 className="w-5 h-5" />, label: 'Social Media'},
    { icon: <Settings className="w-5 h-5" />, label: 'Settings'},
  ];

  return (
    <div className="min-h-screen bg-aurora text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-white/80 hover:text-white transition"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient glow overflow-hidden">
                <img src={LOGO} alt="logo" className='w-10 h-10 rounded-xl object-cover' />
              </div>
              <span className="text-xl font-bold font-display">VoteChain</span>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <button className="text-white/70 transition hover:text-cyber-300">
              <Bell className="w-6 h-6" />
            </button>
            <button className="text-white/70 transition hover:text-cyber-300">
              <Settings className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-white/70 transition hover:text-cyber-300"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <div className="hidden md:flex items-center gap-2 rounded-full glass px-4 py-1.5">
              <span className="text-sm font-medium text-white/85">Welcome, <span className="gradient-text font-semibold">{firstName} {lastName}</span></span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass border-r border-white/10 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-200 ease-in-out lg:translate-x-0 z-40
      `}>
        <nav className="p-4">
          <ul className="space-y-1.5">
            {navItems.map((item, index) => (
              <li key={index}>
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRender(item.label)}
                  className="group flex w-full items-center space-x-3 px-4 py-3 text-white/70 rounded-xl hover:cursor-pointer
                    hover:bg-white/10 hover:text-white transition-colors duration-200"
                >
                  <span className="text-cyber-300 transition group-hover:text-cyber-400">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`
        pt-16 min-h-screen transition-all duration-200
        ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className={`
        border-t border-white/10 bg-ink-900/60 py-10 px-6 text-sm text-white/60
        ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
              <Vote className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold font-display text-white">VoteChain</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">How It Works</a></li>
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">Security</a></li>
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">API</a></li>
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">Support</a></li>
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-white/55 hover:text-cyber-300 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/45">
            <p>&copy; {new Date().getFullYear()} VoteChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
