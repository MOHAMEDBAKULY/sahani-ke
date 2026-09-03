import type { Locale, PortableBlock } from "@/lib/types";

export function PortableBody({
  blocks,
  locale,
}: {
  blocks: PortableBlock[];
  locale?: Locale;
}) {
  return (
    <div className="flex max-w-3xl flex-col gap-6 text-[16px] leading-[1.2] normal-case tracking-[-0.01em]">
      {blocks.map((block, i) => {
        const text = block.children.map((c) => c.text).join("");
        if (block.style === "h2") {
          return (
            <h2 key={i} className="font-display mt-4 text-[40px] uppercase leading-[0.9]">
              {text}
            </h2>
          );
        }
        if (block.style === "blockquote") {
          return (
            <blockquote key={i} className="border-s-2 border-current ps-4 font-times text-[16px] not-italic">
              {text}
            </blockquote>
          );
        }
        return <p key={i}>{text}</p>;
      })}
    </div>
  );
}
