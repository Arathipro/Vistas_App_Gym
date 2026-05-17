import React, { createContext, useContext, useMemo, useState } from 'react';

const AppSessionContext = createContext(null);

export function AppSessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);

  function clearSession() {
    setUser(null);
    setPerfil(null);
  }

  const value = useMemo(() => ({
    user,
    setUser,
    perfil,
    setPerfil,
    clearSession,
  }), [user, perfil]);

  return (
    <AppSessionContext.Provider value={value}>
      {children}
    </AppSessionContext.Provider>
  );
}

export function useAppSession() {
  const ctx = useContext(AppSessionContext);
  if (!ctx) throw new Error('useAppSession debe usarse dentro de <AppSessionProvider>');
  return ctx;
}
