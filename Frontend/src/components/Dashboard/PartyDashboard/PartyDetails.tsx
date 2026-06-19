import { motion } from 'framer-motion';
import { CheckCircle, Building2, Phone, Mail, FileText, Scale, User } from 'lucide-react';
import { PartyInfo } from './View';

interface PartyDetailsProps {
    publicUrl : string
    party: PartyInfo;
    onViewDocument: (type: 'manifesto' | 'constitution') => void;
  }


export default function PartyDetails ({ publicUrl,party, onViewDocument }: PartyDetailsProps) {

    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto p-8"
        >
          <div className="glass gradient-border rounded-3xl overflow-hidden glow">
            <div className="relative bg-brand-gradient-animated p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative flex items-center justify-between">
                <div>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl font-bold font-display mb-2"
                  >
                    {party.name}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/80"
                  >
                    {party.abbreviation}
                  </motion.p>
                </div>
                {party.isVerified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white/90 text-brand-700 px-4 py-2 rounded-full flex items-center font-semibold shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verified
                  </motion.div>
                )}
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-start">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white mr-3">
                      <User className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">Party Leader</h3>
                      <p className="text-white/60">{party.leaderName}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white mr-3">
                      <Building2 className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">Address</h3>
                      <p className="text-white/60 flex flex-wrap">{party.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white mr-3">
                      <Phone className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">Contact</h3>
                      <p className="text-white/60">{party.mobile}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-start">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white mr-3">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-white/60">{party.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white mr-3">
                      <Scale className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">Party Symbol</h3>
                      <img src={publicUrl} alt="PartySymbol" className="w-20 h-20 rounded-full mt-2 ring-2 ring-brand-500/50" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid md:grid-cols-2 gap-4"
              >
                <button
                  onClick={() => onViewDocument('manifesto')}
                  className="flex items-center cursor-pointer justify-center px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-brand-400 transition-colors"
                >
                  <FileText className="w-5 h-5 mr-2 text-cyber-400" />
                  View Manifesto
                </button>
                <button
                  onClick={() => onViewDocument('constitution')}
                  className="flex items-center cursor-pointer justify-center px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-brand-400 transition-colors"
                >
                  <FileText className="w-5 h-5 mr-2 text-cyber-400" />
                  View Constitution
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      );
}
