import { IconProps } from "@components/library/Icon";

export interface SidebarProps {
  moduleList: ModuleListProps[];
  selectedModule: number;
  className: string;
  sideBarStatus?: boolean;
  stateChange?: number;
  onSidebarToggle?: () => void;
  isModuleChanged?: (e: number) => void;
  onMenuSubItemToggle?: (index: number, isOpen: boolean) => void;
  onMenuItemChanged?: (
    e: number,
    isSubItem?: boolean,
    subItemIndex?: number
  ) => void;
  showMobileSidebar?: boolean;
  hideMobileSidebar?: (e: boolean) => void;
  hasDropDown?: boolean;
  dividerColor?: string;
  madeBy?: string;
  alignDevNameToCenter?: boolean;
}

export interface ModuleListProps {
  id: number;
  name: string;
  items: ModuleItemProps[];
}

export interface ModuleItemBaseProps {
  id: number;
  name: string;
  icon: IconProps["iconName"];
  link?: string;
  notificationCount?: number;
  isActive: boolean;
  isOpen?: boolean;
  permissions?: Array<string>;
  subItems?: ModuleSubItemProps[];
}

export type ModuleItemProps =
  | (ModuleItemBaseProps & {
      link: string;
      subItems?: undefined;
    })
  | (ModuleItemBaseProps & {
      link?: undefined;
      subItems: ModuleSubItemProps[];
    });

export interface ModuleSubItemProps {
  id: number;
  name: string;
  link: string;
  isActive: boolean;
  permissions?: Array<string>;
  notificationCount?: number;
  flyoutItems?: ModuleSubItemProps[];
}
