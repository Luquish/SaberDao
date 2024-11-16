import type { Interpolation, Theme } from "@emotion/react";
import { useState } from "react";

import { AsyncButton } from "./AsyncButton";
import { Modal } from "./Modal";

import React from "react";

type Props = React.ComponentProps<typeof AsyncButton> & {
  modal: {
    title: string;
    disabled?: boolean;
    contents: React.ReactNode;
    style?: Interpolation<Theme>;
    innerStyles?: Interpolation<Theme>;
  };
};

export const AsyncConfirmButton: React.FC<Props> = ({
  children,
  onClick,
  modal: { title, contents, disabled, style: modalStyle, innerStyles },
  ...buttonProps
}: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      <Modal
        className={`p-0 ${modalStyle || ''}`}
        isOpen={showModal}
        onDismiss={() => {
          setShowModal(false);
        }}
      >
        <div className="border-b border-b-warmGray-800 text-white font-bold text-base text-center py-4">
          {title}
        </div>
        <div className="p-8 flex flex-col items-center" css={innerStyles}>
          {contents}
          <AsyncButton
            className="mt-8 w-full"
            {...buttonProps}
            disabled={disabled}
            onClick={onClick}
          >
            {title}
          </AsyncButton>
        </div>
      </Modal>
      <AsyncButton
        {...buttonProps}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {children}
      </AsyncButton>
    </>
  );
};
