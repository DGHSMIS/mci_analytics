import { cookies } from "next/headers";
import { ModuleItemProps, ModuleListProps } from "../navigation/SidebarProps";

/**
 * @name Authguard
 * @description
 * * Company - ARITS Ltd. 13th March 2023.
 * * This component is used to render a Sidebar based on user permissions.
 * * This is a wrapper component where the module list is passed as a parameter and it automatically filters the list based on the permissions parameter which comes from the backend api.
 * @param children - The React Child Components dependant on the AuthGuard
 * @param modules - List of Modules to render on the sidebar
 * => Logout funtion yet to be implemented
 */

export const revalidate = 0;

interface AuthGuardProps {
  //in interface define a function that returns a ModuleListProps[]
  children: any;
  modules: ModuleListProps[];
}
// ! Without revalidation, this AuthGuard will be cached and would break workflow

const AuthGuard = (props: AuthGuardProps) => {
  if (typeof props.children !== "function") {
    return null;
  }

  // * Temporarily stores item list from each module here
  const items: ModuleItemProps[] = [];

  const nextCookies = cookies();

  // * Reading cookies to get default sidebar items
  const sideBarFromCookie: string | undefined =
    nextCookies.get("user-info")?.value;
  console.log(sideBarFromCookie);

  // * Now read permissions from userinfo cookies
  const permissions: Array<string> = sideBarFromCookie
    ? JSON.parse(sideBarFromCookie).permissions
    : undefined;
  console.log(permissions);

  // * Checks if sidebar has Modules and then loops through the modules
  props.modules?.forEach((module) => {
    // * Checks if module has items and then loops through the items
    module.items?.filter((item: ModuleItemProps) => {
      // * if the item has permission property then loop through the permission property
      item.permissions?.forEach((sidebarItemPermission: string) => {
        // * Loop through the user permissions and compare with sidebar's individual item permissions...
        permissions?.forEach((userPermission: string) => {
          // * if the user permission matches with the sidebar item permission then push the item to the items array
          if (userPermission === sidebarItemPermission) {
            //*if permission parameter not found then return the menu item
            items.push(item);
          }
        });
      });
      // ! if the item has no permission property then push the item to the items array, otherwise it will always be hidden
      if (item.permissions === undefined) {
        items.push(item);
      }
    });
  });

  //*Brings the unique element from item
  const uniqueMenuItems = items.filter(
    (menuItem, index, self) =>
      index === self.findIndex((m) => m.id === menuItem.id)
  );

  //*sets the unique elements
  props.modules[0].items = uniqueMenuItems;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return props.children(props.modules);
};

export default AuthGuard;
