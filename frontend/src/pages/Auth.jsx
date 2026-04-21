import { useState } from 'react';
import { Globe, ArrowRight } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email.includes('@')) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-800 border border-dark-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Graphic */}
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Globe size={180} />
        </div>

        <div className="mb-10 text-center relative z-10">
          <div className="inline-flex bg-primary/20 p-4 rounded-3xl text-primary mx-auto mb-4">
            <Globe size={40} />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-400">
            Nomad Empire
          </h2>
          <p className="text-gray-400 mt-2">La tua base sicura per viaggiare, vivere e prosperare fiscalmente nel mondo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Accesso sicuro</label>
            <input 
              type="email" 
              required
              placeholder="Il tuo indirizzo email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <div className="flex items-center">
            <input id="remember-me" type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary focus:ring-primary bg-dark-900 border-dark-700 accent-primary" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
              Ricordami su questo dispositivo
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-dark-900 font-bold py-3 px-4 rounded-xl transition-all"
          >
            <span>Accedi o Registrati</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6 relative z-10">
          Inseriremo presto i Magic Link passwordless di Supabase.
        </p>
      </div>
    </div>
  );
}
