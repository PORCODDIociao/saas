import { useState } from 'react';
import { TrendingUp, TrendingDown, PlusCircle, Trash2, Lock, AlertTriangle } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { calculateTaxResidencyDays } from '../logic/calculators';
import { Link } from 'react-router-dom';

export default function Finance({ plan, trips }) {
  const { transactions, addTransaction, deleteTransaction, totals, CURRENCY_RATES } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'income', description: '', amount: '', currency: 'EUR', category: 'Freelance' });

  const CATEGORIES = {
    income: ['Freelance', 'Stipendio', 'Affitti', 'Investimenti', 'Altro'],
    expenses: ['Alloggio', 'Voli', 'Cibo', 'Trasporti', 'Abbonamenti', 'Tasse', 'Altro'],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    addTransaction(form);
    setForm({ type: 'income', description: '', amount: '', currency: 'EUR', category: 'Freelance' });
    setShowForm(false);
  };

  // Tax Estimator data (only for BUSINESS)
  const taxData = calculateTaxResidencyDays(trips || []);
  const taxRisks = taxData.filter(c => c.days >= 183);

  if (plan === 'FREE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="p-5 bg-dark-800 border border-dark-700 rounded-3xl max-w-md">
          <Lock size={40} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Finance Hub</h3>
          <p className="text-gray-400 mb-6">Il Finance Hub richiede un piano <strong className="text-primary">Digital Nomad</strong> o superiore. Traccia entrate, uscite e stima le tasse.</p>
          <Link to="/pricing" className="bg-primary text-dark-900 font-bold px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors">
            Passa a Nomad →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Finance Hub</h2>
          <p className="text-gray-400 text-sm">Il tuo libro mastro globale in un unico posto.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors">
          <PlusCircle size={18} />
          <span>Aggiungi</span>
        </button>
      </div>

      {/* TOTALS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-dark-800 border border-dark-700 p-5 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 rounded-2xl text-green-400"><TrendingUp size={22} /></div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Entrate Nette</p>
            <p className="text-2xl font-bold text-green-400">€{totals.income.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-dark-800 border border-dark-700 p-5 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 rounded-2xl text-red-400"><TrendingDown size={22} /></div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Uscite Totali</p>
            <p className="text-2xl font-bold text-red-400">€{totals.expenses.toFixed(2)}</p>
          </div>
        </div>
        <div className={`bg-dark-800 border p-5 rounded-3xl flex items-center space-x-4 ${totals.net >= 0 ? 'border-accent/30' : 'border-danger/30'}`}>
          <div className={`p-3 rounded-2xl ${totals.net >= 0 ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'}`}>
            {totals.net >= 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Cashflow Netto</p>
            <p className={`text-2xl font-bold ${totals.net >= 0 ? 'text-accent' : 'text-danger'}`}>€{totals.net.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* TAX ESTIMATOR (BUSINESS ONLY) */}
      {plan === 'BUSINESS' ? (
        taxRisks.length > 0 && (
          <div className="bg-dark-800 border border-warning/30 p-6 rounded-3xl">
            <div className="flex items-center space-x-3 mb-4 text-warning">
              <AlertTriangle size={22} />
              <h3 className="font-bold text-lg">Tax Estimator — Rischio Rilevato</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Hai superato i 183 giorni in questi paesi nell'anno corrente. Potresti essere considerato <strong className="text-white">residente fiscale</strong> dalla relativa autorità tributaria.</p>
            <div className="space-y-3">
              {taxRisks.map(c => (
                <div key={c.iso_code} className="flex items-center justify-between bg-dark-900 p-4 rounded-2xl border border-warning/20">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl font-bold text-warning">{c.iso_code}</span>
                    <span className="text-sm text-gray-400">{c.days} giorni nell'anno corrente</span>
                  </div>
                  <span className="text-xs bg-warning/20 text-warning border border-warning/30 px-3 py-1 rounded-full font-bold">RISCHIO FISCALE</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">* Consulta sempre un commercialista per la tua situazione specifica. Questa è una stima orientativa.</p>
          </div>
        )
      ) : (
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Lock size={20} className="text-gray-600" />
            <div>
              <h3 className="font-bold text-white">Tax Estimator</h3>
              <p className="text-sm text-gray-400">Calcola il rischio di doppia tassazione in base ai giorni per paese.</p>
            </div>
          </div>
          <Link to="/pricing" className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap ml-4">
            Piano Business →
          </Link>
        </div>
      )}

      {/* ADD FORM */}
      {showForm && (
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-4">Nuova Transazione</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex rounded-xl overflow-hidden border border-dark-700">
              <button type="button" onClick={() => setForm({...form, type: 'income', category: 'Freelance'})}
                className={`flex-1 py-2.5 font-bold text-sm transition-colors ${form.type === 'income' ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:bg-dark-700'}`}>
                Entrata
              </button>
              <button type="button" onClick={() => setForm({...form, type: 'expense', category: 'Alloggio'})}
                className={`flex-1 py-2.5 font-bold text-sm transition-colors ${form.type === 'expense' ? 'bg-red-500/20 text-red-400' : 'text-gray-500 hover:bg-dark-700'}`}>
                Uscita
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrizione *</label>
                <input required type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Es. Fattura cliente Acme"
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Categoria</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent outline-none">
                  {(CATEGORIES[form.type === 'income' ? 'income' : 'expenses']).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Importo *</label>
                <input required type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                  placeholder="1000.00"
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Valuta</label>
                <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent outline-none">
                  {Object.keys(CURRENCY_RATES).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-accent text-dark-900 font-bold px-6 py-3 rounded-xl">Salva</button>
            </div>
          </form>
        </div>
      )}

      {/* LEDGER TABLE */}
      <div className="bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-dark-700 flex justify-between items-center">
          <h3 className="font-bold text-white">Ledger Transazioni</h3>
          <span className="text-xs text-gray-500">{transactions.length} movimenti</span>
        </div>
        {transactions.length === 0 ? (
          <p className="p-10 text-center text-gray-500">Nessuna transazione ancora. Aggiungine una!</p>
        ) : (
          <div className="divide-y divide-dark-700/50">
            {[...transactions].reverse().map(tx => (
              <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-xl ${tx.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {tx.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.category} · {tx.amount} {tx.currency}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}€{parseFloat(tx.amountEur).toFixed(2)}
                  </span>
                  <button onClick={() => deleteTransaction(tx.id)} className="p-2 text-gray-600 hover:text-danger rounded-xl hover:bg-danger/10 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
