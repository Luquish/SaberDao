import React from "react";

interface Props {
  title: React.ReactNode;
  actions?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export const BasicSection: React.FC<Props> = ({
  title,
  actions,
  description,
  children,
}: Props) => {
  return (
    <div>
      <div className="mb-2">
        {actions ? (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium mb-1">{title}</h2>
            {actions}
          </div>
        ) : (
          <h2 className="text-xl font-medium mb-1">{title}</h2>
        )}
        {description && <p className="text-secondary text-sm">{description}</p>}
      </div>
      {children}
    </div>
  );
};
