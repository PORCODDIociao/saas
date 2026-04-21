import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, History, FileText, Settings as SettingsIcon, Menu, X, Rocket, Crown, BarChart2, Folder, LogOut } from 'lucide-react';
import { useState } from 'react';

import Dashboard from './pages/Dashboard';
import TripHistory from './pages/History';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import Pricing from './pages/Pricing';
import Finance from './pages/Finance';
import Documents from './pages/Documents';
import SubscriptionModal from './components/SubscriptionModal';
import { ReportModal } from './components/ReportModal';
import { useTrips } from './hooks/useTrips';
import { usePlan } from './hooks/usePlan';
import { useAuth } from './hooks/useAuth';

function Sidebar({ isMobileOpen, setIsMobileOpen, plan, user, logout, trips }) {
  const [reportOpen, setReportOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/history', label: 'Cronologia Viaggi', icon: History },
    { path: '/finance', label: 'Finance Hub', icon: BarChart2, locked: plan === 'FREE' },
    { path: '/documents', label: 'Tax Proof Folder', icon: Folder, locked: plan !== 'BUSINESS' },
    { path: '/settings', label: 'Impostazioni', icon: SettingsIcon },
  ];

  const handleReportClick = () => {
    setIsMobileOpen(false);
    if (plan !== 'BUSINESS') {
      setModalMsg("Questa funzione richiede il piano Business. Fai l'upgrade per generare report PDF professionali per il tuo commercialista.");
      setModalOpen(true);
    } else {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setReportOpen(true);
      }, 1500);
    }
  };

  const badgeColors = {
    'FREE': 'bg-gray-700 text-gray-300',
    'NOMAD': 'bg-primary/20 text-primary border border-primary/30',
    'BUSINESS': 'bg-accent/20 text-accent border border-accent/30',
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-700
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* HEADER */}
        <div className="p-5 border-b border-dark-700/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-400">
              Nomad Empire
            </h1>
            <button className="md:hidden text-gray-400" onClick={() => setIsMobileOpen(false)}>
              <X size={22} />
            </button>
          </div>
          {/* USER BADGE */}
          <div className="flex items-center space-x-3 p-3 bg-dark-900/60 rounded-xl border border-dark-700">
            <div className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center flex-shrink-0">
              <Crown size={16} className={plan !== 'FREE' ? 'text-primary' : 'text-gray-500'} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mt-0.5 ${badgeColors[plan]}`}>
                {plan}
              </span>
            </div>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors group ${
                  isActive ? 'bg-dark-700 text-accent' : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={19} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.locked && (
                  <span className="text-[10px] uppercase font-bold bg-dark-700 text-gray-400 border border-dark-600 px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                )}
              </Link>
            );
          })}

          {/* REPORT PDF BUTTON */}
          <button
            onClick={handleReportClick}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-gray-400 hover:text-white hover:bg-dark-700/50"
          >
            <div className="flex items-center space-x-3">
              <FileText size={19} />
              <span className="font-medium text-sm">Report PDF</span>
            </div>
            {plan !== 'BUSINESS' && (
              <span className="text-[10px] uppercase font-bold bg-dark-700 text-gray-400 border border-dark-600 px-1.5 py-0.5 rounded">
                PRO
              </span>
            )}
          </button>

          {/* PRICING */}
          <Link
            to="/pricing"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              location.pathname === '/pricing' ? 'bg-dark-700 text-accent' : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
            }`}
          >
            <Rocket size={19} />
            <span className="font-medium text-sm">Piani e Prezzi</span>
          </Link>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-dark-700/50 mt-auto space-y-3">
          {plan === 'FREE' && (
            <Link
              to="/pricing"
              onClick={() => setIsMobileOpen(false)}
              className="block w-full bg-primary hover:bg-primary-hover text-dark-900 font-bold py-2.5 px-4 rounded-xl text-center text-sm transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              ↑ Upgrade a Pro
            </Link>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 text-gray-500 hover:text-gray-300 py-2 text-sm transition-colors"
          >
            <LogOut size={16} />
            <span>Esci</span>
          </button>
        </div>
      </aside>

      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        plan="BUSINESS"
        customMessage={modalMsg}
      />

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        trips={trips}
        user={user}
      />

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[90] bg-dark-800 border border-accent/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <span className="font-medium text-sm">Generazione report professionale in corso...</span>
        </div>
      )}
    </>
  );
}

export default function App() {
  const { trips, loading: tripsLoading, addTrip, deleteTrip } = useTrips();
  const { plan, setPlan, loading: planLoading } = usePlan();
  const { user, login, logout, loading: authLoading } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (authLoading || tripsLoading || planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Se non loggato, mostra Auth
  if (!user) {
    return <Auth onLogin={login} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-900 flex">
        <Sidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          plan={plan}
          user={user}
          logout={logout}
          trips={trips}
        />

        <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-hidden">
          {/* MOBILE TOPBAR */}
          <header className="md:hidden bg-dark-800 border-b border-dark-700 p-4 flex items-center justify-between sticky top-0 z-30">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-400">
              Nomad Empire
            </h1>
            <button onClick={() => setIsMobileOpen(true)} className="text-gray-400 p-1">
              <Menu size={24} />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard trips={trips} plan={plan} />} />
              <Route path="/history" element={<TripHistory trips={trips} addTrip={addTrip} deleteTrip={deleteTrip} plan={plan} />} />
              <Route path="/finance" element={<Finance plan={plan} trips={trips} />} />
              <Route path="/documents" element={<Documents plan={plan} />} />
              <Route path="/pricing" element={<Pricing currentPlan={plan} />} />
              <Route path="/settings" element={<Settings plan={plan} setPlan={setPlan} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
