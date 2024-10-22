import { useState } from "react";
import Image from "next/image";

const Gallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-sm">
      <div className="w-full h-[22rem] relative">
        {images.map((image, index) => (
          <div key={index} className={index === currentIndex ? "block" : "hidden"}>
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              width={300}
              height={300}
              className="w-full h-[20rem] object-contain rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;