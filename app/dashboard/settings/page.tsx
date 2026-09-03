import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loadStore } from "@/lib/cms";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const settings = loadStore().settings;
  return (
    <div>
      <h1 className="font-display text-[48px] leading-[0.9]">Settings</h1>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
