import React, { createContext } from 'react';
const WalletConnectorContext = createContext({});
export const WalletConnectorProvider = ({ children }) => {
    return (React.createElement(WalletConnectorContext.Provider, { value: {} }, children));
};
