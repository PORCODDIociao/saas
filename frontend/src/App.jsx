import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, History, FileText, Settings as SettingsIcon, Menu, X, Rocket, Crown } from 'lucide-react';
import { useState } from 'react';

import Dashboard from './pages/Dashboard';
import TripHistory from './pages/History';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import SubscriptionModal from './components/SubscriptionModal';
import { useTrips } from './hooks/useTrips';
import { usePlan } from './hooks/usePlan';

function Sidebar({ isMobileOpen, setIsMobileOpen, plan }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCustomMsg, setModalCustomMsg] = useState('');
  
  const navItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/history', label: 'Cronologia Viaggi', icon: History },
    { path: '/settings', label: 'Impostazioni', icon: SettingsIcon },
  ];

  const handleReportClick = () => {
    setIsMobileOpen(false);
    if (plan !== 'BUSINESS') {
      setModalCustomMsg("Questa funzione richiede il piano Business. Fai l'upgrade per proteggere le tue tasse.");
      setModalOpen(true);
    } else {
      alert("Generazione PDF in corso..."); // Solo chi è BUSINESS vede questo
    }
  };

  const badgeColors = {
    'FREE': 'bg-gray-700 text-gray-300',
    'NOMAD': 'bg-primary/20 text-primary border border-primary/30',
    'BUSINESS': 'bg-accent/20 text-accent border border-accent/30'
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-700
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-400">
              NomadTracker
            </h1>
            <button className="md:hidden text-gray-400" onClick={() => setIsMobileOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          {/* USER BADGE */}
          <div className="flex items-center space-x-3 p-3 bg-dark-900/50 rounded-xl border border-dark-700">
            <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
               <Crown size={16} className={plan !== 'FREE' ? 'text-primary' : 'text-gray-500'} />
            </div>
            <div>
              <p className="text-sm font-medium text-white leading-tight">Il tuo account</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeColors[plan]}`}>
                {plan}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-dark-700 text-accent' : 'text-gray-400 hover:text-white hover:bg-dark-700/50'}`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          <button 
            onClick={handleReportClick} 
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-gray-400 hover:text-white hover:bg-dark-700/50"
          >
             <FileText size={20} />
             <span className="font-medium text-left flex-1">Report PDF</span>
             {plan !== 'BUSINESS' && <span className="text-[10px] uppercase font-bold bg-dark-700 text-white border border-dark-600 px-2 py-1 rounded-md">PRO</span>}
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-700 rounded-2xl p-5 text-center shadow-lg">
            <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Rocket className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-white mb-1">Passa a Pro</h3>
            <p className="text-xs text-gray-400 mb-4">Sblocca viaggi illimitati e funzionalità avanzate.</p>
            <Link 
              to="/pricing"
              onClick={() => setIsMobileOpen(false)}
              className="block w-full bg-primary hover:bg-primary-hover text-dark-900 font-bold py-2 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            >
              Scopri i Piani
            </Link>
          </div>
        </div>
      </aside>

      <SubscriptionModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        plan="BUSINESS" 
        customMessage={modalCustomMsg} 
      />
    </>
  );
}

export default function App() {
  const { trips, loading, addTrip, deleteTrip } = useTrips();
  const { plan, setPlan, loading: loadingPlan } = usePlan();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (loading || loadingPlan) return <div className="min-h-screen flex items-center justify-center bg-dark-900 text-white">Caricamento...</div>;

  if (trips.length === 0) {
    return <Landing onStart={() => addTrip({ iso_code: 'ES', entry_date: new Date().toISOString().split('T')[0], is_schengen: true })} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-900 flex">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} plan={plan} />
        
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-hidden">
          <header className="md:hidden bg-dark-800 border-b border-dark-700 p-4 flex items-center justify-between sticky top-0 z-30">
            <h1 className="text-lg font-bold text-white">NomadTracker</h1>
            <button onClick={() => setIsMobileOpen(true)} className="text-gray-400">
              <Menu size={24} />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard trips={trips} plan={plan} />} />
              <Route path="/history" element={<TripHistory trips={trips} addTrip={addTrip} deleteTrip={deleteTrip} plan={plan} />} />
              <Route path="/pricing" element={<Pricing currentPlan={plan} />} />
              <Route path="/settings" element={<Settings plan={plan} setPlan={setPlan} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
