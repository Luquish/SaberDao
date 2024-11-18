import "@reach/dialog/styles.css";
import clsx from 'clsx';
import { animated, useSpring, useTransition } from "@react-spring/web";
import React from "react";
import { isMobile } from "react-device-detect";
import { useGesture } from "react-use-gesture";
import { ModalProvider } from "./context";
export const Modal = ({ className, children, isOpen, onDismiss, darkenOverlay = true, }) => {
    const fadeTransition = useTransition(isOpen, {
        config: { duration: 150 },
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });
    const [{ y }, set] = useSpring(() => ({
        y: 0,
        config: { mass: 1, tension: 210, friction: 20 },
    }));
    const bind = useGesture({
        onDrag: (state) => {
            set({
                y: state.down ? state.movement[1] : 0,
            });
            if (state.movement[1] > 300 ||
                (state.velocity > 3 && state.direction[1] > 0)) {
                onDismiss();
            }
        },
    });
    return (React.createElement(React.Fragment, null, fadeTransition((transition, item) => item && (React.createElement(StyledDialogOverlay, { style: transition, isOpen: isOpen || transition.opacity.get() !== 0, onDismiss: onDismiss, darkenOverlay: darkenOverlay },
        React.createElement(ModalWrapper, { className: className, "aria-label": "dialog content", ...(isMobile
                ? {
                    ...bind(),
                    style: {
                        transform: y.to((n) => `translateY(${n > 0 ? n : 0}px)`),
                    },
                }
                : {}) },
            React.createElement(ModalProvider, { initialState: onDismiss }, children)))))));
};
const ModalWrapper = ({ children, ...props }) => (React.createElement(animated.div, { ...props, className: clsx("shadow-2xl w-full max-w-lg p-6 rounded-lg relative", "dark:bg-warm-gray-850", props.className) }, children));
const StyledDialogOverlay = ({ darkenOverlay, children, ...props }) => (React.createElement(animated.div, { ...props, className: clsx("z-[11]", darkenOverlay ? "bg-black/55" : "bg-transparent", props.className) },
    React.createElement("div", { className: "p-0" }, children)));
