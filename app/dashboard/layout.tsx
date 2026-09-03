import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/dashboard/LogoutButton";

const LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/stories", label: "Stories" },
  { href: "/dashboard/trips", label: "Trips" },
  { href: "/dashboard/destinations", label: "Destinations" },
  { href: "/dashboard/guides", label: "Guides" },
  { href: "/dashboard/media", label: "Media" },
  { href: "/dashboard/translations", label: "Translations" },
  { href: "/dashboard/newsletter", label: "Newsletter" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();
  if (!admin) return children;

  return (
    <div className="section-light min-h-screen">
      <div className="flex flex-col md:flex-row">
        <aside className="border-e border-forest-charcoal px-6 py-8 md:min-h-screen md:w-56">
          <Link href="/dashboard" className="font-display text-[40px] leading-[0.9]">
            Desk
          </Link>
          <nav className="mt-8 flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="caption">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10">
            <LogoutButton />
          </div>
        </aside>
        <div className="flex-1 px-6 py-8 md:px-12">{children}</div>
      </div>
    </div>
  );
}
