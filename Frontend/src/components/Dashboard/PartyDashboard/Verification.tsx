import { useEffect, useState } from 'react';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../../utils/util';

type VerificationStatus = 'unverified'| 'verifying' | 'verified' | 'failed';

export default function Verification () {
    const [partyCode, setPartyCode] = useState('');
    const [status, setStatus] = useState<VerificationStatus>('unverified');
    useEffect(() => {
        const checkVerificationStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v2/partyDetails`,{
                    withCredentials : true
                })
                if(response.status === 200){
                    if(response.data.partyDetails.verified){
                        setStatus('verified')
                    }else{
                        setStatus('unverified')
                    }
                }else{
                    alert(response.data.message)
                }

            } catch {
                alert("Error in fetching party status. Please try again!")
            }
        }
        checkVerificationStatus()
    },[]);
  const handleVerification = async () => {
    if (!partyCode) return;
    if(status === 'verified'){
        alert('Party already verified');
        return;
    }
    setStatus('verifying');
    // Simulate verification process
    try {
        const verification = await axios.post(`${API_URL}/api/v2/verifyParty`,{
            voterId : partyCode
        });
        if(verification.status === 200){
            setStatus('verified')
        }else{
            setStatus('failed')
        }
    } catch (error) {
        console.log("error", error)
        alert("Error in verifying party. Please try again!")
        setStatus('failed')
    }
  };

  const statusConfig = {
    unverified: {
      icon: Shield,
      text: 'Enter party code to verify',
      color: 'text-white/60',
    },
    verifying: {
      icon: Shield,
      text: 'Verifying...',
      color: 'text-cyber-400',
    },
    verified: {
      icon: ShieldCheck,
      text: 'Party Verified!',
      color: 'text-emerald-400',
    },
    failed: {
      icon: ShieldX,
      text: 'Verification Failed',
      color: 'text-red-400',
    },
  };

  const { icon: StatusIcon, text, color } = statusConfig[status];

  return (
    <div className="min-h-screen bg-aurora text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl animate-blob z-0" />
        <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-accent-500/30 blur-3xl animate-blob z-0" style={{ animationDelay: '3s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-16 sm:py-24">
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-center mb-8">
              Party <span className="gradient-text">Verification System</span>
            </h1>
            <p className="text-xl text-white/65 text-center max-w-2xl mx-auto mb-12">
              Verify your party credentials instantly with our secure verification system
            </p>

            {/* Verification Card */}
            <div className="max-w-md mx-auto glass gradient-border rounded-3xl p-8 glow">
              <div className="flex flex-col items-center gap-6">
                <div className={`p-4 rounded-full bg-white/5 border border-white/10 ${color}`}>
                  <StatusIcon size={32} />
                </div>

                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="partyCode" className="block text-sm font-medium text-white/70">
                      Party Code
                    </label>
                    <input
                      type="text"
                      id="partyCode"
                      value={partyCode}
                      onChange={(e) => setPartyCode(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40 outline-none transition"
                      placeholder="Enter your party code"
                      disabled={status === 'verifying'}
                    />
                  </div>

                  <button
                    onClick={handleVerification}
                    disabled={status === 'verifying' || !partyCode}
                    className="btn-primary w-full"
                  >
                    {status === 'verifying' ? 'Verifying...' : 'Verify Party'}
                  </button>
                </div>

                <p className={`text-sm font-medium ${color}`}>
                  {text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Instant Verification',
              description: 'Get real-time verification results for your party credentials',
            },
            {
              title: 'Secure System',
              description: 'Advanced security measures to protect your verification process',
            },
            {
              title: '24/7 Availability',
              description: 'Access our verification system anytime, anywhere',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 glass rounded-3xl transition hover:bg-white/[0.1]"
            >
              <h3 className="text-xl font-semibold font-display text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}