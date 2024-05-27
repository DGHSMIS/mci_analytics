import Button from "@library/Button";
import { isEmpty } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "tailwind-cn";
import ButtonIcon from "../ButtonIcon";

export interface MultipleFileUploadProps {
  // multiple?: boolean;
  // textDragDropArea?: string;
  // clearFiles?: boolean;
  btnText?: string;
  getFiles?: (files: File[]) => void;
  onLoadFiles?: File[];
  clearFiles?: boolean;
  allowedFileTypes?: string;
  maxUploadSize?: number;
  previewSize?: "xs" | "sm" | "md" | "lg";
  maxUploadFileNumber?: number;
  isDisabled?: boolean;
  className?: string;
  showCloseButton?: boolean;
  showImageNumber?: boolean;
}

/**
 * Label Component
 *
 * @description
 * Company - ARITS Ltd.
/**
/**
 * Interface for the props of a multiple file upload component.
 * @interface MultipleFileUploadProps
 * @property {string} [btnText] - The text to display on the upload button.
 * @property {(files: File[]) => void} [getFiles] - Callback function to handle the uploaded files.
 * @property {files: File[]} [onLoadFiles] - Pre store files if given.
 * @property {string} [allowedFileTypes] - The allowed file types for upload.
 * @property {boolean} [clearFiles] - Command To Clear All Files
 * @property {boolean} [showCloseButton] - Render Close Button of Image
 * @property {boolean} [showImageNumber] - Render Image Number of Image
 * @property {number} [maxUploadSize] - The maximum upload size in bytes.
 * @property {"sm" | "md" | "lg"} [previewSize] - The size of the file preview.
 * @property {number} [maxUploadFileNumber] - The maximum number of files that can be
*/

const MultipleFileUpload = function ({
  // multiple = false,
  // textDragDropArea = 'Drag & drop files here',
  // clearFiles = false,
  btnText = "Upload files",
  getFiles,
  onLoadFiles = [],
  clearFiles = false,
  allowedFileTypes = "image/png, image/jpeg, image/webp, text/csv",
  previewSize = "sm",
  maxUploadSize = 1,
  maxUploadFileNumber = 10,
  isDisabled,
  className,
  showCloseButton = false,
  showImageNumber = false,
}: MultipleFileUploadProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const [preFiles, setPreFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [filesPath, setFilesPath] = useState<string[]>([]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null
  );

  const [isClearFiles, setIsClearFiles] = useState(false);

  useEffect(() => {
    if (onLoadFiles.length > 0) {
      setPreFiles(onLoadFiles);
    }
  }, [onLoadFiles]);

  useEffect(() => {
    setIsClearFiles(clearFiles);
  }, [clearFiles]);

  useEffect(() => {
    getFiles && getFiles(files);
  }, [files]);

  useEffect(() => {
    if (previewUrl != null && previewUrl.length > 0) {
      setFilesPath((prevData) => [...prevData, previewUrl]);
    }

    setPreviewUrl("");
  }, [previewUrl]);

  useEffect(() => {
    if (isClearFiles) {
      setFiles([]);
      setFilesPath([]);
      setPreviewUrl(null);
      setDraggedImageIndex(null);
    }
  }, [isClearFiles]);

  useEffect(() => {
    if (preFiles.length > 0) {
      onLoadChange(preFiles);
    }
  }, [preFiles]);

  // + Function To Convert Image to Base 64
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64."));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  // + Function To Render On Load Images if Given
  const onLoadChange = (imageFiles: File[]) => {
    imageFiles.forEach((element) => {
      setFiles((prevData) => [...prevData, ...[element]]);
    });

    Promise.all(imageFiles.map((file) => fileToBase64(file)))
      .then((dataArray) => {
        // dataArray.forEach((subElement) => {
        //   setPreviewUrl(subElement)
        // })
        // console.log("Test Image Url", dataArray)
        setFilesPath(dataArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (event: any) => {
    event.preventDefault();
    const fileList = Array.from(event.target.files);

    if (files.length + fileList.length <= maxUploadFileNumber) {
      if (allowedFileTypes.length > 0) {
        const validFilesType = fileList.filter((file: any) =>
          allowedFileTypes.includes(file.type)
        );
        if (validFilesType.length == fileList.length) {
          const validFilesSize = validFilesType.filter(
            (file: any) => file.size <= maxUploadSize * 1000000
          );
          if (validFilesSize.length == validFilesType.length) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewUrl(reader.result as string);
            };

            reader.readAsDataURL(event.target.files[0]);

            event.target.value = "";
            setFiles([...files, ...(validFilesSize as File[])]);
            // getFiles && getFiles([...files, ...(validFilesSize as File[])])
          } else {
            return alert("file size too big");
          }
        } else {
          return alert("Wrong file type");
        }
      }
    } else {
      alert(`You can't select more than ${maxUploadFileNumber} files`);
    }
  };

  const handleClick = (event: any) => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  function handleDelete(_index: any) {
    setFiles((currentValue) => {
      const newVal = currentValue.filter(function (item, index) {
        if (index !== _index) {
          return item;
        }
      });

      return newVal;
    });
  }

  // + Debugging UseEffects
  useEffect(() => {
    if (filesPath.length > 0) {
      console.log("Files Path", filesPath);
    }
  }, [filesPath]);

  useEffect(() => {
    if (preFiles.length > 0) {
      console.log("Pre Files", preFiles);
    }
  }, [preFiles]);

  useEffect(() => {
    if (files.length > 0) {
      console.log("MultiUpload Files", files);
    }
  }, [files]);

  return (
    <div
      className={cn(
        "altd-multiple-file-upload img-uploader-container space-y-20 text-center",
        className
      )}
    >
      <div
        className={cn("mx-auto mt-20 grid grid-cols-4 justify-center gap-8", {
          "max-w-xs": previewSize == "xs",
          "max-w-sm": previewSize == "sm",
          "max-w-md": previewSize == "md",
          "max-w-lg": previewSize == "lg",
        })}
      >
        {!isEmpty(filesPath)
          ? filesPath.map((file, index) => {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <div
                  key={index}
                  className={cn(
                    "relative",
                    index == 0 ? "col-span-4" : "col-span-1"
                  )}
                >
                  {showCloseButton && (
                    <ButtonIcon
                      clicked={() => {
                        const newArrayFiles = files.filter(
                          (_, Localindex) => Localindex !== index
                        );
                        const newArrayFilesPath = filesPath.filter(
                          (_, Localindex) => Localindex !== index
                        );
                        setFiles(newArrayFiles);
                        setFilesPath(newArrayFilesPath);
                      }}
                      iconName="x-close"
                      iconSize={index == 0 ? "20" : "16"}
                      className="group/btn absolute right-4 top-4 inline-flex rounded-full bg-white/50 p-4 shadow-md hover:bg-rose-500"
                      iconClassName="group-hover/btn:stroke-white"
                    />
                  )}
                  {showImageNumber && (
                    <div
                      className={cn(
                        "absolute left-4 top-4 flex aspect-square items-center justify-center rounded-full bg-emerald-500 shadow-md",
                        index == 0 ? "w-28" : "w-24"
                      )}
                    >
                      <span className="font-mono text-sm text-white">
                        {index + 1}
                      </span>
                    </div>
                  )}

                  <img
                    key={index}
                    className="aspect-square w-full border border-slate-200 object-cover"
                    src={file}
                    alt="preview"
                    draggable
                    onDragStart={() => setDraggedImageIndex(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();

                      if (draggedImageIndex !== null) {
                        const newFilesPath = [...filesPath];
                        const newFiles = [...files];

                        newFilesPath[draggedImageIndex] = filesPath[index];
                        newFiles[draggedImageIndex] = files[index];
                        newFilesPath[index] = filesPath[draggedImageIndex];
                        newFiles[index] = files[draggedImageIndex];
                        setFilesPath(newFilesPath);
                        setFiles(newFiles);

                        setDraggedImageIndex(null);
                      }
                    }}
                  />
                </div>
              );
            })
          : ""}
      </div>

      <div className="info-text">
        <small className="block text-slate-700">
          Max file size: {maxUploadSize}Mb
        </small>
        <small className="block text-slate-700">{allowedFileTypes}</small>
      </div>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={(e) => {
          handleChange(e);
        }}
        accept={allowedFileTypes}
        className="hidden"
      />
      <Button
        clicked={handleClick}
        className="formBtnWrapper d-flex justify-content-center"
        variant="primary"
        btnText={btnText}
        size="sm"
        outline={true}
        iconName="upload-01"
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default MultipleFileUpload;
