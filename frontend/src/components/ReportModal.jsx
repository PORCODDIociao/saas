import { useState } from 'react';
import { X, Globe, Landmark, TrendingUp, TrendingDown, Download, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { calculateSchengenDays, calculateSchengenStatus, calculateTaxResidencyDays } from '../logic/calculators';

function ReportModal({ isOpen, onClose, trips, user }) {
  const today = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const schengenDays = calculateSchengenDays(trips);
  const schengenStatus = calculateSchengenStatus(trips);
  const taxData = calculateTaxResidencyDays(trips);
  const finances = JSON.parse(localStorage.getItem('nomad_finance') || '[]');

  const totals = finances.reduce((acc, tx) => {
    const val = parseFloat(tx.amountEur);
    if (tx.type === 'income') acc.income += val;
    else acc.expenses += val;
    return acc;
  }, { income: 0, expenses: 0 });
  totals.net = totals.income - totals.expenses;

  const schengenPct = Math.min((schengenDays / 90) * 100, 100);
  const statusColor = schengenDays >= 90 ? '#cf6679' : schengenDays >= 75 ? '#fbc02d' : '#66fcf1';

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      {/* Close button fuori dal report */}
      <button onClick={onClose} className="fixed top-4 right-4 z-[80] p-2 bg-dark-800 border border-dark-700 text-gray-400 hover:text-white rounded-full">
        <X size={20} />
      </button>
      <button onClick={handlePrint} className="fixed top-4 right-16 z-[80] flex items-center space-x-2 bg-primary text-dark-900 font-bold px-4 py-2 rounded-full text-sm">
        <Download size={16} />
        <span>Stampa / Salva PDF</span>
      </button>

      {/* REPORT DOCUMENT */}
      <div id="nomad-report" className="relative mt-16 mb-8 w-full max-w-3xl bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl print:mt-0 print:rounded-none print:shadow-none">
        
        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #0b0f1a 0%, #1a2035 100%)' }} className="px-10 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">Nomad Empire</h1>
              <p style={{ color: '#66fcf1' }} className="text-sm font-medium mt-1">Report Conformità & Fiscale</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">Generato il</p>
              <p className="text-white font-bold text-sm">{today}</p>
            </div>
          </div>
          {user?.email && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Intestatario</p>
              <p className="text-white font-bold text-lg">{user.email}</p>
            </div>
          )}
        </div>

        <div className="px-10 py-8 space-y-8">
          
          {/* 1. SCHENGEN STATUS */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Globe size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">Regola Schengen — 90/180 Giorni</h2>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Giorni utilizzati negli ultimi 180 giorni</span>
                <span className="font-bold text-xl" style={{ color: statusColor }}>{schengenDays} / 90</span>
              </div>
              {/* Progress bar */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${schengenPct}%`, backgroundColor: statusColor }} />
              </div>
              <p className="text-sm text-gray-700 font-medium">{schengenStatus}</p>
            </div>
          </section>

          {/* 2. TAX RESIDENCY */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Landmark size={20} className="text-purple-600" />
              <h2 className="text-lg font-bold text-gray-800">Rischio Residenza Fiscale</h2>
            </div>
            {taxData.length === 0 ? (
              <p className="text-gray-500 text-sm italic">Nessun dato disponibile.</p>
            ) : (
              <div className="space-y-3">
                {taxData.map(stat => {
                  const pct = Math.min((stat.days / 183) * 100, 100);
                  const isRisk = stat.days >= 183;
                  const isWarning = stat.days >= 100 && !isRisk;
                  return (
                    <div key={stat.iso_code} className={`border rounded-xl p-4 ${isRisk ? 'border-red-200 bg-red-50' : isWarning ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          {isRisk ? <AlertTriangle size={16} className="text-red-600" /> : <Clock size={16} className="text-gray-400" />}
                          <span className="font-bold text-gray-800">{stat.iso_code}</span>
                          {isRisk && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">RISCHIO FISCALE</span>}
                        </div>
                        <span className={`font-bold ${isRisk ? 'text-red-600' : 'text-gray-700'}`}>{stat.days} / 183 giorni</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: isRisk ? '#ef4444' : isWarning ? '#f59e0b' : '#6366f1' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. LOG VIAGGI */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Globe size={20} className="text-green-600" />
              <h2 className="text-lg font-bold text-gray-800">Log Viaggi ({trips.length} registrati)</h2>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="text-left px-4 py-3 font-semibold">Paese</th>
                    <th className="text-left px-4 py-3 font-semibold">Ingresso</th>
                    <th className="text-left px-4 py-3 font-semibold">Uscita</th>
                    <th className="text-center px-4 py-3 font-semibold">Schengen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...trips].sort((a,b) => new Date(b.entry_date) - new Date(a.entry_date)).map(trip => (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold">{trip.iso_code}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(trip.entry_date).toLocaleDateString('it-IT')}</td>
                      <td className="px-4 py-3 text-gray-600">{trip.exit_date ? new Date(trip.exit_date).toLocaleDateString('it-IT') : '— In corso'}</td>
                      <td className="px-4 py-3 text-center">{trip.is_schengen ? <span className="text-blue-600 font-bold text-xs">✓ Sì</span> : <span className="text-gray-400 text-xs">No</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. FINANCE SUMMARY */}
          {finances.length > 0 && (
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp size={20} className="text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-800">Riepilogo Finanziario</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Entrate</p>
                  <p className="text-xl font-bold text-green-600">€{totals.income.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Uscite</p>
                  <p className="text-xl font-bold text-red-500">€{totals.expenses.toFixed(2)}</p>
                </div>
                <div className={`rounded-xl p-4 text-center border ${totals.net >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-xs text-gray-500 mb-1">Netto</p>
                  <p className={`text-xl font-bold ${totals.net >= 0 ? 'text-blue-600' : 'text-red-500'}`}>€{totals.net.toFixed(2)}</p>
                </div>
              </div>
            </section>
          )}

          {/* FOOTER */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-400">Documento generato da <strong>Nomad Empire</strong> — nomadempire.app</p>
            <p className="text-xs text-gray-400 mt-1">⚠️ Questo report è a scopo informativo. Consulta un commercialista per decisioni fiscali vincolanti.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportButton({ plan, trips, user }) {
  const [showReport, setShowReport] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    if (plan !== 'BUSINESS') return;
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setShowReport(true);
    }, 1500);
  };

  return (
    <>
      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[90] bg-dark-800 border border-accent/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-4">
          <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <span className="font-medium">Generazione report professionale in corso...</span>
        </div>
      )}

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        trips={trips}
        user={user}
      />
    </>
  );
}

export { ReportModal };
