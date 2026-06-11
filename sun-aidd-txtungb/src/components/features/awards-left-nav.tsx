"use client";

import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
}

interface AwardsLeftNavProps {
  items: NavItem[];
}

export function AwardsLeftNav({ items }: AwardsLeftNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [items]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="sticky top-28 flex flex-col gap-1">
      {items.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`text-left px-4 py-2.5 text-sm rounded transition-colors duration-150 ${
            activeId === id
              ? "text-[#ffea9e] underline underline-offset-4 font-medium"
              : "text-[#999999] hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
