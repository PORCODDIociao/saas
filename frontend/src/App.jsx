import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Globe, ShieldAlert, BadgeAlert, Plus, Trash2, CalendarDays } from 'lucide-react';
import { calculateSchengenDays, calculateTaxResidencyDays } from './logic/calculators';
import './index.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/trips';

function App() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newTrip, setNewTrip] = useState({ iso_code: '', entry_date: '', exit_date: '', is_schengen: false });

  // Load trips
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrip)
      });
      if (res.ok) {
        setNewTrip({ iso_code: '', entry_date: '', exit_date: '', is_schengen: false });
        fetchTrips();
      }
    } catch (err) {
      console.error('Error adding trip:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTrips(trips.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Error deleting trip', err);
    }
  };

  const schengenDays = calculateSchengenDays(trips);
  const taxData = calculateTaxResidencyDays(trips);

  const getSchengenColor = (days) => {
    if (days >= 90) return '#cf6679'; // Danger
    if (days >= 75) return '#fbc02d'; // Warning
    return '#66fcf1'; // Safe
  };

  if (loading) return <div className="app-container">Caricamento dati...</div>;

  return (
    <div className="app-container">
      <header>
        <h1>Nomad Compliance Tracker</h1>
        <p>Monitora i limiti del visto Schengen e la tua residenza fiscale.</p>
      </header>

      <div className="dashboard-grid">
        {/* SCHENGEN CALCULATOR */}
        <div className="card schengen-container">
          <h2><Globe size={20} /> Regola Schengen (90/180)</h2>
          <div className="progress-wrapper">
            <CircularProgressbar
              value={schengenDays}
              maxValue={90}
              text={`${schengenDays}/90`}
              styles={buildStyles({
                pathColor: getSchengenColor(schengenDays),
                textColor: '#fff',
                trailColor: 'rgba(255,255,255,0.1)',
                textSize: '24px'
              })}
            />
          </div>
          <p className={schengenDays > 90 ? 'danger-text' : (schengenDays > 75 ? 'warning-text' : '')}>
            {schengenDays > 90 
              ? 'Violazione del visto! Hai superato i 90 giorni.' 
              : `Hai trascorso ${schengenDays} giorni nell'area Schengen negli ultimi 180 giorni.`}
          </p>
        </div>

        {/* TAX RESIDENCY */}
        <div className="card">
          <h2><BadgeAlert size={20} /> Alert Residenza Fiscale</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Giorni calcolati nell'anno solare in corso (limite generale: 183 gg)
          </p>
          {taxData.length === 0 ? <p>Nessun viaggio registrato per l'anno in corso.</p> : null}
          
          {taxData.map(stat => {
            let color = '#66fcf1'; // Green
            if (stat.days >= 150) color = '#cf6679'; // Red
            else if (stat.days >= 100) color = '#fbc02d'; // Orange

            const pct = Math.min((stat.days / 183) * 100, 100);

            return (
              <div key={stat.iso_code} className="tax-bar-container">
                <div className="tax-header">
                  <span>Paese: <strong>{stat.iso_code}</strong></span>
                  <span style={{ color }}>{stat.days}/183 gg</span>
                </div>
                <div className="tax-bar">
                  <div 
                    className="tax-bar-fill" 
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  ></div>
                </div>
                {stat.days >= 150 && (
                  <p className="danger-text" style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>
                    <ShieldAlert size={14} style={{ position: 'relative', top: '2px', marginRight: '4px' }}/>
                    Rischio Residenza Fiscale Imminente!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* ADD TRIP FORM */}
        <div className="card">
          <h2><Plus size={20} /> Nuovo Viaggio</h2>
          <form onSubmit={handleAddTrip}>
            <div className="form-group">
              <label>Codice Paese (es. ES, TH, IT)</label>
              <input 
                type="text" 
                maxLength="2" 
                required 
                value={newTrip.iso_code}
                onChange={e => setNewTrip({...newTrip, iso_code: e.target.value.toUpperCase()})}
                placeholder="IT"
              />
            </div>
            <div className="form-group">
              <label>Data di Ingresso</label>
              <input 
                type="date" 
                required 
                value={newTrip.entry_date}
                onChange={e => setNewTrip({...newTrip, entry_date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Data di Uscita (opzionale)</label>
              <input 
                type="date" 
                value={newTrip.exit_date}
                onChange={e => setNewTrip({...newTrip, exit_date: e.target.value})}
              />
            </div>
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="is_schengen"
                checked={newTrip.is_schengen}
                onChange={e => setNewTrip({...newTrip, is_schengen: e.target.checked})}
              />
              <label htmlFor="is_schengen">Area Schengen</label>
            </div>
            <button type="submit">Salva Viaggio</button>
          </form>
        </div>

        {/* TRIPS LIST */}
        <div className="card">
          <h2><CalendarDays size={20} /> I Tuoi Viaggi</h2>
          <div className="trip-list">
            {trips.length === 0 ? <p>Nessun viaggio inserito.</p> : null}
            {trips.map(trip => (
              <div key={trip.id} className={`trip-item ${trip.is_schengen ? 'schengen' : ''}`}>
                <div className="trip-item-info">
                  <strong>{trip.iso_code} {trip.is_schengen && '(Schengen)'}</strong>
                  <span>{new Date(trip.entry_date).toLocaleDateString()} - {trip.exit_date ? new Date(trip.exit_date).toLocaleDateString() : 'In Corso'}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(trip.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
