import React from "react";
import ContentLoader from "@/components/tribeca/common/ContentLoader";

const GaugeRowPlaceholder: React.FC = () => {
  return (
    <tr>
      <td>
        <div className="h-10 flex items-center">
          <ContentLoader className="w-10 h-4" />
        </div>
      </td>
      <td>
        <div className="h-10 flex items-center">
          <ContentLoader className="w-32 h-4" />
        </div>
      </td>
      <td>
        <div className="h-10 flex items-center">
          <ContentLoader className="w-12 h-4" />
        </div>
      </td>
      <td>
        <div className="h-10 flex items-center">
          <ContentLoader className="w-12 h-4" />
        </div>
      </td>
    </tr>
  );
};

export default GaugeRowPlaceholder;