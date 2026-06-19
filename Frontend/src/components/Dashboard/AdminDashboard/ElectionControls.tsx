import { motion } from 'framer-motion';
import { Play, Square, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../utils/util';

export default function ElectionControls () {
    const [loading, setLoading] = useState<boolean>(false);
    const [isVisible,setIsVisible] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [active, setActive] = useState<boolean>(false);
    const handleStartElection = async() => {
      setLoading(true);
        try {
            
            const startElection = await axios.post(`${API_URL}/api/v3/startElection`,{
              duration : duration
            });
            if(startElection.status === 200){
              alert(startElection.data.message);
              setActive(true);
            }else(
              alert(startElection.data.message)
            )
        } catch{
            alert("Error in starting election");
        } finally{
          setLoading(false);
        }
    }
    const handleEndElection = async() => {
      setLoading(true);
      try {
        
          const endElection = await axios.post(`${API_URL}/api/v3/endElection`);
          if(endElection.status === 200){
            alert(endElection.data.message);
            setActive(false);
          }else(
            alert(endElection.data.message)
          )
      } catch{
        alert("Error in ending election");
      }finally{
        setLoading(false)
      }
    }
    const handleResetElection = async() => {
      setLoading(true);
        try {
            const resetElection = await axios.post(`${API_URL}/api/v4/resetElection`);
            if(resetElection.status === 200){
              alert(resetElection.data.message);
              setActive(false);
            }else(
              alert(resetElection.data.message)
            )
        } catch{
            alert("Error in resetting election");
        }finally{
          setLoading(false)
        }
    }
    const handleSubmit = async() => {
      setIsVisible(false);
      await handleStartElection();
      
    }
  return (
    <div className="flex gap-3 relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        onClick={() => active ? handleEndElection() : setIsVisible(true)}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed ${
          active
            ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_8px_24px_-8px_rgba(244,63,94,0.7)] hover:brightness-110'
            : 'btn-primary'
        }`}
      >

        {active ? (
          <>
            <Square className="w-5 h-5" />
            End Election
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Start Election
          </>
        )}
      </motion.button>
      {isVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="gradient-border w-[90vw] max-w-md rounded-3xl bg-ink-800/90 p-8 glow"
              >
                <h3 className="text-2xl font-bold font-display gradient-text text-center">Start Election</h3>
                <label htmlFor="duration" className="mt-6 block text-sm font-medium text-white/70">Election duration (minutes)</label>
                <input
                  id="duration"
                  type="number"
                  placeholder="Enter duration"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40"
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
                <div className='mt-8 flex items-center justify-center gap-4'>
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex-1 cursor-pointer"
                >
                  Submit
                </button>
                <button onClick={() =>setIsVisible(false)} className="btn-ghost flex-1 cursor-pointer">Cancel</button>
                </div>
              </motion.div>
            </div>
          )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        onClick={handleResetElection}
        className="btn-ghost px-6 py-3 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
      >
        <RotateCcw className="w-5 h-5" />
        Reset
      </motion.button>
    </div>
  );
}