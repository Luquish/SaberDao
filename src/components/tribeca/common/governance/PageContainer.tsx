import React from "react";

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function PageContainer({
  children,
  style,
  className = "",
}: Props) {
  return (
    <div className={`max-w-5xl w-full md:w-11/12 mx-auto ${className}`} style={style}>
      {children}
    </div>
  );
}
