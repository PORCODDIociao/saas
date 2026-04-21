import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, History, FileText, Settings as SettingsIcon, Menu, X, Rocket } from 'lucide-react';
import { useState } from 'react';

import Dashboard from './pages/Dashboard';
import TripHistory from './pages/History';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import { useTrips } from './hooks/useTrips';

function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/history', label: 'Cronologia Viaggi', icon: History },
    { path: '/settings', label: 'Impostazioni', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-700
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-400">
            NomadTracker
          </h1>
          <button className="md:hidden text-gray-400" onClick={() => setIsMobileOpen(false)}>
            <X size={24} />
          </button>
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
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                  ${isActive ? 'bg-dark-700 text-accent' : 'text-gray-400 hover:text-white hover:bg-dark-700/50'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Trigger Tasto Pro */}
          <button onClick={() => alert('Popup Pro in arrivo!')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-gray-400 hover:text-white hover:bg-dark-700/50">
             <FileText size={20} />
             <span className="font-medium">Report Fiscale</span>
             <span className="ml-auto text-[10px] uppercase font-bold bg-primary/20 text-primary px-2 py-1 rounded-md">Pro</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-700 rounded-2xl p-5 text-center shadow-lg">
            <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Rocket className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-white mb-1">Upgrade a Pro</h3>
            <p className="text-xs text-gray-400 mb-4">Sblocca report completi e allerte per il commercialista.</p>
            <button onClick={() => alert('Funzione bloccata in attesa di backend/pagamento')} className="w-full bg-primary hover:bg-primary-hover text-dark-900 font-bold py-2 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              Ottieni Pro
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function App() {
  const { trips, loading, addTrip, deleteTrip } = useTrips();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-900 text-white">Caricamento...</div>;

  // Se l'utente non ha alcun viaggio registrato, gli mostriamo la Landing Page attrattiva
  if (trips.length === 0) {
    return <Landing onStart={() => addTrip({ iso_code: 'ES', entry_date: new Date().toISOString().split('T')[0], is_schengen: true })} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-900 flex">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden bg-dark-800 border-b border-dark-700 p-4 flex items-center justify-between sticky top-0 z-30">
            <h1 className="text-lg font-bold text-white">NomadTracker</h1>
            <button onClick={() => setIsMobileOpen(true)} className="text-gray-400">
              <Menu size={24} />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard trips={trips} />} />
              <Route path="/history" element={<TripHistory trips={trips} addTrip={addTrip} deleteTrip={deleteTrip} />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
