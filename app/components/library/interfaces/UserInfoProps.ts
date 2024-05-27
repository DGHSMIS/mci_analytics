export default interface UserInfoProps {
  companyId: number;
  companyName: string;
  name: string;
  permissions?: Array<string>;
  roleId: number;
  roleName: string;
  userImg?: string;
}
