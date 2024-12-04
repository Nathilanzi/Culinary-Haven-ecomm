"use client";

import { useState } from "react";
import Image from "next/image";
import ArrowButtons from "./ArrowButtons";

/**
 * ImageSelector component that allows users to view and select images from a gallery.
 * Displays a main selected image and thumbnails that can be clicked to update the main image.
 *
 * @param {Object} props - The component props.
 * @param {string[]} props.images - An array of image URLs to display in the selector.
 *
 * @returns {JSX.Element} The rendered ImageSelector component.
 */
export default function ImageSelector({ images }) {
  // State hook to track the currently selected image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define fixed size for the images
  const fixedImageSize = { width: 500, height: 500 };

  // Handlers for arrow buttons
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="relative">
      {/* Main Selected Image */}
      <div
        className="px-4 py-12 rounded-xl flex items-center justify-center bg-gray-100"
        style={{ height: "500px" }} // Adjust height as needed
      >
        <Image
          src={images[currentIndex]}
          alt="Selected"
          width={fixedImageSize.width}
          height={fixedImageSize.height}
          className="w-full h-full rounded object-cover"
        />
      </div>

      {/* Arrow Buttons */}
      {images.length > 1 && (
        <div className="group">
          <ArrowButtons
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
            className="border border-red-600"
          />
        </div>
      )}

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-4 mx-auto">
          {images.map((img, index) => (
            <div
              key={index}
              className={`w-[100px] h-[100px] flex items-center justify-center bg-gray-200 rounded-xl p-2 cursor-pointer ${
                currentIndex === index ? "ring-2 ring-teal-500" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
