import { motion } from 'framer-motion';
import { Ban, CheckCircle } from 'lucide-react';
import { useElectionStore } from '../AdminStore/store';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../utils/util';

type Voter = {
  _id: string;
  voterId : string;
  firstName: string;
  lastName : string
  isBlocked : boolean;
  verified : boolean;
  hasVoted : boolean;
}
export const VotersList = () => {
const [voterList, setVoterList] = useState<Voter[]>([]);
const {toggleVoterBlock } = useElectionStore();
  useEffect(() => {
    const voterList = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/getVoters`);
        if(response.status === 200 ){
          setVoterList(response.data.voters);
        }else{
          setVoterList([]);
        }
      } catch {
        alert("Something went wrong. Please try again!");
        setVoterList([]);
      }
    }
    voterList();
  },[])
  useEffect(() => {
    const fetchVotingStatus = async () => {
      try {
        const updatedVoters = await Promise.all(
          voterList.map(async (voter) => {
            try {
              const response = await axios.get(`${API_URL}/api/v3/getVoterStatus`, {
                params: { voterId: voter.voterId },
              });
              return response.status === 200
                ? { ...voter, hasVoted: response.data.hasVoted }
                : { ...voter, hasVoted: false };
            } catch {
              return { ...voter, hasVoted: false };
            }
          })
        );
        setVoterList(updatedVoters);
      } catch (error) {
        console.error("Error fetching voter status:", error);
      }
    };

    if (voterList.length > 0) {
      fetchVotingStatus();
    }
  }, []);

  const handleBlocked = async (voterId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to block this voter?");
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/v1/toggleBlock`, {
        voterId: voterId,
      });
  
      if (response.status !== 200) {
        alert("Failed to block voter. Please try again.");
        return;
      }
  
      const response2 = await axios.post(`${API_URL}/api/v3/blockVoter`, {
        voterId: voterId,
      });
  
      if (response2.status !== 200) {
        await axios.post(`${API_URL}/api/v1/toggleBlock`, {
          voterId: voterId,
        });
  
        alert("Failed to update block status in external system. Changes have been reverted.");
        return;
      }
      alert("Voter blocked successfully!");
      window.location.reload();
  
    } catch (error) {
      console.error("Error handling voter block:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  const handleUnblocked = async (voterId : string) =>{
    const isConfirmed = window.confirm("Are you sure you want to unblock this voter?");
    if (!isConfirmed) {
      return;
    }
      try {
        const response = await axios.post(`${API_URL}/api/v1/toggleBlock`, {
          voterId: voterId,
        });
    
        if (response.status !== 200) {
          alert("Failed to unblock voter. Please try again.");
          return;
        }
        const response2 = await axios.post(`${API_URL}/api/v3/unblockVoter`, {
          voterId: voterId,
        });
    
        if (response2.status !== 200) {
          await axios.post(`${API_URL}/api/v1/toggleBlock`, {
            voterId: voterId,
          });
          alert("Failed to update block status in external system. Changes have been reverted.");
        return;
        }
        alert("Voter blocked successfully!");
      window.location.reload();
      } catch (error) {
        console.error("Error handling voter block:", error);
      alert("Something went wrong. Please try again.");
      }
  }
  return (
    <div className="glass h-[30vw] rounded-2xl overflow-hidden overflow-y-scroll">
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-ink-800/70 backdrop-blur border-b border-white/10">
        <h2 className="text-base font-bold font-display text-white">Voters Management</h2>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Status</span>
      </div>
      <div className="divide-y divide-white/5">
        {voterList.map((voter) => (
          <motion.div
            key={voter._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between px-5 py-4 transition hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${voter.verified ? 'bg-cyber-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/25'}`} />
              <span className="font-medium text-white/90">{voter.firstName} {voter.lastName}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${voter.hasVoted ? 'bg-green-400/15 text-green-400' : 'bg-red-400/15 text-red-400'}`}>
                {voter.hasVoted ? 'Voted' : 'Not Voted'}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleVoterBlock(voter._id)}
                className={`p-2 rounded-lg transition ${
                  voter.isBlocked
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-white/50 hover:bg-white/10'
                }`}
              >
                {voter.isBlocked ? <div className='relative group' onClick={() => handleUnblocked(voter.voterId)}>
              <Ban className="w-5 h-5 cursor-pointer text-red-400" />
              <span className="absolute right-2  bottom-5 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Banned
              </span>
              </div> : <div className='relative group' onClick={() => handleBlocked(voter.voterId)}>
              <CheckCircle className="w-5 h-5 cursor-pointer  text-cyber-400" />
              <span className="absolute right-2  bottom-5 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Allowed
              </span>
              </div>}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}