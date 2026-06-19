import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Paperclip } from 'lucide-react';

export default function MessagePanel () {
    const [message, setMessage] = useState('');

  return (
    <div className="glass gradient-border rounded-3xl p-6 h-full">
      <h2 className="text-xl font-semibold font-display mb-6">Message Center</h2>

      <div className="h-[300px] overflow-y-auto mb-4 space-y-4 pr-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-gradient rounded-2xl rounded-tr-sm p-4 ml-auto max-w-[80%] text-white shadow-lg"
        >
          <p className="text-sm">Latest campaign updates have been posted. Please review and provide feedback.</p>
          <span className="text-xs text-white/70 mt-2 block">10:30 AM</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 max-w-[80%]"
        >
          <p className="text-sm text-white/90">Thank you for the update. I'll review it right away.</p>
          <span className="text-xs text-white/40 mt-2 block">10:32 AM</span>
        </motion.div>
      </div>

      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 text-cyber-400 hover:bg-white/10 rounded-full transition-colors"
          >
            <Smile className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 text-cyber-400 hover:bg-white/10 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2.5 bg-brand-gradient text-white rounded-full glow transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
