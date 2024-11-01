import { MdInfoOutline } from "react-icons/md";

import { MouseoverTooltip } from "./MouseoverTooltip";

interface Props {
  text: React.ReactNode;
  children?: React.ReactNode;
}

export const HelpTooltip: React.FC<Props> = ({ text, children }: Props) => {
  return (
    <MouseoverTooltip text={text}>
      {children}
      <MdInfoOutline tw="inline w-3.5 h-3.5 ml-1.5 hover:text-primary" />
    </MouseoverTooltip>
  );
};
