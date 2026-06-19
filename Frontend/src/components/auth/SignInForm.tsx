import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Mail, Vote } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { API_URL, type ApiError } from '../../utils/util';

export interface UserCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
  }
export const SignInForm = ({setIsRegistering} : {setIsRegistering : (state : boolean) => void}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserCredentials>();

  const onSubmit = async (data: UserCredentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/signin`,{
             username : data.username,
             password : data.password
      });
      if(response.status !== 200){
        console.log("response:",response);
          alert(response.data.message)
          return;
      }
      const token = response.data.token;
      Cookies.set('token',token, {expires : 2});
      navigate(`/voter/dashboard/${token}`)
      alert(response.data.message);
    }catch(error){
      alert((error as ApiError).response?.data?.message)
    }
     finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-aurora flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent-500/30 blur-3xl animate-blob" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass rounded-3xl p-8 w-full max-w-md text-white"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient glow">
            <Vote className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display gradient-text">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-white/60">Sign in to cast your vote securely</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Username / Voter ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
              <input
                {...register('username', { required: 'Username is required' })}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-12 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition duration-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-brand-500 focus:ring-brand-500/40 transition duration-300"
              />
              <span className="ml-2 text-sm text-white/60">Remember me</span>
            </label>
            <a
              href="#forgot-password"
              className="text-sm text-cyber-300 hover:text-cyber-400 transition duration-300"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/50">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-ghost w-full"
          >
            <Mail className="h-5 w-5" />
            <span>Sign in with Google</span>
          </button>
        </form>
      </motion.div>
      <p className="relative text-center mt-6 text-white/60">
            Don't have an account?{' '}
            <button
              onClick={() => setIsRegistering(true)}
              className="font-semibold text-cyber-300 hover:text-cyber-400 transition duration-300 cursor-pointer"
            >
              Register now
            </button>
          </p>
    </div>
  );
};