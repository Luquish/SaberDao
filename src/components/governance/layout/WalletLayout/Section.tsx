interface Props {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Section: React.FC<Props> = ({
  title,
  description,
  className,
  children,
}: Props) => {
  return (
    <section>
      <h2 tw="text-xl font-medium mb-1">{title}</h2>
      {description && <p tw="text-secondary text-sm">{description}</p>}
      <div tw="my-6 flex items-center gap-4" className={className}>
        {children}
      </div>
    </section>
  );
};
