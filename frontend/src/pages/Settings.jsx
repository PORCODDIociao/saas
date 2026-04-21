import { useState } from 'react';
import { Globe2, Code, PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import { EU_COUNTRIES } from '../logic/calculators';

const ALL_PASSPORTS = [
  { code: 'IT', label: 'Italia 🇮🇹', tier: 'free' },
  { code: 'ES', label: 'Spagna 🇪🇸', tier: 'free' },
  { code: 'US', label: 'Stati Uniti 🇺🇸', tier: 'free' },
  { code: 'UK', label: 'Regno Unito 🇬🇧', tier: 'free' },
  { code: 'CA', label: 'Canada 🇨🇦', tier: 'free' },
  { code: 'AU', label: 'Australia 🇦🇺', tier: 'free' },
  { code: 'FR', label: 'Francia 🇫🇷', tier: 'nomad' },
  { code: 'DE', label: 'Germania 🇩🇪', tier: 'nomad' },
  { code: 'PT', label: 'Portogallo 🇵🇹', tier: 'nomad' },
  { code: 'AE', label: 'Emirati Arabi (Dubai) 🇦🇪', tier: 'business' },
  { code: 'CY', label: 'Cipro 🇨🇾', tier: 'business' },
  { code: 'MT', label: 'Malta 🇲🇹', tier: 'business' },
  { code: 'PA', label: 'Panama 🇵🇦', tier: 'business' },
  { code: 'TH', label: 'Thailandia 🇹🇭', tier: 'business' },
  { code: 'BR', label: 'Brasile 🇧🇷', tier: 'business' },
  { code: 'MX', label: 'Messico 🇲🇽', tier: 'business' },
];

export default function Settings({ plan, setPlan }) {
  const [nationality, setNationality] = useState('IT');
  const [secondPassports, setSecondPassports] = useState([]);
  const [saved, setSaved] = useState(false);

  const tierAllows = (tier) => {
    if (tier === 'free') return true;
    if (tier === 'nomad') return plan === 'NOMAD' || plan === 'BUSINESS';
    if (tier === 'business') return plan === 'BUSINESS';
    return false;
  };

  const availablePassports = ALL_PASSPORTS.filter(p => tierAllows(p.tier));
  
  const addSecondPassport = (code) => {
    if (!secondPassports.includes(code) && code !== nationality) {
      setSecondPassports([...secondPassports, code]);
    }
  };

  const removeSecondPassport = (code) => {
    setSecondPassports(secondPassports.filter(p => p !== code));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('nomad_settings', JSON.stringify({ nationality, secondPassports }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Impostazioni</h2>
        <p className="text-gray-400 text-sm">Configura il tuo profilo internazionale.</p>
      </div>

      {/* PASSAPORTO PRINCIPALE */}
      <div className="bg-dark-800 border border-dark-700 p-6 sm:p-8 rounded-3xl">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-dark-700/50">
          <div className="p-3 bg-dark-700 rounded-2xl text-accent"><Globe2 size={24} /></div>
          <div>
            <h3 className="text-lg font-bold text-white">Passaporto Principale</h3>
            <p className="text-sm text-gray-400">Influenza il calcolo della regola 90/180 Schengen.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nazionalità Primaria</label>
            <select
              value={nationality}
              onChange={e => setNationality(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-accent outline-none"
            >
              {ALL_PASSPORTS.filter(p => tierAllows(p.tier)).map(p => (
                <option key={p.code} value={p.code}>{p.label}</option>
              ))}
            </select>
            {EU_COUNTRIES.includes(nationality) && (
              <p className="text-xs text-accent mt-2 flex items-center space-x-1">
                <CheckCircle size={12} />
                <span>Passaporto EU — sei esente dalla regola Schengen 90/180 come cittadino europeo.</span>
              </p>
            )}
          </div>

          {/* SECONDO PASSAPORTO (BUSINESS) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-gray-400">Passaporti Aggiuntivi</label>
              {plan !== 'BUSINESS' && (
                <span className="text-[10px] uppercase font-bold bg-dark-700 text-gray-400 border border-dark-600 px-2 py-0.5 rounded">BUSINESS</span>
              )}
            </div>
            
            {plan === 'BUSINESS' ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {availablePassports.filter(p => p.code !== nationality).map(p => {
                    const isSelected = secondPassports.includes(p.code);
                    return (
                      <button
                        key={p.code}
                        type="button"
                        onClick={() => isSelected ? removeSecondPassport(p.code) : addSecondPassport(p.code)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                          isSelected
                            ? 'bg-accent/10 border-accent/50 text-accent'
                            : 'bg-dark-900 border-dark-700 text-gray-400 hover:border-dark-500'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
                {secondPassports.length > 0 && (
                  <p className="text-xs text-gray-500">
                    I tuoi passaporti aggiuntivi vengono usati per ottimizzare automaticamente la strategia di ingresso nei paesi.
                  </p>
                )}
              </>
            ) : (
              <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Disponibile per gli utenti Business — sblocca residenze fiscali in Dubai, Cipro, Malta e altro.</p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className={`flex items-center space-x-2 font-medium px-6 py-3 rounded-xl transition-colors ${
                saved ? 'bg-green-600/20 border border-green-600/50 text-green-400' : 'bg-dark-700 hover:bg-dark-600 text-white'
              }`}
            >
              {saved && <CheckCircle size={18} />}
              <span>{saved ? 'Salvato!' : 'Salva Preferenze'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* DEV TOOLS */}
      <div className="bg-dark-900 border border-danger/30 p-6 rounded-3xl">
        <div className="flex items-center space-x-3 mb-4 text-danger">
          <Code size={20} />
          <h3 className="font-bold">Developer Tools</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">Simula i piani per testare i limiti dell'interfaccia.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setPlan('FREE')} className={`px-4 py-2 rounded-lg font-bold text-sm border ${plan === 'FREE' ? 'bg-gray-700 text-white border-gray-600' : 'border-dark-700 text-gray-500 hover:bg-dark-800'}`}>FREE</button>
          <button onClick={() => setPlan('NOMAD')} className={`px-4 py-2 rounded-lg font-bold text-sm border ${plan === 'NOMAD' ? 'bg-primary/20 text-primary border-primary/50' : 'border-dark-700 text-gray-500 hover:bg-dark-800'}`}>NOMAD</button>
          <button onClick={() => setPlan('BUSINESS')} className={`px-4 py-2 rounded-lg font-bold text-sm border ${plan === 'BUSINESS' ? 'bg-accent/20 text-accent border-accent/50' : 'border-dark-700 text-gray-500 hover:bg-dark-800'}`}>BUSINESS</button>
        </div>
      </div>
    </div>
  );
}
