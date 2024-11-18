import { Card } from "@/components/tribeca/common/governance/Card";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { ProgramsList } from "./ProgramsList";
import React from "react";

export const ProgramsView: React.FC = () => {
  return (
    <GovernancePage title="Programs">
      <Card
        title={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <h2>Manage Programs</h2>
            </div>
          </div>
        }
      >
        <ProgramsList />
      </Card>
    </GovernancePage>
  );
};

export default ProgramsView;
