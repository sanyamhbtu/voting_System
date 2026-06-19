import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Upload } from 'lucide-react';
import axios from 'axios'
import { API_URL } from '../../../utils/util';
export interface IdentityInfo {
    idType: 'Aadhar Card' | 'Voter Id';
    documentNumber: string;
    selfieUrl: string;
    documentUrl: string;
  }

interface Props {
  onNext: () => void;
  onPrevious: () => void;
  updateFormData: (data: IdentityInfo) => void;
}

export const IdentityVerificationStep: React.FC<Props> = ({
  onNext,
  onPrevious,
  updateFormData
}) => {
  const [selfiePreview, setSelfiePreview] = useState<string>('');
  const [documentPreview, setDocumentPreview] = useState<string>('');
  const[selfieUrl, setSelfieUrl] = useState<string>('');
  const[documentUrl, setDocumentUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IdentityInfo>();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "selfie" | "document"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      const localPreview = URL.createObjectURL(file);
    if (type === "selfie") {
      setSelfiePreview(localPreview);
    } else {
      setDocumentPreview(localPreview);
    }
      const formData = new FormData();
      formData.append('file', file);
      try {
        const upload = await axios.post(`${API_URL}/api/v1/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if(upload.status !== 200){
            alert("Error in file uploading. Please try again!")
            URL.revokeObjectURL(localPreview);
            if (type === "selfie") setSelfiePreview('');
            else setDocumentPreview('');
            return;
        }
        const fileUrl = upload.data.fileUrl;
        if(type === "selfie"){
          setSelfieUrl(fileUrl);
        }else{
          setDocumentUrl(fileUrl);
        }
        URL.revokeObjectURL(localPreview);
      } catch {
        alert("error to connect database")
        URL.revokeObjectURL(localPreview);
        if (type === "selfie") setSelfiePreview('');
        else setDocumentPreview('');
      }
      
  };
}
  const onSubmit = (data: IdentityInfo) => {
    updateFormData({ ...data, selfieUrl: selfieUrl, documentUrl: documentUrl });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          ID Type
        </label>
        <select
          {...register('idType', { required: 'ID type is required' })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
        >
          <option value="" className="bg-ink-800">Select ID type</option>
          <option value="Aadhar Card" className="bg-ink-800">Aadhar Card</option>
          <option value="Voter Id" className="bg-ink-800">Voter ID</option>
        </select>
        {errors.idType && (
          <p className="mt-1 text-sm text-red-400">{errors.idType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Document Number
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <input
            {...register('documentNumber', {
              required: 'Document number is required',
              pattern: {
                value: /^[0-9]{12}$/,
                message: 'Please enter a valid 12-digit number'
              }
            })}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
            placeholder="Enter your document number"
          />
        </div>
        {errors.documentNumber && (
          <p className="mt-1 text-sm text-red-400">{errors.documentNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Selfie Upload
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/15 border-dashed rounded-xl bg-white/5 transition hover:border-brand-400/60">
          <div className="space-y-1 text-center">
            {selfiePreview ? (
              <img
                src={selfiePreview}
                alt="Selfie preview"
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
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={(e) => {
                    handleFileChange(e,"selfie")
                  } }
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-white/40">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          ID Document Upload
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/15 border-dashed rounded-xl bg-white/5 transition hover:border-brand-400/60">
          <div className="space-y-1 text-center">
            {documentPreview ? (
              <img
                src={documentPreview}
                alt="Document preview"
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
                  onChange={(e) => {
                    handleFileChange(e,"document")
                  } }
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-white/40">PNG, JPG up to 5MB</p>
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
}
