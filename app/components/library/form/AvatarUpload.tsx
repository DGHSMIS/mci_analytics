"use client";

import Label from "@components/library/form/Label";
import Image from "next/image";
import { ChangeEvent, memo, useEffect, useRef, useState } from "react";
import { cn } from "tailwind-cn";
import Icon from "../Icon";

export interface AvatarUploadProps {
  onClick?: (file: File) => void;
  onLoadFile?: File | null;
  label?: string;
  accept?: string;
  multiple?: boolean;
  fallbackImage?: React.ReactNode;
  buttonText?: string;
  containerClassName?: string;
}

/**
 * File Upload With Preview Component
 *
 * @description
 * Company - ARITS Ltd. 18th Jan 2023.
 * This component is used to render a File Upload With Preview. The preview of the file can be controlled from the parent component. Example: if the file type is not image there can be a different preview.
 *
 * @param {void} onClick - Takes a string and triggers a function to the parent when file(s) is uploaded - label - The label of the dropdown
 * @param {string} placeholder - The placeholder of the image
 * @param {string} label - label for the file upload field
 * @param {string} accept - Set the file types allowed. Example formats: image/png, image/jpeg, image/webp
 * @param {boolean} multiple - Sets whether multiple file uploads are allowed
 * @param {string} imagePath - Sets default image url for the preview
 * @param {File} onLoadFile - Pre store file if given

 * => Please complete this component @soumya [className / multiple]
 *
 */

export const AvatarUpload = memo(function AvatarUpload({
  onClick,
  label = "",
  accept = "image/png, image/jpeg, image/webp",
  multiple = false,
  fallbackImage = (
    <svg
      className="h-full w-full text-gray-300"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  buttonText = "Change",
  containerClassName,
  onLoadFile = null,
}: AvatarUploadProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [fileURL, setFileURL] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const validTypes = accept.includes(event.target.files[0].type);

      if (validTypes) {
        setFileURL(URL.createObjectURL(event.target.files[0]));
        setFileName(event.target.files[0].name);

        console.log("FILE URL VALUE IS");
        console.log(fileURL.toString());
        fileURL.toString().split(/[#?]/)[0].split(".").pop()?.trim();

        console.log(fileName);
        console.log(event.target.files[0].type);

        if (onClick) {
          onClick(event.target.files[0]);
        }

        const i = event.target.files[0];
        const body = new FormData();

        body.append("image", i);
      } else {
        alert("Invalid File Type!");
      }
    }
  };

  const handleClick = (event: any) => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  useEffect(() => {
    if (onLoadFile != null) {
      setFileURL(URL.createObjectURL(onLoadFile));
      setFileName(onLoadFile.name);
    }
  }, [onLoadFile]);

  return (
    <>
      <div
        className={cn(
          "flex flex-col space-y-8 rounded border border-dashed border-slate-300 bg-slate-50 p-20 text-center sm:items-center",
          containerClassName
        )}
      >
        {label.length > 0 && (
          <Label text={label} size="text-xs" className="mb-0" />
        )}

        {!fileName ? (
          <div
            onClick={handleClick}
            className="group/fallback relative mx-auto h-64 w-64 overflow-hidden rounded-full border bg-slate-100 hover:cursor-pointer"
          >
            {fallbackImage}
            <div className="absolute inset-0 flex h-full w-full items-center justify-center group-hover/fallback:bg-slate-800/10">
              <Icon
                iconName="camera-02"
                className="relative top-12 stroke-slate-500 group-hover/fallback:hidden"
              />
              <Icon
                variant="solid"
                iconName="camera-02"
                className="relative top-12 hidden fill-slate-500 group-hover/fallback:block"
              />
            </div>
          </div>
        ) : (
          <div
            className="group/avatar relative inline-flex justify-center overflow-hidden rounded-full border hover:cursor-pointer"
            onClick={handleClick}
          >
            <Image
              className="aspect-square object-cover object-center text-slate-300 group-hover/avatar:brightness-75"
              src={fileURL}
              alt={fileName}
              width={"64"}
              height={"64"}
            />
            <p
              className="absolute inset-0 hidden h-full w-full items-end justify-center pb-4 text-xs text-white group-hover/avatar:flex"
              style={{ textShadow: "0 -2px 8px #000" }}
            >
              Edit
            </p>
          </div>
        )}
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={(e) => {
            handleChange(e);
          }}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />
        {/* <Button clicked={handleClick} type="button" size="sm" btnText={buttonText} outline /> */}
      </div>
    </>
  );
});
