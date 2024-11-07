export default interface AccordionObject {
  index: number;
  title: string;
  activeIndex: number | undefined;
  isDisabled: boolean;
  body: string | JSX.Element;
  barColor: string;
}
