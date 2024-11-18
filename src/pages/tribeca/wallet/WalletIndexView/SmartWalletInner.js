import { useSmartWallet } from "../../../../hooks/useSmartWallet";
export const SmartWalletInner = () => {
    const { smartWallet } = useSmartWallet();
    return (React.createElement("div", null, smartWallet?.data?.owners.map((o) => o.toString()).join(",")));
};
