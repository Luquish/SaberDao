import { Global, css} from "@emotion/react";
import React from "react";

import { Header } from "./Header";

interface Props {
  placeholder?: boolean;
  children?: React.ReactNode;
}

export const GovernorLayout: React.FC<Props> = ({
  children,
  placeholder = false,
}: Props) => {
  return (
    <div>
      <Header placeholder={placeholder} />
      <Global
        styles={css`
          body {
            &.dark {
              background-color: #18181b;
            }
          }
        `}
      />
      <div className="flex w-screen">
        <div className="flex-grow h-full overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
};
