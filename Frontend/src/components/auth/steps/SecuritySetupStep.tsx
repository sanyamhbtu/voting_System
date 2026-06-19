import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone, User, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../../utils/util';

export interface SecurityInfo {
    mobile: string;
    username: string;
    password: string;
    email: string;
  }

interface Props {
  onNext: () => void;
  onPrevious: () => void;
  updateFormData: (data: SecurityInfo) => void;
}

export const SecuritySetupStep: React.FC<Props> = ({
  onNext,
  onPrevious,
  updateFormData
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SecurityInfo>();

  const password = watch('password', '');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleSendOTP = () => {
    // Simulate OTP sending
    setOtpSent(true);
  };

  const verifyOTP = () => {
    // Simulate OTP verification
    if (otp === '123456') {
      return true;
    }
    return false;
  };

  const onSubmit = async (data: SecurityInfo) => {
    if (!otpSent || !verifyOTP()) {
      alert('Please verify your mobile number');
      return;
    }
    try {
      const voter = await axios.post(`${API_URL}/api/v1/emailcheck`, {
        email : data.email
      })
      console.log("voter:",voter.data)
      if(voter.status !== 200){
        alert("This email is already registered");
        return;
      }
    } catch (error) {
      console.log("error",error)
      alert("Server down. Please try again later.")
      return;
    }
    updateFormData(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Mobile Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <input
            {...register('mobile', {
              required: 'Mobile number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit mobile number'
              }
            })}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-28 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
            placeholder="Enter your mobile number"
          />
          <button
            type="button"
            onClick={handleSendOTP}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-gradient text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:brightness-110 transition duration-300"
          >
            Send OTP
          </button>
        </div>
        {errors.mobile && (
          <p className="mt-1 text-sm text-red-400">{errors.mobile.message}</p>
        )}
      </div>

      {otpSent && (
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Enter OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 tracking-[0.4em] focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <input
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 4,
                message: 'Username must be at least 4 characters'
              }
            })}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
            placeholder="Choose a username"
          />
        </div>
         {/* <boltAction type="file" filePath="src/components/auth/steps/SecuritySetupStep.tsx" /> */}
        {errors.username && (
          <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5 cursor-pointer" onClick={() =>{setShowPassword(!showPassword)}} />
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
                message: 'Password must contain at least one uppercase letter, one number, and one special character'
              }
            })}
            type={showPassword ? 'text' : 'password'}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
            placeholder="Create a strong password"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
        <div className="mt-2">
          <div className="flex gap-2 mb-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < getPasswordStrength(password)
                    ? 'bg-brand-gradient'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-white/50">
            Password strength: {
              ['Weak', 'Fair', 'Good', 'Strong'][getPasswordStrength(password) - 1] || 'Very Weak'
            }
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
          <input
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
            placeholder="Enter your email address"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
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