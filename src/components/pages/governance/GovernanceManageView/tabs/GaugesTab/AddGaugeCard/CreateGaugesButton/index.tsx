import { ModalButton } from "../../../../../../../common/Modal/ModalButton";
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
