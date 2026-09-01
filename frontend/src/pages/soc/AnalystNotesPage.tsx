import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  Tag, 
  Clock, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { AnalystNote } from '../../types/soc';

export const AnalystNotesPage: React.FC = () => {
  const { analystNotes, addAnalystNote, deleteAnalystNote } = useSOC();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // New Note Form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<AnalystNote['category']>('OBSERVATION');
  const [newContent, setNewContent] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const filteredNotes = analystNotes.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || n.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addAnalystNote({
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      author: 'SOC L1 Analyst'
    });

    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
  };

  const exportNotes = () => {
    const md = `# SOC Analyst Casebook & Investigation Notes
Generated: ${new Date().toISOString()}

${analystNotes.map(n => `### [${n.category}] ${n.title}
*Timestamp: ${n.timestamp} | Author: ${n.author}*

${n.content}
---
`).join('\n')}`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soc-analyst-notes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              SOC ANALYST CASEBOOK & FORENSIC SCRATCHPAD
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Log investigative findings, decoded strings, hypotheses, containment timestamps, and case notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close Note Form' : 'Add Case Note'}</span>
          </button>

          <button
            onClick={exportNotes}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Notes</span>
          </button>
        </div>
      </div>

      {/* New Note Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateNote}
          className="p-5 rounded-xl bg-[#070b16] border border-cyan-500/40 shadow-xl space-y-4 text-xs animate-fadeIn"
        >
          <div className="font-bold text-slate-100 uppercase text-xs">Create New Investigation Note</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">NOTE TITLE</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Memory Dump Analysis on WIN-CLIENT-08"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">CATEGORY</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400"
              >
                <option value="OBSERVATION">OBSERVATION</option>
                <option value="EVIDENCE">EVIDENCE</option>
                <option value="HYPOTHESIS">HYPOTHESIS</option>
                <option value="CONTAINMENT">CONTAINMENT</option>
                <option value="CONCLUSION">CONCLUSION</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">FINDINGS & OBSERVATIONS</label>
            <textarea
              rows={4}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Record forensic details, decoded payloads, IP hashes, or containment steps taken..."
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 leading-relaxed font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-[#070b16] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Notes Title, Findings, Evidence..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Categories</option>
            <option value="OBSERVATION">Observation</option>
            <option value="EVIDENCE">Evidence</option>
            <option value="HYPOTHESIS">Hypothesis</option>
            <option value="CONTAINMENT">Containment</option>
            <option value="CONCLUSION">Conclusion</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="p-4 rounded-xl bg-[#090e1d] border border-slate-800 hover:border-cyan-500/40 shadow-lg space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  note.category === 'CONTAINMENT' ? 'bg-red-950 text-red-300 border border-red-800' :
                  note.category === 'EVIDENCE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  note.category === 'CONCLUSION' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {note.category}
                </span>
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{note.timestamp}</span>
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-100">{note.title}</h3>
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Author: <strong className="text-slate-200">{note.author}</strong></span>
              <button
                onClick={() => deleteAnalystNote(note.id)}
                className="text-slate-500 hover:text-red-400 p-1"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
