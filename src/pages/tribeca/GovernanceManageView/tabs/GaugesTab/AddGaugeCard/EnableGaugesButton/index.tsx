import React from "react";

import { ModalButton } from "@/components/tribeca/common/Modal/ModalButton";
import { useAllGauges } from "@/hooks/tribeca/useGauges";
import EnableAllGaugesModal from "./EnableAllGaugesModal";

const EnableGaugesButton: React.FC = () => {
  const { gauges } = useAllGauges();
  return (
    <ModalButton
      buttonLabel="Enable All Gauges"
      buttonProps={{
        variant: "outline",
      }}
    >
      <EnableAllGaugesModal gauges={gauges} />
    </ModalButton>
  );
};

export default EnableGaugesButton;
