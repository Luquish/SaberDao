import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { SmartWalletProvider } from '../../hooks/tribeca/useSmartWallet';
import { WalletLayout } from '../../components/tribeca/layout/WalletLayout';
import { TribecaIndexView } from './landing/TribecaIndexView';
import { WalletTreasurySendView } from './wallet/treasury/WalletTreasurySendView';
import { WalletTreasuryDepositView } from './wallet/treasury/WalletTreasuryDepositView';
import { ProgramUpgradeView } from './wallet/programs/ProgramUpgradeView';
import { ProgramImportView } from './wallet/programs/ProgramImportView';
import { WalletProgramsView } from './wallet/programs/WalletProgramsView';
import { WalletTreasuryView } from './wallet/treasury/WalletTreasuryView';
import { WalletSettingsView } from './wallet/WalletSettingsView';
import { WalletInboxView } from './wallet/WalletInboxView';
import { DAOStep1IntroView } from './onboarding/dao/DAOStep1IntroView';
import { governanceRoutes } from './governance/routes';
const TribecaDaoPage = () => {
    useEffect(() => {
        // Asegurarse de que el modo oscuro esté activado para Tribeca
        document.body.classList.add("dark");
        return () => {
            document.body.classList.remove("dark");
        };
    }, []);
    return (React.createElement("div", { className: "min-h-screen bg-warmGray-900" },
        React.createElement(SmartWalletProvider, null,
            React.createElement(WalletLayout, null,
                React.createElement(Router, { basepath: "/tribeca" },
                    React.createElement(TribecaIndexView, { path: "/" }),
                    React.createElement(WalletTreasurySendView, { path: "/treasury/send" }),
                    React.createElement(WalletTreasuryDepositView, { path: "/treasury/deposit" }),
                    React.createElement(ProgramUpgradeView, { path: "/programs/:programID/upgrade" }),
                    React.createElement(ProgramImportView, { path: "/programs/import" }),
                    React.createElement(WalletProgramsView, { path: "/programs" }),
                    React.createElement(WalletTreasuryView, { path: "/treasury" }),
                    React.createElement(WalletSettingsView, { path: "/settings" }),
                    React.createElement(WalletInboxView, { path: "/inbox" }),
                    React.createElement(DAOStep1IntroView, { path: "/onboarding/dao" }),
                    governanceRoutes,
                    React.createElement(TribecaIndexView, { default: true }))))));
};
export default TribecaDaoPage;
