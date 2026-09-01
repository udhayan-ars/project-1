import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SOCEvent,
  SOCAlert,
  SOCIncident,
  IOCItem,
  MitreTechnique,
  NetworkFlow,
  AuthRecord,
  DetectionRule,
  Asset,
  AttackScenario,
  SOCReport13Section,
  AnalystNote,
  ThreatHealthMetrics,
  AlertStatus,
  IncidentStatus
} from '../types/soc';
import {
  INITIAL_EVENTS,
  INITIAL_ALERTS,
  INITIAL_INCIDENTS,
  INITIAL_IOCS,
  MITRE_TECHNIQUES,
  INITIAL_ASSETS,
  INITIAL_DETECTION_RULES,
  ATTACK_SCENARIOS,
  INITIAL_NETWORK_FLOWS,
  INITIAL_AUTH_LOGS,
  INITIAL_ANALYST_NOTES,
  DEFAULT_REPORT_SAMPLE
} from '../data/socData';

interface SOCContextType {
  // State
  events: SOCEvent[];
  alerts: SOCAlert[];
  incidents: SOCIncident[];
  iocs: IOCItem[];
  mitreTechniques: MitreTechnique[];
  assets: Asset[];
  detectionRules: DetectionRule[];
  networkFlows: NetworkFlow[];
  authLogs: AuthRecord[];
  analystNotes: AnalystNote[];
  reports: SOCReport13Section[];
  activeScenario: AttackScenario | null;
  scenarioStep: number;
  healthMetrics: ThreatHealthMetrics;
  isStreaming: boolean;
  streamSpeed: number; // in milliseconds (e.g. 3000)

  // Actions
  toggleStreaming: () => void;
  setStreamSpeed: (speed: number) => void;
  injectEvent: (event: SOCEvent) => void;
  clearEvents: () => void;
  
  // Alert Actions
  updateAlertStatus: (alertId: string, status: AlertStatus, reason?: string) => void;
  updateAlertNotes: (alertId: string, notes: string) => void;
  
  // Incident Actions
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  assignIncidentAnalyst: (incidentId: string, analyst: string) => void;
  performContainmentAction: (
    incidentId: string, 
    actionType: 'host_isolated' | 'ip_blocked' | 'credentials_reset' | 'process_killed',
    details: string
  ) => void;
  
  // Asset Actions
  toggleAssetQuarantine: (assetId: string) => void;
  
  // Rule Actions
  toggleRuleStatus: (ruleId: string) => void;
  
  // IOC Actions
  addIOC: (ioc: IOCItem) => void;
  updateIOCReputation: (iocId: string, reputation: IOCItem['reputation'], riskScore: number) => void;
  
  // Scenario Runner
  loadScenario: (scenarioKey: string) => void;
  advanceScenarioStep: () => void;
  resetScenario: () => void;
  
  // Notes
  addAnalystNote: (note: Omit<AnalystNote, 'id' | 'timestamp'>) => void;
  deleteAnalystNote: (noteId: string) => void;
  
  // Reports & Rubric Evaluator
  saveReport: (report: SOCReport13Section) => void;
  evaluateReportRubric: (report: SOCReport13Section) => SOCReport13Section;
}

const SOCContext = createContext<SOCContextType | undefined>(undefined);

export const SOCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage if available
  const [events, setEvents] = useState<SOCEvent[]>(() => {
    const saved = localStorage.getItem('lmcys_soc_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [alerts, setAlerts] = useState<SOCAlert[]>(() => {
    const saved = localStorage.getItem('lmcys_soc_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [incidents, setIncidents] = useState<SOCIncident[]>(() => {
    const saved = localStorage.getItem('lmcys_soc_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [iocs, setIocs] = useState<IOCItem[]>(() => {
    const saved = localStorage.getItem('lmcys_soc_iocs');
    return saved ? JSON.parse(saved) : INITIAL_IOCS;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('lmcys_soc_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [detectionRules, setDetectionRules] = useState<DetectionRule[]>(() => {
    const saved = localStorage.getItem('lmcys_soc_rules');
    return saved ? JSON.parse(saved) : INITIAL_DETECTION_RULES;
  });

  const [networkFlows, setNetworkFlows] = useState<NetworkFlow[]>(INITIAL_NETWORK_FLOWS);
  const [authLogs, setAuthLogs] = useState<AuthRecord[]>(INITIAL_AUTH_LOGS);

  const [analystNotes, setAnalystNotes] = useState<AnalystNote[]>(() => {
    const saved = localStorage.getItem('lmcys_soc_notes');
    return saved ? JSON.parse(saved) : INITIAL_ANALYST_NOTES;
  });

  const [reports, setReports] = useState<SOCReport13Section[]>(() => {
    const saved = localStorage.getItem('lmcys_soc_reports');
    return saved ? JSON.parse(saved) : [DEFAULT_REPORT_SAMPLE];
  });

  const [activeScenario, setActiveScenario] = useState<AttackScenario | null>(null);
  const [scenarioStep, setScenarioStep] = useState<number>(1);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(3500);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lmcys_soc_events', JSON.stringify(events.slice(0, 100)));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('lmcys_soc_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('lmcys_soc_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('lmcys_soc_notes', JSON.stringify(analystNotes));
  }, [analystNotes]);

  useEffect(() => {
    localStorage.setItem('lmcys_soc_reports', JSON.stringify(reports));
  }, [reports]);

  // Synthetic Live Streaming Telemetry Generator
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const sampleEventTypes = [
        {
          type: 'Windows Security Logon Success',
          cat: 'AUTHENTICATION' as const,
          sev: 'INFO' as const,
          user: 'jdoe',
          host: 'WIN-CLIENT-08',
          sip: '192.168.10.45',
          dip: '10.0.0.1',
          proto: 'KERBEROS',
          msg: 'User CORP\\jdoe successfully authenticated via Kerberos ticket.'
        },
        {
          type: 'DNS Query Response',
          cat: 'DNS' as const,
          sev: 'INFO' as const,
          user: 'SYSTEM',
          host: 'WEB-SRV-01',
          sip: '10.0.0.10',
          dip: '8.8.8.8',
          proto: 'DNS',
          msg: 'Standard A-record lookup for api.github.com resolved to 140.82.121.4.'
        },
        {
          type: 'Firewall Inbound Packet Dropped',
          cat: 'NETWORK' as const,
          sev: 'LOW' as const,
          user: 'N/A',
          host: 'FIREWALL-EDGE',
          sip: `198.51.100.${Math.floor(Math.random() * 200)}`,
          dip: '10.0.0.10',
          proto: 'TCP',
          port: 445,
          msg: 'Inbound SMB connection attempt from WAN dropped by default perimeter ACL.'
        },
        {
          type: 'SSH Authentication Failure',
          cat: 'AUTHENTICATION' as const,
          sev: 'MEDIUM' as const,
          user: 'guest',
          host: 'LINUX-SRV-02',
          sip: '203.0.113.195',
          dip: '10.0.0.15',
          proto: 'SSH',
          port: 22,
          msg: 'Failed password attempt for invalid user guest from external IP.'
        },
        {
          type: 'PowerShell Execution Policy Audit',
          cat: 'ENDPOINT' as const,
          sev: 'INFO' as const,
          user: 'alice.w',
          host: 'WIN-CLIENT-02',
          sip: '192.168.10.105',
          dip: '192.168.10.105',
          proto: 'PROCESS',
          msg: 'PowerShell script execution policy checked; standard RemoteSigned enforced.'
        }
      ];

      const chosen = sampleEventTypes[Math.floor(Math.random() * sampleEventTypes.length)];
      const now = new Date();
      const timeStr = `${now.toISOString().replace('T', ' ').substring(0, 19)} UTC`;
      const randomId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;

      const newEvent: SOCEvent = {
        id: randomId,
        timestamp: timeStr,
        severity: chosen.sev,
        event_type: chosen.type,
        category: chosen.cat,
        source_ip: chosen.sip,
        dest_ip: chosen.dip,
        protocol: chosen.proto,
        port: chosen.port || 443,
        username: chosen.user,
        host: chosen.host,
        status: 'NEW',
        message: chosen.msg,
        action: chosen.sev === 'INFO' ? 'ALLOW' : 'ALERT'
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 80)]);
    }, streamSpeed);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed]);

  // Compute Dynamic Security Health Score
  const calculateHealthMetrics = useCallback((): ThreatHealthMetrics => {
    let baseScore = 95;

    // Deduct for active critical/high alerts
    const openCriticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;
    const openHighAlerts = alerts.filter(a => a.severity === 'HIGH' && a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;
    baseScore -= openCriticalAlerts * 8;
    baseScore -= openHighAlerts * 4;

    // Deduct for uncontained critical incidents
    const uncontainedIncidents = incidents.filter(i => i.current_status === 'NEW' || i.current_status === 'INVESTIGATING').length;
    baseScore -= uncontainedIncidents * 6;

    // Add back for isolated assets / contained items
    const quarantinedAssets = assets.filter(a => a.status === 'QUARANTINED').length;
    baseScore += quarantinedAssets * 2;

    const clampedScore = Math.max(20, Math.min(100, baseScore));

    let threatLevel: ThreatHealthMetrics['active_threat_level'] = 'DEFCON 5 - NORMAL';
    if (clampedScore < 50) threatLevel = 'DEFCON 1 - CRITICAL';
    else if (clampedScore < 65) threatLevel = 'DEFCON 2 - HIGH';
    else if (clampedScore < 80) threatLevel = 'DEFCON 3 - ELEVATED';
    else if (clampedScore < 90) threatLevel = 'DEFCON 4 - GUARDED';

    return {
      overall_score: clampedScore,
      endpoint_security: Math.max(30, Math.min(100, clampedScore - openCriticalAlerts * 3)),
      network_security: Math.max(40, Math.min(100, clampedScore - 5)),
      identity_security: Math.max(35, Math.min(100, clampedScore - 8)),
      detection_coverage: 94,
      incident_response_velocity: 88,
      active_threat_level: threatLevel
    };
  }, [alerts, incidents, assets]);

  const healthMetrics = calculateHealthMetrics();

  // Handlers
  const toggleStreaming = () => setIsStreaming(prev => !prev);

  const injectEvent = (event: SOCEvent) => {
    setEvents(prev => [event, ...prev]);
  };

  const clearEvents = () => {
    setEvents(INITIAL_EVENTS);
  };

  const updateAlertStatus = (alertId: string, status: AlertStatus, reason?: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status,
              false_positive_reason: reason || alert.false_positive_reason
            }
          : alert
      )
    );
  };

  const updateAlertNotes = (alertId: string, notes: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, notes } : alert
      )
    );
  };

  const updateIncidentStatus = (incidentId: string, status: IncidentStatus) => {
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === incidentId ? { ...inc, current_status: status } : inc
      )
    );
  };

  const assignIncidentAnalyst = (incidentId: string, analyst: string) => {
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === incidentId ? { ...inc, assigned_analyst: analyst } : inc
      )
    );
  };

  const performContainmentAction = (
    incidentId: string,
    actionType: 'host_isolated' | 'ip_blocked' | 'credentials_reset' | 'process_killed',
    details: string
  ) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            containment_status: {
              ...inc.containment_status,
              [actionType]: true
            },
            containment_actions_taken: [
              ...inc.containment_actions_taken,
              `[${new Date().toISOString().substring(11, 19)} UTC] ${details}`
            ]
          };
        }
        return inc;
      })
    );
  };

  const toggleAssetQuarantine = (assetId: string) => {
    setAssets(prev =>
      prev.map(asset => {
        if (asset.id === assetId) {
          const newStatus = asset.status === 'QUARANTINED' ? 'ONLINE' : 'QUARANTINED';
          return { ...asset, status: newStatus };
        }
        return asset;
      })
    );
  };

  const toggleRuleStatus = (ruleId: string) => {
    setDetectionRules(prev =>
      prev.map(rule => {
        if (rule.id === ruleId) {
          const newStatus = rule.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
          return { ...rule, status: newStatus };
        }
        return rule;
      })
    );
  };

  const addIOC = (ioc: IOCItem) => {
    setIocs(prev => [ioc, ...prev]);
  };

  const updateIOCReputation = (iocId: string, reputation: IOCItem['reputation'], riskScore: number) => {
    setIocs(prev =>
      prev.map(ioc =>
        ioc.id === iocId ? { ...ioc, reputation, risk_score: riskScore } : ioc
      )
    );
  };

  // Attack Scenario Simulator
  const loadScenario = (scenarioKey: string) => {
    const scenario = ATTACK_SCENARIOS.find(s => s.key === scenarioKey);
    if (!scenario) return;

    setActiveScenario(scenario);
    setScenarioStep(1);

    // Inject scenario events into stream
    setEvents(prev => [...scenario.injected_events, ...prev]);

    // Upsert alert
    setAlerts(prev => {
      const exists = prev.some(a => a.id === scenario.injected_alert.id);
      if (exists) {
        return prev.map(a => a.id === scenario.injected_alert.id ? scenario.injected_alert : a);
      }
      return [scenario.injected_alert, ...prev];
    });

    // Upsert incident
    setIncidents(prev => {
      const exists = prev.some(i => i.id === scenario.injected_incident.id);
      if (exists) {
        return prev.map(i => i.id === scenario.injected_incident.id ? scenario.injected_incident : i);
      }
      return [scenario.injected_incident, ...prev];
    });
  };

  const advanceScenarioStep = () => {
    if (!activeScenario) return;
    if (scenarioStep < activeScenario.scenario_flow_steps.length) {
      setScenarioStep(prev => prev + 1);
    }
  };

  const resetScenario = () => {
    setActiveScenario(null);
    setScenarioStep(1);
  };

  // Analyst Notes
  const addAnalystNote = (note: Omit<AnalystNote, 'id' | 'timestamp'>) => {
    const newNote: AnalystNote = {
      ...note,
      id: `NOTE-${Date.now().toString().slice(-4)}`,
      timestamp: `${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`
    };
    setAnalystNotes(prev => [newNote, ...prev]);
  };

  const deleteAnalystNote = (noteId: string) => {
    setAnalystNotes(prev => prev.filter(n => n.id !== noteId));
  };

  // Report Evaluator Rubric (Heuristic AI / SOC Evaluation)
  const evaluateReportRubric = (report: SOCReport13Section): SOCReport13Section => {
    let scoreCompleteness = 1.0;
    let scoreAccuracy = 1.0;
    let scoreEvidence = 1.0;
    let scoreRootCause = 1.0;
    let scoreRemediation = 1.0;

    // Completeness Check (Word counts & section fills)
    const filledSectionsCount = [
      report.sec1_executive_summary,
      report.sec2_detection_mechanism,
      report.sec3_chronological_timeline,
      report.sec4_technical_evidence,
      report.sec5_extracted_iocs,
      report.sec6_mitre_mapping,
      report.sec7_impact_assessment,
      report.sec8_root_cause_analysis,
      report.sec9_containment_actions,
      report.sec10_eradication_steps,
      report.sec11_recovery_verification,
      report.sec12_lessons_learned_detections,
      report.sec13_analyst_signoff
    ].filter(s => s && s.trim().length > 30).length;

    scoreCompleteness = Math.min(5.0, 1.0 + (filledSectionsCount / 13) * 4.0);

    // Technical Accuracy Check
    const hasTechnicalKeywords = /powershell|sysmon|eventid|lsass|c2|beacon|mitre|t1\d{3}|sha256|palo alto|ssh|brute force/i.test(
      `${report.sec2_detection_mechanism} ${report.sec4_technical_evidence} ${report.sec6_mitre_mapping}`
    );
    scoreAccuracy = hasTechnicalKeywords ? 4.8 : 2.5;

    // Evidence Quality Check
    const hasEvidence = /ip|hash|sha256|pid|port|command|registry|cmd/i.test(report.sec4_technical_evidence);
    scoreEvidence = hasEvidence && report.sec4_technical_evidence.length > 50 ? 5.0 : 2.0;

    // Root Cause Depth Check (5-Whys pattern)
    const hasRootCauseStructure = /why|root cause|vector|weakness|vulnerability/i.test(report.sec8_root_cause_analysis);
    scoreRootCause = hasRootCauseStructure && report.sec8_root_cause_analysis.length > 80 ? 4.9 : 2.8;

    // Remediation Actionability Check
    const hasRemediation = /block|isolate|gpo|asr|credential guard|patch|mfa|disable/i.test(
      `${report.sec9_containment_actions} ${report.sec12_lessons_learned_detections}`
    );
    scoreRemediation = hasRemediation ? 5.0 : 3.0;

    const total = parseFloat(
      ((scoreCompleteness + scoreAccuracy + scoreEvidence + scoreRootCause + scoreRemediation) / 5).toFixed(1)
    );

    let feedback = 'Report passes SOC Level 1 operational standards.';
    if (total >= 4.8) {
      feedback = 'Outstanding NIST/SANS compliant incident report. Clear forensic chain, precise MITRE mapping, and robust defensive hardening.';
    } else if (total >= 3.5) {
      feedback = 'Good initial report. Consider expanding on the 5-Whys root cause analysis and specific GPO/ASR remediation controls.';
    } else {
      feedback = 'Report requires further technical depth. Ensure all 13 sections contain specific forensic telemetry and IOC details.';
    }

    return {
      ...report,
      score_completeness: parseFloat(scoreCompleteness.toFixed(1)),
      score_technical_accuracy: parseFloat(scoreAccuracy.toFixed(1)),
      score_evidence_quality: parseFloat(scoreEvidence.toFixed(1)),
      score_root_cause_depth: parseFloat(scoreRootCause.toFixed(1)),
      score_remediation_actionability: parseFloat(scoreRemediation.toFixed(1)),
      total_rubric_score: total,
      evaluator_feedback: feedback
    };
  };

  const saveReport = (report: SOCReport13Section) => {
    const graded = evaluateReportRubric(report);
    setReports(prev => {
      const exists = prev.some(r => r.report_title === graded.report_title);
      if (exists) {
        return prev.map(r => r.report_title === graded.report_title ? graded : r);
      }
      return [graded, ...prev];
    });
  };

  return (
    <SOCContext.Provider
      value={{
        events,
        alerts,
        incidents,
        iocs,
        mitreTechniques: MITRE_TECHNIQUES,
        assets,
        detectionRules,
        networkFlows,
        authLogs,
        analystNotes,
        reports,
        activeScenario,
        scenarioStep,
        healthMetrics,
        isStreaming,
        streamSpeed,
        toggleStreaming,
        setStreamSpeed,
        injectEvent,
        clearEvents,
        updateAlertStatus,
        updateAlertNotes,
        updateIncidentStatus,
        assignIncidentAnalyst,
        performContainmentAction,
        toggleAssetQuarantine,
        toggleRuleStatus,
        addIOC,
        updateIOCReputation,
        loadScenario,
        advanceScenarioStep,
        resetScenario,
        addAnalystNote,
        deleteAnalystNote,
        saveReport,
        evaluateReportRubric
      }}
    >
      {children}
    </SOCContext.Provider>
  );
};

export const useSOC = (): SOCContextType => {
  const context = useContext(SOCContext);
  if (!context) {
    throw new Error('useSOC must be used within a SOCProvider');
  }
  return context;
};
