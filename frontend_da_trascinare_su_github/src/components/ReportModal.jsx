import { useState } from 'react';
import { X, Globe, Landmark, TrendingUp, AlertTriangle, Clock, Download } from 'lucide-react';
import { calculateSchengenDays, calculateSchengenStatus, calculateTaxResidencyDays } from '../logic/calculators';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function ReportModal({ isOpen, onClose, trips, user, finances = [] }) {
  const today = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const schengenDays = calculateSchengenDays(trips);
  const schengenStatus = calculateSchengenStatus(trips);
  const taxData = calculateTaxResidencyDays(trips);

  const totals = finances.reduce((acc, tx) => {
    const val = parseFloat(tx.amountEur || 0);
    if (tx.type === 'income') acc.income += val;
    else acc.expenses += val;
    return acc;
  }, { income: 0, expenses: 0 });
  totals.net = totals.income - totals.expenses;

  const schengenPct = Math.min((schengenDays / 90) * 100, 100);
  const statusColor = schengenDays >= 90 ? '#cf6679' : schengenDays >= 75 ? '#fbc02d' : '#66fcf1';

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(11, 15, 26);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Nomad Empire", 15, 20);
    doc.setFontSize(10);
    doc.setTextColor(102, 252, 241);
    doc.text("Report Conformita & Fiscale", 15, 28);

    doc.setTextColor(200, 200, 200);
    doc.text(`Generato il: ${today}`, 150, 20);
    if(user?.email) {
      doc.text(`Intestatario: ${user.email}`, 150, 28);
    }
    
    // Schengen
    let yPos = 50;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.text("Regola Schengen - 90/180 Giorni", 15, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Giorni utilizzati: ${schengenDays} / 90`, 15, yPos);
    
    // Rischio Fiscale
    yPos += 15;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.text("Rischio Residenza Fiscale", 15, yPos);
    
    const taxRows = taxData.map(t => [t.iso_code, `${t.days} / 183 giorni`, t.days >= 183 ? 'RISCHIO' : t.days >= 100 ? 'ATTENZIONE' : 'OK']);
    
    doc.autoTable({
      startY: yPos + 5,
      head: [['Paese', 'Giorni', 'Stato']],
      body: taxRows.length > 0 ? taxRows : [['Nessun dato', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40] }
    });
    
    // Viaggi
    yPos = doc.lastAutoTable.finalY + 15;
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.text(`Log Viaggi (${trips.length} registrati)`, 15, yPos);
    
    const tripRows = [...trips].sort((a,b) => new Date(b.entry_date) - new Date(a.entry_date)).map(t => [
      t.iso_code,
      new Date(t.entry_date).toLocaleDateString('it-IT'),
      t.exit_date ? new Date(t.exit_date).toLocaleDateString('it-IT') : 'In corso',
      t.is_schengen ? 'SI' : 'NO'
    ]);

    doc.autoTable({
      startY: yPos + 5,
      head: [['Paese', 'Ingresso', 'Uscita', 'Schengen']],
      body: tripRows.length > 0 ? tripRows : [['Nessun viaggio', '-', '-', '-']],
      theme: 'striped',
      headStyles: { fillColor: [40, 40, 40] }
    });
    
    // Finanze
    if (finances.length > 0) {
      yPos = doc.lastAutoTable.finalY + 15;
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.text("Riepilogo Finanziario (EUR)", 15, yPos);
      
      doc.autoTable({
        startY: yPos + 5,
        head: [['Entrate', 'Uscite', 'Netto']],
        body: [[
           `E ${totals.income.toFixed(2)}`,
           `E ${totals.expenses.toFixed(2)}`,
           `E ${totals.net.toFixed(2)}`
        ]],
        theme: 'plain',
        bodyStyles: { fontStyle: 'bold', fontSize: 12 },
        headStyles: { fillColor: [240, 240, 240], textColor: [100, 100, 100] }
      });
    }

    doc.save(`Nomad_Empire_Report_${new Date().getTime()}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <button onClick={onClose} className="fixed top-4 right-4 z-[80] p-2 bg-dark-800 border border-dark-700 text-gray-400 hover:text-white rounded-full">
        <X size={20} />
      </button>
      <button onClick={generatePDF} className="fixed top-4 right-16 z-[80] flex items-center space-x-2 bg-primary text-dark-900 font-bold px-4 py-2 rounded-full text-sm">
        <Download size={16} />
        <span>Stampa / Salva PDF</span>
      </button>

      {/* REPORT DOCUMENT (HTML PREVIEW) */}
      <div id="nomad-report" className="relative mt-16 mb-8 w-full max-w-3xl bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl">
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
          {/* SCHENGEN STATUS */}
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
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${schengenPct}%`, backgroundColor: statusColor }} />
              </div>
              <p className="text-sm text-gray-700 font-medium">{schengenStatus}</p>
            </div>
          </section>

          {/* TAX RESIDENCY */}
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

          {/* FINANCE SUMMARY */}
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
            <p className="text-xs text-gray-400">Documento generato da <strong>Nomad Empire</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ReportModal };
