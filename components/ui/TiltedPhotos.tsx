import Image from "next/image";

const ANGLES = [-8, 12, 4, -5, 9];

export function TiltedPhotos({
  images,
  alts = [],
}: {
  images: string[];
  alts?: string[];
}) {
  return (
    <div className="relative min-h-[340px] md:min-h-[420px]">
      {images.slice(0, 5).map((src, i) => (
        <div
          key={src + i}
          className="absolute overflow-hidden"
          style={{
            width: "min(360px, 58vw)",
            left: `${8 + (i % 3) * 18}%`,
            top: `${i * 36}px`,
            transform: `rotate(${ANGLES[i % ANGLES.length]}deg)`,
            zIndex: i + 1,
          }}
        >
          <Image
            src={src}
            alt={alts[i] || ""}
            width={720}
            height={480}
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
