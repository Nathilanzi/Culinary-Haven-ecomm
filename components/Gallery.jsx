"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ArrowButtons from "./ArrowButtons";

const Gallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => setAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const nextImage = () => {
    if (animation) return;
    setDirection(1);
    setAnimation(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    if (animation) return;
    setDirection(-1);
    setAnimation(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative overflow-hidden shadow-md group">
      {/* Set the height for uniformity */}
      <div className="w-full h-[15rem]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-all duration-500 ease-in-out ${
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index === (currentIndex - 1 + images.length) % images.length
                ? "opacity-0 -translate-x-full"
                : index === (currentIndex + 1) % images.length
                ? "opacity-0 translate-x-full"
                : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              width={400}
              height={300}
              className="w-full h-full object-cover object-center" // Updated to ensure all images fit uniformly
            />
          </div>
        ))}
      </div>

      {/* Image navigation controls */}
      {images.length > 1 && (
        <div className="w-full flex justify-center py-4">
          <ArrowButtons
            onPrevClick={prevImage}
            onNextClick={nextImage}
            disabled={animation}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
