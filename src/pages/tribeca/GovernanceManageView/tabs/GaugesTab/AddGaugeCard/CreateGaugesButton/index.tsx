import React from "react";

import { ModalButton } from "@/components/tribeca/common/Modal/ModalButton";
import { CreateGaugesModal } from "./CreateGaugesModal";

export const CreateGaugesButton: React.FC = () => {
  return (
    <ModalButton
      buttonLabel="Create Gauges"
      buttonProps={{
        variant: "outline",
      }}
    >
      <CreateGaugesModal />
    </ModalButton>
  );
};
