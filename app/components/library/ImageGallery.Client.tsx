import ButtonIcon from "@library/ButtonIcon";
import React, { useEffect, useState } from "react";

export interface ImageGalleryProps {
  images: string[];
  activeImage?: (e: { imgPath: string; imgIndex: number }) => void;
  imagePerRow?: number;
  previewSize?: number;
}

/**
 * A Image Gallery component that displays image as grid layout and also shows preview.
 * This component also has the option to switch the previous or next Image 
 * 
 * @param {string[]} images this parameter takes the path as array of string from parent 
 * @param {(e: { imgPath: string; imgIndex: number }) => void} [activeImage] This props returns the path name and the index value of the array to the parent 
 * @param {number} [imagePerRow] Number of image per row that will render into the gallery component
 * @param {number} [previewSize] Size of preview Maximum value works till 700
 
 *
 * @author ARITS Ltd.
 * @description
 * Company - ARITS Ltd. 24th August 2023.
 *
 */

function ImageGallery({
  images,
  activeImage,
  imagePerRow = 3,
  previewSize = 480,
}: ImageGalleryProps) {
  const [modalImage, setModalImage] = useState("");
  const [modalImageIndex, setModalImageIndex] = useState<number>();
  const [modalVisible, setModalVisible] = useState(false);
  const [nextButtonDisable, setNextButtonDisable] = useState<boolean>();
  const [prevButtonDisable, setPrevButtonDisable] = useState<boolean>();

  const openModal = (image: any, index: any) => {
    setModalVisible(true);
    setModalImageIndex(index);
  };

  useEffect(() => {
    images.map((img, index) => {
      if (index == modalImageIndex) {
        setModalImage(img);
        if (activeImage) {
          activeImage({ imgPath: img, imgIndex: index });
        }
      }
    });
  }, [modalImageIndex]);

  useEffect(() => {
    if (modalImageIndex == 0) {
      setPrevButtonDisable(true);
      setNextButtonDisable(false);
    }
    if (
      modalImageIndex &&
      modalImageIndex > 0 &&
      modalImageIndex < images.length - 1
    ) {
      setPrevButtonDisable(false);
      setNextButtonDisable(false);
    }
    if (
      modalImageIndex &&
      modalImageIndex > 0 &&
      modalImageIndex == images.length - 1
    ) {
      setPrevButtonDisable(false);
      setNextButtonDisable(true);
    }
  }, [modalImageIndex]);

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <div className="flex h-min w-max items-center justify-center bg-gray-100 p-8">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${imagePerRow}, minmax(0, 1fr))`,
          /* Add any other styles you need */
        }}
        className="gallery  gap-8"
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={index}
              className="object-fit flex h-[100px] w-[100px] items-center justify-center border outline-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/click-events-have-key-events, jsx-a11y/img-redundant-alt, jsx-a11y/no-noninteractive-element-interactions  */}
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                className="gallery-image max-h-full cursor-pointer "
                onClick={() => openModal(image, index)}
              />
            </div>
          ))
        ) : (
          <div className="flex h-[100px] w-full items-center justify-items-center bg-slate-100">
            <span className="justify-self-center font-normal text-gray-500">
              No data found
            </span>
          </div>
        )}
      </div>
      {modalVisible && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            style={{ width: previewSize }}
            className="modal-content relative flex aspect-square  items-center rounded-lg bg-slate-500 object-cover p-4"
          >
            <div className="absolute right-12 top-12 rounded-full p-4 text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-500">
              <ButtonIcon
                iconName="x-close"
                className="!flex !aspect-square"
                iconSize="24"
                clicked={() => {
                  setModalVisible(false);
                }}
              />
            </div>
            <div className="absolute top-[50%] w-full ">
              <div className="flex w-full justify-between">
                <ButtonIcon
                  isDisabled={
                    prevButtonDisable ? prevButtonDisable : prevButtonDisable
                  }
                  iconName="sld-skip-back"
                  className="!flex !aspect-square rounded-full p-4 text-slate-400 transition-colors hover:bg-rose-100 hover:text-slate-600"
                  iconSize="24"
                  clicked={() => {
                    setModalImageIndex((prev: any) => {
                      if (prev == 0) {
                        return 0;
                      } else {
                        return prev - 1;
                      }
                    });
                  }}
                />
                <ButtonIcon
                  isDisabled={
                    nextButtonDisable ? nextButtonDisable : nextButtonDisable
                  }
                  iconName="sld-skip-forward"
                  className="mr-8 !flex !aspect-square rounded-full p-4 text-slate-400 transition-colors hover:bg-rose-100 hover:text-slate-600"
                  iconSize="24"
                  clicked={() => {
                    setModalImageIndex((prev: any) => {
                      if (prev + 1 < images.length) {
                        return prev + 1;
                      } else {
                        return prev;
                      }
                    });
                  }}
                />
              </div>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/click-events-have-key-events, jsx-a11y/img-redundant-alt, jsx-a11y/no-noninteractive-element-interactions
             */}
            <img
              src={modalImage}
              alt="Modal Image"
              className="modal-image mx-auto max-h-full "
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
