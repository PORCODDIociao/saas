import { useState } from 'react';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';

export default function TripHistory({ trips, addTrip, deleteTrip }) {
  const [newTrip, setNewTrip] = useState({ iso_code: '', entry_date: '', exit_date: '', is_schengen: false });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTrip.iso_code || !newTrip.entry_date) return;
    
    addTrip({
      ...newTrip,
      iso_code: newTrip.iso_code.toUpperCase(),
    });
    setNewTrip({ iso_code: '', entry_date: '', exit_date: '', is_schengen: false });
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Cronologia Viaggi</h2>
          <p className="text-gray-400 text-sm">Gestisci il tuo storico passaporto.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
        >
          <Plus size={18} />
          <span>Aggiungi</span>
        </button>
      </div>

      {/* ADD TRIP FORM */}
      {showForm && (
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-3xl mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-white mb-4">Nuovo Viaggio</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Codice Paese (es. ES, IT, TH)</label>
                <input 
                  type="text" 
                  maxLength="2" 
                  required 
                  value={newTrip.iso_code}
                  onChange={e => setNewTrip({...newTrip, iso_code: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none uppercase transition-colors"
                  placeholder="US"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={newTrip.is_schengen}
                      onChange={e => setNewTrip({...newTrip, is_schengen: e.target.checked})}
                    />
                    <div className="w-6 h-6 border-2 border-dark-600 bg-dark-900 rounded-md peer-checked:bg-accent peer-checked:border-accent transition-colors"></div>
                    <svg className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block text-dark-900" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 6.5L6 11L16 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Area Schengen</span>
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data di Ingresso</label>
                <input 
                  type="date" 
                  required 
                  value={newTrip.entry_date}
                  onChange={e => setNewTrip({...newTrip, entry_date: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data di Uscita <span className="text-dark-500">(opzionale se in corso)</span></label>
                <input 
                  type="date" 
                  value={newTrip.exit_date}
                  onChange={e => setNewTrip({...newTrip, exit_date: e.target.value})}
                  min={newTrip.entry_date}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-accent hover:bg-accent-hover text-dark-900 font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)]">
                Salva Viaggio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TRIPS LIST */}
      <div className="bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden">
        {trips.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CalendarDays size={48} className="mx-auto mb-4 opacity-20" />
            <p>Nessun viaggio registrato.</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-700/50">
            {trips.sort((a,b) => new Date(b.entry_date) - new Date(a.entry_date)).map(trip => (
              <div key={trip.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-dark-700/20 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border ${trip.is_schengen ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-dark-700 border-dark-600 text-gray-300'}`}>
                    {trip.iso_code}
                  </div>
                  <div>
                    <h4 className="text-white font-medium flex items-center">
                      Viaggio in {trip.iso_code}
                      {trip.is_schengen && <span className="ml-2 text-[10px] uppercase font-bold bg-accent/20 text-accent px-2 py-0.5 rounded-full">Schengen</span>}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(trip.entry_date).toLocaleDateString('it-IT')} 
                      {' '}➔{' '} 
                      {trip.exit_date ? new Date(trip.exit_date).toLocaleDateString('it-IT') : <span className="text-accent">In corso</span>}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTrip(trip.id)}
                  className="p-3 bg-dark-900 border border-dark-700 hover:border-danger/50 rounded-xl text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors self-end sm:self-auto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
