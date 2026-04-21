import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulazione controllo utente loggato dal LocalStorage
    const storedUser = localStorage.getItem('nomad_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email) => {
    // Checkbox ricordami mock: lo salviamo sempre per ora
    const newUser = { email, id: 'user_' + Date.now() };
    setUser(newUser);
    localStorage.setItem('nomad_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nomad_user');
  };

  return { user, login, logout, loading };
}
