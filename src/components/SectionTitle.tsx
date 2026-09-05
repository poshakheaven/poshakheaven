import type { ReactNode } from "react";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "left" | "center";
  children?: ReactNode;
};

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  children
}: SectionTitleProps) {
  return (
    <div
      className={`mb-8 md:mb-12 ${
        align === "center"
          ? "text-center max-w-2xl mx-auto"
          : "flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div>
        {eyebrow && (
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-6 bg-accent" />
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-luxury text-accent">
              {eyebrow}
            </p>
          </div>
        )}
        <h2 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-xs sm:text-sm text-muted max-w-xl">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-2 text-sm text-muted">{children}</div>}
      </div>
      {action && <div className="flex-none pt-2 md:pt-0">{action}</div>}
    </div>
  );
}
