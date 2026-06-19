import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_URL } from '../../../utils/util';

type TEAM_MEMBERS = {
    id : string,
    name : string,
    role : string,
    avatar : string
}
type TEAM_DETAILS = {
    name : string,
    role:string,
    avatar :string
}

export default function TeamSection () {
    const [teamMembers,setTeamMembers] = useState<TEAM_MEMBERS[]>([]);
    const [teamDetails, setTeamDetails] = useState<TEAM_DETAILS>({ name: '', role: '', avatar: '' });
    const [selfiePreview, setSelfiePreview] = useState<string>('');
    const [active,setActive] = useState<boolean>(false);

    useEffect(() => {
        const getTeamMembers = async () => {
            try {
                const team = await axios.get(`${API_URL}/api/v2/getTeamMembers`,{
                    withCredentials : true
                })
                if(team.status === 200){
                    const memebers = team.data.teamMembers;
                    const updatedMembers : TEAM_MEMBERS[] = await Promise.all(memebers.map(async(member : TEAM_MEMBERS) =>{
                            try {
                                const avatarResponse = await axios.post(`${API_URL}/api/v1/getPublicUrl`,{
                                    file : member.avatar
                                })
                                return { ...member, avatar: avatarResponse.data.url };
                            } catch {
                                return member;
                            }
                    }));        
                    setTeamMembers(updatedMembers);
                }
            } catch {
                alert("Error in fetching team members. Please try again!")
            }
        }
        getTeamMembers();
    },[])
    const handleAddTeamMember = async () => {
        try {
            const teamMember = await axios.post(`${API_URL}/api/v2/addTeamMember`,{
                name : teamDetails?.name,
                role : teamDetails?.role,
                avatar : teamDetails?.avatar
            },{
                withCredentials : true
            })
            if(teamMember.status === 200){
                setTeamMembers([...teamMembers,teamMember.data.partyTeam]);
                alert("Team member added successfully!")
            }
            window.location.reload();
        } catch (error) {
            alert("Error in adding team member. Please try again!")
            console.log("error: ",error)
        }
    }
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should not exceed 5MB');
            return;
        }
      const localPreview = URL.createObjectURL(file);
      setSelfiePreview(localPreview);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const upload = await axios.post(`${API_URL}/api/v1/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if(upload.status !== 200){
            alert("Error in file uploading. Please try again!")
            URL.revokeObjectURL(localPreview);
            setSelfiePreview('');
            return;
        }
        const fileUrl = upload.data.fileUrl;
        setTeamDetails({...teamDetails, avatar : fileUrl});
        URL.revokeObjectURL(localPreview);
      } catch {
        alert("error to connect database")
        URL.revokeObjectURL(localPreview);
        setSelfiePreview('');
      }
    }
}
    return (
        <div className="glass gradient-border rounded-3xl p-6 h-full">
          <h2 className="text-xl font-semibold font-display mb-6">Party Team</h2>

          <div className="space-y-3 h-[35vh] overflow-y-scroll pr-1">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-brand-400/40 transition-colors"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/50"
                />
                <div>
                  <h3 className="font-medium text-white">{member.name}</h3>
                  <p className="text-sm text-white/60">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="btn-primary cursor-pointer w-full mt-6"
            onClick={() => setActive(true)}
          >
            Add Team Member
          </motion.button>
           {active && <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4'>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='glass gradient-border w-full max-w-xl flex flex-col items-center gap-5 rounded-3xl p-8'
                >
                <h1 className='text-3xl font-bold font-display gradient-text'>Add Team Member</h1>
                <div className='w-full'>
                    <label id='name' className='block text-sm font-medium text-white/70 mb-1'>Name:</label>
                    <input id='name' className='w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition'
                    placeholder="Enter team memeber name"
                    onChange={e => setTeamDetails({...teamDetails, name:e.target.value})}
                     />
                </div>
                <div className='w-full'>
                    <label id='role' className='block text-sm font-medium text-white/70 mb-1'>Role:</label>
                    <input id='role' className='w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition'
                    placeholder="Enter team memeber role"
                    onChange={e => setTeamDetails({...teamDetails, role:e.target.value})}
                     />
                </div>
                <div className='w-full'>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                    Selfie Upload
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-white/20 hover:border-brand-400 bg-white/5 rounded-2xl transition-colors">
                    <div className="space-y-1 text-center">
                        {selfiePreview ? (
                        <img
                            src={selfiePreview}
                            alt="Selfie preview"
                            className="mx-auto h-32 w-32 object-cover rounded-2xl ring-2 ring-brand-500/50"
                        />
                        ) : (
                        <Upload className="mx-auto h-12 w-12 text-cyber-400" />
                        )}
                        <div className="flex text-sm text-white/60 justify-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-cyber-300 hover:text-cyber-400 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input
                            type="file"
                            className="sr-only"
                            accept="image/png, image/jpg, image/jpeg"
                            onChange={(e) => {
                                handleFileChange(e)
                            } }
                            />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-white/40">PNG, JPG up to 5MB</p>
                    </div>
                    </div>
                </div>
                <div className='flex justify-between items-center gap-4 w-full max-w-xs'>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    className='btn-primary flex-1 cursor-pointer'
                    onClick={handleAddTeamMember}
                >
                    Add
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    className='btn-ghost flex-1 cursor-pointer'
                    onClick={() => setActive(false)}
                >
                    Cancel
                </motion.button>
                </div>

           </motion.div>
           </div>
           }

        </div>
      );
}