import { X } from 'lucide-react';
import { useState } from 'react';

export default function SubscriptionModal({ isOpen, onClose, plan, customMessage }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email) {
      setSubmitted(true);
      // Qui in futuro si fa la chiamata API al backend per salvare la mail
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-dark-800 border border-dark-700 w-full max-w-md p-6 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-dark-900 border border-dark-700 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-2xl font-bold text-white mb-2">
          {customMessage ? "Passa a PRO" : `Sblocca il piano ${plan}`}
        </h3>
        
        {!submitted ? (
          <>
            <p className="text-gray-400 mb-6">
              {customMessage || `Stiamo attivando i pagamenti sicuri tramite Stripe. Vuoi essere avvisato quando il piano ${plan} sarà disponibile ed assicurarti uno sconto esclusivo del 20% a vita?`}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  required
                  placeholder="La tua email migliore..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-dark-900 font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Voglio lo sconto del 20%
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Sei in lista!</h4>
            <p className="text-gray-400">Ti abbiamo riservato lo sconto. Riceverai un'email non appena i pagamenti saranno attivi.</p>
            <button onClick={onClose} className="mt-6 text-primary hover:text-primary-hover font-medium underline">
              Torna al pannello
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
