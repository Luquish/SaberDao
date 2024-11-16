import React from "react";

interface Props {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
}

export const Notice: React.FC<Props> = ({
  className,
  icon,
  title,
  children,
}: Props) => {
  return (
    <div className={`border px-5 py-4 flex flex-col gap-3 ${className}`}>
      {title && (
        <div className="flex items-center gap-3">
          {icon && <div className="text-secondary">{icon}</div>}
          <h2 className="font-medium text-sm">{title}</h2>
        </div>
      )}
      <div className="prose prose-sm">{children}</div>
    </div>
  );
};
