import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Calendar, MapPin } from 'lucide-react';

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    gender: 'Male' | 'Female' | 'Other';
  }

interface Props {
  onNext: () => void;
  updateFormData: (data: PersonalInfo) => void;
}

export const PersonalInfoStep: React.FC<Props> = ({ onNext, updateFormData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PersonalInfo>();

  const onSubmit = (data: PersonalInfo) => {
    const dateObj = new Date(data.dateOfBirth);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const year = dateObj.getFullYear();
     
    const formattedDate = `${day}/${month}/${year}`;
    data.dateOfBirth = formattedDate;

    updateFormData(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
            <input
              {...register('firstName', { required: 'First name is required' })}
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
              placeholder="Enter your first name"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
            <input
              {...register('lastName', { required: 'Last name is required' })}
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
              placeholder="Enter your last name"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Date of Birth
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <input
            type="date"
            {...register('dateOfBirth', {
              required: 'Date of birth is required',
              validate: value => {
                const age = new Date().getFullYear() - new Date(value).getFullYear();
                return age >= 18 || 'You must be at least 18 years old';
              }
            })}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition [color-scheme:dark]"
          />
        </div>
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <input
            {...register('address', { required: 'Address is required' })}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
            placeholder="Enter your full address"
          />
        </div>
        {errors.address && (
          <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Gender
        </label>
        <select
          {...register('gender', { required: 'Gender is required' })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
        >
          <option value="" className="bg-ink-800">Select gender</option>
          <option value="Male" className="bg-ink-800">Male</option>
          <option value="Female" className="bg-ink-800">Female</option>
          <option value="Other" className="bg-ink-800">Other</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-400">{errors.gender.message}</p>
        )}
      </div>

      <div className="flex justify-end">
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