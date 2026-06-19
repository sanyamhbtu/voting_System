
import { Users,TrendingUp } from 'lucide-react';
import Sidebar from './SideBar';
import ElectionControls from './ElectionControls';
import StatsCard from './StatsCard';
import { VotersList } from './VotersList';
import { ElectionChart } from './ElectionChart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PartiesList } from './PartiesList';
import { ShowResults } from './ShowResults';
import { API_URL } from '../../../utils/util';

export interface Party {
    id: string;
    name: string;
    votes: number;
    color: string;
  }
  
  export interface Voter {
    id: string;
    name: string;
    isBlocked: boolean;
    hasVoted: boolean;
  }
  
export interface ElectionState {
    isActive: boolean;
    totalVoters: number;
    parties: Party[];
    voters: Voter[];
    startElection: () => void;
    endElection: () => void;
    resetElection: () => void;
    removeParty: (id: string) => void;
    toggleVoterBlock: (id: string) => void;
  }

export default function AdminDash () {
    const[totalVoters, setTotalVoters] = useState<number>();
    const [totalVotes, setTotalVotes] = useState<number>();
    const [blockedVoters,setBlockedVoters] = useState<number>();
    const [render, setRender] = useState<string>("Home")

    useEffect(() => {
      const getTotalVoters = async () => {
        try {
          const totalVoters = await axios.get(`${API_URL}/api/v3/totalVoters`);
          if(totalVoters.status === 200){
              setTotalVoters(totalVoters.data.totalVoters);
          }else{
            setTotalVoters(0.0);
          }
        } catch {
          setTotalVoters(0.0);
          alert("Error fetching total voters");
        }
      }
      const getTotalVotes = async () => {
        try {
          const totalVotes = await axios.get(`${API_URL}/api/v3/totalVotes`);
          if(totalVotes.status === 200){
            setTotalVotes(totalVotes.data.totalVotes);
          }else{
            setTotalVotes(0.0);
          }
        } catch {
          setTotalVotes(0.0);
          alert("Error fetching total votes");
        }
      }
      const getBlockedVoters = async () => {
        try {
            const blockedVoters = await axios.get(`${API_URL}/api/v1/getBlockedVoters`);
            if(blockedVoters.status === 200){
              setBlockedVoters(blockedVoters.data.blockedVoters.length);
            }else{
              setBlockedVoters(0.0);
            }
        } catch {
           setBlockedVoters(0.0);
           alert("Error fetching blocked voters")
        }
      }
      getTotalVoters();
      getTotalVotes();
      getBlockedVoters();
    },[]);
    const handleRendering = (render : string) => {
        switch (render) {
            case "Home" :
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ElectionChart />
                        <VotersList />
                    </div>
                )
            case "Voters Management" :
                return <VotersList />
            case "Vote Distribution" : 
                return <ElectionChart />
            case "Parties Management" : 
                return <PartiesList />
            case "Show Results" :
                return <ShowResults />
            default : 
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ElectionChart />
                        <VotersList />
                        <PartiesList />
                    </div>
                )
        }
    }
  return (
    <div className="flex min-h-screen bg-aurora text-white">
      <Sidebar setRender={setRender} />

      <main className="flex-1 p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyber-400">Admin</p>
              <h1 className="mt-1 text-3xl font-bold font-display gradient-text">Election Dashboard</h1>
            </div>
            <ElectionControls />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Voters"
              value={totalVoters}
              icon={Users}
            />
            <StatsCard
              title="Active Voters"
              value={(totalVoters as number) - (blockedVoters as number)}
              icon={Users}
              trend={(((totalVoters as number) - (blockedVoters as number))/(totalVoters as number)) * 100}
            />
            <StatsCard
              title="Total Votes"
              value={totalVotes}
              icon={TrendingUp}
            />
          </div>

          {handleRendering(render)}
        </div>
        <footer className="mt-16 border-t border-white/10 pt-10">
        <div className="grid md:grid-cols-3 gap-8">

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">About Us</a></li>
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">How It Works</a></li>
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">Security</a></li>
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">Documentation</a></li>
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">API</a></li>
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">Support</a></li>
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-white/55 transition-colors hover:text-cyber-300">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/45">
          <p>&copy; {new Date().getFullYear()} VoteChain. All rights reserved.</p>
        </div>

      </footer>
      </main>

    </div>
  );
}