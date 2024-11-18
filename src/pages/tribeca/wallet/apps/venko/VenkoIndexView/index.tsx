import React from "react";

import { BasicPage } from "@/components/tribeca/common/page/BasicPage";
import { VenkoLockup } from "./VenkoLockup";

export const VenkoIndexView: React.FC = () => {
  return (
    <BasicPage title="Venko" description="Redeem a Stream">
      <VenkoLockup />
    </BasicPage>
  );
};
