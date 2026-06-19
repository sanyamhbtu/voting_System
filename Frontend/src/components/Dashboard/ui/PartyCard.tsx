import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {PartyListProps} from './PartyList'
import { MicVocal, MapPin, PersonStanding  } from "lucide-react"
import axios from 'axios';
import { API_URL } from '../../../utils/util';
type partyCardProbs = {
    party : PartyListProps;
    onClick : () => void;
}
export default function PartyCard ({party, onClick} : partyCardProbs) {
    const [publicUrl , setPublicUrl] = useState<string>("");
    useEffect(() => {
            const fetchPublicUrl = async () => {
                try {
                    const response = await axios.post(`${API_URL}/api/v1/getPublicUrl`,{
                        file : party.symbolUrl
                    })
                    if(response.status === 200){
                        setPublicUrl(response.data.url);
                    }else{
                        setPublicUrl(party.symbolUrl);
                    }
                } catch {
                    alert("Backend is down!");
                    setPublicUrl(party.symbolUrl);
                }
            }
            fetchPublicUrl();
    },[party.symbolUrl])
    return (
        <motion.div
            whileHover={{ y: -6 }}
            className="glass gradient-border text-white rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/[0.1] cursor-pointer p-4" onClick={onClick}>
            <img src={publicUrl ||"/placeholder.svg"}
                        alt={party.partyAbbreviation}
                        className="w-full h-48 object-fill rounded-2xl ring-1 ring-white/10" />
            <div className='px-2 py-4'>
                <h2 className='text-2xl font-bold font-display mb-2 gradient-text'>
                    {party.partyName};
                </h2>
            </div>
            <div className='flex items-center mb-2 text-white/80 px-2'>
                <MicVocal className="w-4 h-4 mr-2 text-cyber-400" />
                <span>{party.partyAbbreviation}</span>
            </div>
            <div className='flex items-center mb-2 text-white/80 px-2'>
                <MapPin className="w-4 h-4 mr-2 text-cyber-400" />
                <span>{party.address}</span>
            </div>
            <div className="flex items-center text-white/80 px-2 pb-2">
                <PersonStanding className="w-5 h-5 mr-2 text-cyber-400" />
                <span>{party.partyLeaderName} attendees</span>
            </div>
        </motion.div>
    )
}