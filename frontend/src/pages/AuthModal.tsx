import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User as UserIcon, 
  X, 
  AlertCircle, 
  GraduationCap, 
  Building2, 
  Calendar, 
  UserCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (isNewUser?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login Form State (accepts Username OR Email ID)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration 8-Field State
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [age, setAge] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [studying, setStudying] = useState('');
  const [academicYear, setAcademicYear] = useState('1st Year');
  const [collegeName, setCollegeName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { playClick, playSuccess, playFailure } = useSound();

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    playClick();

    const trimmedIdent = loginIdentifier.trim();
    if (!trimmedIdent || !loginPassword) {
      setError('⚠️ Please fill in all required fields.');
      playFailure();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: trimmedIdent,
          email: trimmedIdent,
          username: trimmedIdent,
          password: loginPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '❌ Incorrect username or password.');
        playFailure();
        setLoading(false);
        return;
      }

      playSuccess();
      login(data.token, data.user);
      onSuccess(data.user.mindset_completed === 0);
    } catch (err: any) {
      setError('⚠️ Network connection error. Please verify the Academy server is running.');
      playFailure();
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    playClick();

    // 1. Validate Full Name
    const trimmedFullName = fullName.trim();
    if (!trimmedFullName) {
      setError('⚠️ Please fill in your Full Name.');
      playFailure();
      return;
    }

    // 2. Validate Email safely via JavaScript
    const normalizedEmail = regEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      setError('❌ Please enter a valid email address.');
      playFailure();
      return;
    }

    // 3. Validate Password (min 8 chars, at least 1 letter and 1 number)
    if (!regPassword || regPassword.length < 8 || !/[a-zA-Z]/.test(regPassword) || !/[0-9]/.test(regPassword)) {
      setError('❌ Password must contain at least 8 characters, including at least one letter and one number.');
      playFailure();
      return;
    }

    // 4. Validate Age
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 120) {
      setError('❌ Age must be a valid positive number between 10 and 120.');
      playFailure();
      return;
    }

    // 5. Validate other required fields
    if (!referredBy.trim()) {
      setError('⚠️ Who Referred You field is required.');
      playFailure();
      return;
    }

    if (!studying.trim()) {
      setError('⚠️ What are you studying field is required.');
      playFailure();
      return;
    }

    if (!academicYear.trim()) {
      setError('⚠️ Current Academic Year field is required.');
      playFailure();
      return;
    }

    if (!collegeName.trim()) {
      setError('⚠️ College Name field is required.');
      playFailure();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: trimmedFullName,
          email: normalizedEmail,
          password: regPassword,
          age: parsedAge,
          referred_by: referredBy.trim(),
          studying: studying.trim(),
          academic_year: academicYear.trim(),
          college_name: collegeName.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 || (data.error && data.error.includes('already registered'))) {
          setError('This email is already registered. Please login instead.');
        } else {
          setError(data.error || '❌ Registration failed. Please check your information and try again.');
        }
        playFailure();
        setLoading(false);
        return;
      }

      playSuccess();
      login(data.token, data.user);
      onSuccess(true);
    } catch (err: any) {
      setError('⚠️ Network connection error. Please verify the Academy server is running.');
      playFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className={`cyber-card w-full ${mode === 'register' ? 'max-w-2xl' : 'max-w-md'} p-6 md:p-8 border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.25)] relative my-8`}>
        
        {/* Close button */}
        <button
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <Shield className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white tracking-wide">
            {mode === 'login' ? 'Cadet Access Portal' : 'Join LMCYS Cyber Academy'}
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            {mode === 'login' 
              ? 'Authenticate with your Username or registered Email ID'
              : 'Complete your cadet profile to initialize 100-level SOC training'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode Toggle Switch */}
        <div className="flex rounded-lg bg-slate-950 p-1 mb-5 border border-slate-800 font-mono text-xs">
          <button
            type="button"
            onClick={() => { playClick(); setMode('login'); setError(null); }}
            className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
              mode === 'login' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cadet Login
          </button>
          <button
            type="button"
            onClick={() => { playClick(); setMode('register'); setError(null); }}
            className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
              mode === 'register' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Join Academy
          </button>
        </div>

        {/* ========================================================================= */}
        {/* LOGIN FORM                                                                */}
        {/* ========================================================================= */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} noValidate className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">USERNAME OR EMAIL ID</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  autoComplete="username"
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. udhayan or cadet@example.com"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn-primary w-full py-3 text-xs uppercase font-bold tracking-wider mt-4 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Enter SOC Academy'}</span>
            </button>
          </form>
        ) : (
          /* ========================================================================= */
          /* REGISTRATION FORM (8 Required Fields)                                     */
          /* ========================================================================= */
          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4 font-mono text-xs">
            <div className="space-y-3">
              
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">FULL NAME *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Murali"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">EMAIL ID *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="murali@example.com"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Password & Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">PASSWORD (MIN 8 CHARS) *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 letter, 1 number"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">AGE *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min={10}
                      max={120}
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      placeholder="20"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Who Referred You & What are you studying? */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">WHO REFERRED YOU *</label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={referredBy}
                      onChange={e => setReferredBy(e.target.value)}
                      placeholder="Rahul / LinkedIn / Self"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">WHAT ARE YOU STUDYING? *</label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={studying}
                      onChange={e => setStudying(e.target.value)}
                      placeholder="B.E Cyber Security / Computer Science"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Current Academic Year & College Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">CURRENT ACADEMIC YEAR *</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <select
                      value={academicYear}
                      onChange={e => setAcademicYear(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year / 4th Year">Final Year / 4th Year</option>
                      <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="High School Student">High School Student</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">COLLEGE / INSTITUTION NAME *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={collegeName}
                      onChange={e => setCollegeName(e.target.value)}
                      placeholder="ABC Engineering College"
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn-primary w-full py-3 text-xs uppercase font-bold tracking-wider mt-4 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration & Join'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
