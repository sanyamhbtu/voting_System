import { motion } from 'framer-motion';
import { BarChart3, Users, Award, Crown, House } from 'lucide-react';
import { useState } from 'react';
import LOGO from '../../../assets/logo.png'
const menuItems = [
  {icon : House , label : "Home"},
  { icon: BarChart3, label: 'Vote Distribution' },
  { icon: Users, label: 'Voters Management' },
  { icon: Award, label: 'Parties Management' },
  {icon : Crown, label : 'Show Results'},
];

export default function Sidebar ({setRender} : {setRender : (render : string) => void}) {
    const [active, setActive] = useState<string>('Home');

    return(
        <div className="h-screen w-64 shrink-0 glass border-r border-white/10 p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient glow overflow-hidden">
          <img src={LOGO} alt="Logo" className='w-7 h-7 rounded-full object-cover'/>
        </div>
        <h1 className="text-xl font-bold font-display gradient-text">
          VoteChain
        </h1>
      </div>

      <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
        Menu
      </div>

      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const isActive = active === item.label;
          return (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setActive(item.label); setRender(item.label); }}
            className={`group flex items-center gap-3 w-full p-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-brand-gradient text-white glow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-white/50 group-hover:text-cyber-300'}`} />
            <span>{item.label}</span>
          </motion.button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="gradient-border rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs font-semibold text-white/80 font-display">Admin Console</p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/45">
            Blockchain-secured elections, managed in real time.
          </p>
        </div>
      </div>
    </div>
    )
}