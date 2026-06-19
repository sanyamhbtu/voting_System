import {
  BarChart,
  Calendar,
  CheckCircle,
  TrendingUp,
  CircleX
} from 'lucide-react';
import { motion } from 'framer-motion';
import DynamicChart from './DynamicChart';
import Broadcasting from './Broadcasting';
export default function VoterMain({verified, firstName, lastName, setRender} : {verified : boolean, firstName : string, lastName : string , setRender : (render : string) => void}) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8 gradient-border"
      >
        <h1 className="text-3xl font-bold font-display">
          Welcome back, <span className="gradient-text">{firstName} {lastName}</span>!
        </h1>
        <p className="text-white/65 mt-2">
          Stay informed about upcoming elections and track your voting activity.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 font-medium text-sm">Next Election</p>
              <h3 className="text-2xl font-bold gradient-text font-display mt-1">Mar 15, 2024</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient glow">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
        {verified ?
        <button onClick={() => {setRender("VoterVerification")}} className="text-left">
        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6 cursor-pointer h-full">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 font-medium text-sm">Voter ID Status</p>
              <div className="flex items-center mt-1 space-x-2">
                <CheckCircle className="w-5 h-5 text-cyber-400" />
                <span className="text-2xl font-bold font-display text-white">Verified</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyber-500/20 border border-cyber-400/30 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-cyber-300" />
            </div>
          </div>
        </motion.div>
      </button>
         :
        <button onClick={() => {setRender("VoterVerification")}} className="text-left">
        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6 cursor-pointer h-full">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 font-medium text-sm">Voter ID Status</p>
                <div className="flex items-center mt-1 space-x-2">
                  <CircleX className="w-5 h-5 text-accent-400" />
                  <span className="text-2xl font-bold font-display text-white">Unverified</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-500/20 border border-accent-400/30 flex items-center justify-center">
                <CircleX className="w-6 h-6 text-accent-400" />
              </div>
            </div>
          </motion.div>
        </button>

        }

        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 font-medium text-sm">Voter Turnout</p>
              <h3 className="text-2xl font-bold gradient-text font-display mt-1">67.5%</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient glow">
              <BarChart className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 font-medium text-sm">Active Polls</p>
              <h3 className="text-2xl font-bold gradient-text font-display mt-1">3 Ongoing</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient glow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Upcoming Elections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        <DynamicChart/>
        <Broadcasting/>
      </div>
    </div>
  );
}
