import { memo } from "react";
import Button from "./Button";
import ModalBlank from "./ModalBlank";

export interface ModalAlertProps {
  showCrossButton?: boolean;
  modalSize?: "sm" | "md" | "lg" | "full";
  modalAlign?: "center" | "top";
  modalBtnRight?:
    | "link"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";
  onCloseModal?: Function;
  title?: string;
  successText?: string;
  onSuccessClick?: Function;
  cancelText?: string;
  onCancelClick?: Function;
}

/**
 * Modal Alert Component
 *
 * @description
 * Company - ARITS Ltd.
 * This component is used to render a pop up alter for user action
 * Developed using the Untitled UI Icon library.
 * @param {boolean} [props.showCrossButton=true] - Whether to show the cross button in the modal.
 * @param {string} [props.modalSize="sm"] - The size of the modal: 'sm' | 'md' | 'lg' | 'full'
 * @param {string} [props.modalAlign="center"] - The alignment of the modal.
 * @property {string} [proms.modalBtnRight] - The style of the button on the right side of the modal. Can be "link", "primary",
 * @param {Function} onCloseModal — Parent controls what to do with onClose()
 * @param {string} [props.title="Do you want to continue?"] - The title of the modal.
 * @param {string} [props.successText="Send"] - Set the message when successful.
 * @param {Function} onSuccessClick — Success button click event
 * @param {string} cancelText — Cancel button text
 * @param {Function} onCancelClick — Cancel button click event
 * @param {Object} props - The component props.
 */

const ModalAlert = memo(function ModalAlert({
  showCrossButton = true,
  modalSize = "sm",
  modalAlign = "center",
  modalBtnRight,
  title = "Do you want to continue?",
  successText = "Send",
  cancelText = "Cancel",
  onSuccessClick,
  onCancelClick,
}: ModalAlertProps) {
  return (
    <ModalBlank
      containerClassName="modal-alert"
      showCrossButton={showCrossButton}
      modalSize={modalSize}
      modalAlign={modalAlign}
      onCloseModal={(e: any) => {
        if (onCancelClick) {
          onCancelClick();
        }
      }}
    >
      <h5 className="!mb-28 text-center">{title}</h5>
      <div className="grid grid-cols-2 gap-x-20">
        <Button
          btnText={cancelText}
          variant="neutral"
          textClassName="text-slate-500"
          fullWidth
          clicked={(e: any) => {
            if (onCancelClick) {
              onCancelClick();
            }
          }}
        />
        <Button
          btnText={successText}
          variant={modalBtnRight}
          fullWidth
          clicked={(e: any) => {
            if (onSuccessClick) {
              onSuccessClick();
            }
          }}
        />
      </div>
    </ModalBlank>
  );
});

export default ModalAlert;
