import { noop } from "lodash-es";
import { createContainer } from "unstated-next";
const useModalInner = (close = noop) => {
    if (!close) {
        throw new Error("no close provided");
    }
    return { close };
};
export const { useContainer: useModal, Provider: ModalProvider } = createContainer(useModalInner);
