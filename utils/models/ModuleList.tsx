import { ModuleListProps } from "@library/molecules/navigation/SidebarProps";

// export interface ModuleListInterface {
//   id: number;
//   name: string;
//   items?: any;
// }

// export interface ModuleItemInterface {
//   id: number;
//   name: string;
//   icon: string;
//   link: string;
//   isActive: boolean;
//   subItems?: ModuleSubItemInterface[];
// }

// export interface ModuleSubItemInterface {
//   id: number;
//   name: string;
//   link: string;
//   isActive: boolean;
// }

export const ModuleList: ModuleListProps[] = [
  {
    id: 1,
    name: "Dev List",
    items: [
      // {
      // 	id: 1,
      // 	name: "Data Dashboard",
      // 	icon: "dotpoints-01",
      // 	link: "/data-management/dashboard",
      // 	isActive: false,
      // 	// subItems: []
      // },
      {
        id: 1,
        name: "Fahim Demo",
        link: "/dashboard",
        isActive: false,
        icon: "dotpoints-01",
        // subItems: []
      },
      {
        id: 2,
        name: "Maher Demo",
        link: "/dashboard/bootstrapz",
        isActive: false,
        icon: "upload-cloud-01",
        // subItems: []
      },
      {
        id: 3,
        name: "Soumya Demo",
        link: "/dashboard/soumya",
        isActive: false,
        icon: "check-done-02",
        // subItems: []
      },
      {
        id: 4,
        name: "Raihan Demo",
        link: "/dashboard/arms",
        isActive: false,
        icon: "file-06",
        // link: "/users",
        // subItems: []
      },

      {
        id: 5,
        name: "Mat React Table",
        link: "/dashboard/tables/material",
        isActive: false,
        icon: "file-06",
        // link: "/users",
        // subItems: []
      },

      {
        id: 6,
        name: "Settings",
        isActive: false,
        icon: "settings-01",
        link: "/users2",
        // subItems: []
      },
      {
        id: 7,
        name: "Nobin Demo",
        link: "/dashboard/Nobin",
        isActive: false,
        icon: "file-03",
        // link: "/users",
        // subItems: []
      },
    ],
  },
  {
    id: 2,
    name: "Aggregation & VFM",
    items: [
      {
        id: 1,
        name: "Aggregation Dashboard",
        icon: "dotpoints-01",
        link: "dashboard/arms2",
        isActive: false,
        // subItems: []
      },
      {
        id: 2,
        name: "User List",
        link: "dashboard/arms3",
        isActive: false,
        icon: "upload-cloud-01",
        // subItems: []
      },
      {
        id: 3,
        name: "Other Items",
        isActive: false,
        link: "dashboard/arms4",
        icon: "check-done-02",
        // subItems: []
      },
      {
        id: 6,
        name: "Settings",
        isActive: false,
        icon: "settings-01",
        link: "/users1",
        // subItems: []
      },
    ],
  },
  {
    id: 3,
    name: "Intervention",
    items: [
      {
        id: 1,
        name: "Intervention Dashboard",
        icon: "dotpoints-01",
        link: "/intervention/dashboard",
        isActive: false,
      },
      {
        id: 2,
        name: "Intervention List",
        link: "/intervention/intervention-list",
        isActive: false,
        icon: "upload-cloud-01",
        // subItems: []
      },
      {
        id: 3,
        name: "Other Items",
        isActive: false,
        icon: "check-done-02",
        link: "/users",
        // subItems: []
      },
      {
        id: 3,
        name: "Other Items 2",
        isActive: false,
        icon: "check-done-02",
        link: "/users",
        // subItems: []
      },
      {
        id: 4,
        name: "Other Items 3",
        isActive: false,
        icon: "users-01",
        link: "/users",
        // subItems: []
      },
      {
        id: 6,
        name: "Settings",
        isActive: false,
        icon: "settings-01",
        link: "/users",
        // subItems: []
      },
    ],
  },
  {
    id: 4,
    name: "Research",
    items: [
      {
        id: 1,
        name: "Research Dashboard",
        icon: "dotpoints-01",
        link: "/dashboard",
        isActive: false,
      },
      {
        id: 2,
        name: "Research List",
        link: "/users",
        isActive: false,
        icon: "upload-cloud-01",
        // subItems: []
      },

      {
        id: 6,
        name: "Settings",
        isActive: false,
        icon: "settings-01",
        link: "/users",
        // subItems: []
      },
    ],
  },
  {
    id: 5,
    name: "Knowledge Library",
    items: [
      {
        id: 1,
        name: "KL Dashboard",
        icon: "dotpoints-01",
        link: "/dashboard",
        isActive: false,
      },
      {
        id: 2,
        name: "KL List",
        link: "/users",
        isActive: false,
        icon: "upload-cloud-01",
        // subItems: []
      },
      {
        id: 3,
        name: "Users",
        isActive: false,
        icon: "check-done-02",
        link: "/users",
        // subItems: []
      },
      {
        id: 6,
        name: "Settings",
        isActive: false,
        icon: "settings-01",
        link: "/users",
        // subItems: []
      },
    ],
  },
  {
    id: 6,
    name: "User",
    items: [
      {
        id: 1,
        name: "User Dashboard",
        icon: "dotpoints-01",
        link: "/dashboard",
        isActive: false,
      },
      {
        id: 2,
        name: "User List",
        link: "/users",
        isActive: false,
        icon: "upload-cloud-01",
        // subItems: []
      },
      {
        id: 3,
        name: "User Permissions",
        isActive: false,
        icon: "check-done-02",
        link: "/users",
        // subItems: []
      },
      {
        id: 3,
        name: "User Reports",
        isActive: false,
        icon: "check-done-02",
        link: "/users",
        // subItems: []
      },
      {
        id: 6,
        name: "Settings",
        isActive: false,
        icon: "settings-01",
        link: "/users",
        // subItems: []
      },
    ],
  },
];
