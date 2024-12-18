import React from "react";

import BasicPage from "@/components/tribeca/common/page/BasicPage";
import CreateStream from "./CreateStream";

const VenkoCreateStreamView: React.FC = () => {
  return (
    <BasicPage title="Issue a Venko Stream" description="Issue a Venko Stream">
      <CreateStream />
    </BasicPage>
  );
};

export default VenkoCreateStreamView;