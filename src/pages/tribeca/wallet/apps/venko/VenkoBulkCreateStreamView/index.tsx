import React from "react";

import { BasicPage } from "@/components/tribeca/common/page/BasicPage";
import { BulkCreateStream } from "./BulkCreateStream";

export const VenkoBulkCreateStreamView: React.FC = () => {
  return (
    <BasicPage
      title="Issue Bulk Venko Streams"
      description="Issue Venko Streams in Bulk"
    >
      <BulkCreateStream />
    </BasicPage>
  );
};
