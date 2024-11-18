import { QuarrySDKProvider } from "@rockooor/react-quarry";
import React from "react";
export const QuarryInterfaceProvider = ({ children, }) => {
    return React.createElement(QuarrySDKProvider, { initialState: {} }, children);
};
