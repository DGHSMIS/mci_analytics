import Button from "@components/library/Button";
import React, { memo, useState } from "react";
import { cn } from "tailwind-cn";
import { useFileUpload } from "use-file-upload";

export interface SingleFileUploadProps {
  previewFile?: string;
  minWidth?: number;
  minHeight?: number;
  btnText?: string;
  maxFileSizeInMb?: number;
  fileTypeText?: string;
  fileType?: string;
  previewSize?: string;
  sizeLimitAlert?: string;
  dimensionMessageAlert?: string;
  clicked: object;
}

/**
       * SingleFileUpload Component
       * @description
       * Company - ARITS Ltd. 12th Jan 2022.
       * This component is used to render SingleFileUpload element in the app.
        @param {string} previewFile If the image already exists, this param shows the preview
        @param {number} minWidth Define the minimum width of the image
        @param {number} minHeight Define the minimum height of the image
        @param {string} btnText Set the btnText for the upload button
        @param {number} maxFileSizeInMb Set the max file upload size in megabytes
        @param {string} fileTypeText Set the description for allowed file types
        @param {string} fileType Set the allowed file types
        @param {string} previewSize Set the image preview size
        @param {string} sizeLimitAlert Set the alert message when the upload image size doesn't match the set range
        @param {string} dimensionMessageAlert Set the alert message when the upload image dimension doesn't match the set range
        @param {SingleFileUploadProps[]} The items to choose in the SingleFileUpload component
        @param {FormItemResponseProps} clicked The callback function to return the value of the SingleFileUpload component to the parent
      */

const SingleFileUpload = memo(function SingleFileUpload({
  previewFile = "",
  minWidth = 200,
  minHeight = 200,
  btnText = "Upload Image",
  maxFileSizeInMb = 2,
  fileTypeText = "Allowed image types: .png, .jpeg, .jpg",
  fileType = "image/png, image/jpeg, image/jpg",
  previewSize = "lg",
  sizeLimitAlert = "Image size must be less than " + maxFileSizeInMb + "Mb.",
  dimensionMessageAlert = "Minimum image dimensions must be 200px x 200px.",
  clicked,
}: any) {
  const maxFileSizeInMB = maxFileSizeInMb;
  const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;
  const [files, selectFiles] = useFileUpload();
  const [fileSize, setFileSize] = useState(maxFileSizeInMB + 1);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileSrc, setFileSrc] = useState(previewFile);

  return (
    <div className="altd-single-file-upload text-center">
      {fileSize <= maxFileSizeInBytes && files && fileSelected ? (
        fileType == "image/png, image/jpeg, image/jpg" && (
          <img
            className={cn("mx-auto aspect-square object-cover", {
              "w-80": previewSize == "xs",
              "w-104": previewSize == "sm",
              "w-220": previewSize == "md",
              "w-auto": previewSize == "lg",
            })}
            src={fileSrc}
            alt="preview"
          />
        )
      ) : previewFile ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={cn("mx-auto object-cover", {
            "w-80": previewSize == "xs",
            "w-104": previewSize == "sm",
            "w-220": previewSize == "md",
            "w-auto": previewSize == "lg",
          })}
          src={previewFile}
          alt="preview"
        />
      ) : (
        // Placeholder Image
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="mx-auto rounded opacity-50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="120" height="120" fill="#EFF1F3" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M33.2503 38.4816C33.2603 37.0472 34.4199 35.8864 35.8543 35.875H83.1463C84.5848 35.875 85.7503 37.0431 85.7503 38.4816V80.5184C85.7403 81.9528 84.5807 83.1136 83.1463 83.125H35.8543C34.4158 83.1236 33.2503 81.957 33.2503 80.5184V38.4816ZM80.5006 41.1251H38.5006V77.8751L62.8921 53.4783C63.9172 52.4536 65.5788 52.4536 66.6039 53.4783L80.5006 67.4013V41.1251ZM43.75 51.6249C43.75 54.5244 46.1005 56.8749 49 56.8749C51.8995 56.8749 54.25 54.5244 54.25 51.6249C54.25 48.7254 51.8995 46.3749 49 46.3749C46.1005 46.3749 43.75 48.7254 43.75 51.6249Z"
            fill="#687787"
          />
        </svg>
      )}
      <div className="mt-12">
        <small className="block text-slate-700">
          Max file size: {maxFileSizeInMB}Mb
        </small>
        <small className="block text-slate-700">{fileTypeText}</small>
      </div>
      <Button
        isDisabled={false}
        className="formBtnWrapper d-flex justify-content-center mt-20"
        variant="primary"
        btnText={btnText}
        size="sm"
        outline={true}
        iconName="upload-01"
        clicked={() => {
          selectFiles(
            { accept: fileType, multiple: false },
            /* @ts-ignore */
            ({ name, size, source, file }) => {
              /* Checking Image Height and Width */
              if (fileType == "image/png, image/jpeg, image/jpg") {
                let img = new Image();
                img.src = window.URL.createObjectURL(file);
                const blob = new Blob([file], {
                  type: file.type,
                });
                const newlyUploadedImageURL = URL.createObjectURL(blob);
                setFileSrc(newlyUploadedImageURL);
                img.onload = () => {
                  if (img.width >= minWidth && img.height >= minHeight) {
                    setFileSelected(true);
                    setFileSize(size);
                    if (size <= maxFileSizeInBytes) {
                      clicked(file);
                    } else {
                      alert(sizeLimitAlert);
                      clicked(undefined);
                    }
                  } else {
                    alert(dimensionMessageAlert);
                    previewFile = "";
                    clicked(undefined);
                    setFileSelected(false);
                  }
                };
              } else {
                setFileSize(size);
                if (size <= maxFileSizeInBytes) {
                  clicked(file);
                  setFileSelected(true);
                } else {
                  clicked(undefined);
                  setFileSelected(false);
                }
              }
            }
          );
        }}
      />
    </div>
  );
});
export default SingleFileUpload;
