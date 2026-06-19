import React, { useEffect, useState, useRef } from 'react';
import { Camera, Upload, ChevronDown, Save, User, MapPin, CreditCard, Check } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../../utils/util';

export default function VoterSettings() {
  const selfieInputRef = useRef<HTMLInputElement | null>(null);
  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const [publicSelfieUrl, setPublicSelfieUrl] = useState<string>("");
  const [publicDocumentUrl, setPublicDocumentUrl] = useState<string>("")
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: '',
    idType: '',
    gender: '',
    address: '',
    selfieFile: "",
    documentFile: "",
    showDropdown: {
      idType: false,
      gender: false
    },
    saved: false
  });
  useEffect(() =>{
      const getVoter = async () => {
          try {
            const response = await axios.get(`${API_URL}/api/v1/getVoter`,
              {withCredentials : true}
            )
            
            if(response.status === 200){
              const voterData = response.data.voter;
              const [publicSelfieUrlResponse, publicDocumentUrlResponse] = await Promise.all([
                axios.post(`${API_URL}/api/v1/getPublicUrl`, { file: voterData.selfieUrl }),
                axios.post(`${API_URL}/api/v1/getPublicUrl`, { file: voterData.documentUrl }),
              ]);
    
              setPublicSelfieUrl(publicSelfieUrlResponse.data.url || "");
              setPublicDocumentUrl(publicDocumentUrlResponse.data.url || "");
              
              setFormState(prev => ({
                ...prev,
                firstName : response.data.voter.firstName,
                lastName : response.data.voter.lastName,
                idType : response.data.voter.idType,
                gender : response.data.voter.gender,
                address : response.data.voter.address,
                selfieFile : voterData.selfieUrl,
                documentFile : voterData.documentUrl
              }))
            }
          } catch (error) {
            console.log(error);
          }
      }
      getVoter();
  },[])

  const idTypes = ['Aadhar Card', 'Voter Id'];
  const genders = ['Male', 'Female', 'Other'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'selfieFile' | 'documentFile') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const upload = await axios.post(`${API_URL}/api/v1/upload`,formData,{
        headers: { 'Content-Type': 'multipart/form-data' }
       })
       if(upload.status !== 200){
        alert("Error in file uploading. Please try again!")
        return;
       }
       const fileUrl = upload.data.fileUrl;
       const publicUrl = await axios.post(`${API_URL}/api/v1/getPublicUrl`,{
        file : fileUrl
       })
       if(fileType === "selfieFile"){
        setPublicSelfieUrl(publicUrl.data.url)
       }else{
        setPublicDocumentUrl(publicUrl.data.url)
       }
       setFormState((prev) => ({ ...prev, [fileType]: fileUrl }));
    } catch {
      alert("error to connect database")
    }
    
    
    
  };
  const toggleDropdown = (dropdown: 'idType' | 'gender') => {
    setFormState(prev => ({
      ...prev,
      showDropdown: {
        ...prev.showDropdown,
        [dropdown]: !prev.showDropdown[dropdown]
      }
    }));
  };

  const selectOption = (option: string, field: 'idType' | 'gender') => {
    setFormState(prev => ({
      ...prev,
      [field]: option,
      showDropdown: {
        ...prev.showDropdown,
        [field]: false
      }
    }));
  };
  const handleUpdate = (fileType : 'selfieFile' | 'documentFile') => {
    if(fileType === "selfieFile"){
      selfieInputRef.current?.click();
    }else{
      documentInputRef.current?.click();
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const update = await axios.put(`${API_URL}/api/v1/updateProfile`,{
        firstName : formState.firstName,
        lastName : formState.lastName,
        idType : formState.idType,
        gender : formState.gender,
        address : formState.address,
        selfieFile : formState.selfieFile,
        documentFile : formState.documentFile
      },{
        withCredentials : true
      })
      if(update.status === 200){
        setFormState(prev => ({
          ...prev,
          saved : true
        }))
        alert("Profile updated successfully");
      }
    } catch (error) {
      alert("Error updating profile. Please try again!");
      console.log(error)
    }
    
  };

  return (
    <div className="min-h-screen text-white font-sans">
      <div className="relative z-10 container mx-auto px-2 md:px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-sm font-semibold uppercase tracking-widest text-cyber-400">Your account</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold font-display gradient-text">
              User Settings
            </h1>
            <p className="mt-3 text-white/60 max-w-2xl mx-auto">
              Update your profile information and manage your account settings
            </p>
          </div>

          {/* Main card */}
          <div className="glass rounded-3xl gradient-border shadow-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* Two column layout for desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-white/80">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                     value={formState.firstName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                      placeholder="Enter your first name"
                    />
                    <User className="absolute right-3 top-3 h-5 w-5 text-white/40" />
                  </div>
                </div>
                
                {/* Last Name */}
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-white/80">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formState.lastName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                      placeholder="Enter your last name"
                    />
                    <User className="absolute right-3 top-3 h-5 w-5 text-white/40" />
                  </div>
                </div>
                
                {/* Selfie Upload */}
                <div className="space-y-2">
                  <label htmlFor="selfie" className="block text-sm font-medium text-white/80">
                    Selfie Upload
                  </label>
                  
                  {formState.selfieFile ? <div>
                      <button type='button'  onClick={() => handleUpdate("selfieFile")} ><img src={publicSelfieUrl} alt="selfiePhoto" className='w-[15vw] h-[15vw] rounded-2xl object-cover border border-white/10 hover:cursor-pointer hover:opacity-90 transition'/></button>
                      <input
                        type="file"
                        ref={selfieInputRef}
                        className="hidden"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={(e) => handleFileChange(e, 'selfieFile')}
                      />
                  </div> : 
                  <div className="relative group">
                    <input
                      type="file"
                      id="selfie"
                      name="selfie"
                      onChange={(e) => handleFileChange(e, 'selfieFile')}
                      className='hidden'
                      accept="image/*"
                    />
                    <label
                      htmlFor="selfie"
                      className="flex items-center justify-center w-full bg-white/5 border border-white/15 border-dashed rounded-xl px-4 py-8 text-white cursor-pointer hover:bg-white/10 hover:border-brand-400/60 transition-all duration-200 group-hover:shadow-[0_0_18px_rgba(168,85,247,0.3)]"
                    >
                      <div className="text-center">
                        <Camera className="mx-auto h-8 w-8 text-cyber-300 mb-2" />
                        
                      </div>
                    </label>
                  </div>}
                </div>
                
                {/* Document Upload */}
                <div className="space-y-2">
                  <label htmlFor="document" className="block text-sm font-medium text-white/80">
                    Document Upload
                  </label>
                  {formState.documentFile ? <div>
                      <button type='button'  onClick={() => handleUpdate("documentFile")} ><img src={publicDocumentUrl} alt="documentPhoto" className='w-[15vw] h-[15vw] rounded-2xl object-cover border border-white/10 hover:cursor-pointer hover:opacity-90 transition'/></button>
                      <input
                        type="file"
                        ref={documentInputRef}
                        className="hidden"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={(e) => handleFileChange(e, 'documentFile')}
                      />
                  </div> : 
                  <div className="relative group">
                    <input
                      type="file"
                      id="document"
                      name="document"
                      onChange={(e) => handleFileChange(e, 'documentFile')}
                      className="hidden"
                    />
                    <label
                      htmlFor="document"
                      className="flex items-center justify-center w-full bg-white/5 border border-white/15 border-dashed rounded-xl px-4 py-8 text-white cursor-pointer hover:bg-white/10 hover:border-brand-400/60 transition-all duration-200 group-hover:shadow-[0_0_18px_rgba(168,85,247,0.3)]"
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-cyber-300 mb-2" />
                        {/* <span className="text-sm text-gray-300">
                          {formState.documentFile ? formState.documentFile : "Upload your document"}
                        </span> */}
                      </div>
                    </label>
                  </div>}
                </div>
                
                {/* ID Type Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="idType" className="block text-sm font-medium text-white/80">
                    ID Type
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('idType')}
                      className="flex items-center justify-between w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                    >
                      <span className={formState.idType ? "text-white" : "text-white/40"}>
                        {formState.idType || "Select ID type"}
                      </span>
                      <ChevronDown className={`h-5 w-5 text-white/50 transition-transform duration-200 ${formState.showDropdown.idType ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {formState.showDropdown.idType && (
                      <div className="absolute z-10 mt-2 w-full glass rounded-xl border border-white/15 shadow-lg shadow-brand-500/20 py-1 animate-fadeIn">
                        {idTypes.map((type) => (
                          <div
                            key={type}
                            onClick={() => selectOption(type, 'idType')}
                            className="px-4 py-2 text-white/85 hover:bg-white/10 cursor-pointer flex items-center space-x-2"
                          >
                            <CreditCard className="h-4 w-4 text-cyber-300" />
                            <span>{type}</span>
                            {formState.idType === type && (
                              <Check className="h-4 w-4 text-cyber-400 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Gender Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium text-white/80">
                    Gender
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('gender')}
                      className="flex items-center justify-between w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                    >
                      <span className={formState.gender ? "text-white" : "text-white/40"}>
                        {formState.gender || "Select gender"}
                      </span>
                      <ChevronDown className={`h-5 w-5 text-white/50 transition-transform duration-200 ${formState.showDropdown.gender ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {formState.showDropdown.gender && (
                      <div className="absolute z-10 mt-2 w-full glass rounded-xl border border-white/15 shadow-lg shadow-brand-500/20 py-1 animate-fadeIn">
                        {genders.map((gender) => (
                          <div
                            key={gender}
                            onClick={() => selectOption(gender, 'gender')}
                            className="px-4 py-2 text-white/85 hover:bg-white/10 cursor-pointer flex items-center"
                          >
                            <span>{gender}</span>
                            {formState.gender === gender && (
                              <Check className="h-4 w-4 text-cyber-400 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Address - Full width */}
              <div className="mt-6 space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-white/80">
                  Address
                </label>
                <div className="relative">
                  <textarea
                    id="address"
                    name="address"
                    value={formState.address}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition resize-none"
                    placeholder="Enter your full address"
                  ></textarea>
                  <MapPin className="absolute right-3 top-3 h-5 w-5 text-white/40" />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className={`btn-primary ${
                    formState.saved ? 'pointer-events-none' : ''
                  }`}
                >
                  {formState.saved ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Save Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}