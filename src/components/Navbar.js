import React, { useCallback, useRef } from 'react';
import { BaseWalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'gatsby';
import { ImCross } from 'react-icons/im';
import { SiGitbook } from 'react-icons/si';
import { FaCog } from 'react-icons/fa';
import { FaDiscord, FaExternalLinkAlt } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { Token, WRAPPED_SOL } from '@saberhq/token-utils';
import { FaMedium, FaXTwitter } from 'react-icons/fa6';
import clsx from 'clsx';
import I18n from '../i18n';
import Saber from '../svg/saber';
import Button from './Button';
import Block from './Block';
import useUserATA from '../hooks/user/useUserATA';
import useNetwork from '../hooks/useNetwork';
import useUnwrap from '../hooks/user/useUnwrap';
import UniversalPopover from './models/universal-popover';
import ModelHeader from './models/model-header';
import SettingModel from './models/setting-model';
import { SABER_IOU_MINT } from '@saberhq/saber-periphery';
import useRedeemSbr from '../hooks/user/useRedeemSbr';
const WrappedSolBlock = () => {
    const { network } = useNetwork();
    const { data: ata, refetch } = useUserATA(WRAPPED_SOL[network], true);
    const { unwrap } = useUnwrap();
    const { mutate: execUnwrap, isPending, } = useMutation({
        mutationKey: ['unwrap'],
        mutationFn: async () => {
            await unwrap();
            refetch();
        },
    });
    return ((ata?.balance.asNumber ?? 0) > 0 && (React.createElement(Block, { active: true, className: "flex gap-1 items-center" },
        "You have ",
        ata.balance.asNumber,
        " wrapped SOL in your wallet.",
        isPending ? (React.createElement(Button, { size: "small", disabled: true, key: "g" }, "Unwrapping...")) : (React.createElement(Button, { size: "small", key: "g", onClick: execUnwrap }, "Unwrap")))));
};
const IOUSBRBlock = () => {
    const { redeem } = useRedeemSbr();
    const { data: iou, refetch } = useUserATA(new Token({
        address: SABER_IOU_MINT.toString(),
        decimals: 6,
        symbol: 'IOU',
        name: 'IOU',
        chainId: 101,
    }));
    const { mutate: execRedeem, isPending, } = useMutation({
        mutationKey: ['redeem'],
        mutationFn: async () => {
            await redeem();
            refetch();
        },
    });
    return ((iou?.balance.asNumber ?? 0) > 0 && (React.createElement(Block, { active: true, className: "flex gap-1 items-center" },
        "You have ",
        iou.balance.asNumber,
        " IOU SBR in your wallet. You can redeem it here.",
        isPending ? (React.createElement(Button, { size: "small", disabled: true, key: "g" }, "Redeeming...")) : (React.createElement(Button, { size: "small", key: "g", onClick: execRedeem }, "Redeem")))));
};
export default function Navbar() {
    const { publicKey } = useWallet();
    const settingRef = useRef();
    const handleModelClose = useCallback(() => {
        settingRef.current?.close();
    }, []);
    const handleOpenModel = useCallback(() => {
        settingRef.current?.open();
    }, []);
    const LABELS = {
        disconnecting: 'Disconnecting ...',
        'has-wallet': React.createElement("div", { className: "flex items-center gap-1" },
            publicKey?.toString().substring(0, 3),
            "...",
            publicKey?.toString().substring(publicKey?.toString().length - 3),
            " ",
            React.createElement(ImCross, null)),
        'no-wallet': 'Disconnect Wallet',
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(UniversalPopover, { ref: settingRef, onClose: handleModelClose },
            React.createElement("div", { className: clsx('bg-saber-modelBg max-w-2xl w-full m-2 sm:m-2 md:m-2 bg-darkblue border  border-gray-600 p-5 shadow-3xl rounded-xl z-[1000] transition-opacity'), onClick: (e) => e.stopPropagation() },
                React.createElement(ModelHeader, { handleClose: handleModelClose, title: I18n.SettingPopupTitle }),
                React.createElement(SettingModel, null))),
        React.createElement("div", { className: "w-full flex flex-col lg:flex-row gap-1" },
            React.createElement("div", { className: "flex items-center gap-3 font-bold mb-3 lg:mb-0" },
                React.createElement(Link, { to: "/", className: "flex-grow" },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement(Saber, { className: "text-saber-light" }),
                        "Saber")),
                React.createElement("div", { className: "flex items-center gap-2 lg:hidden" },
                    publicKey ? React.createElement(BaseWalletDisconnectButton, { labels: LABELS }) : React.createElement(WalletMultiButton, null),
                    React.createElement(Button, { type: "secondary", className: "flex items-center gap-2 h-10 text-xl", onClick: handleOpenModel },
                        React.createElement(FaCog, null)))),
            React.createElement("div", { className: "flex-grow flex-wrap flex justify-center gap-3" },
                React.createElement(Link, { to: "/" },
                    React.createElement(Button, { className: "flex items-center gap-2 h-10", type: "secondary" }, "Pools")),
                React.createElement(Link, { to: "/tribeca" },
                    React.createElement(Button, { className: "flex items-center gap-2 h-10", type: "secondary" }, "TribecaDao")),
                React.createElement("a", { href: "https://vota.fi/", target: "_blank", rel: "noreferrer" },
                    React.createElement(Button, { type: "secondary", className: "flex items-center gap-2 h-10" },
                        "Bribes ",
                        React.createElement(FaExternalLinkAlt, null))),
                React.createElement("a", { href: "https://doc.saberdao.io/", target: "_blank", rel: "noreferrer" },
                    React.createElement(Button, { type: "secondary", className: "flex items-center gap-2 h-10 text-xl" },
                        React.createElement(SiGitbook, null))),
                React.createElement("a", { href: "https://blog.saberdao.io/", target: "_blank", rel: "noreferrer" },
                    React.createElement(Button, { type: "secondary", className: "flex items-center gap-2 h-10 text-xl" },
                        React.createElement(FaMedium, null))),
                React.createElement("a", { href: "https://twitter.com/thesaberdao", target: "_blank", rel: "noreferrer" },
                    React.createElement(Button, { type: "secondary", className: "flex items-center gap-2 h-10 text-xl" },
                        React.createElement(FaXTwitter, null))),
                React.createElement("a", { href: "https://discord.com/invite/cmVUgRXS53", target: "_blank", rel: "noreferrer" },
                    React.createElement(Button, { type: "secondary", className: "flex items-center gap-2 h-10 text-xl" },
                        React.createElement(FaDiscord, null)))),
            React.createElement("div", { className: "hidden lg:flex items-center gap-2" },
                publicKey ? React.createElement(BaseWalletDisconnectButton, { labels: LABELS }) : React.createElement(WalletMultiButton, null),
                React.createElement(Button, { type: "secondary", className: "flex items-center gap-2 h-10 text-xl", onClick: handleOpenModel },
                    React.createElement(FaCog, null)))),
        React.createElement(WrappedSolBlock, null),
        React.createElement(IOUSBRBlock, null)));
}
