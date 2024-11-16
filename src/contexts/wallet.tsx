import React, { createContext, useContext } from 'react';

const WalletConnectorContext = createContext({});
export const WalletConnectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WalletConnectorContext.Provider value={{}}>
      {children}
    </WalletConnectorContext.Provider>
  );
}; 