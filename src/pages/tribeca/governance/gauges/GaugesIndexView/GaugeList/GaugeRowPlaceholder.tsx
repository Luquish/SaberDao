import { ContentLoader } from "../../../../../common/ContentLoader";

export const GaugeRowPlaceholder: React.FC = () => {
  return (
    <tr>
      <td>
        <div tw="h-10 flex items-center">
          <ContentLoader tw="w-10 h-4" />
        </div>
      </td>
      <td>
        <div tw="h-10 flex items-center">
          <ContentLoader tw="w-32 h-4" />
        </div>
      </td>
      <td>
        <div tw="h-10 flex items-center">
          <ContentLoader tw="w-12 h-4" />
        </div>
      </td>
      <td>
        <div tw="h-10 flex items-center">
          <ContentLoader tw="w-12 h-4" />
        </div>
      </td>
    </tr>
  );
};
