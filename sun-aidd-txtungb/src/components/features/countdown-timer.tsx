"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(targetDate: Date): TimeLeft {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownTimer() {
  const t = useTranslations("home.countdown");
  const targetDate = new Date(
    process.env.NEXT_PUBLIC_EVENT_DATETIME ?? "2025-12-20T18:30:00+07:00"
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    computeTimeLeft(targetDate)
  );
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const tick = () => {
      const next = computeTimeLeft(targetDate);
      setTimeLeft(next);
      if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
        setIsOver(true);
      }
    };

    const id = setInterval(tick, 1_000);
    tick();
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: t("days"), value: timeLeft.days },
    { label: t("hours"), value: timeLeft.hours },
    { label: t("minutes"), value: timeLeft.minutes },
    { label: t("seconds"), value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-6">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-6">
          <div className="text-center">
            <div
              key={value}
              className="text-5xl font-bold text-primary tabular-nums animate-tick"
            >
              {pad(value)}
            </div>
            <div className="text-xs text-muted mt-1 uppercase tracking-widest">
              {label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-3xl text-border pb-5">:</span>
          )}
        </div>
      ))}
      {!isOver && (
        <span className="ml-4 text-xs text-primary border border-primary rounded-full px-3 py-1 animate-pulse">
          Coming soon
        </span>
      )}
    </div>
  );
}
