import { ModalButton } from "../../../../../../../common/Modal/ModalButton";
import { useAllGauges } from "../../../../../gauges/hooks/useGauges";
import { EnableAllGaugesModal } from "./EnableAllGaugesModal";

export const EnableGaugesButton: React.FC = () => {
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
