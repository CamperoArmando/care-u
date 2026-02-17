import { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken } from '../api/http';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {

  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem('careu_auth');
    return raw ? JSON.parse(raw) : { user: null, token: null };
  });

  // cargar sesión guardada correctamente
  useEffect(() => {
    if (auth?.token) setAuthToken(auth.token);
  }, [auth.token]);

  const login = (user, token = 'firebase') => {

    // 👇 IMPORTANTE: ahora SIEMPRE habrá token
    const session = { user, token };

    localStorage.setItem('careu_auth', JSON.stringify(session));
    setAuth(session);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('careu_auth');
    setAuth({ user: null, token: null });
    setAuthToken(null);
  };

  return (
    <AuthCtx.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
