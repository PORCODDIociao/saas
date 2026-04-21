import { useState } from 'react';
import { CalendarDays, Plus, Trash2, ShieldAlert } from 'lucide-react';
import SubscriptionModal from '../components/SubscriptionModal';
import { useNavigate } from 'react-router-dom';

export default function TripHistory({ trips, addTrip, deleteTrip, plan }) {
  const [newTrip, setNewTrip] = useState({ iso_code: '', entry_date: '', exit_date: '', is_schengen: false });
  const [showForm, setShowForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (plan === 'FREE' && trips.length >= 3) {
      setModalOpen(true);
    } else {
      setShowForm(!showForm);
    }
  };

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
          onClick={handleAddClick}
          className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors relative"
        >
          {plan === 'FREE' && trips.length >= 3 && (
            <span className="absolute -top-2 -right-2 w-3 h-3 bg-danger rounded-full animate-pulse" />
          )}
          <Plus size={18} />
          <span>Aggiungi</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-3xl mb-8 animate-in fade-in">
          <h3 className="text-lg font-bold text-white mb-4">Nuovo Viaggio</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Codice Paese (es. ES)</label>
                <input 
                  type="text" maxLength="2" required 
                  value={newTrip.iso_code} onChange={e => setNewTrip({...newTrip, iso_code: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent outline-none uppercase"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newTrip.is_schengen}
                    onChange={e => setNewTrip({...newTrip, is_schengen: e.target.checked})}
                    className="w-5 h-5 accent-accent"
                  />
                  <span className="text-gray-300">Area Schengen</span>
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data Ingresso</label>
                <input 
                  type="date" required 
                  value={newTrip.entry_date} onChange={e => setNewTrip({...newTrip, entry_date: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data Uscita</label>
                <input 
                  type="date" 
                  value={newTrip.exit_date} onChange={e => setNewTrip({...newTrip, exit_date: e.target.value})} min={newTrip.entry_date}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-accent text-dark-900 font-bold px-6 py-3 rounded-xl">Salva Viaggio</button>
            </div>
          </form>
        </div>
      )}

      {/* TRIPS LIST */}
      <div className="bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden">
        {trips.length === 0 ? (
          <div className="p-12 text-center text-gray-500"><p>Nessun viaggio registrato.</p></div>
        ) : (
          <div className="divide-y divide-dark-700/50">
            {trips.sort((a,b) => new Date(b.entry_date) - new Date(a.entry_date)).map(trip => (
              <div key={trip.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-dark-700/20">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${trip.is_schengen ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-dark-700 border-dark-600 text-gray-300'}`}>
                    {trip.iso_code}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{trip.iso_code}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(trip.entry_date).toLocaleDateString('it-IT')} 
                      {' '}➔{' '} 
                      {trip.exit_date ? new Date(trip.exit_date).toLocaleDateString('it-IT') : <span className="text-accent">In corso</span>}
                    </p>
                  </div>
                </div>
                <button onClick={() => deleteTrip(trip.id)} className="p-3 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-xl"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SubscriptionModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        plan="NOMAD"
        customMessage="Hai raggiunto il limite del piano Free (3 viaggi). Passa a Nomad per tracciare il tuo giro del mondo senza limiti."
      />
    </div>
  );
}
