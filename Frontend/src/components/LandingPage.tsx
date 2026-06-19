import React from 'react';
import { Vote, Users, Check, Shield, Lock, ArrowRight, Sparkles, BarChart3, Fingerprint, Boxes } from 'lucide-react';
import { motion } from 'framer-motion';
import Background from '../assets/Background.mp4';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const LandingPage = () => {
  return (
    <div className="bg-ink-900 text-white overflow-x-hidden">
      {/* ───────────── Hero ───────────── */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Video + aurora overlay */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
            <source src={Background} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-aurora opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-transparent to-ink-900" />
        </div>

        {/* Floating blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl animate-blob z-0" />
        <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-accent-500/30 blur-3xl animate-blob z-0" style={{ animationDelay: '3s' }} />

        {/* Nav */}
        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient glow">
              <Vote className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display">VoteChain</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how" className="transition hover:text-white">How it works</a>
            <Link to="/party/auth" className="transition hover:text-white">For Parties</Link>
          </div>
          <Link to="/admin/auth" className="btn-ghost text-sm">Admin Login</Link>
        </nav>

        {/* Hero content */}
        <div className="relative z-20 mx-auto max-w-7xl px-6 pt-12 pb-24 md:pt-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/80">
              <Sparkles className="h-4 w-4 text-cyber-400" />
              Blockchain-secured · End-to-end verifiable
            </span>
            <h1 className="text-5xl font-extrabold leading-[1.05] font-display md:text-7xl">
              Democracy,
              <br />
              <span className="gradient-text">reimagined for the digital age</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
              Cast your vote in seconds. Every ballot is encrypted, tamper-proof, and
              independently verifiable on-chain — no middlemen, no doubt.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/voter/auth">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-primary text-lg">
                  Register to Vote <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              <a href="#how">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-ghost text-lg">
                  Learn More
                </motion.button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4"
          >
            {[
              { value: '100%', label: 'Verifiable' },
              { value: '0', label: 'Tamper attempts possible' },
              { value: '<5s', label: 'To cast a vote' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl px-4 py-6 text-center">
                <div className="text-3xl font-bold gradient-text font-display">{s.value}</div>
                <div className="mt-1 text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Role cards */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
            <Link to="/party/auth">
              <RegistrationCard
                title="Party Registration"
                description="Register your political party, build your team, and manage campaigns with real-time analytics."
                icon={<Users className="h-7 w-7" />}
                cta="Register a party"
              />
            </Link>
            <Link to="/voter/auth">
              <RegistrationCard
                title="Voter Registration"
                description="Quick, secure onboarding with identity verification so every eligible voter can participate."
                icon={<Vote className="h-7 w-7" />}
                cta="Register as voter"
                featured
              />
            </Link>
          </div>
        </div>
      </section>

      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

const RegistrationCard = ({
  title,
  description,
  icon,
  cta,
  featured,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  cta: string;
  featured?: boolean;
}) => (
  <motion.div
    whileHover={{ y: -6 }}
    className={`group relative h-full overflow-hidden rounded-3xl p-8 transition ${
      featured ? 'gradient-border bg-white/[0.07]' : 'glass'
    }`}
  >
    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white glow">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold font-display">{title}</h3>
    <p className="mt-2 text-white/65">{description}</p>
    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyber-300">
      {cta}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </span>
  </motion.div>
);

const Features = () => {
  const features = [
    { icon: <Shield className="h-7 w-7" />, title: 'Secure by design', description: 'Votes are cryptographically signed and stored on an immutable ledger — impossible to alter after the fact.' },
    { icon: <Check className="h-7 w-7" />, title: 'Instantly verifiable', description: 'Anyone can confirm a vote was counted correctly through transparent on-chain records.' },
    { icon: <Lock className="h-7 w-7" />, title: 'Privacy first', description: 'Identity verification keeps voting eligible while your individual choice stays confidential.' },
    { icon: <BarChart3 className="h-7 w-7" />, title: 'Live analytics', description: 'Real-time turnout and results broadcasting for voters, parties, and administrators.' },
    { icon: <Fingerprint className="h-7 w-7" />, title: 'Biometric checks', description: 'Optional face verification adds an extra layer of confidence at registration.' },
    { icon: <Boxes className="h-7 w-7" />, title: 'Token-based ballots', description: 'Each voter receives a single, non-transferable voting token — one person, one vote.' },
  ];

  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Why VoteChain"
          title="Trust, built into every layer"
          subtitle="A voting platform that combines blockchain security, real-time transparency, and a delightful experience."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group rounded-3xl glass p-7 transition hover:bg-white/[0.1]"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white transition group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold font-display">{feature.title}</h3>
              <p className="mt-2 text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { n: '01', title: 'Register & verify', text: 'Sign up and confirm your identity with document and optional face verification.' },
    { n: '02', title: 'Receive your token', text: 'The election commission issues a single secure voting token to your account.' },
    { n: '03', title: 'Cast your vote', text: 'Choose your party and submit — your encrypted ballot is written on-chain instantly.' },
    { n: '04', title: 'Verify the result', text: 'Track live results and independently confirm your vote was counted.' },
  ];
  return (
    <section id="how" className="relative py-28">
      <div className="absolute inset-0 bg-aurora opacity-60" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="How it works" title="From sign-up to verified vote" subtitle="Four simple steps. Minutes, not queues." />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl gradient-border bg-white/[0.04] p-7"
            >
              <div className="text-4xl font-extrabold gradient-text font-display">{s.n}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/60">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="relative py-24">
    <div className="mx-auto max-w-5xl px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient-animated p-12 text-center glow md:p-16">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-white font-display md:text-5xl">Ready to make your vote count?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">Join a transparent, secure election experience built for everyone.</p>
          <Link to="/voter/auth">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-brand-700 shadow-xl">
              Get Started <ArrowRight className="h-5 w-5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const SectionHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="mx-auto max-w-2xl text-center"
  >
    <span className="text-sm font-semibold uppercase tracking-widest text-cyber-400">{eyebrow}</span>
    <h2 className="mt-3 text-4xl font-bold font-display md:text-5xl">{title}</h2>
    <p className="mt-4 text-white/60">{subtitle}</p>
  </motion.div>
);

export const Footer = () => {
  const cols = [
    { h: 'Product', items: ['Features', 'How It Works', 'Security', 'FAQ'] },
    { h: 'Resources', items: ['Documentation', 'API', 'Support', 'Contact'] },
    { h: 'Legal', items: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'] },
  ];
  return (
    <footer className="border-t border-white/10 bg-ink-900 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
                <Vote className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold font-display">VoteChain</span>
            </div>
            <p className="mt-4 text-sm text-white/55">Transforming democracy through secure, accessible, and verifiable digital voting.</p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">{c.h}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-white/55 transition hover:text-cyber-300">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/45">
          &copy; {new Date().getFullYear()} VoteChain. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default LandingPage;
