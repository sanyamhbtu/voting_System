import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Image, FileText, User, Users, Building, AtSign,Bell, Settings as SettingsIcon, Award} from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_URL } from '../../../utils/util';

export interface PartyDetails {
    name: string;
    abbreviation: string;
    address: string;
    symbol: string;
    username: string;
    leaderName: string;
    manifesto: string;
    constitution: string;
  }

export default function Settings () {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [partyDetails, setPartyDetails] = useState<PartyDetails>({
        name: '',
        abbreviation: '',
        address: '',
        symbol: '',
        username: '',
        leaderName: '',
        manifesto: '',
        constitution: '',
      });
      const [symbolPreview, setSymbolPreview] = useState<string | null>(null);
      const [manifestoPreview, setManifestoPreview] = useState<boolean>(false);
      const [constitutionPreview, setConstitutionPreview] = useState<boolean>(false);
      useEffect(() => {
        const getPartyDetails = async () => {
            try {
                const details = await axios.get(`${API_URL}/api/v2/partyDetails`,{
                    withCredentials : true
                })
                if(details.status === 200){
                    console.log("details",details.data.partyDetails);
                    setPartyDetails( {
                        name: details.data.partyDetails.partyName,
                        abbreviation: details.data.partyDetails.partyAbbreviation,
                        address: details.data.partyDetails.address,
                        symbol: details.data.partyDetails.symbolUrl || '',
                        username: details.data.partyDetails.username,
                        leaderName: details.data.partyDetails.partyLeaderName,
                        manifesto: details.data.partyDetails.manifesto || '',
                        constitution: details.data.partyDetails.partyConstitution || '',

                });

                }else{
                    setPartyDetails({
                        name: '',
                        abbreviation: '',
                        address: '',
                        symbol: '',
                        username: '',
                        leaderName: '',
                        manifesto: '',
                        constitution: '',
                    })
                }
                console.log("partyDetails", partyDetails)
            } catch {
                alert("Error in fetching details. Please try again!")
                setPartyDetails({
                    name: '',
                    abbreviation: '',
                    address: '',
                    symbol: '',
                    username: '',
                    leaderName: '',
                    manifesto: '',
                    constitution: '',
                })
            }
        }
        getPartyDetails();
    },[]);
    
    const handleFileUpload = async (e : React.ChangeEvent<HTMLInputElement>, type : string) => {
        const file = e.target.files?.[0];
        if(file) {
            if(type === 'symbol' && file.size > 5 * 1024 * 1024){
                alert('Symbol size should not exceed 5MB');
                return;
            }
            if(type === 'manifesto' && file.size > 30 * 1024 * 1024){
                alert('Manifesto size should not exceed 30MB');
                return;
            }
            if(type === 'constitution' && file.size > 30 * 1024 * 1024){
                alert('Constitution size should not exceed 30MB');
                return;
            }
            const localPreview = URL.createObjectURL(file);
            if(type === 'symbol'){
                setSymbolPreview(localPreview);
            }else if(type === 'manifesto'){
                setManifestoPreview(true);
            }else if(type === 'constitution'){
                setConstitutionPreview(true)
            }
            const formData = new FormData();
            formData.append('file', file);
            try {
                const upload = await axios.post(`${API_URL}/api/v1/upload`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                if(upload.status !== 200){
                    alert("Error in file uploading. Please try again!")
                    if(type === 'symbol'){
                        URL.revokeObjectURL(localPreview);
                    }
                    if(type === 'symbol'){
                        setSymbolPreview(null);
                    }else if(type === 'manifesto'){
                        setManifestoPreview(false);
                    }else if(type === 'constitution'){
                        setConstitutionPreview(false)
                    }
                    return
                }
                if(type === 'manifesto'){
                    setPartyDetails({...partyDetails, manifesto : upload.data.url});
                  setManifestoPreview(true);
                }else if(type === 'constitution'){
                    setPartyDetails({...partyDetails, constitution : upload.data.url})
                    setConstitutionPreview(true)
                }else if( type === 'symbol'){
                    setPartyDetails({...partyDetails, symbol : upload.data.url})
                }
              } catch {
                alert("error to connect database")
              }finally {
                URL.revokeObjectURL(localPreview);
              }
            
        }
    }
    const handleSubmit = async () => {
        
        try {
            const update = await axios.put(`${API_URL}/api/v2/updateProfile`,{
                    name: partyDetails.name,
                    abbreviation: partyDetails.abbreviation,
                    address: partyDetails.address,
                    symbol: partyDetails.symbol,
                    username: partyDetails.username,
                    leaderName: partyDetails.leaderName,
                    manifesto: partyDetails.manifesto,
                    constitution: partyDetails.constitution
            },{
                withCredentials : true
            })
            if(update.status === 200){
                alert("Profile updated successfully!");
                navigate(`/party/dashboard/${token}`)
            }
        } catch {
            alert("Error in updating profile. Please try again!")
            navigate(`/party/dashboard/${token}`)
        }
    }
      return (
        <div className="min-h-screen bg-aurora text-white p-8">

            <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border-b border-white/10 p-4 mb-11 rounded-2xl"
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link to={`/party/dashboard/${token}`}>
                  <div className="flex items-center space-x-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white glow">
                      <Award className="w-6 h-6" />
                    </span>
                    <h1 className="text-2xl font-bold font-display gradient-text">
                      ElectCode
                    </h1>
                  </div>
              </Link>

              <div className="flex items-center space-x-2">
                <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-400 transition-colors cursor-pointer">
                  <Bell className="w-5 h-5 text-cyber-400" />
                </button>
                <Link to={`/party/dashboard/${token}/settings`}><button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-400 transition-colors cursor-pointer">
                  <SettingsIcon className="w-5 h-5 text-cyber-400" />
                </button></Link>

              </div>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto glass gradient-border rounded-3xl overflow-hidden glow"
          >
            <div className="relative bg-brand-gradient-animated p-6 overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <h1 className="relative text-3xl font-bold font-display text-white">Party Details</h1>
            </div>
    
            <div className="p-8 grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Party Name */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-white/70">
                    <Users className="w-4 h-4 mr-2 text-cyber-400" />
                    Party Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={partyDetails.name}
                    onChange={(e) => {setPartyDetails({ ...partyDetails, name : e.target.value})}}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                    placeholder={partyDetails.name || 'Enter party name'}
                  />
                </motion.div>
    
                {/* Abbreviation */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-white/70">
                    <AtSign className="w-4 h-4 mr-2 text-cyber-400" />
                    Party Abbreviation
                  </label>
                  <input
                    type="text"
                    name="abbreviation"
                    value={partyDetails.abbreviation}
                    onChange={(e) => {setPartyDetails({ ...partyDetails, abbreviation : e.target.value})}}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                    placeholder={partyDetails.abbreviation ||"Enter abbreviation"}
                  />
                </motion.div>
              </div>
    
              {/* Address */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-white/70">
                  <Building className="w-4 h-4 mr-2 text-cyber-400" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={partyDetails.address}
                  onChange={(e) => {setPartyDetails({ ...partyDetails, address : e.target.value})}}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                  placeholder={partyDetails.address ||"Enter party address"}
                />
              </motion.div>
    
              {/* Symbol Upload */}
              {symbolPreview ? <div className='flex flex-col justify-center items-center gap-3'>
                <img
                src={symbolPreview}
                alt="Selfie preview"
                className="mx-auto h-32 w-32 object-cover rounded-2xl ring-2 ring-brand-500/50"
              />
              <label className="relative cursor-pointer rounded-md font-medium text-cyber-300 hover:text-cyber-400 focus-within:outline-none">
                <span>Upload a symbol</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e,'symbol')}
                />
              </label>
              </div> :
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label className="flex items-center text-sm font-medium text-white/70">
                  <Image className="w-4 h-4 mr-2 text-cyber-400" />
                  Party Symbol
                </label>
                <div
                  
                  className="border-2 border-dashed border-white/20 bg-white/5 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 transition-colors"
                >
                <label className="relative cursor-pointer rounded-md font-medium text-cyber-300 hover:text-cyber-400 focus-within:outline-none">
                <span>Upload a symbol</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e,'symbol')}
                />
              </label>
                  
                    <Upload className="w-12 h-12 mx-auto text-cyber-400 mb-2" />

                  <p className="text-sm text-white/50">Drop your party symbol here or click to upload</p>
                </div>
              </motion.div>
                }
              <div className="grid md:grid-cols-2 gap-6">
                {/* Username */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-white/70">
                    <User className="w-4 h-4 mr-2 text-cyber-400" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={partyDetails.username}
                    onChange={(e) => {setPartyDetails({ ...partyDetails, username : e.target.value} ) }}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                    placeholder={partyDetails.username || "Enter username"}
                  />
                </motion.div>
    
                {/* Party Leader */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-white/70">
                    <User className="w-4 h-4 mr-2 text-cyber-400" />
                    Party Leader Name
                  </label>
                  <input
                    type="text"
                    name="leaderName"
                    value={partyDetails.leaderName}
                    onChange={(e) => {setPartyDetails({ ...partyDetails, leaderName : e.target.value})}}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                    placeholder={partyDetails.leaderName || "Enter party leader name"}
                  />
                </motion.div>
              </div>
    
              {/* Document Uploads */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Manifesto Upload */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-white/70">
                    <FileText className="w-4 h-4 mr-2 text-cyber-400" />
                    Party Manifesto (PDF)
                  </label>
                  <div
                    className="border-2 border-dashed border-white/20 bg-white/5 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 transition-colors"
                  >
                <label className="relative cursor-pointer rounded-md font-medium text-cyber-300 hover:text-cyber-400 focus-within:outline-none">
                <span>Upload a maifesto</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e,'manifesto')}
                />
              </label>
                    {manifestoPreview ? <div className="mt-2 text-sm text-cyber-300 font-medium">Manifesto file uploaded</div> :
                    <div>

                    <Upload className="w-8 h-8 mx-auto text-cyber-400 mb-2" />
                    <p className="text-sm text-white/50">
                      Upload Manifesto (PDF)
                    </p>
                    </div>
                    
                    }
                  </div>
                </motion.div>
    
                {/* Constitution Upload */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="flex items-center text-sm font-medium text-white/70">
                    <FileText className="w-4 h-4 mr-2 text-cyber-400" />
                    Party Constitution (PDF)
                  </label>
                  <div
                    className="border-2 border-dashed border-white/20 bg-white/5 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 transition-colors"
                  >
                <label className="relative cursor-pointer rounded-md font-medium text-cyber-300 hover:text-cyber-400 focus-within:outline-none">
                <span>Upload a constitution</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e,'constitution')}
                />
              </label>
                    {constitutionPreview ? <div className="mt-2 text-sm text-cyber-300 font-medium">Constitution file uploaded</div> :
                    <div>

                    <Upload className="w-8 h-8 mx-auto text-cyber-400 mb-2" />
                    <p className="text-sm text-white/50">
                      Upload Constitution (PDF)
                    </p>
                    </div>
                    }
                  </div>
                </motion.div>
              </div>
    
              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="btn-primary w-full"
              >
                Save Party Details
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
}