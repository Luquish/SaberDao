import { usePubkey } from "@rockooor/sail";
import React from "react";
import { useLocation } from "@reach/router";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { Card } from "@/components/tribeca/common/governance/Card";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
import { InitializeRedeemer } from "./InitializeRedeemer";
import { RedeemerAllowance } from "./RedeemerAllowance";
import { useRedeemer } from "./useRedeemer";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    const iouMint = paths[paths.indexOf('redeemer') + 1] || '';
    return { iouMint };
}
export const TheRedeemer = () => {
    const location = useLocation();
    const { iouMint: iouMintString } = getParams(location.pathname);
    const iouMint = usePubkey(iouMintString);
    const { data: redeemer } = useRedeemer(iouMint ?? undefined);
    if (redeemer === undefined) {
        return React.createElement(LoadingPage, null);
    }
    return (React.createElement("div", { className: "flex flex-col gap-4" }, redeemer === null ? (React.createElement(InitializeRedeemer, { iouMint: iouMint ?? undefined })) : (React.createElement(React.Fragment, null,
        React.createElement(Card, { title: "Redeemer" },
            React.createElement(AttributeList, { loading: redeemer === undefined, attributes: {
                    Key: redeemer?.publicKey,
                    "IOU Mint": redeemer?.account.iouMint,
                    "Redemption Mint": redeemer?.account.redemptionMint,
                    "Redemption Vault": redeemer?.account.redemptionVault,
                } })),
        React.createElement(RedeemerAllowance, { redeemer: redeemer.publicKey })))));
};
