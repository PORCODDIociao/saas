import { Check } from 'lucide-react';
import { useState } from 'react';
import SubscriptionModal from '../components/SubscriptionModal';

export default function Pricing({ currentPlan }) {
  const [modalState, setModalState] = useState({ isOpen: false, plan: '' });

  const handleSubscription = (planName) => {
    // Apriamo il modale placeholder per il checkout
    setModalState({ isOpen: true, plan: planName });
  };

  const isCurrent = (planCode) => currentPlan === planCode;

  return (
    <div className="max-w-6xl mx-auto pb-16">
      
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Piani pensati per la tua <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Libertà</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Scegli il piano adatto al tuo ritmo di viaggio. Evita multe, divieti d'ingresso e problemi fiscali.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CARD 1: FREE */}
        <div className="bg-dark-800 border border-dark-700 p-8 rounded-3xl flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Backpacker</h3>
            <p className="text-sm text-gray-400 mt-1">Inizia a viaggiare</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">0€</span>
            <span className="text-gray-500"> / mese</span>
          </div>
          <div className="flex-1">
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center"><Check className="text-accent mr-3" size={16} /> Limite 3 viaggi attivi</li>
              <li className="flex items-center"><Check className="text-accent mr-3" size={16} /> Regola Schengen (Base)</li>
              <li className="flex items-center"><Check className="text-accent mr-3" size={16} /> Contatore Fiscale singolo</li>
            </ul>
          </div>
          <button 
            disabled={isCurrent('FREE')}
            className={`mt-8 w-full py-3 rounded-xl font-bold transition-all ${isCurrent('FREE') ? 'bg-dark-700 text-gray-500' : 'bg-dark-700 hover:bg-dark-600 text-white border border-dark-600'}`}
          >
            {isCurrent('FREE') ? 'Piano Attuale' : 'Scegli Backpacker'}
          </button>
        </div>

        {/* CARD 2: PRO / NOMAD (Evidenziata) */}
        <div className="bg-dark-800 border-2 border-primary p-8 rounded-3xl flex flex-col relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-dark-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Più Popolare
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Digital Nomad</h3>
            <p className="text-sm text-primary mt-1">Automazione e Sicurezza</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">9.99€</span>
            <span className="text-gray-500"> / mese</span>
          </div>
          <div className="flex-1">
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center"><Check className="text-primary mr-3" size={16} /> Viaggi illimitati</li>
              <li className="flex items-center"><Check className="text-primary mr-3" size={16} /> Multi-Passaporto</li>
              <li className="flex items-center"><Check className="text-primary mr-3" size={16} /> Allerte per e-mail</li>
              <li className="flex items-center"><Check className="text-primary mr-3" size={16} /> Dashboard Avanzata</li>
            </ul>
          </div>
          <button 
            onClick={() => handleSubscription('Digital Nomad')}
            disabled={isCurrent('NOMAD')}
            className={`mt-8 w-full py-3 rounded-xl font-bold transition-all ${isCurrent('NOMAD') ? 'bg-primary/50 text-dark-900 border border-primary/20' : 'bg-primary hover:bg-primary-hover text-dark-900 shadow-[0_0_15px_rgba(212,175,55,0.3)]'}`}
          >
            {isCurrent('NOMAD') ? 'Piano Attuale' : 'Scegli Nomad'}
          </button>
        </div>

        {/* CARD 3: BUSINESS */}
        <div className="bg-dark-800 border border-dark-700 p-8 rounded-3xl flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Legal Shield</h3>
            <p className="text-sm text-gray-400 mt-1">Conformità Fiscale Totale</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">24.99€</span>
            <span className="text-gray-500"> / mese</span>
          </div>
          <div className="flex-1">
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center"><Check className="text-accent mr-3" size={16} /> Tutto il piano Nomad</li>
              <li className="flex items-center text-white"><Check className="text-accent mr-3" size={16} /> Report PDF per Commercialista</li>
              <li className="flex items-center"><Check className="text-accent mr-3" size={16} /> Residenze fiscali non dom (Dubai, Cipro...)</li>
              <li className="flex items-center"><Check className="text-accent mr-3" size={16} /> Consulenza prioritaria</li>
            </ul>
          </div>
          <button 
            onClick={() => handleSubscription('Legal Shield')}
            disabled={isCurrent('BUSINESS')}
            className={`mt-8 w-full py-3 rounded-xl font-bold transition-all ${isCurrent('BUSINESS') ? 'bg-dark-700 text-gray-500' : 'bg-dark-700 hover:bg-dark-600 text-white border border-dark-600'}`}
          >
            {isCurrent('BUSINESS') ? 'Piano Attuale' : 'Scegli Business'}
          </button>
        </div>

      </div>

      <SubscriptionModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        plan={modalState.plan}
      />

    </div>
  );
}
