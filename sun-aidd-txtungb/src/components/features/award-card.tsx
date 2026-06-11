import type { Award } from "@/lib/types";
import Link from "next/link";

interface AwardCardProps {
  award: Award;
  detailLabel: string;
}

export function AwardCard({ award, detailLabel }: AwardCardProps) {
  return (
    <div className="flex flex-col bg-[#101417] border border-[#2e3940] rounded-xl overflow-hidden hover:border-[#998c5f] transition-colors duration-200">
      <div className="h-48 bg-[#00070c] flex items-center justify-center">
        {award.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={award.image_url}
            alt={award.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl text-[#998c5f] opacity-30">★</span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-[#ffea9e] font-semibold text-lg mb-2">
          {award.title}
        </h3>
        <p className="text-[#999999] text-sm leading-relaxed flex-1">
          {award.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-[#998c5f]">{award.value}</span>
          <Link
            href={`/awards#${award.slug}`}
            className="text-xs text-[#ffea9e] hover:underline"
          >
            {detailLabel} →
          </Link>
        </div>
      </div>
    </div>
  );
}
