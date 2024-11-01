import { Card } from "./Card";

interface Props {
  title?: string;
  image?: React.ReactNode;
  children?: React.ReactNode;
}

export const CardWithImage: React.FC<Props> = ({
  title,
  children,
  image,
}: Props) => {
  return (
    <Card>
      <div tw="flex flex-col md:flex-row">
        <div tw="flex-1 p-6">
          <h4 tw="text-base font-bold mb-3.5 text-white">{title}</h4>
          {children}
        </div>
        <div tw="flex-1 md:w-1/2 bg-warmGray-900">{image}</div>
      </div>
    </Card>
  );
};
