import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Upload } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../../utils/util';
export interface DetailInfo {
    partyLeaderName : string,
    manifesto : string,
    partyConstitution : string,
  }

interface Props {
  onNext: () => void;
  onPrevious: () => void;
  updateFormData: (data: DetailInfo) => void;
}

export const PartyDetailsStep: React.FC<Props> = ({
  onNext,
  onPrevious,
  updateFormData
}) => {
  const [manifesto, setManifesto] = useState<string>('');
  const [partyConstitution, setPartyConstitution] = useState<string>('');
  const [manifestoPreview, setManifestoPreview] = useState<string>('');
  const [partyConstitutonPreview, setPartyConstitutonPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DetailInfo>();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type : string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        alert('File size should not exceed 10MB');
        return;
      }
      const localPreview = URL.createObjectURL(file);
      if (type === "manifesto") {
        setManifestoPreview(localPreview);
      } else {
        setPartyConstitutonPreview(localPreview);
      }
        const formData = new FormData();
        formData.append('file', file);
      try {
        const upload = await axios.post(`${API_URL}/api/v1/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log(upload)
        if(upload.status !== 200){
            alert("Error in file uploading. Please try again!")
            URL.revokeObjectURL(localPreview);
            if (type === "manifesto") setManifestoPreview('');
            else setPartyConstitutonPreview('');
            return;
        }
        if(type === 'manifesto'){
          setManifesto(upload.data.fileUrl);
        }else{
          setPartyConstitution(upload.data.fileUrl);
        }
      } catch {
        alert("error to connect database")
      }finally {
        URL.revokeObjectURL(localPreview);
      }
    }
  };

  const onSubmit = (data: DetailInfo) => {
    console.log("manifesto", manifesto)
    console.log("partyConstitution", partyConstitution)
    updateFormData({ ...data, manifesto: manifesto, partyConstitution: partyConstitution });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Party Leader Name
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <input
            {...register('partyLeaderName', {
              required: 'Party leader name is required'
            })}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
            placeholder="Enter party leader name"
          />
        </div>
        {errors.partyLeaderName && (
          <p className="mt-1 text-sm text-red-400">{errors.partyLeaderName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Party Manifesto Upload
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/15 border-dashed rounded-xl bg-white/5 transition hover:border-brand-400/60">
          <div className="space-y-1 text-center">
            {manifestoPreview ? (
              <img
                src={manifestoPreview}
                alt="manifesto preview"
                className="mx-auto h-32 w-32 object-cover rounded-lg"
              />
            ) : (
              <Upload className="mx-auto h-12 w-12 text-white/40" />
            )}
            <div className="flex text-sm text-white/60">
              <label className="relative cursor-pointer rounded-md font-medium text-cyber-300 hover:text-cyber-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "manifesto")}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-white/40">pdf up to 30MB</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Party Constitution Upload
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/15 border-dashed rounded-xl bg-white/5 transition hover:border-brand-400/60">
          <div className="space-y-1 text-center">
            {partyConstitutonPreview ? (
              <img
                src={partyConstitutonPreview}
                alt="constitution preview"
                className="mx-auto h-32 w-32 object-cover rounded-lg"
              />
            ) : (
              <Upload className="mx-auto h-12 w-12 text-white/40" />
            )}
            <div className="flex text-sm text-white/60">
              <label className="relative cursor-pointer rounded-md font-medium text-cyber-300 hover:text-cyber-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "partyConstitution")}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-white/40">pdf up to 30MB</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="btn-ghost"
        >
          Previous
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Next Step
        </button>
      </div>
    </form>
  );
};