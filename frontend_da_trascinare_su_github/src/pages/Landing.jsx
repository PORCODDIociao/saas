import { Globe2 } from 'lucide-react';

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      
      <div className="z-10 text-center max-w-2xl px-6">
        <div className="mb-8 flex justify-center">
          <div className="bg-dark-800 p-4 rounded-3xl shadow-xl shadow-black/50 border border-dark-700">
            <Globe2 size={48} className="text-accent" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Gestisci la tua <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">libertà digitale.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto">
          Tracciamo i tuoi giorni in ogni paese, calcoliamo le scadenze visti e ti avvisiamo prima che scatti l'obbligo fiscale.
        </p>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-dark-900 bg-accent rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_20px_rgba(102,252,241,0.3)] hover:shadow-[0_0_30px_rgba(102,252,241,0.5)]"
        >
          <span className="relative z-10 text-lg">Inizia Ora (Gratis)</span>
        </button>
        
        <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex flex-col items-center">
            <span className="font-bold text-white mb-1">100%</span>
            <span>Cloud Sync</span>
          </div>
          <div className="w-px h-8 bg-dark-700" />
          <div className="flex flex-col items-center">
            <span className="font-bold text-white mb-1">Zero</span>
            <span>Sorprese Fiscali</span>
          </div>
        </div>
      </div>
    </div>
  );
}
