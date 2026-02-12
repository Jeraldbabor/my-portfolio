"use client";

import Image from "next/image";
import { useState } from "react";

interface HoverProfileImageProps {
  src: string;
  hoverSrc: string;
  alt: string;
}

export function HoverProfileImage({ src, hoverSrc, alt }: HoverProfileImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={src}
        alt={alt}
        width={140}
        height={140}
        className={`rounded-full object-cover w-full h-full ring-1 ring-zinc-200 dark:ring-zinc-700 absolute inset-0 transition-opacity duration-300 ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
        priority
      />
      <Image
        src={hoverSrc}
        alt={alt}
        width={140}
        height={140}
        className={`rounded-full object-cover w-full h-full ring-1 ring-zinc-200 dark:ring-zinc-700 absolute inset-0 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        priority
      />
    </div>
  );
}
