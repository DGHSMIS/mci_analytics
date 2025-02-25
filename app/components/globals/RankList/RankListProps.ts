import { IconProps } from "@library/Icon";

export interface RankItemProps {
  id: number | string;
  name: string;
  total: number | string;
}

export interface RankListProps {
  listTitle: string;
  titleColor: string;
  titleIcon: IconProps["iconName"];
  titleIconColor: string;
  listHeader: RankItemProps;
  listTotal?: number;
  listData: RankItemProps[];
}
