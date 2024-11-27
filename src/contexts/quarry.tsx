import { QuarrySDKProvider } from "@rockooor/react-quarry";
import React from "react";

interface Props {
  children?: React.ReactNode;
}

export const QuarryInterfaceProvider: React.FC<Props> = ({
  children,
}: Props) => {
  return <QuarrySDKProvider initialState={{}}>{children}</QuarrySDKProvider>;
};
