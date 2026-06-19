import { useEffect, useState } from "react";
import PartyList, { PartyListProps } from "../ui/PartyList"
import axios from 'axios'
import { API_URL } from '../../../utils/util';
export default function RegisteredParties () {
  const [partyList, setPartyList] = useState<PartyListProps[] | []>([]);
  useEffect(() => {
      const getParties = async () =>{
          try {
            const parties = await axios.get(`${API_URL}/api/v2/parties`);
            setPartyList(parties.data.parties);
          } catch (error) {
            setPartyList([]);
            console.log(error);
          }
      }
      getParties();
  },[])
    return (
        <main className="min-h-screen text-white p-2 md:p-6">
      <div className="text-center mb-10">
        <span className="text-sm font-semibold uppercase tracking-widest text-cyber-400">Democracy in motion</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold font-display gradient-text">
          Registered Parties
        </h1>
        <p className="mt-3 text-white/60">Explore the parties competing in the current election.</p>
      </div>
      <PartyList parties={partyList} />
    </main>
    )
}