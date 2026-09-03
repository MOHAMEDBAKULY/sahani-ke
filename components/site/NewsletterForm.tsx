"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/copy";
import { OutlinedButton } from "@/components/ui/OutlinedButton";

export function NewsletterForm({
  locale,
  variant = "inline",
}: {
  locale: Locale;
  variant?: "inline" | "modal";
}) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language: locale, website: honeypot }),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      setMessage(data.success ? t("newsletterSuccess", locale) : data.message || t("newsletterError", locale));
      if (data.success) {
        setEmail("");
        sessionStorage.setItem("sahani.newsletter.done", "1");
      }
    } catch {
      setMessage(t("newsletterError", locale));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="sr-only" htmlFor={`email-${variant}`}>
        {t("newsletterPlaceholder", locale)}
      </label>
      <input
        id={`email-${variant}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("newsletterPlaceholder", locale)}
        autoComplete="email"
      />
      <input
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <OutlinedButton type="submit">{pending ? "…" : t("newsletterCta", locale)}</OutlinedButton>
      {message ? <p className="caption">{message}</p> : null}
    </form>
  );
}

export function NewsletterModal({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("sahani.newsletter.done")) return;
    const onHome = /^\/(en|ar)\/?$/.test(window.location.pathname);
    if (!onHome) return;
    const timer = window.setTimeout(() => setOpen(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        className="caption fixed end-6 bottom-6 z-40 border border-highlighter-mint bg-carbon-ink px-4 py-3 text-highlighter-mint"
        onClick={() => setOpen(true)}
      >
        {t("openNewsletter", locale)}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-carbon-ink/70 p-6 md:p-12">
      <div className="section-dark w-full max-w-md border border-highlighter-mint p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <p className="font-display text-[40px] leading-[0.9]">{t("newsletterTitle", locale)}</p>
          <button type="button" className="caption" onClick={() => setOpen(false)}>
            {t("close", locale)}
          </button>
        </div>
        <p className="mb-6 text-[12px] normal-case">{t("newsletterBody", locale)}</p>
        <NewsletterForm locale={locale} variant="modal" />
      </div>
    </div>
  );
}
