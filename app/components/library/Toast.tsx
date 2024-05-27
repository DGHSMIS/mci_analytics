"use client";

import ButtonIcon from "@components/library/ButtonIcon";
import Icon, { IconProps } from "@components/library/Icon";
import { memo, useEffect } from "react";
import { cn } from "tailwind-cn";

interface ToastParams {
  message?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  closeButton?: false;
  iconName?: IconProps["iconName"];
  iconColor?: string;
  autoClose?: number | false;
  onClose: () => void;
  position?: "top-right" | "top-left" | "bottom-left" | "bottom-right";
  id?: string;
  className?: string;
}

export type ToastProps = ToastParams &
  (
    | { message?: never; children: React.ReactNode }
    | { message: string; children?: never }
  );

/**
 * Toast Component
 *
 * @param {string} message - The message to be displayed in the toast
 * @param {React.ReactNode} children - Any React nodes to be displayed in the toast instead of the message
 * @param {string} className - Additional classes to be applied to the toast container element
 * @param {'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'} variant - The variant of toast to display, the options are `primary`, `secondary`, `success`, `error`, `info` (default), `warning`
 * @param {boolean} closeButton - Whether to display a close button for the toast
 * @param {string} iconName - The name of the Feather icon to display in the toast
 * @param {string} iconColor - The color of the Feather icon to display in the toast
 * @param {number | false} autoClose - The duration for which the toast should be visible in milliseconds (default is 3500ms), or `false` to disable auto-closing
 * @param {() => void} onClose - A function to be called when the toast is closed
 * @param {'top-left' | 'bottom-left' | 'bottom-right'} position - The position of the toast on the screen, the options are `top-left`, `bottom-left`, `bottom-right`; default is `top-right` and is excluded from the type definition
 * @param {string} id - The ID of the toast element
 *
 * @description
 * Company - ARITS Ltd. 4th Jan 2023.
 * This component is used to render a Toast message.
 * Developed using icon sprite file: untitled-ui-sprite.svg.
 */

const Toast = memo(function Toast({
  message,
  children = undefined,
  variant = "info",
  closeButton = undefined,
  iconName = "",
  iconColor = "currentColor",
  onClose,
  autoClose = undefined,
  position = "top-right",
  id = undefined,
  className = "",
}: ToastProps) {
  useEffect(() => {
    if (autoClose === false) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, autoClose ?? 3500);
    return () => clearTimeout(timer);
  }, [autoClose, onClose]);

  return (
    <>
      <div
        id={id}
        style={{ opacity: 1, transform: "translateY(0)" }}
        className={cn(
          "absolute z-10 m-8 flex w-full max-w-md items-center space-x-4 rounded-lg border p-12 shadow-md transition-opacity delay-[3s] duration-[3s] ease-in-out dark:bg-slate-800 dark:text-slate-400",
          //=> Position
          {
            "left-0 top-0": position === "top-left",
            "right-0 top-0": position === "top-right",
            "bottom-0 left-0": position === "bottom-left",
            "bottom-0 right-0": position === "bottom-right",
          },
          //=> Variants
          {
            "border-primary-500 bg-primary-50 text-primary-900":
              variant === "primary",
            "border-secondary-500 bg-secondary-50 text-secondary-900":
              variant === "secondary",
            "border-teal-500 bg-teal-50 text-teal-900": variant === "success",
            "border-sky-500 bg-sky-100 text-sky-900": variant === "info",
            "border-rose-500 bg-rose-100 text-rose-900": variant === "error",
            "border-amber-500 bg-amber-50 text-amber-900":
              variant === "warning",
          },
          className
        )}
        role="alert"
      >
        <div className="flex w-full space-x-8">
          <>
            {children ?? (
              <>
                {/* Left Icon */}
                <div className="flex">
                  <Icon
                    iconName={
                      iconName ??
                      (variant === "success"
                        ? "check-circle"
                        : variant === "error"
                        ? "alert-triangle"
                        : variant === "info"
                        ? "alert-circle"
                        : "alert-circle")
                    }
                    iconColor={iconColor}
                    iconSize="20"
                    className="pointer-events-none my-auto"
                  />
                </div>
                {/* Message */}
                <div className="inline-flex shrink items-center whitespace-pre-wrap text-sm font-normal">
                  {message}
                </div>
              </>
            )}

            {/* Close Button */}
            {closeButton != false && (
              <div className="!ml-auto">
                <ButtonIcon
                  // className={`rounded-md hover:bg-slate-200`}
                  clicked={() => {
                    onClose?.();
                  }}
                  iconName="x-close"
                  iconColor={iconColor}
                  className="!p-4"
                />
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
});

export default Toast;
