import { FaRegQuestionCircle } from "react-icons/fa";
import { useLocation } from "@reach/router";
import React from "react";

import { EmptyState } from "@/components/tribeca/common/EmptyState";
import Card from "@/components/tribeca/common/governance/Card";
import { getUrlParams } from "@/utils/tribeca/urlParams";

const GovernanceNotFoundPage = () => {
  const location = useLocation();
  const governorStr = getUrlParams.governor(location.pathname);

  return (
    <div className="w-full">
      <div className="bg-warmGray-900 pb-24">
        <div className="max-w-5xl w-11/12 mx-auto">
          <div className="flex flex-col gap-4 md:gap-8 md:flex-row md:min-h-[120px] flex-wrap items-center justify-between w-full">
            <div className="flex flex-col self-start md:self-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
                Not Found
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl w-11/12 mx-auto">
        <main className="w-full -mt-16 mb-20">
          <Card title="Governance Not Found">
            <EmptyState
              icon={<FaRegQuestionCircle />}
              title="Governance Not Found"
            >
              <div className="max-w-sm text-center mt-4">
                <p>
                  We couldn't find a DAO at {governorStr}. Please check the
                  address and try again.
                </p>
              </div>
            </EmptyState>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default GovernanceNotFoundPage;
