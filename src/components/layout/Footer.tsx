import { site } from "@/lib/site";
import { LogoMark } from "@/components/ui/Logo";

const links = [
  { href: "#technology", label: "Overview" },
  { href: "#dimensions", label: "Intelligence" },
  { href: "#architecture", label: "Hardware" },
  { href: "#molecular", label: "Biosensing" },
  { href: "#applications", label: "Applications" },
  { href: "#partnership", label: "Partnerships" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/[0.06] bg-night">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-4">
              <LogoMark className="h-6 w-auto" />
              <span className="h-4 w-px bg-white/15" aria-hidden />
              <span className="font-display text-sm font-medium text-fog">
                {site.productName}
              </span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-fog">{site.tagline}</p>
          </div>
          <nav aria-label="Footer" className="lg:col-span-6">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 lg:justify-end">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-fog transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/[0.06] pt-8 text-xs text-fog/80 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <p>
              © {year} {site.companyShort} ({site.companyName}). All rights reserved.
            </p>
            <p>{site.productName} — platform concept and development proposal.</p>
          </div>
          <p className="max-w-xl leading-relaxed lg:text-right">
            {site.productName} by {site.companyShort} is a technology under development. It is not a
            medical device and has not been cleared or approved by any regulatory authority. All data,
            interfaces and measurements shown on this page are illustrative and do not represent
            clinical results.
          </p>
        </div>
      </div>
    </footer>
  );
}
