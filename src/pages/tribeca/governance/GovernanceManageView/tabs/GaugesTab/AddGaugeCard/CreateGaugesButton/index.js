import { ModalButton } from "@/common/Modal/ModalButton";
import { CreateGaugesModal } from "./CreateGaugesModal";
export const CreateGaugesButton = () => {
    return (React.createElement(ModalButton, { buttonLabel: "Create Gauges", buttonProps: {
            variant: "outline",
        } },
        React.createElement(CreateGaugesModal, null)));
};
