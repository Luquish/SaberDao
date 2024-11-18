import { ModalButton } from "@/common/Modal/ModalButton";
import { useAllGauges } from "../../../../../gauges/hooks/useGauges";
import { EnableAllGaugesModal } from "./EnableAllGaugesModal";
export const EnableGaugesButton = () => {
    const { gauges } = useAllGauges();
    return (React.createElement(ModalButton, { buttonLabel: "Enable All Gauges", buttonProps: {
            variant: "outline",
        } },
        React.createElement(EnableAllGaugesModal, { gauges: gauges })));
};
