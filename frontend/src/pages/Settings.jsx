import { Globe2, Code } from 'lucide-react';

export default function Settings({ plan, setPlan }) {
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Impostazioni</h2>
        <p className="text-gray-400 text-sm">Configura il tuo passaporto base e le preferenze.</p>
      </div>

      <div className="bg-dark-800 border border-dark-700 p-6 sm:p-8 rounded-3xl mb-8">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-dark-700/50">
          <div className="p-3 bg-dark-700 rounded-2xl text-accent">
            <Globe2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Nazionalità Principale</h3>
            <p className="text-sm text-gray-400">Fondamentale per il calcolo esatto delle esenzioni visti.</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={e => { e.preventDefault(); alert('Impostazioni salvate!'); }}>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Passaporto / Cittadinanza</label>
            <select 
              className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors appearance-none"
              defaultValue="IT"
            >
              <option value="IT">Italia (Passaporto Europeo)</option>
              <option value="US">Stati Uniti</option>
              <option value="UK">Regno Unito</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <h4 className="text-primary font-bold mb-1">Membro Pro Richiesto</h4>
            <p className="text-sm text-primary/80">
              L'aggiunta di passaporti multipli o residenze fiscali speciali (es. Dubai, Cipro) è disponibile solo per gli utenti Pro.
            </p>
          </div>

          <div className="pt-4">
            <button type="submit" className="bg-dark-700 hover:bg-dark-600 text-white font-medium px-6 py-3 rounded-xl transition-colors">
              Salva Preferenze
            </button>
          </div>
        </form>
      </div>

      {/* DEV TOOLS per simulare i Piani */}
      <div className="bg-dark-900 border border-danger/30 p-6 rounded-3xl relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-4 text-danger">
          <Code size={20} />
          <h3 className="font-bold">Developer Tools</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">Usa questo controller per simulare il passaggio di piano e testare i blocchi dell'interfaccia senza toccare il database.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setPlan('FREE')} className={`px-4 py-2 rounded-lg font-bold text-sm border ${plan === 'FREE' ? 'bg-gray-700 text-white border-gray-600' : 'border-dark-700 text-gray-500 hover:bg-dark-800'}`}>FREE</button>
          <button onClick={() => setPlan('NOMAD')} className={`px-4 py-2 rounded-lg font-bold text-sm border ${plan === 'NOMAD' ? 'bg-primary/20 text-primary border-primary/50' : 'border-dark-700 text-gray-500 hover:bg-dark-800'}`}>NOMAD</button>
          <button onClick={() => setPlan('BUSINESS')} className={`px-4 py-2 rounded-lg font-bold text-sm border ${plan === 'BUSINESS' ? 'bg-accent/20 text-accent border-accent/50' : 'border-dark-700 text-gray-500 hover:bg-dark-800'}`}>BUSINESS</button>
        </div>
      </div>
    </div>
  );
}
