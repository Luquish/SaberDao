import React, { lazy, Suspense } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import { GMProvider } from "@/contexts/tribeca/gauges";

// Lazy loading con mejor manejo de errores
const LazyComponent = (importPromise: Promise<any>) => {
    const Component = lazy(() => importPromise);
    return (props: any) => (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    );
};

// Lazy imports basados en TribecaDao
const GovernanceListView = LazyComponent(import("./GovernanceListView"));
const IndexView = LazyComponent(import("./landing"));
const DAOConfigView = LazyComponent(import("./onboarding/dao/DAOConfigView"));
const DAOCustomView = LazyComponent(import("./onboarding/dao/DAOCustomView"));
const DAOStep1IntroView = LazyComponent(import("./onboarding/dao/DAOStep1IntroView"));
const DAOStep2ExecutiveView = LazyComponent(import("./onboarding/dao/DAOStep2ExecutiveView"));
const DAOStep3EmergencyView = LazyComponent(import("./onboarding/dao/DAOStep3EmergencyView"));
const DAOStep4LockerView = LazyComponent(import("./onboarding/dao/DAOStep4LockerView"));
const WalletCreateView = LazyComponent(import("./onboarding/WalletCreateAdvancedView"));
const WalletCreateSimpleView = LazyComponent(import("./onboarding/WalletCreateSimpleView"));
const UserView = LazyComponent(import("./wallet/user"));
const WalletView = LazyComponent(import("./wallet/WalletView"));
const GovernanceView = LazyComponent(import("./GovernanceView"));

const AppRoutes = (
    <Router>
        {/* Rutas principales basadas en TribecaDao */}
        <IndexView path="/tribeca" />
        <GovernanceListView path="/tribeca/gov" />
        <GovernanceView path="/tribeca/gov/:governor/*" />
        
        {/* Rutas de wallet */}
        <WalletView path="/tribeca/wallets/:walletKey/*" />
        
        {/* Rutas de onboarding */}
        <DAOConfigView path="/tribeca/onboarding/dao/config" />
        <DAOCustomView path="/tribeca/onboarding/dao/custom" />
        <DAOStep2ExecutiveView path="/tribeca/onboarding/dao/create-executive" />
        <DAOStep3EmergencyView path="/tribeca/onboarding/dao/create-emergency" />
        <DAOStep4LockerView path="/tribeca/onboarding/dao/create-dao" />
        <DAOStep1IntroView path="/tribeca/onboarding/dao" />
        <WalletCreateSimpleView path="/tribeca/onboarding/new" />
        <WalletCreateView path="/tribeca/onboarding/advanced" />
        <UserView path="/tribeca/user" />
    </Router>
);

export default AppRoutes;
