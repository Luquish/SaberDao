import { Switch } from "@headlessui/react";
import { useState } from "react";
import tw from "twin.macro";

import { LoadingSpinner } from "./LoadingSpinner";

interface Props {
  label?: string;
  checked: boolean;
  onChange: (value: boolean) => void | Promise<void>;
}

export const Toggle: React.FC<Props> = ({
  label,
  checked,
  onChange,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingChecked, setPendingChecked] = useState<boolean>(checked);

  const displayChecked = isLoading ? pendingChecked : checked;

  return (
    <Switch.Group>
      <div tw="flex items-center text-sm">
        <Switch<"button">
          checked={displayChecked}
          disabled={isLoading}
          onChange={async (value: boolean) => {
            setPendingChecked(value);
            setIsLoading(true);
            try {
              await onChange(value);
            } catch (e) {
              console.error(e);
            }
            setIsLoading(false);
          }}
          css={[
            displayChecked ? tw`bg-primary` : tw`bg-warmGray-600`,
            tw`relative inline-flex items-center h-6 rounded-full w-11 transition-colors`,
            isLoading && tw`bg-warmGray-400`,
          ]}
        >
          <span
            css={[
              displayChecked ? tw`translate-x-6` : tw`translate-x-1`,
              tw`inline-block w-4 h-4 transform bg-white rounded-full transition-transform`,
            ]}
          />
        </Switch>
        {isLoading && <LoadingSpinner tw="ml-2 text-warmGray-400" />}
        {label && (
          <Switch.Label tw="ml-2 font-medium text-warmGray-400">
            {label}
          </Switch.Label>
        )}
      </div>
    </Switch.Group>
  );
};
