import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { useEffect, useState } from "react";
import React from "react";

interface Props
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src?: string;
  size?: number;
  className?: string;
  alt: string;
}

export const ImageWithFallback: React.FC<Props> = ({
  className,
  src,
  size = 28,
  alt,
  ...imageProps
}: Props) => {
  const [invalid, setInvalid] = useState<boolean>(false);
  useEffect(() => {
    setInvalid(false);
  }, [src]);
  return (
    <Wrapper size={size}>
      {invalid || !src ? (
        <Placeholder />
      ) : (
        <img
          {...imageProps}
          src={src}
          onError={() => {
            setInvalid(true);
          }}
          alt={alt}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = ({ size, children }: { size: number; children: React.ReactNode }) => (
  <div
    className={`h-[${size}px] w-[${size}px] rounded-full overflow-hidden`}
  >
    {children}
  </div>
);

const Placeholder = () => (
  <div
    className="h-full w-full border-2 border-dashed rounded-full"
    style={{ borderColor: "#ccc" }}
  />
);
