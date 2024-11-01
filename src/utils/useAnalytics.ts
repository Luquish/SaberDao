import { ExtraErrorData as ExtraErrorDataIntegration } from "@sentry/integrations";
import * as Sentry from "@sentry/react";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useEnvironment } from "./useEnvironment";

/**
 * Sets up analytics. Only call this file ONCE.
 */
export const useAnalytics = (): void => {
  const { network } = useEnvironment();
  const wallet = useAnchorWallet();
  const walletProviderInfo = useWallet();
  const location = useLocation();

  // Google Analytics
  useEffect(() => {
    window.gtag?.("event", "page_view", {
      page_path: location.pathname + location.search,
      page_location: location.key ?? window.location.href,
      page_title: document.title,
    });
  }, [location.key, location.pathname, location.search]);

  const owner = wallet?.publicKey;
  useEffect(() => {
    if (owner) {
      Sentry.setUser({
        id: owner.toString(),
      });
    } else {
      Sentry.configureScope((scope) => scope.setUser(null));
    }
  }, [owner]);

  useEffect(() => {
    Sentry.setTag("network", network);
    Sentry.setTag("wallet.provider", walletProviderInfo.wallet?.adapter.name);
  }, [network, walletProviderInfo.wallet?.adapter.name]);

  useEffect(() => {
    if (process.env.REACT_APP_SENTRY_DSN) {
      const sentryCfg = {
        environment: process.env.REACT_APP_SENTRY_ENVIRONMENT ?? "unknown",
        release: process.env.REACT_APP_SENTRY_RELEASE ?? "unknown",
      };
      Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [
          new ExtraErrorDataIntegration({
            depth: 3,
          }),
        ],
        tracesSampleRate: 0.2,
        ...sentryCfg,
      });

      console.log(
        `Initializing Sentry environment at release ${sentryCfg.release} in environment ${sentryCfg.environment}`
      );
    } else {
      console.warn(
        `REACT_APP_SENTRY_DSN not found. Sentry will not be loaded.`
      );
    }
  }, []);
};
