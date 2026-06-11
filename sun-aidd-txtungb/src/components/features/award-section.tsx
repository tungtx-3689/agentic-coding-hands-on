import type { Award } from "@/lib/types";

interface AwardSectionProps {
  award: Award;
}

export function AwardSection({ award }: AwardSectionProps) {
  return (
    <section id={award.slug} className="py-16 border-b border-[#2e3940] scroll-mt-28">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="w-full md:w-64 shrink-0 h-48 bg-[#101417] rounded-xl flex items-center justify-center border border-[#2e3940]">
          {award.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={award.image_url}
              alt={award.title}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-6xl text-[#998c5f] opacity-30">★</span>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#ffea9e] mb-3">{award.title}</h2>
          <p className="text-[#999999] leading-relaxed mb-6">{award.description}</p>
          <div className="flex flex-wrap gap-6">
            <div className="bg-[#101417] rounded-lg px-5 py-3">
              <div className="text-xs text-[#999999] mb-1">Số lượng</div>
              <div className="text-white font-semibold">{award.count}</div>
            </div>
            <div className="bg-[#101417] rounded-lg px-5 py-3">
              <div className="text-xs text-[#999999] mb-1">Giá trị giải</div>
              <div className="text-[#ffea9e] font-semibold">{award.value}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
