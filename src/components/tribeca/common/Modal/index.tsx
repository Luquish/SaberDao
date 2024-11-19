import "@reach/dialog/styles.css";

import clsx from 'clsx';
import { animated, useSpring, useTransition, SpringValue } from "@react-spring/web";
import React from "react";
import { isMobile } from "react-device-detect";
import { useGesture, DragState } from "@use-gesture/react";

import { ModalProvider } from "@/contexts/tribeca/modal";

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
  darkenOverlay?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  className,
  children,
  isOpen,
  onDismiss,
  darkenOverlay = true,
}: ModalProps) => {
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
      if (
        state.movement[1] > 300 ||
        (state.velocity[1] > 3 && state.direction[1] > 0)
      ) {
        onDismiss();
      }
    },
  });

  return (
    <>
      {fadeTransition(
        (transition: { opacity: SpringValue<number> }, item: boolean) =>
          item && (
            <StyledDialogOverlay
              style={transition}
              isOpen={isOpen || transition.opacity.get() !== 0}
              onDismiss={onDismiss}
              darkenOverlay={darkenOverlay}
            >
              <ModalWrapper
                className={className}
                aria-label="dialog content"
                {...(isMobile
                  ? {
                      ...bind(),
                      style: {
                        transform: y.to(
                          (n: number) => `translateY(${n > 0 ? n : 0}px)`
                        ),
                      },
                    }
                  : {})}
              >
                <ModalProvider initialState={onDismiss}>
                  {children}
                </ModalProvider>
              </ModalWrapper>
            </StyledDialogOverlay>
          )
      )}
    </>
  );
};

const ModalWrapper: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, ...props }) => (
    <animated.div
      {...props}
      className={clsx(
        "shadow-2xl w-full max-w-lg p-6 rounded-lg relative",
        "dark:bg-warm-gray-850",
        props.className
      )}
    >
      {children}
    </animated.div>
  );
  
  const StyledDialogOverlay: React.FC<{
    darkenOverlay: boolean;
    className?: string;
    style?: any;
    children?: React.ReactNode;
    isOpen?: boolean;
    onDismiss?: () => void;
  }> = ({ darkenOverlay, children, ...props }) => (
    <animated.div
      {...props}
      className={clsx(
        "z-[11]",
        darkenOverlay ? "bg-black/55" : "bg-transparent",
        props.className
      )}
    >
      <div className="p-0">
        {children}
      </div>
    </animated.div>
  );
