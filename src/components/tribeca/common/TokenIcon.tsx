import type { Token } from "@saberhq/token-utils";
import React, { useState } from "react";
import clsx from "clsx";

interface Props {
  token?: Token | null;
  size?: number;
  className?: string;
}

export function TokenIcon({
  className,
  token,
  size = 28,
}: Props) {
  const [invalid, setInvalid] = useState<boolean>(false);
  
  return (
    <div 
      className={clsx(
        "rounded-full overflow-hidden",
        className
      )}
      style={{ 
        height: `${size}px`, 
        width: `${size}px` 
      }}
    >
      {invalid || !token?.icon ? (
        <div 
          className="h-full w-full rounded-full border border-dashed border-[#ccc]"
        />
      ) : (
        <img
          src={token.icon}
          onError={() => {
            setInvalid(true);
          }}
          alt={`Icon for token ${token.name}`}
          className="h-full w-full"
        />
      )}
    </div>
  );
}
