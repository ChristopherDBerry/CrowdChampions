import React, { createContext, useContext, useState, useEffect } from 'react';

const ApiAuthContext = createContext();

export function ApiAuthProvider({ children }) {
  const [apiAuth, setApiAuth] = useState({username: '', token: ''});

  return (
    <ApiAuthContext.Provider value={{ apiAuth, setApiAuth }}>
      {children}
    </ApiAuthContext.Provider>
  );
}

export const useApiAuthContext = () => useContext(ApiAuthContext);
