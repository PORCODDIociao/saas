import { useState } from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
        setErrorMsg('Controlla la tua email per confermare la registrazione!');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Si è verificato un errore');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-800 border border-dark-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Graphic */}
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Globe size={180} />
        </div>

        <div className="mb-8 text-center relative z-10">
          <div className="inline-flex bg-primary/20 p-4 rounded-3xl text-primary mx-auto mb-4">
            <Globe size={40} />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-400">
            Nomad Empire
          </h2>
          <p className="text-gray-400 mt-2">La tua base sicura per viaggiare, vivere e prosperare fiscalmente nel mondo.</p>
        </div>

        {errorMsg && (
          <div className={`mb-6 p-3 rounded-xl text-center text-sm font-medium ${errorMsg.includes('confermare') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              placeholder="Il tuo indirizzo email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="La tua password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-dark-900 font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Attendi...' : isLogin ? 'Accedi' : 'Registrati'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="relative z-10 mt-6">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-dark-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">oppure</span>
            <div className="flex-grow border-t border-dark-700"></div>
          </div>
          
          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full mt-4 flex items-center justify-center space-x-2 bg-dark-900 hover:bg-dark-700 text-white font-bold py-3 px-4 rounded-xl transition-all border border-dark-600"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            <span>Continua con Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6 relative z-10">
          {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-primary hover:underline font-medium">
            {isLogin ? 'Registrati ora' : 'Accedi'}
          </button>
        </p>
      </div>
    </div>
  );
}
