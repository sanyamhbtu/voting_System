import { useEffect, useState, useRef } from 'react';
import { Vote, Users, PartyPopper, Trophy,Circle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL, type ApiError } from '../../../utils/util';

interface Party {
    id: number;
    name: string;
    votes: number;
    color: string;
  }

export default function Votenow () {
    const [ids , setIds] = useState<string[]>([]);
    const COLORS = [
        '#8b5cf6', '#d946ef', '#22d3ee', '#a78bfa', '#e879f9',
        '#67e8f9', '#7c3aed', '#c026d3', '#06b6d4', '#c4b5fd',
        '#f0abfc', '#a5f3fc', '#6d28d9', '#a21caf', '#0891b2',
        '#ddd6fe', '#f5d0fe', '#cffafe', '#5b21b6', '#86198f',
        '#0e7490', '#8b5cf6', '#d946ef', '#22d3ee', '#a78bfa',
        '#e879f9', '#67e8f9', '#7c3aed', '#c026d3', '#06b6d4'
      ];
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
      useEffect(() => {
            const getPartiesId = async () => {
                try {
                    const response = await axios.get(`${API_URL}/api/v2/getPartiesId`);
                    if(response.data?.partyIds){
                        setIds(response.data.partyIds);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            getPartiesId();
      },[]);
      useEffect(() => {
              if (ids.length === 0) return;
      
          const getPartyData = async () => {
            try {
              const requests = ids.map((party) => getFunction(party));
            const results = await Promise.all(requests);
            const validData = results
              .map((res, index) => ({
                id : res.id,
                name: res.name,
                votes: res.voteCount,
                color: COLORS[index % COLORS.length],
              }));
              setParties(validData);
            } catch (error) {
              console.log(error);
            }
          };
          getPartyData();
          },[ids])
      const getFunction = async (partyId: string) => {
        try {
          const response = await axios.get(`${API_URL}/api/v3/partyStatus`, {
            params: { partyId },
          });
          return response.data;
        } catch (error) {
          console.error(`Error fetching party ${partyId}:`, error);
          return null;
        }
      };
      const startCamera = async (id : number) => {
        setIsOpen(true);
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
          setSelectedId(id);
          
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };
    
      const stopCamera = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setSelectedId(null)
        setIsOpen(false);
      };
    
      const capturePhoto = async () => {
        setLoading(true);
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
          const image = canvas.toDataURL('image/jpeg');
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
          const formData = new FormData();
          formData.append("file", file);
          try {
            const upload = await axios.post(`${API_URL}/api/v1/upload`,formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
            )
            if(upload.status === 200){
              const verify = await axios.post(`${API_URL}/api/v1/verifyVoter`,{
                file : upload.data.fileUrl
              },{
                withCredentials : true
              });
              if(verify.status === 200){
                handleVote(selectedId as number);
              }else{
                alert("Voter not verified. Please try again!");
              }
            }else{
              alert("Internal error. Please try again!")
            }
          } catch (error) {
            console.log(error)
            alert((error as ApiError).response?.data?.message)
          }finally{
            setLoading(false)
          }
          stopCamera();
          
        }
      };
      const handleVote = async(id: number) => {
            try {
                const isVerified = await axios.get(`${API_URL}/api/v1/getVoter`,
                    {withCredentials:true}
                );
                if(!isVerified){
                    alert("voter is not login")
                }
                const status = isVerified.data.voter.verified;
                if(!status){
                    alert("voter is not verified")
                    return;
                }
                const castVote = await axios.post(`${API_URL}/api/v3/vote`,{
                    partyId : id
                },{
                    withCredentials : true
                });
                if(!castVote){
                    alert("something went wrong");
                    return;
                }
                if(castVote.status === 200){
                    setParties(parties.map(party => 
                        party.id === id ? { ...party, votes: party.votes + 1 } : party
                    ));
                }
                alert("vote cast successfully");
                window.location.reload();
            } catch (error) {
              console.log(error);
                alert(`${(error as ApiError).response?.data?.message}. ${(error as ApiError).response?.data?.error?.reason}`);
            }
        
      };
      const maxVotes = Math.max(...parties.map(party => party.id));
    if(loading) return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-white/15 border-t-accent-500 rounded-full animate-spin"></div>
      </div>
    )
      return (
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto py-10 px-2 md:px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 flex items-center justify-center gap-3">
                <PartyPopper className="h-9 w-9 text-cyber-400" />
                <span className="gradient-text">Vote Now</span>
              </h1>
              <p className="text-white/65 text-lg">Cast your vote and make your voice heard!</p>
            </div>

            <div className="space-y-5">
         {parties.map((party) => (
                <motion.div
                  key={party.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 glow` } style={{ backgroundColor: party.color }}>
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold font-display text-white">
                          {party.name}
                          {party.votes === maxVotes && (
                            <Trophy className="h-5 w-5 text-cyber-400 inline ml-2" />
                          )}
                        </h3>
                        <p className="text-white/55">{party.votes} votes</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => startCamera(party.id)}
                      className="btn-primary cursor-pointer"
                    >
                      <Vote className="w-5 h-5" />
                      Vote
                    </motion.button>
                  </div>
                  <div className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={` h-2 rounded-full transition-all duration-500 ease-out`}
                      style={{
                        width: `${(party.votes / maxVotes) * 100}%`,
                        backgroundColor: party.color
                      }}
                    />
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
          {isOpen  && (
                    <div className="fixed inset-0 flex items-center justify-center bg-ink-900/70 backdrop-blur-lg z-50">
                    <div className="relative glass rounded-3xl shadow-2xl w-full max-w-lg p-6 glow">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-2xl shadow-md w-full scale-x-[-1]"
                      />
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={capturePhoto}
                          className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-md hover:bg-white/90 transition cursor-pointer"
                        >
                          <Circle className="text-accent-500" size={34} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={stopCamera}
                          className="flex items-center justify-center w-14 h-14 glass rounded-full shadow-md hover:bg-white/15 transition cursor-pointer"
                        >
                          <X className="text-white" size={24} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
          )}
        </div>

      );
}