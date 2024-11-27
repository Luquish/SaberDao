import { FaTimes } from "react-icons/fa";

import { Button } from "@/components/governance/Button";
import { useModal } from "./context";

interface Props {
  title: string;
  children?: React.ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
  className?: string;
}

export const ModalInner: React.FC<Props> = ({
  title,
  children,
  buttonProps,
  className,
}: Props) => {
  const { close } = useModal();
  return (
    <>
      <div tw="relative border-b dark:border-b-warmgray-800 dark:text-white font-bold text-base text-center py-4">
        <div tw="px-8 overflow-ellipsis overflow-hidden whitespace-nowrap">
          {title}
        </div>
        <button
          onClick={() => close()}
          tw="absolute right-4 h-full flex items-center top-0 text-warmgray-600 hover:text-warmgray-200 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
      <div tw="p-8" className={className}>
        {children}
        {buttonProps && <Button tw="mt-8 w-full h-10" {...buttonProps} />}
      </div>
    </>
  );
};
