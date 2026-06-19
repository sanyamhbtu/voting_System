import { useEffect, useState} from 'react';
import { LineChart, Vote } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../../utils/util';
type DATA = {
    voterId : string;
    partyId : string;
    partyName : string;
    votes : number;
    color: string;
}


export const ShowResults = () => {
    const [data, setData] = useState<DATA[] | []>([]);
    const [activeParty, setActiveParty] = useState<string | null>(null);
    useEffect(() => {
            const getPartiesData = async () => {
                try {
                    const parties = await axios.get(`${API_URL}/api/v2/getPartiesData`);
                    if(!parties){
                        setData([]);
                        alert("Error in fetching result");
                        return;
                    }
                    if(parties.status === 200){
                        const filterdData = parties.data.parties.map((party: { partyId: number; partyName: string; voterId: string }) => ({
                                partyId : party.partyId,
                                partyName : party.partyName,
                                voterId : party.voterId,
                                votes : 0,
                                color : "purple"
                        }))
                        setData(filterdData);
                    }else{
                        setData([]);
                        alert("Error in fetching result");
                    }
                } catch {
                    setData([]);
                    alert("Error in fetching result")
                }  
            }
            getPartiesData();
    },[])
    useEffect(() => {
        if(data.length === 0) return;
        const fetchVotes = async () => {
            try {
                const votes = await Promise.all(data.map(async (party) => {
                    try {
                        const response = await axios.get(`${API_URL}/api/v3/partyStatus`,{
                            params : {
                                partyId : party.voterId
                            }
                        })
                        return response.status === 200
                    ? { ...party, votes: response.data.voteCount }
                    : { ...party, votes: 0 };
                    } catch {
                        return { ...party, votes: 0 };
                    }
                    
                }))
                setData(votes);
            } catch {
                alert("Error fetching votes");
            }
                
        }
        fetchVotes();
    },[data])
  return (
    <div className="rounded-2xl bg-aurora overflow-hidden">
      {/* Header Section */}
      <div className="border-b border-white/10 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white glow">
              <Vote className="w-6 h-6" />
            </span>
            <h1 className="text-3xl font-bold font-display gradient-text">
              Election Results 2025
            </h1>
          </div>
          <p className="text-white/60">Real-time voting statistics and analytics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid gap-6">
          {/* Stats Overview */}
          <div className="flex items-center justify-between p-6 gradient-border rounded-2xl bg-white/[0.04]">
            <div>
              <p className="text-white/60">Total Votes Cast</p>
              <h2 className="text-4xl font-bold font-display gradient-text">
                {data.reduce((acc, party) => acc + party.votes, 0).toLocaleString()}
              </h2>
            </div>
            <LineChart className="w-12 h-12 text-cyber-400" />
          </div>

          {/* Results Grid */}
          <div className="grid gap-4">
            {data.map((party) => (
              <div
                key={party.partyId}
                className={`relative overflow-hidden p-6 rounded-2xl glass transition-all duration-300 ${
                  activeParty === party.partyId
                    ? 'border-brand-400/60 glow'
                    : 'hover:bg-white/[0.1]'
                }`}
                onMouseEnter={() => setActiveParty(party.partyId)}
                onMouseLeave={() => setActiveParty(null)}
              >
                {/* Background Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-brand-600/15 to-transparent transition-opacity duration-300 ${
                    activeParty === party.partyId ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold font-display text-white">{party.partyName}</h3>
                      <p className="text-white/45 text-sm">ID: {party.partyId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-display gradient-text">
                        {party.votes.toLocaleString()}
                      </p>
                      <p className="text-white/50 text-sm">votes</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gradient transition-all duration-500"
                      style={{
                        width: `${(party.votes / Math.max(...data.map(p => p.votes))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}