import React from "react";
import { useSDK } from "../../../contexts/sdk";
import { WalletButton } from "../layout/GovernorLayout/Header/WalletButton";
import { Button } from "./Button";
export const AsyncButton = ({ onClick, children, ...rest }) => {
    const { sdkMut } = useSDK();
    return sdkMut !== null ? (React.createElement(Button, { onClick: onClick
            ? async () => {
                await onClick(sdkMut);
            }
            : undefined, ...rest }, children)) : (React.createElement(WalletButton, null));
};
