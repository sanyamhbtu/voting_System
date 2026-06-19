import { X, ScrollText , MapPin, Users, BookText  } from "lucide-react"
import { PartyListProps } from './PartyList'
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '../../../utils/util';

type PartyModelprops = {
    party : PartyListProps;
    onClose : () => void;
}

export default function PartyModel({ party, onClose }: PartyModelprops) {
      const [manifesto,setManifesto] = useState<string>('');
      const [constitution,setConstitution] = useState<string>('');
        useEffect(() => {
            const fetchPublicUrl = async () => {
              try {
                const requests = await Promise.all(
                  [party.manifesto,party.partyConstitution].map(async (url) => {
                    const response = await axios.post(`${API_URL}/api/v1/getPublicUrl`,{
                      file : url
                    })
                    return response.status === 200 ? response.data.url : url;
                  })
                )
                setManifesto(requests[0])
                setConstitution(requests[1])
              } catch (error) {
                alert("Error fetching public URL")
                console.log(error);
              }
            }
            fetchPublicUrl();
        },[party.manifesto,party.partyConstitution])
        return(
            <div className="fixed inset-0 backdrop-blur bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="glass gradient-border rounded-3xl overflow-hidden glow w-full max-w-2xl text-white">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 z-10 bg-white/10 border border-white/15 text-white p-2 rounded-full hover:bg-white/20 transition-colors duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold font-display mb-4 gradient-text">
            {party.partyName} ({party.partyAbbreviation})
          </h2>
          <div className="flex items-center mb-2 text-white/80">
            <MapPin className="w-5 h-5 mr-2 text-cyber-400" />
            <span className="font-bold text-white mr-2">Address:</span>
            <span>{party.address}</span>
          </div>
          <div className="flex items-center mb-4 text-white/80">
            <Users className="w-5 h-5 mr-2 text-cyber-400" />
            <span className="font-bold text-white mr-2">Leader:</span>
            <span>{party.partyLeaderName}</span>
          </div>
          <div className=" mb-2 justify-center">

            <span className="font-bold text-white mr-2 flex"> <ScrollText  className="w-5 h-5 mr-2 text-cyber-400" /> <a href={manifesto} className="text-cyber-300 hover:text-cyber-400 hover:underline">Manifesto:</a></span>
            <iframe src={manifesto} title="Manifesto" className="w-full h-56 rounded-xl border border-white/10 bg-white/5 mt-2"></iframe>
          </div>
          <div className="justify-center mb-2">

            <span className="font-bold text-white mr-2 flex"> <BookText  className="w-5 h-5 mr-2 text-cyber-400" /> <a href={constitution} className="text-cyber-300 hover:text-cyber-400 hover:underline">Constitution:</a></span>
            <iframe src={constitution} title="constitution" className="w-full h-56 rounded-xl border border-white/10 bg-white/5 mt-2"></iframe>
          </div>
        </div>
      </div>
    </div>
        )
}