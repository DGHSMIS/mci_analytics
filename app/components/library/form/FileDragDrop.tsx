"use client";

import Button from "@library/Button";
import ButtonIcon from "@library/ButtonIcon";
import Icon from "@library/Icon";
import Toast, { ToastProps } from "@library/Toast";
import variables from "@variables/variables.module.scss";
import { isEmpty } from "lodash";
import React, { memo, useEffect, useRef, useState } from "react";
import { cn } from "tailwind-cn";
import twcolors from "tailwindcss/colors";

export interface FileDragDropProps {
  textDragDropArea?: string;
  btnText?: string;
  getFiles?: (files: File[]) => void;
  allowedFileTypes?: string;
  multiple?: boolean;
  hasHintText?: boolean;
  hintText?: string;
  maxUploadSize?: number;
  maxUploadFileNumber?: number;
  className?: string;
  clearFiles?: boolean;
  // onCross: Function;
}

/**
 * File Drag and Drop Component
 *
 * @description
 * Company - ARITS Ltd. 16 Feb 2023.
 * This component is used to render a File Drag and Drop Component. Takes either multiple files or a single file. The component behaves both like drag and drop and file upload.
 *
 * @param {string} textDragDropArea Label for the upload text link
 * @param {void} getFiles Function that gets the files from the component to the parent component
 * @param {string} allowedFileTypes Set the file types allowed. Example formats: image/png, image/jpeg, image/webp,text/plain(file-type: .txt),text/csv (file-type: .csv),application/pdf (file-type: .pdf)
 * @param {boolean} multiple Sets whether multiple file uploads are allowed
 * @param {number} maxUploadSize Sets the maximum upload size in megabytes - Instance Values -10, 20 etc
 * @param {number} maxUploadFileNumber Sets the maximum number of file can be selected - Instance Values 1, 2, 3 etc
 */

const FileDragDrop = memo(function FileDragDrop({
  textDragDropArea = "Drag & drop files here",
  btnText = "Upload a file",
  getFiles,
  allowedFileTypes = "image/png, image/jpeg, image/webp, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  multiple = false,
  maxUploadSize = 1,
  maxUploadFileNumber = 10,
  hasHintText = false,
  hintText = ``,
  clearFiles = false,
  className,
}: FileDragDropProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showAlertTost, setShowAlertToast] = useState(false);
  const [alertToastValue, setAlertToastValue] = useState<ToastProps>({
    message: "",
    variant: "error",
    autoClose: 6000,
    onClose: () => {
      setShowAlertToast(false);
    },
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const fileList = Array.from(event.dataTransfer.files);

    if (multiple == true) {
      if (files.length + fileList.length <= maxUploadFileNumber) {
        if (allowedFileTypes.length > 0) {
          const validFilesType = fileList.filter((file) =>
            allowedFileTypes.includes(file.type)
          );
          if (validFilesType.length == fileList.length) {
            const validFilesSize = validFilesType.filter(
              (file) => file.size <= maxUploadSize * 1000000
            );
            if (validFilesSize.length == validFilesType.length) {
              setFiles([...files, ...validFilesSize]);
            } else {
              setAlertToastValue({
                message: "File size too big",
                variant: "error",
                autoClose: 6000,

                onClose: () => {
                  setShowAlertToast(false);
                },
              });
              setShowAlertToast(true);
              // return alert("file size too big");
            }
          } else {
            setAlertToastValue({
              message: "Wrong file type",
              variant: "error",
              autoClose: 6000,
              onClose: () => {
                setShowAlertToast(false);
              },
            });
            setShowAlertToast(true);

            // return alert("Wrong file type");
          }
        }
      } else {
        setAlertToastValue({
          message: `You can't select more than ${maxUploadFileNumber} files`,
          variant: "error",
          autoClose: 6000,

          onClose: () => {
            setShowAlertToast(false);
          },
        });
        setShowAlertToast(true);

        // alert(`You can't select more than ${maxUploadFileNumber} files`);
      }
    } else {
      if (files.length + fileList.length > 1) {
        setAlertToastValue({
          message: "Multiple files selection not allowed",
          variant: "error",
          autoClose: 6000,
          onClose: () => {
            setShowAlertToast(false);
          },
        });
        setShowAlertToast(true);

        // alert("Multiple files selection not allowed");
      } else {
        if (allowedFileTypes.length > 0) {
          const validFilesType = fileList.filter((file) =>
            allowedFileTypes.includes(file.type)
          );
          if (validFilesType.length == fileList.length) {
            const validFilesSize = validFilesType.filter(
              (file) => file.size <= maxUploadSize * 1000000
            );
            if (validFilesSize.length == validFilesType.length) {
              setFiles([...files, ...validFilesSize]);
            } else {
              setAlertToastValue({
                message: "File size too big",
                variant: "error",
                autoClose: 6000,
                onClose: () => {
                  setShowAlertToast(false);
                },
              });
              setShowAlertToast(true);

              // return alert("file size too big");
            }
          } else {
            setAlertToastValue({
              message: "Wrong file type",
              variant: "error",
              autoClose: 6000,
              onClose: () => {
                setShowAlertToast(false);
              },
            });
            setShowAlertToast(true);

            // return alert("Wrong file type");
          }
        }
      }
    }
  };
  useEffect(() => {
    console.log(files);
    setFiles(files);
    console.log("files");
    console.log(files);
    getFiles && getFiles(files);
  }, [files]);

  useEffect(() => {
    if (clearFiles) {
      setFiles([]);
    }
  }, [clearFiles]);

  const handleChange = (event: any) => {
    event.preventDefault();
    const fileList = Array.from(event.target.files);

    event.target.value = "";

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
            setFiles([...files, ...(validFilesSize as File[])]);
          } else {
            setAlertToastValue({
              message: "file size too big",
              variant: "error",
              autoClose: 6000,
              onClose: () => {
                setShowAlertToast(false);
              },
            });
            setShowAlertToast(true);

            // return alert("file size too big");
          }
        } else {
          setAlertToastValue({
            message: "Wrong file type",
            variant: "error",
            autoClose: 6000,
            onClose: () => {
              setShowAlertToast(false);
            },
          });
          setShowAlertToast(true);

          // return alert("Wrong file type");
        }
      }
    } else {
      setAlertToastValue({
        message: `You can't select more than ${maxUploadFileNumber} files`,
        variant: "error",
        autoClose: 6000,
        onClose: () => {
          setShowAlertToast(false);
        },
      });
      setShowAlertToast(true);

      // alert(`You can't select more than ${maxUploadFileNumber} files`);
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

  return (
    <div className="altd-file-drag-drop">
      {showAlertTost && <Toast {...alertToastValue} />}

      <div
        className={cn(
          "dropzone flex w-full flex-col items-center gap-20 rounded border-2 border-dashed border-slate-200 bg-slate-100 px-56 py-48 text-slate-400 md:px-156",
          dragging && "dragging",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Icon
          iconName="upload-cloud-01"
          iconColor={twcolors.slate[400]}
          iconSize="32px"
          iconStrokeWidth="1.5"
        />
        <span className="text-center text-xl font-medium">
          {textDragDropArea}
        </span>
        <span className="text-xl font-medium">or</span>

        {multiple && (
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            accept={allowedFileTypes}
            multiple
            className="hidden"
          />
        )}
        {!multiple && (
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={(e) => {
              handleChange(e);
            }}
            accept={allowedFileTypes}
            className="hidden"
          />
        )}

        {multiple == true && files.length < maxUploadFileNumber ? (
          <Button clicked={handleClick} btnText={btnText} outline size="sm" />
        ) : files.length < 1 ? (
          <Button clicked={handleClick} btnText={btnText} outline size="sm" />
        ) : (
          <Button
            clicked={handleClick}
            btnText={btnText}
            isDisabled={true}
            outline
            size="sm"
          />
        )}
        {hasHintText && (
          <p className="whitespace-pre-line text-sm font-medium">{hintText}</p>
        )}
      </div>

      {!isEmpty(files)
        ? files.map((file, index) => {
            return (
              <div
                id={`uploadFile${index}`}
                key={index}
                className="mt-12 flex justify-between bg-slate-100 px-16 py-12"
              >
                <div className="flex space-x-10">
                  <div className="rounded-full">
                    <Icon iconName="file-02" iconColor={variables.gray600} />
                  </div>
                  <div className="flex flex-col items-start justify-center space-y-4 font-medium text-slate-800">
                    <span>{file.name}</span>
                    {/* //=> NEED TO CREATE THIS FUNCTIONALITY ///// */}
                    {/* <ProgressBar
                      customClass="h-10"
                      onProgress={function (e: any): void {
                        throw new Error("Function not implemented.");
                      }}
                    /> */}
                  </div>
                </div>

                <div className="my-auto rounded-full">
                  <ButtonIcon
                    iconName="x-close"
                    clicked={() => {
                      handleDelete(index);
                    }}
                  />
                </div>
              </div>
            );
          })
        : ""}
    </div>
  );
});

export default FileDragDrop;
