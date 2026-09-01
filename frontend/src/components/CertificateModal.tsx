import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, Download, X, QrCode, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { Certificate } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { playClick, playSuccess } = useSound();
  const [certData, setCertData] = useState<Certificate | null>(null);
  const [eligible, setEligible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCertificate = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('lmcys_token');
        const res = await fetch('/api/certificates', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEligible(data.eligible);
          setCertData(data.certificate);
          if (data.eligible) {
            playSuccess();
          }
        }
      } catch (err) {
        console.error('Certificate fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [isOpen, playSuccess]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="max-w-4xl w-full cyber-card border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(0,243,255,0.25)] relative my-8">
        <button
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {loading ? (
          <div className="text-center py-16">
            <Award className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="font-mono text-slate-300">Retrieving digital credential from Directorate...</p>
          </div>
        ) : eligible && certData ? (
          <div>
            {/* Certificate Canvas */}
            <div id="certificate-print-area" className="border-4 border-cyan-500/40 bg-gradient-to-br from-[#060913] via-[#091124] to-[#040710] p-8 md:p-12 rounded-lg relative overflow-hidden text-center shadow-2xl">
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

              {/* Watermark Crest */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <ShieldCheck className="w-96 h-96 text-cyan-400" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                  <Award className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="text-left">
                  <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-widest text-white">
                    LMCYS CYBER DEFENSE ACADEMY
                  </h2>
                  <p className="text-xs font-mono text-cyan-400 tracking-wider">
                    DIRECTORATE OF SECURITY OPERATIONS & TRAINING
                  </p>
                </div>
              </div>

              <div className="my-6">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                  This Certificate of Competence is awarded to
                </p>
                <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-emerald-400 my-2">
                  {certData.student_name || user?.full_name || 'Cadet Udhayan'}
                </h1>
                <p className="text-xs font-mono text-slate-400">
                  Cadet Handle: <span className="text-cyan-300">@{certData.username || user?.username}</span>
                </p>
              </div>

              <div className="max-w-2xl mx-auto my-6 p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  for successfully demonstrating mastery in **SOC Level 1 Operations**, including **Network & Windows Log Telemetry**, **Event ID 4625/4624 Brute Force Detection**, **Synthetic SIEM Alert Triage**, **True/False Positive Decision Making**, and **NIST-compliant Incident Investigation & Reporting**.
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto my-6 font-mono text-xs text-left bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">CREDENTIAL ID</span>
                  <span className="text-cyan-400 font-bold">{certData.certificate_code}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">EVALUATION SCORE</span>
                  <span className="text-emerald-400 font-bold">{certData.final_score}% (Distinction)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DATE OF ISSUANCE</span>
                  <span className="text-slate-300">{new Date(certData.issue_date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">VERIFICATION HASH</span>
                  <span className="text-purple-400 font-bold">{certData.verification_hash}</span>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="flex items-center justify-between max-w-2xl mx-auto pt-4 border-t border-slate-800/80 text-left">
                <div className="flex items-center gap-2">
                  <QrCode className="w-10 h-10 text-cyan-400" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block">PUBLIC VERIFIER</span>
                    <span className="text-[11px] font-mono text-cyan-300">lmcys.cyber/verify/{certData.certificate_code}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-['Space_Grotesk'] text-sm font-bold text-white tracking-wide">
                    CHIEF ACADEMIC OFFICER
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Verified Cryptographic Signature ✓</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={handlePrint}
                className="cyber-btn-primary text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Print / Save PDF Credential
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2">
              SOC L1 CERTIFICATE LOCKED
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Complete at least the core curriculum levels (Levels 1–3), participate in the SOC Practical Arena triage, and achieve $\ge$ 50% SOC Readiness to unlock your official digital credential.
            </p>
            <div className="inline-block p-4 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-left max-w-sm w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Current SOC Readiness:</span>
                <span className="text-cyan-400 font-bold">{user?.soc_readiness || 0}% / 50%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((user?.soc_readiness || 0) / 50) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
