import Button from "@components/library/Button";
import Icon, { IconProps } from "@components/library/Icon";
import { Dialog, Transition } from "@headlessui/react";
import variables from "@variables/variables.module.scss";
import { Fragment, memo, useRef, useState } from "react";
import { cn } from "tailwind-cn";
import ButtonIcon from "./ButtonIcon";

export interface ModalProps {
  showBackdrop?: boolean;
  modalTitle?: string;
  containerClassName?: string;
  modalTitleClassName?: string;
  modalBody?: any;
  modalSize?: "sm" | "md" | "lg" | "full";
  onClickOutToClose?: boolean;
  showModalIcon?: boolean;
  modalIconVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "custom";
  modalContentAlign?: "left" | "center" | "right";
  modalIconName?: IconProps["iconName"];
  modalIconColor?: string;
  modalIconBgColor?: string;
  modalIconSize?: string;
  modalIconStroke?: string;
  modalBgClassName?: string;
  showCrossButton?: boolean;
  onCloseModal?: Function;
  onLeftBtnClicked?: Function;

  hasLeftButton?: boolean;
  leftButtonIconPos?: "left" | "right";
  leftButtonIconName?: IconProps["iconName"];
  leftButtonIconSize?: string;
  leftButtonIconStroke?: string;
  leftButtonIconColor?: string;
  leftButtonText?: string;
  leftButtonVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "link";
  leftButtonOutline?: boolean;
  leftButtonFullWidth?: boolean;
  leftButtonClassName?: string;
  leftButtonIsDisabled?: boolean;

  rightButtonIconPos?: "left" | "right";
  rightButtonIconName?: IconProps["iconName"];
  rightButtonIconSize?: string;
  rightButtonIconStroke?: string;
  rightButtonIconColor?: string;
  rightButtonText?: string;
  rightButtonVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "link";
  rightButtonOutline?: boolean;
  rightButtonFullWidth?: boolean;
  rightButtonClassName?: string;
  rightButtonIsDisabled?: boolean;
  onRightBtnClicked?: Function;
}

/**
 * Modal Component
 *
 * @description
 * Company - ARITS Ltd.
 * This component is used to render an Modal from the sprite file.
 * Note:if "modalIconVariant" is "custom",then it will give access to customize the modalIconName,modalIconColor,modalIconSize,modalIconStroke.Otherwise these variables are predefined for each of its variant.E.g: if modalVariant is success,modalIconName,modalIconColor,modalIconSize,modalIconStroke these value are already set for success varient
 * Developed using the Untitled UI Icon library.
 *
@param {boolean} showBackdrop — Show or hide the modal backdrop ==> True by default
@param {string} modalTitle — Modal title
@param {string} modalTitleClassName — Modal title class
@param {any} modalBody — Modal body
@param {string} modalSize — Size of the Modal: 'sm' | 'md' | 'lg' | 'full'
@param {boolean} onClickOutToClose — Click outside modal to close automatically or not | false by default
@param {boolean} showModalIcon — Show or hide the modal icon ==> True by default
@param {string} modalIconVariant — Color variants 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'|'custom';
@param {string} modalContentAlign — Align Modal content 'left' | 'center' | 'right' ==> Center by default
@param {string} modalIconName — Modal icon name ==> applicable if 'primary' | 'secondary' | 'neutral' | 'custom'
@param {string} modalIconColor — Modal icon color ==> applicable if 'primary' | 'secondary' | 'custom'
@param {string} modalIconBgColor — Modal icon background color ==> applicable if 'custom'
@param {string} modalIconSize — Modal icon size
@param {string} modalIconStroke — Modal icon stroke width
@param {string} modalBgClassName — Modal panel background class
@param {function} onCloseModal — Parent controls what to do with onClose()
@param {function} onLeftBtnClick — Controls what to do when modal left button is clicked

@param {string} hasLeftButton — Define whether Modal shows left/top button ==> True by default
@param {string} leftButtonIconPos — Left Button icon position 'left' | 'right'
@param {string} leftButtonIconName — Left Button icon name
@param {string} leftButtonIconSize — Left Button icon size
@param {string} leftButtonIconStroke — Left Button icon stroke width
@param {string} leftButtonIconColor — Left Button icon color
@param {string} leftButtonText — Left Button text
@param {string} leftButtonVariant — Left Button variant (options same as Button component)
@param {boolean} leftButtonOutline — Left Button outline ==> False by default
@param {boolean} leftButtonFullWidth — Left Button full width ==> False by default
@param {string} leftButtonClassName — Left Button className, additional
@param {boolean} leftButtonIsDisabled — Left Button disabled or not ==> False by default

@param {string} rightButtonIconPos — Right Button icon position 'left' | 'right'
@param {string} rightButtonIconName — Right Button icon name
@param {string} rightButtonIconSize — Right Button icon size
@param {string} rightButtonIconStroke — Right Button icon stroke width
@param {string} rightButtonIconColor — Right Button icon color
@param {string} rightButtonText — Right Button text
@param {string} rightButtonVariant — Right Button variant (options same as Button component)
@param {boolean} rightButtonOutline — Right Button outline ==> False by default
@param {boolean} rightButtonFullWidth — Right Button full width ==> False by default
@param {string} rightButtonClassName — Right Button className, additional
@param {boolean} rightButtonIsDisabled — Right Button disabled or not ==> False by default
@param {function} onRightBtnClick — Controls what to do when modal right button is clicked
 */

const Modal = memo(function Modal({
  showBackdrop = true,
  modalTitle = "Payment Successful!",
  containerClassName = "",
  modalTitleClassName = "",
  modalBody = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam laudantium explicabo pariatur iste	dolorem animi vitae error totam. At sapiente aliquam accusamus facere.",
  modalSize = "md",
  onClickOutToClose = false,
  showModalIcon = true,
  modalIconVariant = "primary",
  modalContentAlign = "center",
  modalIconColor = variables.gray,
  modalIconBgColor = "bg-slate-100",
  modalIconName = "heart",
  modalIconSize = "20px",
  modalIconStroke = "2",
  modalBgClassName = "bg-white",
  showCrossButton,
  onCloseModal,
  onLeftBtnClicked,

  hasLeftButton = true,
  leftButtonIconPos,
  leftButtonIconName = "x-close",
  leftButtonIconSize = "16px",
  leftButtonIconStroke = "2",
  leftButtonIconColor = variables.gray500,
  leftButtonText = "Cancel",
  leftButtonVariant = "neutral",
  leftButtonOutline = false,
  leftButtonFullWidth = false,
  leftButtonClassName = "",
  leftButtonIsDisabled = false,

  rightButtonIconName = "arrow-narrow-right",
  rightButtonIconSize = "16px",
  rightButtonIconStroke = "2",
  rightButtonIconColor = variables.gray50,
  rightButtonText = "Button",
  rightButtonVariant = "primary",
  rightButtonOutline = false,
  rightButtonFullWidth = false,
  rightButtonClassName = "",
  rightButtonIsDisabled = false,
  rightButtonIconPos,
  onRightBtnClicked,
}: ModalProps) {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  const onClose = () => {
    setOpen(false);
    if (onCloseModal) onCloseModal();
  };

  const onLeftBtnClick = () => {
    // setOpen(false);
    if (onLeftBtnClicked) onLeftBtnClicked();
  };
  const onRightBtnClick = () => {
    // setOpen(false);
    if (onRightBtnClicked) onRightBtnClicked();
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={cn("altd-modal relative z-40", containerClassName)}
        initialFocus={cancelButtonRef}
        onClose={() => {
          if (onClickOutToClose) {
            onClose();
          }
        }}
      >
        {showBackdrop == true && (
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-40 bg-slate-900 bg-opacity-75 transition-opacity" />
          </Transition.Child>
        )}

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative transform space-y-20 overflow-hidden rounded-lg ${modalBgClassName} p-20 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-24
								${modalSize == "sm" && "sm:max-w-lg"}
								${modalSize == "md" && "sm:max-w-3xl"}
								${modalSize == "lg" && "sm:max-w-7xl"}
								${modalSize == "full" && "sm:max-w-full"}
								`}
              >
                {/* // ! Close Button */}
                {showCrossButton && (
                  <div
                    className={`absolute top-16 rounded-full p-4 text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-500 ${
                      modalContentAlign == "right" ? "left-16" : "right-16"
                    }`}
                  >
                    <ButtonIcon
                      iconName="x-close"
                      iconSize="24"
                      clicked={onClose}
                    />
                  </div>
                )}

                {/* // ! Show Icon and Variants */}
                {showModalIcon === true && modalIconVariant == "primary" && (
                  <div
                    className={`${
                      modalContentAlign == "left"
                        ? "mr-auto"
                        : modalContentAlign == "center"
                        ? "mx-auto"
                        : modalContentAlign == "right"
                        ? "ml-auto"
                        : ""
                    }  flex h-48 w-48 items-center justify-center rounded-full bg-green-100`}
                  >
                    <Icon
                      iconName={modalIconName}
                      iconColor={variables.primary}
                      className="pointer-events-none"
                    />
                  </div>
                )}
                {showModalIcon === true && modalIconVariant == "secondary" && (
                  <div
                    className={`${
                      modalContentAlign == "left"
                        ? "mr-auto"
                        : modalContentAlign == "center"
                        ? "mx-auto"
                        : modalContentAlign == "right"
                        ? "ml-auto"
                        : ""
                    } flex h-48 w-48 items-center justify-center rounded-full bg-secondary-100`}
                  >
                    <Icon
                      iconName={modalIconName}
                      iconColor={variables.secondary}
                      className="pointer-events-none"
                    />
                  </div>
                )}
                {showModalIcon === true && modalIconVariant == "success" && (
                  <div
                    className={`${
                      modalContentAlign == "left"
                        ? "mr-auto"
                        : modalContentAlign == "center"
                        ? "mx-auto"
                        : modalContentAlign == "right"
                        ? "ml-auto"
                        : ""
                    } flex h-48 w-48 items-center justify-center rounded-full bg-green-100`}
                  >
                    <Icon
                      iconName="check"
                      iconColor={variables.success}
                      className="pointer-events-none"
                    />
                  </div>
                )}
                {showModalIcon === true && modalIconVariant == "info" && (
                  <div
                    className={`${
                      modalContentAlign == "left"
                        ? "mr-auto"
                        : modalContentAlign == "center"
                        ? "mx-auto"
                        : modalContentAlign == "right"
                        ? "ml-auto"
                        : ""
                    } flex h-48 w-48 items-center justify-center rounded-full bg-sky-100`}
                  >
                    <Icon
                      iconName="help-circle"
                      iconColor={variables.info}
                      className="pointer-events-none"
                    />
                  </div>
                )}
                {showModalIcon === true && modalIconVariant == "warning" && (
                  <div
                    className={`${
                      modalContentAlign == "left"
                        ? "mr-auto"
                        : modalContentAlign == "center"
                        ? "mx-auto"
                        : modalContentAlign == "right"
                        ? "ml-auto"
                        : ""
                    } flex h-48 w-48 items-center justify-center rounded-full bg-amber-100`}
                  >
                    <Icon
                      iconName="alert-circle"
                      iconColor={variables.warning}
                      className="pointer-events-none"
                    />
                  </div>
                )}
                {showModalIcon === true && modalIconVariant == "danger" && (
                  <div
                    className={`${
                      modalContentAlign == "left"
                        ? "mr-auto"
                        : modalContentAlign == "center"
                        ? "mx-auto"
                        : modalContentAlign == "right"
                        ? "ml-auto"
                        : ""
                    } flex h-48 w-48 items-center justify-center rounded-full bg-rose-100`}
                  >
                    <Icon
                      iconName="alert-triangle"
                      iconColor={variables.danger}
                      className="pointer-events-none"
                    />
                  </div>
                )}
                {showModalIcon === true && modalIconVariant == "neutral" && (
                  <div
                    className={`${
                      modalContentAlign == "left"
                        ? "mr-auto"
                        : modalContentAlign == "center"
                        ? "mx-auto"
                        : modalContentAlign == "right"
                        ? "ml-auto"
                        : ""
                    } flex h-48 w-48 items-center justify-center rounded-full bg-slate-100`}
                  >
                    <Icon
                      iconName={modalIconName}
                      iconColor={variables.gray}
                      className="pointer-events-none"
                    />
                  </div>
                )}
                {showModalIcon === true && modalIconVariant == "custom" && (
                  <div
                    className={`${
                      modalContentAlign == "left"
                        ? "mr-auto"
                        : modalContentAlign == "center"
                        ? "mx-auto"
                        : modalContentAlign == "right"
                        ? "ml-auto"
                        : ""
                    } flex h-48 w-48 items-center justify-center rounded-full ${modalIconBgColor}`}
                  >
                    <Icon
                      iconName={modalIconName}
                      iconColor={modalIconColor}
                      iconStrokeWidth={modalIconStroke}
                      iconSize={modalIconSize}
                      className="pointer-events-none"
                    />
                  </div>
                )}

                {/* // ! Modal Title */}
                <Dialog.Title
                  as="h4"
                  className={`${
                    modalContentAlign == "left"
                      ? "text-left"
                      : modalContentAlign == "center"
                      ? "text-center"
                      : modalContentAlign == "right"
                      ? "text-right"
                      : ""
                  } text-slate-800 ${
                    showModalIcon === false && "mt-16"
                  } ${modalTitleClassName}`}
                >
                  {modalTitle}
                </Dialog.Title>

                {/* // ! Modal Body */}
                <p
                  className={`${
                    modalContentAlign == "left"
                      ? "text-left"
                      : modalContentAlign == "center"
                      ? "text-center"
                      : modalContentAlign == "right"
                      ? "text-right"
                      : ""
                  } text-slate-500`}
                >
                  {modalBody}
                </p>
                {/* // ! Buttons */}
                <div
                  className={`space-y-12 sm:grid sm:grid-flow-row-dense  sm:gap-12 sm:space-y-0 ${
                    hasLeftButton == true ? "grid-cols-1 sm:grid-cols-2" : ""
                  }`}
                >
                  {hasLeftButton == true && (
                    <Button
                      clicked={onLeftBtnClick}
                      iconPos={leftButtonIconPos}
                      btnText={leftButtonText}
                      outline={leftButtonOutline}
                      variant={leftButtonVariant}
                      iconName={leftButtonIconName}
                      iconSize={leftButtonIconSize}
                      iconStrokeWidth={leftButtonIconStroke}
                      iconColor={leftButtonIconColor}
                      fullWidth={leftButtonFullWidth}
                      className={`w-full sm:w-auto ${leftButtonClassName}`}
                      isDisabled={leftButtonIsDisabled}
                    />
                  )}
                  <Button
                    clicked={onRightBtnClick}
                    iconPos={rightButtonIconPos}
                    btnText={rightButtonText}
                    outline={rightButtonOutline}
                    variant={rightButtonVariant}
                    iconName={rightButtonIconName}
                    iconSize={rightButtonIconSize}
                    iconStrokeWidth={rightButtonIconStroke}
                    iconColor={rightButtonIconColor}
                    fullWidth={rightButtonFullWidth}
                    className={`w-full sm:w-auto ${rightButtonClassName}`}
                    isDisabled={rightButtonIsDisabled}
                  />

                  {/* <button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm'
										onClick={() => setOpen(false)}
										ref={cancelButtonRef}
									>
										Cancel
									</button> */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
});
export default Modal;
