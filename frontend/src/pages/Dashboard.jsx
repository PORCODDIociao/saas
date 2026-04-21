import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { calculateSchengenDays, calculateSchengenStatus, calculateTaxResidencyDays } from '../logic/calculators';
import { AlertTriangle, Globe, Landmark, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SubscriptionModal from '../components/SubscriptionModal';

export default function Dashboard({ trips, plan }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const schengenDays = calculateSchengenDays(trips);
  const schengenStatusText = calculateSchengenStatus(trips);
  const taxData = calculateTaxResidencyDays(trips);

  const getSchengenColor = (days) => {
    if (days >= 90) return '#cf6679';
    if (days >= 75) return '#fbc02d';
    return '#66fcf1';
  };

  const handleFabClick = () => {
    if (plan === 'FREE' && trips.length >= 3) {
      setModalOpen(true);
    } else {
      navigate('/history');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 text-sm">Resoconto stato visti e residenza fiscale.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SCHENGEN CARD */}
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Globe size={120} />
          </div>
          
          <div className="flex items-center space-x-3 mb-6 relative z-10">
            <div className="p-2 bg-dark-700 rounded-xl text-accent">
              <Globe size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Regola Schengen (90/180)</h3>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 flex-shrink-0">
              <CircularProgressbar
                value={schengenDays}
                maxValue={90}
                text={`${schengenDays}gg`}
                styles={buildStyles({
                  pathColor: getSchengenColor(schengenDays),
                  textColor: '#fff',
                  trailColor: 'rgba(255,255,255,0.05)',
                  textSize: '20px'
                })}
              />
            </div>
            <div className="flex-1">
              <p className={`text-lg font-medium ${schengenDays >= 90 ? 'text-danger' : (schengenDays >= 75 ? 'text-warning' : 'text-gray-300')}`}>
                {schengenStatusText}
              </p>
            </div>
          </div>
        </div>

        {/* TAX RESIDENCY CARDS */}
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-dark-700 rounded-xl text-primary">
              <Landmark size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Rischio Fiscale (183gg)</h3>
          </div>

          {taxData.length === 0 ? (
             <p className="text-gray-500 text-center py-4">Nessun paese su cui calcolare l'anno corrente.</p>
          ) : (
            <div className="space-y-5">
              {taxData.map(stat => {
                let colorClass = 'bg-accent';
                let textClass = 'text-accent';
                
                if (stat.days >= 150) { colorClass = 'bg-danger'; textClass = 'text-danger'; }
                else if (stat.days >= 100) { colorClass = 'bg-warning'; textClass = 'text-warning'; }

                const pct = Math.min((stat.days / 183) * 100, 100);

                return (
                  <div key={stat.iso_code} className="bg-dark-900 rounded-2xl p-4 border border-dark-700/50">
                    <div className="flex justify-between font-bold mb-2">
                       <span className="text-white text-lg">{stat.iso_code}</span>
                       <span className={textClass}>{stat.days} <span className="text-xs text-gray-500 font-normal">/ 183 gg</span></span>
                    </div>
                    <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleFabClick}
        className="fixed bottom-8 right-8 bg-accent hover:bg-accent-hover text-dark-900 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-transform hover:scale-110 z-40"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <SubscriptionModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        plan="NOMAD"
        customMessage="Hai raggiunto il limite di 3 viaggi del piano Free. Passa a Pro per tracciare il tuo giro del mondo senza limiti."
      />
    </div>
  );
}
