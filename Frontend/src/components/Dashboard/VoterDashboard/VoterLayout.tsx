import React from 'react';
import { useState } from 'react';
import LOGO from '../../../assets/logo.png'
import { 
  Bell, 
  Settings, 
  Sun, 
  Moon,
  History, 
  Calendar, 
  UserCheck, 
  Search, 
  BarChart2, 
  TrendingUp, 
  Share2, 
  Menu, 
  X 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  firstName : string;
  lastName : string;
}

export default function VoterLayout({ children, firstName, lastName }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
   console.log("firstName", firstName, lastName);
  const navItems = [
    { icon: <History className="w-5 h-5" />, label: 'Voting History', href: '#' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Upcoming Elections', href: '#' },
    { icon: <UserCheck className="w-5 h-5" />, label: 'Voter ID Verification', href: '#' },
    { icon: <Search className="w-5 h-5" />, label: 'Party/Candidate Info', href: '#' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Voting Analytics', href: '#' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Poll Results', href: '#' },
    { icon: <Share2 className="w-5 h-5" />, label: 'Social Media', href: '#' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-purple-700 text-white z-50">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <div className="flex items-center space-x-2">
              <img src={LOGO} alt="logo" className='w-10 h-10 rounded-full' />
              <span className="text-xl font-bold">ElectCode</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="hover:text-purple-200">
              <Bell className="w-6 h-6" />
            </button>
            <button className="hover:text-purple-200">
              <Settings className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hover:text-purple-200"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <div className="hidden md:block">
              <span className="font-medium">Welcome, {firstName} {lastName}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-200 ease-in-out lg:translate-x-0 z-40
      `}>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg
                    hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
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
        bg-white  py-4 text-center text-sm text-gray-600
        ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
        <div className="grid md:grid-cols-3 gap-8">
         
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">API</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Digital Voting Platform. All rights reserved.</p>
        </div>
  
      </footer>
    </div>
  );
}