export default interface FormItemResponseProps {
  data: boolean | object | Array<any>[] | Array<any> | string | number | null;
  message?: string;
  status?: number | string;
  element?: Element;
}
