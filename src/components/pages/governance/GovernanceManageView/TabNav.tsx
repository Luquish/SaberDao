import { NavLink } from "react-router-dom";
import tw, { css } from "twin.macro";

import { useGovernor } from "../../../../hooks/tribeca/useGovernor";

interface TabGroup {
  title: string;
  path: string;
  tabs: readonly {
    path: string;
    label: string;
  }[];
}

export const TabNav: React.FC = () => {
  const { path: rootPath, meta } = useGovernor();
  const unfilteredGroups: (TabGroup | boolean)[] = [
    {
      title: "General",
      path: "/",
      tabs: [
        {
          path: "/rewarders",
          label: "Rewarders",
        },
        {
          path: "/gauges",
          label: "Gauges",
        },
        {
          path: "/executive-council",
          label: "Executive Council",
        },
        {
          path: "/config",
          label: "Config",
        },
      ],
    },
    meta?.slug === "sbr" && {
      title: "Saber",
      path: "/saber",
      tabs: [
        {
          path: "/saber/mint-proxy",
          label: "Mint Proxy",
        },
        {
          path: "/saber/redeemer",
          label: "Redeemer",
        },
      ],
    },
  ];
  const groups = unfilteredGroups.filter(Boolean) as readonly TabGroup[];
  return (
    <div>
      <nav tw="flex flex-col gap-2 bg-warmGray-850 px-3 py-2 rounded">
        {groups.map(({ title, path, tabs }) => (
          <div key={title}>
            <SidebarNavLink to={`${rootPath}/manage${path}`} tw="pl-2 mb-0.5">
              <h2 tw="text-white font-semibold">{title}</h2>
            </SidebarNavLink>
            <div tw="flex flex-col gap-0.5">
              {tabs.map(({ path, label }) => (
                <SidebarNavLink to={`${rootPath}/manage${path}`} key={path}>
                  <span>{label}</span>
                </SidebarNavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

const SidebarNavLink = (props: React.ComponentProps<typeof NavLink>) => {
  return (
    <NavLink
      tw="text-warmGray-400 text-sm font-medium h-7 flex items-center px-5 rounded cursor-pointer hover:(bg-warmGray-600 text-white)"
      className={({ isActive }) => (isActive ? "is-active" : "")}
      css={css`
        &.is-active {
          ${tw`bg-warmGray-700 text-white`}
        }
      `}
      {...props}
    />
  );
};
