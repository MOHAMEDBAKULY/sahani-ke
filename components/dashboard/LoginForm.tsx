"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OutlinedButton } from "@/components/ui/OutlinedButton";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(demo = false) {
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(demo ? { demo: true } : { password }),
    });
    if (!res.ok) {
      setError("Invalid desk password.");
      return;
    }
    router.push(params.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <div className="section-dark flex min-h-screen flex-col justify-end px-6 py-16 md:px-12">
      <p className="font-display text-[48px] leading-[0.9] md:text-[clamp(48px,10vw,160px)]">DESK</p>
      <p className="caption mt-4">Sahani.KE · Maryam Rashid</p>
      <form
        className="mt-10 flex max-w-sm flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          login(false);
        }}
      >
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Desk password"
        />
        <OutlinedButton type="submit">Enter</OutlinedButton>
        <OutlinedButton type="button" onClick={() => login(true)}>
          Continue as Maryam Rashid
        </OutlinedButton>
        {error ? <p className="caption">{error}</p> : null}
        <p className="caption normal-case">Demo password: sahani · OAuth is the production path.</p>
      </form>
    </div>
  );
}
