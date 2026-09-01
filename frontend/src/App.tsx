import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SOCProvider, useSOC } from './context/SOCContext';
import { SoundProvider } from './context/SoundContext';
import { Navbar } from './components/Navbar';
import { CyberParticles } from './components/CyberParticles';
import { AIMentorModal } from './components/AIMentorModal';
import { CertificateModal } from './components/CertificateModal';

// LMCYS Core Pages
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { BeforeMindsetPage } from './pages/BeforeMindsetPage';
import { MindsetCheckPage } from './pages/MindsetCheckPage';
import { WorldMapPage } from './pages/WorldMapPage';
import { LevelStudyPage } from './pages/LevelStudyPage';
import { SocArenaPage } from './pages/SocArenaPage';
import { ReportStudioPage } from './pages/ReportStudioPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { IpoExplainerApp } from './ipo/IpoExplainerApp';

// SOC Threat Detection & SIEM Suite
import { SOCHeader } from './components/soc/SOCHeader';
import { SOCSidebar } from './components/soc/SOCSidebar';
import { WorkflowProgressTracker } from './components/soc/WorkflowProgressTracker';
import { InvestigationModal } from './components/soc/InvestigationModal';
import { EventDetailModal } from './components/soc/EventDetailModal';
import { IOCDetailModal } from './components/soc/IOCDetailModal';

import { SOCDashboardPage } from './pages/soc/SOCDashboardPage';
import { LiveEventStreamPage } from './pages/soc/LiveEventStreamPage';
import { AlertsInvestigationPage } from './pages/soc/AlertsInvestigationPage';
import { IOCInvestigationPage } from './pages/soc/IOCInvestigationPage';
import { MitreAttackPage } from './pages/soc/MitreAttackPage';
import { IncidentResponsePage } from './pages/soc/IncidentResponsePage';
import { IncidentReportStudioPage } from './pages/soc/IncidentReportStudioPage';
import { NetworkSecurityPage } from './pages/soc/NetworkSecurityPage';
import { AuthenticationMonitoringPage } from './pages/soc/AuthenticationMonitoringPage';
import { DetectionRulesPage } from './pages/soc/DetectionRulesPage';
import { SiemQuerySearchPage } from './pages/soc/SiemQuerySearchPage';
import { AssetManagementPage } from './pages/soc/AssetManagementPage';
import { ScenarioSimulatorPage } from './pages/soc/ScenarioSimulatorPage';
import { AnalystNotesPage } from './pages/soc/AnalystNotesPage';

import { SOCAlert, SOCEvent, IOCItem, SOCIncident } from './types/soc';

const MainAppRouter: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { iocs } = useSOC();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('map');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [reportInitialData, setReportInitialData] = useState<any>(null);

  // SOC Suite Sub-tab State
  const [socSuiteSubTab, setSocSuiteSubTab] = useState<string>('dashboard');
  const [workflowStage, setWorkflowStage] = useState<number>(1);

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false);
  const [isCertOpen, setIsCertOpen] = useState<boolean>(false);

  // Forensics Modals
  const [selectedAlert, setSelectedAlert] = useState<SOCAlert | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);

  const [selectedEvent, setSelectedEvent] = useState<SOCEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);

  const [selectedIOC, setSelectedIOC] = useState<IOCItem | null>(null);
  const [isIOCModalOpen, setIsIOCModalOpen] = useState<boolean>(false);

  const [draftingIncident, setDraftingIncident] = useState<SOCIncident | null>(null);
  const [draftingAlert, setDraftingAlert] = useState<SOCAlert | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060913] text-cyan-400 font-mono">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Initializing LMCYS Cyber Defense Architecture...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, render Public Landing Page + Auth Modal
  if (!user) {
    return (
      <div className="min-h-screen cyber-grid-bg relative text-slate-100 flex flex-col justify-between">
        <CyberParticles />
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => {
            if (page === 'login') {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            } else if (page === 'register') {
              setAuthModalMode('register');
              setIsAuthModalOpen(true);
            }
          }}
          onOpenMentor={() => setIsMentorOpen(true)}
          onOpenCert={() => setIsCertOpen(true)}
        />

        <main className="relative z-10 flex-1">
          <LandingPage
            onStart={() => {
              setAuthModalMode('register');
              setIsAuthModalOpen(true);
            }}
            onLogin={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
          />
        </main>

        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            setCurrentPage('before_mindset');
          }}
        />

        <AIMentorModal isOpen={isMentorOpen} onClose={() => setIsMentorOpen(false)} />
        <CertificateModal isOpen={isCertOpen} onClose={() => setIsCertOpen(false)} />

        <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center font-mono text-[11px] text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>LMCYS — Let's Make Cyber Security Simple • Final-Year Engineering Project</span>
            <span>SOC Level 1 Certified Curriculum • Safe Synthetic Range</span>
          </div>
        </footer>
      </div>
    );
  }

  // Intermediate Step: "Before We Begin..." explanation screen
  if (currentPage === 'before_mindset') {
    return (
      <div className="min-h-screen cyber-grid-bg relative text-slate-100 flex flex-col justify-between">
        <CyberParticles />
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          onOpenMentor={() => setIsMentorOpen(true)}
          onOpenCert={() => setIsCertOpen(true)}
        />
        <main className="relative z-10 flex-1">
          <BeforeMindsetPage onContinue={() => setCurrentPage('mindset')} />
        </main>
        <AIMentorModal isOpen={isMentorOpen} onClose={() => setIsMentorOpen(false)} />
        <CertificateModal isOpen={isCertOpen} onClose={() => setIsCertOpen(false)} />
      </div>
    );
  }

  // Mindset Check: "Are You an Idiot?" protocol screen
  if (user.mindset_completed === 0 || currentPage === 'mindset') {
    return (
      <div className="min-h-screen cyber-grid-bg relative text-slate-100 flex flex-col justify-between">
        <CyberParticles />
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          onOpenMentor={() => setIsMentorOpen(true)}
          onOpenCert={() => setIsCertOpen(true)}
        />
        <main className="relative z-10 flex-1">
          <MindsetCheckPage onComplete={() => setCurrentPage('map')} />
        </main>
        <AIMentorModal isOpen={isMentorOpen} onClose={() => setIsMentorOpen(false)} />
        <CertificateModal isOpen={isCertOpen} onClose={() => setIsCertOpen(false)} />
      </div>
    );
  }

  // Handlers for SOC Suite
  const handleOpenAlertInvestigation = (alert: SOCAlert) => {
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
    setWorkflowStage(4);
  };

  const handleOpenEventDetail = (event: SOCEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
    setWorkflowStage(1);
  };

  const handlePivotToIOC = (iocValue: string) => {
    const found = iocs.find(i => i.value.toLowerCase() === iocValue.toLowerCase());
    if (found) {
      setSelectedIOC(found);
      setIsIOCModalOpen(true);
    } else {
      setSocSuiteSubTab('ioc');
      setCurrentPage('soc_suite');
    }
  };

  const handleDraftReportFromAlert = (alert: SOCAlert) => {
    setDraftingAlert(alert);
    setDraftingIncident(null);
    setSocSuiteSubTab('reports');
    setCurrentPage('soc_suite');
    setWorkflowStage(9);
  };

  const handleDraftReportFromIncident = (incident: SOCIncident) => {
    setDraftingIncident(incident);
    setDraftingAlert(null);
    setSocSuiteSubTab('reports');
    setCurrentPage('soc_suite');
    setWorkflowStage(9);
  };

  // Main Authenticated Application Router
  return (
    <div className="min-h-screen cyber-grid-bg relative text-slate-100 flex flex-col justify-between bg-[#050811]">
      <CyberParticles />

      {/* Global Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenMentor={() => setIsMentorOpen(true)}
        onOpenCert={() => setIsCertOpen(true)}
      />

      <div className="flex-1 relative z-10">
        
        {/* VIEW 1: Cyber World Map (100 Levels) */}
        {currentPage === 'map' && (
          <WorldMapPage
            onSelectLevel={(lvlId) => {
              setSelectedLevelId(lvlId);
              setCurrentPage('level');
            }}
          />
        )}

        {/* VIEW 2: 3-Tier Level Study Studio (Learn, Practice Terminal, Anti-Cheat Assessment) */}
        {currentPage === 'level' && (
          <LevelStudyPage
            levelId={selectedLevelId}
            onBackToMap={() => setCurrentPage('map')}
            onNextLevel={(nextLvl) => setSelectedLevelId(nextLvl)}
            onOpenArena={() => setCurrentPage('arena')}
          />
        )}

        {/* VIEW 3: Let's Defend (Practical SOC Simulation Arena) */}
        {currentPage === 'arena' && (
          <SocArenaPage
            onWriteReport={(alertData) => {
              setReportInitialData(alertData);
              setCurrentPage('reports');
            }}
            onBackToMap={() => setCurrentPage('map')}
          />
        )}

        {/* VIEW 4: 13-Section Incident Report Studio */}
        {currentPage === 'reports' && (
          <ReportStudioPage initialData={reportInitialData} />
        )}

        {/* VIEW 5: Cadet HUD / Profile */}
        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigateToMap={() => setCurrentPage('map')}
            onNavigateToArena={() => setCurrentPage('arena')}
            onOpenCert={() => setIsCertOpen(true)}
          />
        )}

        {/* VIEW 6: Admin Operations */}
        {currentPage === 'admin' && <AdminPage />}

        {/* VIEW 7: IPO Explained: Level 0 to 100 Interactive App */}
        {currentPage === 'ipo' && (
          <IpoExplainerApp onBackToMain={() => setCurrentPage('map')} />
        )}

        {/* VIEW 7: Full SOC SIEM & Threat Operations Suite */}
        {currentPage === 'soc_suite' && (
          <div className="flex flex-col min-h-[calc(100vh-61px)]">
            <SOCHeader
              activeTab={socSuiteSubTab}
              onSelectTab={(tab) => setSocSuiteSubTab(tab)}
              onOpenMentor={() => setIsMentorOpen(true)}
              onOpenNotes={() => setSocSuiteSubTab('notes')}
            />

            <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
              <SOCSidebar
                activeTab={socSuiteSubTab}
                onSelectTab={(tab) => {
                  setSocSuiteSubTab(tab);
                  if (tab === 'stream') setWorkflowStage(1);
                  else if (tab === 'alerts') setWorkflowStage(2);
                  else if (tab === 'ioc') setWorkflowStage(5);
                  else if (tab === 'mitre') setWorkflowStage(6);
                  else if (tab === 'incidents') setWorkflowStage(7);
                  else if (tab === 'reports') setWorkflowStage(9);
                }}
              />

              <main className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                <WorkflowProgressTracker
                  currentStage={workflowStage}
                  onSelectStage={(st) => {
                    setWorkflowStage(st);
                    if (st === 1) setSocSuiteSubTab('stream');
                    else if (st === 2) setSocSuiteSubTab('alerts');
                    else if (st === 3) setSocSuiteSubTab('dashboard');
                    else if (st === 4) setSocSuiteSubTab('alerts');
                    else if (st === 5) setSocSuiteSubTab('ioc');
                    else if (st === 6) setSocSuiteSubTab('mitre');
                    else if (st === 7 || st === 8) setSocSuiteSubTab('incidents');
                    else if (st === 9) setSocSuiteSubTab('reports');
                  }}
                />

                {socSuiteSubTab === 'dashboard' && (
                  <SOCDashboardPage
                    onSelectAlert={handleOpenAlertInvestigation}
                    onNavigate={(tab) => setSocSuiteSubTab(tab)}
                  />
                )}

                {socSuiteSubTab === 'stream' && (
                  <LiveEventStreamPage
                    onSelectEvent={handleOpenEventDetail}
                    onPivotToIOC={handlePivotToIOC}
                  />
                )}

                {socSuiteSubTab === 'alerts' && (
                  <AlertsInvestigationPage
                    onSelectAlert={handleOpenAlertInvestigation}
                    onNavigateToReport={handleDraftReportFromAlert}
                    onNavigateToIOC={handlePivotToIOC}
                  />
                )}

                {socSuiteSubTab === 'incidents' && (
                  <IncidentResponsePage
                    onDraftReport={handleDraftReportFromIncident}
                  />
                )}

                {socSuiteSubTab === 'ioc' && (
                  <IOCInvestigationPage
                    onPivotToSIEM={() => setSocSuiteSubTab('search')}
                  />
                )}

                {socSuiteSubTab === 'mitre' && (
                  <MitreAttackPage
                    onPivotToAlerts={() => setSocSuiteSubTab('alerts')}
                  />
                )}

                {socSuiteSubTab === 'search' && (
                  <SiemQuerySearchPage
                    onSelectEvent={handleOpenEventDetail}
                    onPivotToIOC={handlePivotToIOC}
                  />
                )}

                {socSuiteSubTab === 'network' && (
                  <NetworkSecurityPage
                    onPivotToIOC={handlePivotToIOC}
                  />
                )}

                {socSuiteSubTab === 'auth' && (
                  <AuthenticationMonitoringPage />
                )}

                {socSuiteSubTab === 'rules' && (
                  <DetectionRulesPage />
                )}

                {socSuiteSubTab === 'assets' && (
                  <AssetManagementPage />
                )}

                {socSuiteSubTab === 'reports' && (
                  <IncidentReportStudioPage
                    initialIncident={draftingIncident}
                    initialAlert={draftingAlert}
                  />
                )}

                {socSuiteSubTab === 'scenarios' && (
                  <ScenarioSimulatorPage
                    onNavigateToDashboard={() => setSocSuiteSubTab('dashboard')}
                    onNavigateToAlerts={() => setSocSuiteSubTab('alerts')}
                    onNavigateToReport={() => setSocSuiteSubTab('reports')}
                  />
                )}

                {socSuiteSubTab === 'notes' && (
                  <AnalystNotesPage />
                )}
              </main>
            </div>
          </div>
        )}
      </div>

      {/* Global Modals */}
      <InvestigationModal
        alert={selectedAlert}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onNavigateToReport={handleDraftReportFromAlert}
        onNavigateToIOC={handlePivotToIOC}
      />

      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onPivotToIOC={handlePivotToIOC}
      />

      <IOCDetailModal
        ioc={selectedIOC}
        isOpen={isIOCModalOpen}
        onClose={() => setIsIOCModalOpen(false)}
        onPivotToSIEM={() => {
          setIsIOCModalOpen(false);
          setSocSuiteSubTab('search');
          setCurrentPage('soc_suite');
        }}
      />

      <AIMentorModal
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        contextType={currentPage === 'level' ? 'assessment' : currentPage === 'arena' ? 'alert' : 'general'}
        contextId={selectedLevelId}
      />

      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-3.5 px-4 text-center font-mono text-[11px] text-slate-500">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LMCYS — Let's Make Cyber Security Simple • Final-Year Engineering Project</span>
          <span className="text-cyan-400">100-Level Curriculum • Safe Synthetic Range • Verified SOC L1 Certification</span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SoundProvider>
        <SOCProvider>
          <MainAppRouter />
        </SOCProvider>
      </SoundProvider>
    </AuthProvider>
  );
};

export default App;
