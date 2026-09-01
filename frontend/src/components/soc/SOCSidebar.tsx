import React from 'react';
import {
  LayoutDashboard,
  Radio,
  AlertTriangle,
  Flame,
  Search,
  Crosshair,
  Grid,
  Network,
  UserCheck,
  Cpu,
  Server,
  FileCheck,
  Zap,
  BookOpen,
  LucideIcon
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';

interface SOCSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
  highlight?: boolean;
  badge?: string;
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

export const SOCSidebar: React.FC<SOCSidebarProps> = ({ activeTab, onSelectTab }) => {
  const { alerts, incidents, detectionRules, assets } = useSOC();

  const openAlertsCount = alerts.filter(a => a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;
  const activeIncidentsCount = incidents.filter(i => i.current_status !== 'CLOSED').length;
  const activeRulesCount = detectionRules.filter(r => r.status === 'ENABLED').length;
  const quarantinedAssetsCount = assets.filter(a => a.status === 'QUARANTINED').length;

  const navGroups: NavGroup[] = [
    {
      category: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard },
        { id: 'stream', label: 'Live Event Stream', icon: Radio, badge: 'LIVE' },
        { id: 'alerts', label: 'Alerts & Investigation', icon: AlertTriangle, count: openAlertsCount, highlight: openAlertsCount > 0 },
        { id: 'incidents', label: 'Incident Response (IR)', icon: Flame, count: activeIncidentsCount, highlight: activeIncidentsCount > 0 }
      ]
    },
    {
      category: 'INVESTIGATION & INTEL',
      items: [
        { id: 'ioc', label: 'IOC Threat Intel', icon: Crosshair },
        { id: 'mitre', label: 'MITRE ATT&CK Matrix', icon: Grid },
        { id: 'search', label: 'SIEM Query & Search', icon: Search }
      ]
    },
    {
      category: 'MONITORING DOMAINS',
      items: [
        { id: 'network', label: 'Network Flow Security', icon: Network },
        { id: 'auth', label: 'Authentication & Identity', icon: UserCheck }
      ]
    },
    {
      category: 'GOVERNANCE & REPORTING',
      items: [
        { id: 'rules', label: 'Detection Rules Engine', icon: Cpu, count: activeRulesCount },
        { id: 'assets', label: 'Asset Management', icon: Server, badge: quarantinedAssetsCount > 0 ? `${quarantinedAssetsCount} Iso` : undefined },
        { id: 'reports', label: '13-Sec Incident Report', icon: FileCheck },
        { id: 'scenarios', label: 'Attack Scenarios', icon: Zap },
        { id: 'notes', label: 'Analyst Casebook', icon: BookOpen }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#070b16] border-r border-cyan-500/15 flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)]">
      <div className="p-3 space-y-5 overflow-y-auto">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {group.category}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-mono text-xs transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/60 text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        item.highlight ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.count}
                      </span>
                    )}

                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Analyst Identity Footer */}
      <div className="p-3 border-t border-slate-900 bg-[#050811]/90">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs shadow-[0_0_8px_rgba(0,240,255,0.3)]">
            L1
          </div>
          <div className="overflow-hidden">
            <div className="font-mono text-xs font-semibold text-slate-200 truncate">
              SOC L1 ANALYST
            </div>
            <div className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>CLEARANCE: ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
