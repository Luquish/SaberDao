import { PageProps } from 'gatsby';
import React, { useEffect } from 'react';
import { Router } from '@reach/router';

import { SmartWalletProvider } from '@/hooks/tribeca/useSmartWallet';
import { WalletLayout } from '@/components/tribeca/layout/WalletLayout';
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
import { governanceRoutes } from './routes';

const GovernancePage: React.FC<PageProps> = () => {
    useEffect(() => {
        document.body.classList.add("dark");
        return () => {
            document.body.classList.remove("dark");
        };
    }, []);

    return (
        <div className="min-h-screen bg-warmGray-900">
            <SmartWalletProvider>
                <WalletLayout>
                    <Router basepath="/tribeca">
                        {/* Landing */}
                        <TribecaIndexView path="/" />
                        
                        {/* Wallet Routes */}
                        <WalletTreasurySendView path="/treasury/send" />
                        <WalletTreasuryDepositView path="/treasury/deposit" />
                        <ProgramUpgradeView path="/programs/:programID/upgrade" />
                        <ProgramImportView path="/programs/import" />
                        <WalletProgramsView path="/programs" />
                        <WalletTreasuryView path="/treasury" />
                        <WalletSettingsView path="/settings" />
                        <WalletInboxView path="/inbox" />
                        
                        {/* DAO Routes */}
                        <DAOStep1IntroView path="/onboarding/dao" />
                        
                        {/* Governance Routes */}
                        {governanceRoutes}
                        
                        {/* Default route */}
                        <TribecaIndexView default />
                    </Router>
                </WalletLayout>
            </SmartWalletProvider>
        </div>
    );
}

export default GovernancePage; 