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
      <div tw="mb-2">
        {actions ? (
          <div tw="flex justify-between items-center">
            <h2 tw="text-xl font-medium mb-1">{title}</h2>
            {actions}
          </div>
        ) : (
          <h2 tw="text-xl font-medium mb-1">{title}</h2>
        )}
        {description && <p tw="text-secondary text-sm">{description}</p>}
      </div>
      {children}
    </div>
  );
};
