"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

interface KudoImagePickerProps {
  previews: string[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  max?: number;
}

export function KudoImagePicker({ previews, onAdd, onRemove, max = 5 }: KudoImagePickerProps) {
  const t = useTranslations("writeKudo");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    onAdd(files.slice(0, max - previews.length));
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        {previews.map((src, i) => (
          <div key={i} className="relative w-16 h-16 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover rounded-lg border border-divider" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error rounded-full flex items-center justify-center text-white text-xs leading-none hover:opacity-80"
              aria-label="Xóa ảnh"
            >
              ×
            </button>
          </div>
        ))}
        {previews.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-16 h-16 shrink-0 bg-container-2 border border-dashed border-divider rounded-lg flex items-center justify-center text-muted hover:border-border hover:text-text transition-colors text-2xl"
            aria-label={t("addImage")}
          >
            +
          </button>
        )}
      </div>
      {previews.length > 0 && (
        <p className="text-xs text-muted">{previews.length}/{max} · {t("maxImages")}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="sr-only"
        aria-hidden="true"
      />
    </div>
  );
}
