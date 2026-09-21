import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Calendar, 
  User, 
  TrendingUp, 
  Filter, 
  Search,
  X,
  History
} from 'lucide-react';
import { Project, ProjectStatus, ProjectTimeEntry } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ProjectsScreenProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onLogHours: (projectId: string, entry: ProjectTimeEntry) => void;
  onShowToast: (msg: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  onAddProject,
  onLogHours,
  onShowToast
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isLogHoursModalOpen, setIsLogHoursModalOpen] = useState(false);

  // Form Registra Ore
  const [timeEntryData, setTimeEntryData] = useState({
    author: 'Marco Cerilli',
    hours: '2.5',
    description: 'Implementazione logica backend e allineamento database'
  });

  // Form Nuova Commessa
  const [newProjectData, setNewProjectData] = useState({
    code: `COMM-2026-0${projects.length + 15}`,
    title: '',
    clientName: '',
    budgetEstimated: '4500',
    estimatedHours: '60',
    deadline: '2026-11-30',
    team: 'Marco Cerilli, Davide, Sara',
    description: ''
  });

  const filteredProjects = projects.filter(p => {
    if (filterStatus === 'in_corso' && p.status !== 'in_corso') return false;
    if (filterStatus === 'in_revisione' && p.status !== 'in_revisione') return false;
    if (filterStatus === 'completato' && p.status !== 'completato') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.clientName.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Metriche
  const totalBudget = projects.reduce((s, p) => s + p.budgetEstimated, 0);
  const totalLoggedHours = projects.reduce((s, p) => s + p.loggedHours, 0);
  const totalEstimatedHours = projects.reduce((s, p) => s + p.estimatedHours, 0);
  const avgSal = projects.length > 0 
    ? Math.round(projects.reduce((s, p) => s + p.salPercentage, 0) / projects.length)
    : 0;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectData.title || !newProjectData.clientName) {
      onShowToast('Inserisci titolo commessa e cliente.');
      return;
    }

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      code: newProjectData.code,
      title: newProjectData.title,
      clientName: newProjectData.clientName,
      status: 'in_corso',
      salPercentage: 15,
      budgetEstimated: parseFloat(newProjectData.budgetEstimated) || 0,
      costActual: 0,
      estimatedHours: parseFloat(newProjectData.estimatedHours) || 0,
      loggedHours: 0,
      startDate: new Date().toISOString().split('T')[0],
      deadline: newProjectData.deadline,
      team: newProjectData.team.split(',').map(m => m.trim()),
      description: newProjectData.description,
      recentLogs: []
    };

    onAddProject(newProj);
    setIsNewProjectModalOpen(false);
    onShowToast(`Commessa ${newProj.code} aperta con successo!`);
  };

  const handleSaveHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    const entry: ProjectTimeEntry = {
      id: `tl-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: timeEntryData.author,
      hours: parseFloat(timeEntryData.hours) || 1,
      description: timeEntryData.description
    };

    onLogHours(selectedProjectId, entry);
    setIsLogHoursModalOpen(false);
    onShowToast(`Registrate ${entry.hours}h di lavoro da ${entry.author}!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Intestazione */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Commesse, Avanzamento & Time Tracking
            </h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              Project Management
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controlla lo stato avanzamento lavori (SAL %), il tempo impiegato e la redditività effettiva di ogni commessa.
          </p>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apri Nuova Commessa</span>
        </button>
      </div>

      {/* KPI Cards Commesse */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Valore Commesse Attive</span>
          <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalBudget)}</div>
          <span className="text-[11px] text-slate-400">{projects.length} commesse in portafoglio</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-indigo-600">SAL Medio Generale</span>
          <div className="text-lg sm:text-xl font-bold text-indigo-600 mt-1">{avgSal}%</div>
          <span className="text-[11px] text-slate-400">Avanzamento lavori medio</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-600">Ore Lavorate (Logged)</span>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 mt-1">{totalLoggedHours}h</div>
          <span className="text-[11px] text-slate-400">su {totalEstimatedHours}h stimate a budget</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-purple-600">Efficienza Produttiva</span>
          <div className="text-lg sm:text-xl font-bold text-purple-600 mt-1">+92%</div>
          <span className="text-[11px] text-slate-400">Rispetto dei tempi di consegna</span>
        </div>
      </div>

      {/* Filtri & Ricerca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tutte ({projects.length})
          </button>
          <button
            onClick={() => setFilterStatus('in_corso')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterStatus === 'in_corso' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Corso
          </button>
          <button
            onClick={() => setFilterStatus('in_revisione')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterStatus === 'in_revisione' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Revisione
          </button>
          <button
            onClick={() => setFilterStatus('completato')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterStatus === 'completato' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completate
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cerca commessa o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Grid delle Commesse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((proj) => {
          const hoursPercentage = Math.round((proj.loggedHours / proj.estimatedHours) * 100);
          return (
            <div 
              key={proj.id} 
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header Card Commessa */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {proj.code}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        proj.status === 'in_corso' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        proj.status === 'in_revisione' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        proj.status === 'completato' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mt-2">{proj.title}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{proj.clientName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400">Budget Concordato</span>
                    <div className="font-extrabold text-base text-slate-900">
                      {formatCurrency(proj.budgetEstimated)}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Progress Bar SAL % */}
                <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-700">Stato Avanzamento Lavori (SAL)</span>
                    <span className="text-indigo-600 font-bold">{proj.salPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        proj.salPercentage >= 80 ? 'bg-emerald-500' :
                        proj.salPercentage >= 40 ? 'bg-indigo-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${proj.salPercentage}%` }}
                    />
                  </div>
                  
                  {/* Ore Lavorate vs Stimate */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Ore: <strong>{proj.loggedHours}h</strong> / {proj.estimatedHours}h ({hoursPercentage}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Scadenza: <strong>{proj.deadline}</strong>
                    </span>
                  </div>
                </div>

                {/* Team Assegnato */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Team:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {proj.team.map((member, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ultime Ore Registrate */}
                {proj.recentLogs && proj.recentLogs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      <History className="w-3 h-3" />
                      <span>Ultime attività registrate</span>
                    </div>
                    <div className="space-y-1">
                      {proj.recentLogs.map(log => (
                        <div key={log.id} className="text-xs flex items-center justify-between text-slate-600">
                          <span className="truncate max-w-60">• {log.description}</span>
                          <span className="font-mono text-slate-400 shrink-0 text-[11px]">{log.hours}h ({log.author})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Azioni Card */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setIsLogHoursModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>+ Registra Ore</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Registra Ore Lavorate */}
      {isLogHoursModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Registra Ore Lavorate su Commessa</h3>
              <button onClick={() => setIsLogHoursModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHours} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Collaboratore / Autore</label>
                <input
                  type="text"
                  value={timeEntryData.author}
                  onChange={(e) => setTimeEntryData({ ...timeEntryData, author: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ore Lavorate</label>
                <input
                  type="number"
                  step="0.5"
                  value={timeEntryData.hours}
                  onChange={(e) => setTimeEntryData({ ...timeEntryData, hours: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrizione Attività svolta</label>
                <textarea
                  rows={3}
                  placeholder="Cosa hai sviluppato o collaudato..."
                  value={timeEntryData.description}
                  onChange={(e) => setTimeEntryData({ ...timeEntryData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogHoursModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-xs"
                >
                  Salva Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nuova Commessa */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Apertura Nuova Commessa di Lavoro</h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Codice Commessa</label>
                  <input
                    type="text"
                    value={newProjectData.code}
                    onChange={(e) => setNewProjectData({ ...newProjectData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    placeholder="es. Studio Medico San Luca"
                    value={newProjectData.clientName}
                    onChange={(e) => setNewProjectData({ ...newProjectData, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titolo Progetto / Commessa</label>
                <input
                  type="text"
                  placeholder="Sviluppo Portale Web & Area Riservata Pazienti"
                  value={newProjectData.title}
                  onChange={(e) => setNewProjectData({ ...newProjectData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget Concordato (€)</label>
                  <input
                    type="number"
                    value={newProjectData.budgetEstimated}
                    onChange={(e) => setNewProjectData({ ...newProjectData, budgetEstimated: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ore Stimate</label>
                  <input
                    type="number"
                    value={newProjectData.estimatedHours}
                    onChange={(e) => setNewProjectData({ ...newProjectData, estimatedHours: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Consegna</label>
                  <input
                    type="date"
                    value={newProjectData.deadline}
                    onChange={(e) => setNewProjectData({ ...newProjectData, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Team Coinvolto (separato da virgola)</label>
                <input
                  type="text"
                  value={newProjectData.team}
                  onChange={(e) => setNewProjectData({ ...newProjectData, team: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note & Obiettivi</label>
                <textarea
                  rows={2}
                  placeholder="Requisiti chiave e milestone..."
                  value={newProjectData.description}
                  onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-xs"
                >
                  Crea Commessa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
