import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyInfoStep } from './steps/PartyInfoStep.tsx';
import { PartyIdentityVerificationStep } from './steps/PartyIdentityVerificationStep.tsx';
import { PartySecuritySetupStep } from './steps/PartySecuritySetupStep.tsx';
import { PartyReviewStep } from './steps/PartyReviewStep.tsx';
import { PartyDetailsStep } from './steps/PartyDetailsStep.tsx';
import type { PersonalInfo } from './steps/PartyInfoStep.tsx';
import type { IdentityInfo } from './steps/PartyIdentityVerificationStep.tsx';
import type { SecurityInfo } from './steps/PartySecuritySetupStep.tsx';
import type { DetailInfo } from './steps/PartyDetailsStep.tsx';
export type RegistrationStep = 'personal' | 'identity' | 'details' | 'security' | 'review';
export type FormData = PersonalInfo & IdentityInfo & SecurityInfo & DetailInfo;
export const RegistrationForm = ({setIsRegistering} : {setIsRegistering : (state : boolean) => void}) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal');
  const [formData, setFormData] = useState<FormData>({
    partyName: '',
    partyAbbreviation: '',
    dateOfBirth: '',
    address: '',
    gender: 'Male',
    idType: 'Aadhar Card',
    documentNumber: '',
    symbolUrl: '',
    documentUrl: '',
    mobile: '',
    username: '',
    password: '',
    email: '',
    partyLeaderName : '',
    manifesto : '',
    partyConstitution : ''

  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    const steps: RegistrationStep[] = ['personal', 'identity','details', 'security', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const steps: RegistrationStep[] = ['personal', 'identity','details', 'security', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="relative min-h-screen bg-aurora flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent-500/30 blur-3xl animate-blob" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass rounded-3xl p-8 w-full max-w-2xl text-white"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center font-display gradient-text">
            Create Your Account
          </h1>
          <div className="flex justify-center mt-6">
            <div className="flex items-center">
              {['personal', 'identity','details', 'security', 'review'].map((step, index) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                      step === currentStep
                        ? 'bg-brand-gradient text-white glow'
                        : index < ['personal', 'identity', 'security', 'review'].indexOf(currentStep)
                        ? 'bg-brand-600 text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-12 h-1 rounded-full ${
                        index < ['personal', 'identity', 'security', 'review'].indexOf(currentStep)
                          ? 'bg-brand-gradient'
                          : 'bg-white/10'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'personal' && (
              <PartyInfoStep onNext={nextStep} updateFormData={updateFormData} />
            )}
            {currentStep === 'identity' && (
              <PartyIdentityVerificationStep
                onNext={nextStep}
                onPrevious={previousStep}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 'details' && (
              <PartyDetailsStep
                onNext={nextStep}
                onPrevious={previousStep}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 'security' && (
              <PartySecuritySetupStep
                onNext={nextStep}
                onPrevious={previousStep}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 'review' && (
              <PartyReviewStep
                formData = {formData}
                onPrevious={previousStep}
                updateFormData={updateFormData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <p className="relative text-center mt-6 text-white/60">
            Already have an party?{' '}
            <button
              onClick={() => setIsRegistering(false)}
              className="font-semibold text-cyber-300 hover:text-cyber-400 transition duration-300 cursor-pointer"
            >
              Sign in
            </button>
          </p>
      
    </div>

  );
};