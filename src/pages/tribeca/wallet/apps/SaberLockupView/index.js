import { BasicPage } from "../../../../common/page/BasicPage";
import { SaberLockupInner } from "./SaberLockupInner";
export const WalletSaberLockupView = () => {
    return (React.createElement(BasicPage, { title: "Saber Lockup", description: "Manage your Saber lockup" },
        React.createElement(SaberLockupInner, null)));
};
