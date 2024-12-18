import { Fraction } from "@saberhq/token-utils";
import type BN from "bn.js";
import React from "react";

interface Props {
  value: BN | number;
  max: BN | number;
  barColor: string;
  className?: string;
}

export const Meter: React.FC<Props> = ({
  value,
  max,
  barColor,
  className,
}: Props) => {
  const width =
    typeof value === "number" && typeof max === "number"
      ? value / max
      : new Fraction(value, max).asNumber;
  return (
    <div className= "flex-grow bg-warmGray-700 h-1 rounded">
      <div
        style={{
          width: `${Math.min(width, 1) * 100}%`,
          backgroundColor: barColor,
        }}
        className="bg-primary h-1 rounded transition-all"
      />
    </div>
  );
};
