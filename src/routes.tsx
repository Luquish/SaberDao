import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Temp } from "./components/common/Temp";

import { TransactionBuilder } from "./components/common/TransactionBuilder";
import { MainLayout } from "./components/layout/MainLayout";
import { ANCHOR_ROUTES } from "./components/pages/anchor/AnchorRoutes";
import { governanceRoutes } from "./components/pages/governance/routes";
import { useConditionalDarkMode } from "./hooks/useConditionalDarkMode";
import { useHashRouterCompat } from "./hooks/useHashRouterCompat";
import { useAnalytics } from "./utils/useAnalytics";

const GovernanceListView = React.lazy(
  () => import("./components/pages/governance/GovernanceListView")
);
const IndexView = React.lazy(() => import("./components/pages/landing"));
const DAOConfigView = React.lazy(
  () => import("./components/pages/onboarding/dao/DAOConfigView")
);
const DAOCustomView = React.lazy(
  () => import("./components/pages/onboarding/dao/DAOCustomView")
);
const DAOStep1IntroView = React.lazy(
  () => import("./components/pages/onboarding/dao/DAOStep1IntroView")
);
const DAOStep2ExecutiveView = React.lazy(
  () => import("./components/pages/onboarding/dao/DAOStep2ExecutiveView")
);
const DAOStep3EmergencyView = React.lazy(
  () => import("./components/pages/onboarding/dao/DAOStep3EmergencyView")
);
const DAOStep4LockerView = React.lazy(
  () => import("./components/pages/onboarding/dao/DAOStep4LockerView")
);
const WalletCreateView = React.lazy(
  () => import("./components/pages/onboarding/WalletCreateAdvancedView")
);
const WalletCreateSimpleView = React.lazy(
  () => import("./components/pages/onboarding/WalletCreateSimpleView")
);
const UserView = React.lazy(() => import("./components/pages/UserView"));

const WalletView = React.lazy(
  () => import("./components/pages/wallet/WalletView")
);

const GovernanceView = React.lazy(
  () => import("./components/pages/governance/GovernanceView")
);

export const AppRoutes: React.FC = () => {
  const { pathname } = useLocation();
  useConditionalDarkMode(
    pathname.startsWith("/gov") || pathname.startsWith("/onboarding/dao")
  );
  useHashRouterCompat();

  useAnalytics();
  return (
    <Routes>
      {ANCHOR_ROUTES}
      <Route path="/tools/tx-builder" element={<TransactionBuilder />} />
      <Route path="/wallets/:walletKey/*" element={<WalletView />} />
      <Route path="/gov/:governor/*" element={<GovernanceView />}>
        {governanceRoutes}
      </Route>
      <Route path="/" element={<IndexView />} />
      <Route path="" element={<MainLayout />}>
        <Route path="/gov" element={<GovernanceListView />} />
        <Route path="/onboarding/dao/config" element={<DAOConfigView />} />
        <Route path="/onboarding/dao/custom" element={<DAOCustomView />} />
        <Route
          path="/onboarding/dao/create-executive"
          element={<DAOStep2ExecutiveView />}
        />
        <Route
          path="/onboarding/dao/create-emergency"
          element={<DAOStep3EmergencyView />}
        />
        <Route
          path="/onboarding/dao/create-dao"
          element={<DAOStep4LockerView />}
        />
        <Route path="/onboarding/dao" element={<DAOStep1IntroView />} />
        <Route path="/onboarding/new" element={<WalletCreateSimpleView />} />
        <Route path="/onboarding/advanced" element={<WalletCreateView />} />
        <Route path="/user" element={<UserView />} />
      </Route>
    </Routes>
  );
};
