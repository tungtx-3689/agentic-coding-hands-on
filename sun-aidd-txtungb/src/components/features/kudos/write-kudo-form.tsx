"use client";

import { submitKudo } from "@/lib/kudos/actions";
import { createClient } from "@/lib/supabase/client";
import type { Hashtag } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HashtagChipInput } from "./hashtag-chip-input";
import { KudoImagePicker } from "./kudo-image-picker";
import { RecipientSelector } from "./recipient-selector";

type Profile = { id: string; display_name: string | null; avatar_url: string | null };

interface WriteKudoFormProps {
  hashtags: Hashtag[];
}

export function WriteKudoForm({ hashtags }: WriteKudoFormProps) {
  const t = useTranslations("writeKudo");
  const router = useRouter();

  const [recipient, setRecipient] = useState<Profile | null>(null);
  const [content, setContent] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousName, setAnonymousName] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isValid = !!recipient && content.trim().length > 0;

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addImages(files: File[]) {
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadImages(): Promise<string[]> {
    if (!images.length) return [];
    const supabase = createClient();
    const urls: string[] = [];
    for (const file of images) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("kudo-images").upload(path, file);
      if (!uploadErr) {
        const { data } = supabase.storage.from("kudo-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isValid || pending) return;
    setPending(true);
    setError(null);

    const imageUrls = await uploadImages();

    const result = await submitKudo({
      receiverId: recipient!.id,
      content: content.trim(),
      hashtagIds: selectedHashtags,
      imageUrls,
      isAnonymous,
      anonymousName: isAnonymous ? anonymousName : undefined,
    });

    if (result.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.push("/kudos");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Recipient */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted">{t("recipient")}</label>
        <RecipientSelector value={recipient} onChange={setRecipient} />
        {submitAttempted && !recipient && (
          <p className="text-xs text-error">{t("errorRecipient")}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("contentPlaceholder")}
          rows={5}
          className={`w-full bg-container-2 border rounded-lg px-4 py-3 text-sm text-text placeholder:text-muted outline-none resize-none transition-colors ${
            submitAttempted && !content.trim() ? "border-error" : "border-divider focus:border-border"
          }`}
        />
        {submitAttempted && !content.trim() ? (
          <p className="text-xs text-error">{t("errorContent")}</p>
        ) : (
          <p className="text-xs text-muted">{t("mentionHint")}</p>
        )}
      </div>

      {/* Hashtags */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted">
          {t("addHashtag")}{" "}
          <span className="text-xs">({selectedHashtags.length}/5)</span>
        </label>
        <HashtagChipInput
          hashtags={hashtags}
          selected={selectedHashtags}
          onChange={setSelectedHashtags}
          max={5}
        />
      </div>

      {/* Images */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted">{t("addImage")}</label>
        <KudoImagePicker
          previews={previews}
          onAdd={addImages}
          onRemove={removeImage}
          max={5}
        />
      </div>

      {/* Anonymous toggle */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={isAnonymous}
          onClick={() => setIsAnonymous((v) => !v)}
          className="flex items-center gap-3 cursor-pointer select-none w-fit"
        >
          <div
            className={[
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
              isAnonymous
                ? "bg-primary border-primary"
                : "bg-transparent border-divider hover:border-border",
            ].join(" ")}
          >
            {isAnonymous && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00101a" strokeWidth="3.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
          <span className="text-sm text-text">{t("anonymous")}</span>
        </button>

        {isAnonymous && (
          <input
            type="text"
            value={anonymousName}
            onChange={(e) => setAnonymousName(e.target.value)}
            placeholder={t("anonymousName")}
            className="w-full bg-container-2 border border-divider focus:border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-muted outline-none transition-colors"
          />
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-error bg-error/10 border border-error/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-divider">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border border-divider text-muted hover:text-text hover:border-border rounded-full py-3 text-sm font-semibold transition-colors"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          disabled={!isValid || pending}
          className="flex-1 bg-primary text-bg font-semibold rounded-full py-3 text-sm hover:bg-btn-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pending ? (images.length > 0 ? t("uploading") : "Đang gửi...") : t("submit")}
        </button>
      </div>
    </form>
  );
}
