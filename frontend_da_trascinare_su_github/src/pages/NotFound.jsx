import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-dark-800 border border-dark-700 p-8 rounded-3xl max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-blue-500" />
        
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark-900 border border-dark-700 mb-6 relative">
          <Compass size={40} className="text-gray-500" />
          <div className="absolute -bottom-2 -right-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded-md">
            404
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Fuori dalla mappa!</h2>
        <p className="text-gray-400 mb-8">
          La destinazione che stai cercando non esiste o è stata spostata. Torna alla base prima che scada il visto.
        </p>
        
        <Link 
          to="/"
          className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-200 text-dark-900 font-bold py-3 px-6 rounded-xl transition-colors w-full"
        >
          <Home size={18} />
          <span>Torna alla Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
