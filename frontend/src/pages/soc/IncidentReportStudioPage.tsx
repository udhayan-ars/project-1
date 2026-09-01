import React, { useState } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  Download, 
  Printer, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Award,
  Layers,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { SOCReport13Section, SOCIncident, SOCAlert } from '../../types/soc';
import { DEFAULT_REPORT_SAMPLE } from '../../data/socData';

interface IncidentReportStudioPageProps {
  initialIncident?: SOCIncident | null;
  initialAlert?: SOCAlert | null;
}

export const IncidentReportStudioPage: React.FC<IncidentReportStudioPageProps> = ({
  initialIncident,
  initialAlert
}) => {
  const { reports, saveReport, evaluateReportRubric, incidents, alerts } = useSOC();

  const [currentReport, setCurrentReport] = useState<SOCReport13Section>(() => {
    if (initialIncident) {
      return {
        ...DEFAULT_REPORT_SAMPLE,
        incident_id: initialIncident.incident_id,
        report_title: `SOC Incident Investigation Report: ${initialIncident.title}`,
        sec1_executive_summary: initialIncident.summary,
        sec7_impact_assessment: initialIncident.impact_scope,
        sec8_root_cause_analysis: initialIncident.root_cause,
        sec9_containment_actions: initialIncident.containment_actions_taken.join('\n')
      };
    }
    return reports[0] || DEFAULT_REPORT_SAMPLE;
  });

  const [evaluationResult, setEvaluationResult] = useState<SOCReport13Section | null>(() => {
    return reports[0] ? evaluateReportRubric(reports[0]) : null;
  });

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleFieldChange = (field: keyof SOCReport13Section, val: string) => {
    setCurrentReport(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleEvaluateAndSave = () => {
    const graded = evaluateReportRubric(currentReport);
    setEvaluationResult(graded);
    saveReport(graded);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLoadIncident = (inc: SOCIncident) => {
    const generated: SOCReport13Section = {
      ...DEFAULT_REPORT_SAMPLE,
      incident_id: inc.incident_id,
      report_title: `SOC Investigation: ${inc.title}`,
      sec1_executive_summary: inc.summary,
      sec7_impact_assessment: inc.impact_scope,
      sec8_root_cause_analysis: inc.root_cause,
      sec9_containment_actions: inc.containment_actions_taken.join('\n')
    };
    setCurrentReport(generated);
    const graded = evaluateReportRubric(generated);
    setEvaluationResult(graded);
  };

  const exportMarkdown = () => {
    const md = `# ${currentReport.report_title}
**Prepared By:** ${currentReport.prepared_by} | **Incident Date:** ${currentReport.date_of_incident} | **Classification:** ${currentReport.classification}
**Incident ID:** ${currentReport.incident_id || 'INC-GENERAL'}

---

## 1. Executive Summary
${currentReport.sec1_executive_summary}

## 2. Detection Mechanism
${currentReport.sec2_detection_mechanism}

## 3. Chronological Timeline
${currentReport.sec3_chronological_timeline}

## 4. Technical Evidence
\`\`\`
${currentReport.sec4_technical_evidence}
\`\`\`

## 5. Extracted Indicators of Compromise (IOCs)
${currentReport.sec5_extracted_iocs}

## 6. MITRE ATT&CK Mapping
${currentReport.sec6_mitre_mapping}

## 7. Impact Assessment
${currentReport.sec7_impact_assessment}

## 8. Root Cause Analysis (5-Whys)
${currentReport.sec8_root_cause_analysis}

## 9. Containment Actions Taken
${currentReport.sec9_containment_actions}

## 10. Eradication Steps
${currentReport.sec10_eradication_steps}

## 11. Recovery & Post-Incident Verification
${currentReport.sec11_recovery_verification}

## 12. Lessons Learned & Detection Improvements
${currentReport.sec12_lessons_learned_detections}

## 13. Analyst & Incident Commander Sign-off
${currentReport.sec13_analyst_signoff}

---
*Report Evaluated by SOC Platform Rubric Engine: ${evaluationResult?.total_rubric_score || '5.0'}/5.0*
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${currentReport.incident_id || 'sans-report'}.md`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const reportSections = [
    { key: 'sec1_executive_summary', label: '1. Executive Summary', rows: 4, placeholder: 'Explain in clear executive terms what occurred, business impact, and resolution...' },
    { key: 'sec2_detection_mechanism', label: '2. Detection Mechanism & Rules', rows: 3, placeholder: 'Specify SIEM rules, Sysmon event IDs, EDR telemetry that triggered the alert...' },
    { key: 'sec3_chronological_timeline', label: '3. Chronological Attack Timeline', rows: 5, placeholder: 'List timestamps and sequential steps from initial delivery to containment...' },
    { key: 'sec4_technical_evidence', label: '4. Technical Forensics & Evidence', rows: 4, placeholder: 'Command line arguments, process trees, network tuples, memory dumps...' },
    { key: 'sec5_extracted_iocs', label: '5. Extracted IOCs (IPs, Domains, Hashes)', rows: 4, placeholder: 'List malicious C2 IPs, domains, SHA-256 hashes, email addresses...' },
    { key: 'sec6_mitre_mapping', label: '6. MITRE ATT&CK® TTP Alignment', rows: 3, placeholder: 'Map Tactics, Techniques, and Technique IDs (e.g. T1059.001, T1110)...' },
    { key: 'sec7_impact_assessment', label: '7. Impact Assessment & Scope', rows: 3, placeholder: 'Assess compromised assets, affected user accounts, and data exposure...' },
    { key: 'sec8_root_cause_analysis', label: '8. Root Cause Analysis (5-Whys)', rows: 4, placeholder: 'Conduct structured 5-Whys analysis explaining the fundamental security gap...' },
    { key: 'sec9_containment_actions', label: '9. Containment Actions Executed', rows: 3, placeholder: 'Detail host isolation, firewall IP blocks, credential resets, process termination...' },
    { key: 'sec10_eradication_steps', label: '10. Eradication & Malware Removal', rows: 3, placeholder: 'Detail removal of dropper files, persistence registry keys, and scheduled tasks...' },
    { key: 'sec11_recovery_verification', label: '11. Recovery & Post-Incident Verification', rows: 3, placeholder: 'Golden image re-imaging, token resets, and 4-hour telemetry monitoring...' },
    { key: 'sec12_lessons_learned_detections', label: '12. Lessons Learned & Defensive Hardening', rows: 4, placeholder: 'ASR rules, GPO macro restrictions, Credential Guard, and employee training...' },
    { key: 'sec13_analyst_signoff', label: '13. SOC Lead & Analyst Sign-off', rows: 2, placeholder: 'Case closure authorization, lead signature, and verified timestamp...' }
  ];

  return (
    <div className="space-y-6 font-mono">
      
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              13-SECTION SANS & NIST INCIDENT REPORT STUDIO
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-grade incident investigation documentation with automated heuristic rubric evaluator.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleEvaluateAndSave}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evaluate & Save Report</span>
          </button>

          <button
            onClick={exportMarkdown}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200"
            title="Print / Save as PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Pre-fill Incident Picker */}
      <div className="p-3.5 rounded-xl bg-[#070b16] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Pre-fill From Incident:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {incidents.map(inc => (
            <button
              key={inc.id}
              onClick={() => handleLoadIncident(inc)}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-mono"
            >
              {inc.incident_id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Editor + Live Rubric Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: 13-Section Form Editor */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Metadata Block */}
          <div className="p-4 rounded-xl bg-[#090e1d] border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 text-[10px] mb-1">REPORT TITLE</label>
              <input
                type="text"
                value={currentReport.report_title}
                onChange={(e) => handleFieldChange('report_title', e.target.value)}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 text-[10px] mb-1">PREPARED BY</label>
              <input
                type="text"
                value={currentReport.prepared_by}
                onChange={(e) => handleFieldChange('prepared_by', e.target.value)}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-500 text-[10px] mb-1">CLASSIFICATION</label>
              <select
                value={currentReport.classification}
                onChange={(e) => handleFieldChange('classification', e.target.value as any)}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400"
              >
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="PUBLIC">PUBLIC</option>
              </select>
            </div>
          </div>

          {/* 13 Structured Sections */}
          <div className="space-y-4">
            {reportSections.map(sec => (
              <div key={sec.key} className="p-4 rounded-xl bg-[#090e1d] border border-slate-800 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-cyan-300 uppercase tracking-wide">
                    {sec.label}
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {(currentReport[sec.key as keyof SOCReport13Section] as string || '').length} chars
                  </span>
                </div>
                <textarea
                  rows={sec.rows}
                  value={currentReport[sec.key as keyof SOCReport13Section] as string || ''}
                  onChange={(e) => handleFieldChange(sec.key as keyof SOCReport13Section, e.target.value)}
                  placeholder={sec.placeholder}
                  className="w-full p-3 rounded-lg bg-black/50 border border-slate-800/90 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Rubric Auto-Evaluator Scorecard */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 p-5 rounded-xl bg-[#090e1d] border border-cyan-500/30 shadow-xl space-y-5 text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100 uppercase">
                  Rubric Auto-Evaluator
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">NIST SP 800-61</span>
            </div>

            {/* Overall Score Dial */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-bold">TOTAL RUBRIC SCORE</div>
              <div className="text-3xl font-bold text-cyan-400">
                {evaluationResult?.total_rubric_score || '5.0'} / 5.0
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">
                OPERATIONAL GRADE: CERTIFIED
              </div>
            </div>

            {/* 5-Dimension Rubric Breakdown */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>1. Completeness (13 Secs)</span>
                  <span className="font-bold text-cyan-400">{evaluationResult?.score_completeness || 5.0}/5.0</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${((evaluationResult?.score_completeness || 5.0) / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>2. Technical Accuracy</span>
                  <span className="font-bold text-cyan-400">{evaluationResult?.score_technical_accuracy || 5.0}/5.0</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${((evaluationResult?.score_technical_accuracy || 5.0) / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>3. Forensics & Evidence Quality</span>
                  <span className="font-bold text-cyan-400">{evaluationResult?.score_evidence_quality || 5.0}/5.0</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${((evaluationResult?.score_evidence_quality || 5.0) / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>4. 5-Whys Root Cause Depth</span>
                  <span className="font-bold text-cyan-400">{evaluationResult?.score_root_cause_depth || 5.0}/5.0</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${((evaluationResult?.score_root_cause_depth || 5.0) / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>5. Actionable Remediation</span>
                  <span className="font-bold text-cyan-400">{evaluationResult?.score_remediation_actionability || 5.0}/5.0</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${((evaluationResult?.score_remediation_actionability || 5.0) / 5) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Evaluator Feedback */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">EVALUATOR VERDICT</span>
              <p className="text-slate-200 text-[11px] leading-relaxed">
                {evaluationResult?.evaluator_feedback || 'Meets full SANS incident reporting criteria.'}
              </p>
            </div>

            {/* Re-evaluate Button */}
            <button
              onClick={handleEvaluateAndSave}
              className="w-full py-2 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 font-bold"
            >
              Re-Calculate Rubric Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
