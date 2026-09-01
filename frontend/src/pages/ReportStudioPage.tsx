import React, { useState, useEffect } from 'react';
import { FileText, Send, Sparkles, CheckCircle2, AlertCircle, BookOpen, Download, RotateCcw, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { IncidentReport } from '../types';

interface ReportStudioPageProps {
  initialData?: any;
}

export const ReportStudioPage: React.FC<ReportStudioPageProps> = ({ initialData }) => {
  const { user } = useAuth();
  const { playClick, playSuccess, playFailure } = useSound();

  const [formData, setFormData] = useState<IncidentReport>({
    title: initialData?.title || 'Unauthorized RDP Brute Force & Encoded Script Execution on CORP-DC-01',
    incident_date: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    severity: initialData?.severity || 'HIGH',
    affected_asset: 'CORP-DC-01 (10.0.0.15 - Windows Server 2022 Domain Controller)',
    alert_description: initialData?.description || 'SIEM Alert LMCYS-4821: Repeated failed logon attempts followed by elevated RDP interactive session.',
    evidence: 'Event ID 4625 recorded 4 consecutive times between 03:14:02 and 03:14:12 UTC from source IP 185.220.101.7. Event ID 4624 (LogonType 10) confirmed at 03:14:18 UTC. Event ID 4688 logged powershell.exe executing base64 encoded download cradle.',
    ioc_list: 'Attacker IP: 185.220.101.7, C2 Domain: c2-beacon.darkops-gateway.xyz, Script SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    findings: initialData?.findings || 'External threat actor conducted an automated dictionary attack against exposed RDP port 3389, successfully guessed the domain administrator password, and spawned a malicious PowerShell staging payload.',
    mitre_technique: initialData?.mitre_technique || 'T1110.001 (Password Guessing), T1078.002 (Domain Accounts), T1059.001 (PowerShell)',
    impact: 'Complete administrative compromise of the primary domain controller, potential for lateral credential theft and persistence installation.',
    root_cause: 'TCP port 3389 (RDP) was exposed directly to the public internet on perimeter firewall rules without Multi-Factor Authentication (MFA) or account lockout policies.',
    recommended_actions: '1. Immediately isolate CORP-DC-01 from network. 2. Block IP 185.220.101.7 on perimeter firewall. 3. Force enterprise-wide password reset for Administrator and revoke active Kerberos tickets. 4. Enforce Duo MFA and restrict RDP access exclusively via IPsec VPN.',
    conclusion: 'Host isolated within 15 minutes of detection. No evidence of lateral movement discovered. System rebuilding and forensic image preservation underway.'
  });

  const [showGuide, setShowGuide] = useState(false);
  const [guideData, setGuideData] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const token = localStorage.getItem('lmcys_token');
        const res = await fetch('/api/reports/template/guide', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setGuideData(data.guide);
        }
      } catch (err) {
        console.error('Failed to load SOP report guide:', err);
      }
    };
    fetchGuide();
  }, []);

  const handleChange = (field: keyof IncidentReport, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handlePopulateSample = () => {
    playClick();
    if (guideData?.sampleReport) {
      setFormData(guideData.sampleReport);
      setEvaluationResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluating(true);
    playClick();

    try {
      const token = localStorage.getItem('lmcys_token');
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setEvaluationResult(data.evaluation);

      if (data.score >= 3.5) {
        playSuccess();
      } else {
        playFailure();
      }
    } catch (err) {
      console.error('Report evaluation failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="cyber-card p-6 mb-8 border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-neon-cyan text-[10px]">SOC L1 INCIDENT REPORT STUDIO</span>
            <span className="text-xs font-mono text-slate-400">• 13 NIST MANDATORY SECTIONS</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-extrabold text-white">
            Incident Investigation Report & Auto-Evaluator
          </h1>
          <p className="text-xs font-sans text-slate-300 mt-1 max-w-2xl">
            Translate raw log telemetry and alert findings into a professional, C-level executive and technical incident report.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { playClick(); setShowGuide(!showGuide); }}
            className="cyber-btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>{showGuide ? 'Hide SOP Guide' : 'Learn Report SOP'}</span>
          </button>
          <button
            onClick={handlePopulateSample}
            className="cyber-btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5 text-amber-300 border-amber-500/40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load SOC Benchmark</span>
          </button>
        </div>
      </div>

      {/* SOP Guide Modal/Drawer */}
      {showGuide && guideData && (
        <div className="cyber-card p-6 mb-8 border-cyan-500/40 bg-cyan-950/20 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/30">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-cyan-300">
              {guideData.title}
            </h3>
            <span className="badge-neon-green text-[10px]">STANDARD OPERATING PROCEDURE</span>
          </div>
          <p className="text-xs text-slate-300 font-sans mb-4">{guideData.overview}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {guideData.sections?.map((sec: any, idx: number) => (
              <div key={idx} className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">{sec.name}</span>
                <span className="text-slate-400 text-[11px]">{sec.rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evaluation Rubric Feedback Banner */}
      {evaluationResult && (
        <div className="cyber-card p-6 mb-8 border-cyan-500/50 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 shadow-[0_0_30px_rgba(0,243,255,0.2)] animate-in zoom-in-95 duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="badge-neon-cyan text-[10px] mb-1 inline-block">AUTOMATED SOC RUBRIC GRADING</span>
              <h2 className="font-['Space_Grotesk'] text-2xl font-extrabold text-white">
                Report Grade: <span className="text-emerald-400">{evaluationResult.totalScore} / 5.0</span>
              </h2>
            </div>

            {/* Subscore Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[9px]">COMPLETENESS</span>
                <span className="text-cyan-400 font-bold">{evaluationResult.completenessScore}/5</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[9px]">TECH ACCURACY</span>
                <span className="text-blue-400 font-bold">{evaluationResult.technicalAccuracyScore}/5</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[9px]">EVIDENCE</span>
                <span className="text-emerald-400 font-bold">{evaluationResult.evidenceScore}/5</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[9px]">ROOT CAUSE</span>
                <span className="text-amber-400 font-bold">{evaluationResult.rootCauseScore}/5</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[9px]">REMEDIATION</span>
                <span className="text-purple-400 font-bold">{evaluationResult.remediationScore}/5</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap">
            {evaluationResult.feedbackMd}
          </div>
        </div>
      )}

      {/* 13-Section Incident Report Form */}
      <form onSubmit={handleSubmit} className="cyber-card p-6 sm:p-8 space-y-6 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1 font-bold">1. INCIDENT TITLE</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">2. INCIDENT DATE & TIME (UTC)</label>
            <input
              type="text"
              value={formData.incident_date}
              onChange={e => handleChange('incident_date', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1 font-bold">3. SEVERITY</label>
            <select
              value={formData.severity}
              onChange={e => handleChange('severity', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
            >
              <option value="CRITICAL">CRITICAL (P1)</option>
              <option value="HIGH">HIGH (P2)</option>
              <option value="MEDIUM">MEDIUM (P3)</option>
              <option value="LOW">LOW (P4)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">4. AFFECTED ASSET</label>
            <input
              type="text"
              value={formData.affected_asset}
              onChange={e => handleChange('affected_asset', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-bold">5. ALERT DESCRIPTION</label>
          <input
            type="text"
            value={formData.alert_description}
            onChange={e => handleChange('alert_description', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-bold">6. EVIDENCE (LOG EVENT IDS, TIMESTAMPS, RAW TELEMETRY)</label>
          <textarea
            rows={3}
            value={formData.evidence}
            onChange={e => handleChange('evidence', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-bold">7. INDICATORS OF COMPROMISE (IOCS — IPS, DOMAINS, HASHES)</label>
          <input
            type="text"
            value={formData.ioc_list}
            onChange={e => handleChange('ioc_list', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-bold">8. INVESTIGATION FINDINGS (STEP-BY-STEP ATTACK NARRATIVE)</label>
          <textarea
            rows={3}
            value={formData.findings}
            onChange={e => handleChange('findings', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1 font-bold">9. MITRE ATT&CK TECHNIQUE(S)</label>
            <input
              type="text"
              value={formData.mitre_technique}
              onChange={e => handleChange('mitre_technique', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">10. IMPACT (BUSINESS & SECURITY)</label>
            <input
              type="text"
              value={formData.impact}
              onChange={e => handleChange('impact', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-bold">11. ROOT CAUSE (WHY DID THIS INCIDENT OCCUR? 5-WHYS)</label>
          <textarea
            rows={2}
            value={formData.root_cause}
            onChange={e => handleChange('root_cause', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-bold">12. RECOMMENDED ACTIONS (CONTAINMENT & REMEDIATION)</label>
          <textarea
            rows={3}
            value={formData.recommended_actions}
            onChange={e => handleChange('recommended_actions', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-bold">13. CONCLUSION & STATUS</label>
          <input
            type="text"
            value={formData.conclusion}
            onChange={e => handleChange('conclusion', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg p-2.5 text-white focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={evaluating}
            className="cyber-btn-primary py-3 px-8 text-xs font-mono flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{evaluating ? 'Grading Against Rubric...' : 'Submit Report for Evaluation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
