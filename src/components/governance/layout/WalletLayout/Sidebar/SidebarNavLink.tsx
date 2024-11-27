import tw from "twin.macro";

type Props = React.ComponentProps<"a"> & {
  isActive?: boolean;
};

export const SidebarNavLink = ({ isActive, ...props }: Props) => {
  return (
    <a
      tw="text-gray-700 text-sm font-medium h-7 flex items-center px-5 rounded cursor-pointer hover:(bg-gray-100)"
      {...props}
      className={isActive ? "bg-gray-100" : ""}
    />
  );
};
