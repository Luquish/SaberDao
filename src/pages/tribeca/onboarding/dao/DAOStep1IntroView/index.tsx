import { Link } from "gatsby";
import React from "react";
import { RouteComponentProps } from '@reach/router';

import { Button } from "@/components/tribeca/common/Button";

const DAOStep1IntroView: React.FC<RouteComponentProps> = () => {
  return (
    <div className="grid gap-12 w-full max-w-sm mx-auto">
      <div>
        <div className="mb-8">
          <h1 className="font-bold text-3xl mb-4 dark:text-gray-50">
            Let's create a DAO.
          </h1>
          <h2 className="text-secondary font-medium text-sm dark:text-gray-300">
            Tribeca allows you to create a powerful DAO with incentives for
            long-term alignment out of the box.
          </h2>
        </div>
        <div className="flex flex-col items-center gap-16">
          <div className="prose prose-sm dark:prose-light">
            <p>
              This wizard will take you through creating the components our
              recommended setup:
            </p>
            <ul>
              <li>A Governance Smart Wallet, with three signers:</li>
              <li>
                A <strong>Tribeca DAO</strong>, using the Locked Voter program
              </li>
              <li>
                A 1-of-n "Executive" multisig, used to execute transactions
              </li>
              <li>
                An Emergency DAO multisig, which can be used to override the
                normal DAO proposal process when things go wrong.
              </li>
            </ul>
          </div>
          <div>
            <Link to="/tribeca/onboarding/dao/create-executive">
              <Button size="md" variant="primary">
                Let's go!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAOStep1IntroView;
