"use client";

import { KudoCard } from "@/components/features/kudos/kudo-card";
import type { Kudo } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";

interface KudosHighlightCarouselProps {
  kudos: Kudo[];
  currentUserId?: string;
}

export function KudosHighlightCarousel({ kudos, currentUserId }: KudosHighlightCarouselProps) {
  const t = useTranslations("kudos");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const isDragging = useRef(false);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocityPx = useRef(0); // pixels per 60fps frame
  const rafId = useRef(0);

  if (!kudos.length) return null;

  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 8);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const applyMomentum = (v: number) => {
    let vel = v;
    const step = () => {
      const el = scrollRef.current;
      if (!el || Math.abs(vel) < 0.5) {
        updateFades();
        return;
      }
      el.scrollLeft += vel;
      vel *= 0.95; // iOS-like deceleration (~0.997/ms at 60fps)
      updateFades();
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    cancelAnimationFrame(rafId.current);
    isDragging.current = true;
    velocityPx.current = 0;
    lastX.current = e.pageX;
    lastTime.current = performance.now();
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();

    const x = e.pageX;
    const now = performance.now();
    const dt = now - lastTime.current;
    const dx = x - lastX.current;

    scrollRef.current.scrollLeft -= dx;
    updateFades();

    // Track velocity: pixels per frame at 60fps
    if (dt > 0 && dt < 100) {
      velocityPx.current = (-dx / dt) * 16.67;
    }

    lastX.current = x;
    lastTime.current = now;
  };

  const stopDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
    applyMomentum(velocityPx.current);
  };

  useEffect(() => {
    updateFades();
    return () => cancelAnimationFrame(rafId.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kudos]);

  return (
    <section>
      <h2 className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
        {t("highlightTitle")}
      </h2>
      <div className="relative">
        {showLeftFade && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-16 z-10 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
        )}
        {showRightFade && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-16 z-10 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />
        )}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 select-none"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            cursor: "grab",
          }}
          onScroll={updateFades}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {kudos.map((kudo) => (
            <div key={kudo.id} className="w-[360px] shrink-0">
              <KudoCard kudo={kudo} currentUserId={currentUserId} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
