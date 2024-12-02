"use client";

import { useState } from "react";
import Image from "next/image";

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
  // State hook to track the currently selected image
  const [selectedImage, setSelectedImage] = useState(images[0]); // Default to the first image

  // Define fixed size for the images
  const fixedImageSize = { width: 500, height: 500 };

  return (
    <div>
      {/* Main Selected Image */}
      <div className="px-4 py-12 rounded-xl">
        <Image
          src={selectedImage}
          alt="Recipe"
          width={fixedImageSize.width}
          height={fixedImageSize.height}
          className="w-9/12 rounded object-cover mx-auto"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-4 mx-auto">
          {images.map((img, index) => (
            <div
              key={index}
              className={`w-[100px] h-20 flex items-center justify-center bg-gray-200 rounded-xl p-4 cursor-pointer ${
                selectedImage === img ? "ring-2 ring-teal-500" : ""
              }`}
              onClick={() => setSelectedImage(img)} // Clicking changes main image
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="w-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
