import { NavLink } from "react-router-dom";
import tw, { css } from "twin.macro";

const NAV_ITEMS = [
  {
    title: "Programs",
    href: "/programs",
  },
  {
    title: "Errors",
    href: "/errors",
  },
  {
    title: "Inspector",
    href: "/tx/inspector",
  },
];

export const InnerNav: React.FC = () => {
  return (
    <div tw="text-sm">
      {NAV_ITEMS.map(({ title, href }) => (
        <NavLink
          key={href}
          to={href}
          className={({ isActive }) => (isActive ? "active" : "")}
          css={[
            tw`px-2 font-medium`,
            css`
              &.active {
                ${tw`text-primary`}
              }
            `,
          ]}
        >
          {title}
        </NavLink>
      ))}
    </div>
  );
};
