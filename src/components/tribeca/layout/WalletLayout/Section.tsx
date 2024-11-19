import React from 'react';

interface Props {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function Section({
  title,
  description,
  className,
  children,
}: Props) {
  return (
    <section>
      <h2 className="text-xl font-medium mb-1">{title}</h2>
      {description && <p className="text-secondary text-sm">{description}</p>}
      <div className={`my-6 flex items-center gap-4 ${className}`}>
        {children}
      </div>
    </section>
  );
};
